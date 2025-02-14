"use client"

import { useState, useEffect } from "react"
import type Web3 from "web3"
import type { Contract } from "web3-eth-contract"

const StatusBar = ({
  contract,
  web3,
}: {
  contract: Contract | null
  web3: Web3 | null
}) => {
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("StatusBar: Contract available:", !!contract)
    console.log("StatusBar: Web3 available:", !!web3)
    if (contract && web3) {
      fetchMintStatus()
    }
  }, [contract, web3])

  const fetchMintStatus = async () => {
    if (!contract || !web3) {
      console.error("StatusBar: Contract or Web3 not initialized")
      setError("Contract or Web3 not initialized")
      return
    }

    try {
      console.log("StatusBar: Fetching mint status...")
      console.log("StatusBar: Contract address:", contract.options.address)

      const [totalSupply, maxSupply] = await Promise.all([
        contract.methods.totalSupply().call(),
        contract.methods.maxSupply().call(),
      ])

      console.log("StatusBar: Fetched data:", { totalSupply, maxSupply })

      setTotalMinted(Number.parseInt(totalSupply))
      setMaxSupply(Number.parseInt(maxSupply))
      setError(null)
    } catch (error) {
      console.error("StatusBar: Failed to fetch mint status:", error)
      setError(`Failed to fetch mint status: ${(error as Error).message}`)
    }
  }

  if (error) {
    return <div className="text-red-500">StatusBar Error: {error}</div>
  }

  return (
    <div className="mb-4 p-3 bg-gray-800 rounded-lg shadow-neon">
      <h2 className="text-lg font-bold mb-2 text-glow">Minting Status</h2>
      <p className="text-sm text-cyan-300">
        Contract: <span className="text-white">{contract?.options.address}</span>
      </p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-cyan-300">Total Minted:</span>
        <span className="font-bold text-glow">{totalMinted}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-cyan-300">Max Supply:</span>
        <span className="font-bold text-glow">{maxSupply}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div
          className="bg-cyan-500 h-2.5 rounded-full"
          style={{ width: `${maxSupply > 0 ? (totalMinted / maxSupply) * 100 : 0}%` }}
        ></div>
      </div>
    </div>
  )
}

export default StatusBar

