"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONTRACT_ABI } from "../constants/contractABI"

const NFTViewer = ({
  provider,
  address,
  contractAddress,
}: { provider: ethers.providers.Web3Provider | null; address: string; contractAddress: string }) => {
  const [nfts, setNfts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!provider || !address) return

    const fetchNFTs = async () => {
      setIsLoading(true)
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)

      try {
        const balance = await contract.balanceOf(address)
        const tokenIds = []

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i)
          const tokenURI = await contract.tokenURI(tokenId)
          tokenIds.push(tokenURI)
        }

        setNfts(tokenIds)
      } catch (error) {
        console.error("Failed to fetch NFTs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTs()
  }, [provider, address, contractAddress])

  return (
    <Card className="bg-gray-800 animate-fade-in">
      <CardHeader>
        <CardTitle>Your NFTs</CardTitle>
        <CardDescription>View your minted NFTs</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading your NFTs...</p>
        ) : nfts.length === 0 ? (
          <p>You don't have any NFTs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nfts.map((nft, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg glow-nft">
                <img src={nft || "/placeholder.svg"} alt={`NFT ${index}`} className="w-full h-auto rounded-lg mb-2" />
                <p className="text-center">NFT #{index + 1}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NFTViewer

