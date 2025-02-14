"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { CONTRACT_ABI } from "../constants/contractABI"

const CONTRACT_ADDRESS = "0xF8BA218bb92CEfd12eDa293245083283B1B60f7a"
const CROFAM_ADDRESS = "0x04632bA88Ae963a21A3E07781eC5BF07223e2cbF"
const CRONOS_CHAIN_ID = 25 // Mainnet Cronos Chain ID

export function useWallet() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" })

        // Check if we're on the correct network
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        if (Number.parseInt(chainId, 16) !== CRONOS_CHAIN_ID) {
          throw new Error("Please connect to the Cronos network")
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        setProvider(provider)
        setSigner(signer)
        setAddress(address)
        setContract(contract)
        setError(null)

        // Check whitelist status
        const isWhitelisted = await contract.isWhitelisted(address)
        setIsWhitelisted(isWhitelisted)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        setError(`Failed to connect wallet: ${(error as Error).message}`)
      }
    } else {
      setError("Ethereum provider not found. Please install MetaMask.")
    }
  }, [])

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet()
        } else {
          setProvider(null)
          setSigner(null)
          setAddress(null)
          setContract(null)
        }
      })

      window.ethereum.on("chainChanged", (_chainId: string) => {
        window.location.reload()
      })
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", connectWallet)
        window.ethereum.removeListener("chainChanged", () => {})
      }
    }
  }, [connectWallet])

  return {
    provider,
    signer,
    address,
    contract,
    isWhitelisted,
    error,
    connectWallet,
  }
}

