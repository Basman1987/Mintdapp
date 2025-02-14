"use client"

import { useState, useEffect } from "react"
import StarryBackground from "./components/StarryBackground"
import MintInterface from "./components/MintInterface"
import NFTViewer from "./components/NFTViewer"
import RoyaltiesCollector from "./components/RoyaltiesCollector"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProjectInfo from "./components/ProjectInfo"
import StatusBar from "./components/StatusBar"
import WhitelistPopup from "./components/WhitelistPopup"
import { useWeb3 } from "./hooks/useWeb3"
import { Button } from "@/components/ui/button"

const CONTRACT_ADDRESS = "0xF8BA218bb92CEfd12eDa293245083283B1B60f7a"

export default function Home() {
  const { web3, contract, address, isWhitelisted, isPaused, error, initializeWeb3, disconnectWallet } = useWeb3()
  const [activeComponent, setActiveComponent] = useState<"mint" | "view" | "royalties">("mint")
  const [showWhitelistPopup, setShowWhitelistPopup] = useState(false)

  useEffect(() => {
    if (isWhitelisted) {
      setShowWhitelistPopup(true)
    }
  }, [isWhitelisted])

  return (
    <main className="min-h-screen cyberpunk-bg text-white flex flex-col">
      <div className="circuit-overlay"></div>
      <StarryBackground />
      <Header activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {error && <div className="bg-red-500 text-white p-4 rounded mb-4 glassmorphism glow-box">{error}</div>}
        <div className="max-w-md mx-auto mb-8">
          <div className="neon-border rounded-lg overflow-hidden shadow-neon-intense animate-pulse-slow">
            <div className="nft-placeholder aspect-square flex items-center justify-center text-3xl font-extrabold">
              <span className="shiny-text">NFT Preview</span>
            </div>
          </div>
        </div>
        {address ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 glassmorphism p-4 rounded-lg">
              <div className="mb-4 sm:mb-0">
                <p className="cyber-text">
                  Connected Address: <span className="font-bold shiny-text">{address}</span>
                </p>
                <p className="cyber-text">
                  Is Whitelisted: <span className="font-bold shiny-text">{isWhitelisted ? "Yes" : "No"}</span>
                </p>
                <p className="cyber-text">
                  Contract Status: <span className="font-bold shiny-text">{isPaused ? "Paused" : "Active"}</span>
                </p>
              </div>
              <Button onClick={disconnectWallet} className="cyber-btn neon-border">
                Disconnect Wallet
              </Button>
            </div>
            <StatusBar contract={contract} web3={web3} />
            {address && (
              <div className="mt-4 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center">
                <Button
                  onClick={() => setActiveComponent("mint")}
                  className={`cyber-btn neon-border w-full sm:w-auto ${
                    activeComponent === "mint" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Mint NFT
                </Button>
                <Button
                  onClick={() => setActiveComponent("view")}
                  className={`cyber-btn neon-border w-full sm:w-auto ${
                    activeComponent === "view" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  View NFTs
                </Button>
                <Button
                  onClick={() => setActiveComponent("royalties")}
                  className={`cyber-btn neon-border w-full sm:w-auto ${
                    activeComponent === "royalties" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Collect Royalties
                </Button>
              </div>
            )}
            {activeComponent === "mint" && (
              <MintInterface
                contract={contract}
                address={address}
                isWhitelisted={isWhitelisted}
                isPaused={isPaused}
                web3={web3}
              />
            )}
            {activeComponent === "view" && (
              <NFTViewer provider={web3?.currentProvider as any} address={address} contractAddress={CONTRACT_ADDRESS} />
            )}
            {activeComponent === "royalties" && (
              <RoyaltiesCollector
                provider={web3?.currentProvider as any}
                address={address}
                contractAddress={CONTRACT_ADDRESS}
              />
            )}
          </>
        ) : (
          <button onClick={initializeWeb3} className="cyber-btn neon-border mx-auto block">
            Connect Wallet
          </button>
        )}
        <ProjectInfo contractAddress={CONTRACT_ADDRESS} />
      </div>
      <Footer />
      {showWhitelistPopup && <WhitelistPopup onClose={() => setShowWhitelistPopup(false)} />}
    </main>
  )
}

