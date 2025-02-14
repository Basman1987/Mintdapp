"use client"

import { useState, useEffect, useCallback } from "react"
import Web3 from "web3"
import type { Contract } from "web3-eth-contract"
import type { AbiItem } from "web3-utils"
import { CONTRACT_ABI } from "../constants/contractABI"

const CONTRACT_ADDRESS = "0xF8BA218bb92CEfd12eDa293245083283B1B60f7a"
const CRONOS_CHAIN_ID = 25 // Mainnet Cronos Chain ID
const CRONOS_RPC_URL = "https://evm.cronos.org" // Cronos mainnet RPC URL

export function useWeb3() {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<Contract | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeWeb3 = useCallback(async () => {
    if (typeof window === "undefined") {
      console.error("Window object is not available")
      setError("Window object is not available")
      return
    }

    if (typeof window.ethereum === "undefined") {
      console.error("No Ethereum wallet detected")
      setError("No Ethereum wallet detected. Please install MetaMask.")
      return
    }

    try {
      console.log("Initializing Web3...")

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      console.log("Connected to chain ID:", chainId)
      if (Number.parseInt(chainId, 16) !== CRONOS_CHAIN_ID) {
        throw new Error(`Please connect to the Cronos network (Chain ID: ${CRONOS_CHAIN_ID})`)
      }

      const web3Instance = new Web3(window.ethereum)
      setWeb3(web3Instance)

      const accounts = await web3Instance.eth.getAccounts()
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please connect to a wallet.")
      }
      setAddress(accounts[0])
      console.log("Connected address:", accounts[0])

      const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS)
      setContract(contractInstance)
      console.log("Contract instance created")

      // Check whitelist status
      const isWhitelisted = await contractInstance.methods.isWhitelisted(accounts[0]).call()
      setIsWhitelisted(isWhitelisted)
      console.log("Is whitelisted:", isWhitelisted)

      // Check if contract is paused
      const paused = await contractInstance.methods.paused().call()
      setIsPaused(paused)
      console.log("Is paused:", paused)

      setError(null)
      console.log("Web3 initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Web3:", error)
      setError(`Failed to initialize Web3: ${(error as Error).message}`)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setWeb3(null)
    setContract(null)
    setAddress(null)
    setIsWhitelisted(false)
    setIsPaused(false)
    setError(null)
    console.log("Wallet disconnected")
  }, [])

  useEffect(() => {
    initializeWeb3()

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAddress(accounts[0])
          initializeWeb3()
        }
      })

      window.ethereum.on("chainChanged", (_chainId: string) => {
        window.location.reload()
      })
    }

    return () => {
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", () => {})
        window.ethereum.removeListener("chainChanged", () => {})
      }
    }
  }, [initializeWeb3, disconnectWallet])

  return {
    web3,
    contract,
    address,
    isWhitelisted,
    isPaused,
    error,
    initializeWeb3,
    disconnectWallet,
  }
}

