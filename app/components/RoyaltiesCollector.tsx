"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CONTRACT_ABI } from "../constants/contractABI"

interface RoyaltiesCollectorProps {
  provider: ethers.providers.Web3Provider | null
  address: string
  contractAddress: string
}

const RoyaltiesCollector: React.FC<RoyaltiesCollectorProps> = ({ provider, address, contractAddress }) => {
  const [totalRoyalties, setTotalRoyalties] = useState<string>("0")
  const [userRoyalties, setUserRoyalties] = useState<string>("0")
  const [claimedRoyalties, setClaimedRoyalties] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (provider && address) {
      fetchRoyaltiesData()
    }
  }, [provider, address])

  const fetchRoyaltiesData = async () => {
    if (!provider || !address) return

    try {
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)

      const [totalDistributed, userUnclaimed, userClaimed] = await Promise.all([
        contract.totalRoyaltiesDistributed(),
        contract.getUnclaimedRoyalties(address),
        contract.getUserClaimedRoyalties(address),
      ])

      setTotalRoyalties(ethers.utils.formatEther(totalDistributed))
      setUserRoyalties(ethers.utils.formatEther(userUnclaimed))
      setClaimedRoyalties(ethers.utils.formatEther(userClaimed))
    } catch (error) {
      console.error("Failed to fetch royalties data:", error)
      setError("Failed to fetch royalties data. Please try again.")
    }
  }

  const collectRoyalties = async () => {
    if (!provider || !address) return

    setIsLoading(true)
    setError(null)

    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer)

      const tx = await contract.claimRoyalties()
      await tx.wait()

      alert("Royalties collected successfully!")
      fetchRoyaltiesData()
    } catch (error) {
      console.error("Failed to collect royalties:", error)
      setError("Failed to collect royalties. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glassmorphism glow-box animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold shiny-text glow-text">Royalties Collection</CardTitle>
        <CardDescription className="cyber-text">Claim your earned royalties</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="bg-red-500 text-white p-2 rounded text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="cyber-text">Total Royalties Distributed:</p>
            <p className="font-bold shiny-text glow-text">{totalRoyalties} CRO</p>
          </div>
          <div>
            <p className="cyber-text">Your Unclaimed Royalties:</p>
            <p className="font-bold shiny-text glow-text">{userRoyalties} CRO</p>
          </div>
          <div>
            <p className="cyber-text">Your Claimed Royalties:</p>
            <p className="font-bold shiny-text glow-text">{claimedRoyalties} CRO</p>
          </div>
        </div>
        <Button
          onClick={collectRoyalties}
          disabled={isLoading || Number.parseFloat(userRoyalties) === 0}
          className="cyber-btn neon-border w-full mt-4"
        >
          {isLoading ? "Collecting..." : "Collect Royalties"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default RoyaltiesCollector

