"use client"

import { useState, useEffect } from "react"
import type Web3 from "web3"
import type { Contract } from "web3-eth-contract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Clipboard, Check } from "lucide-react"

const MintInterface = ({
  contract,
  address,
  isWhitelisted,
  isPaused,
  web3,
}: {
  contract: Contract | null
  address: string
  isWhitelisted: boolean
  isPaused: boolean
  web3: Web3 | null
}) => {
  const [quantity, setQuantity] = useState(1)
  const [croPrice, setCroPrice] = useState("0")
  const [crofamPrice, setCrofamPrice] = useState("0")
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPausedDialog, setShowPausedDialog] = useState(false)
  const [croMaxSupply, setCroMaxSupply] = useState(0)
  const [crofamMaxSupply, setCrofamMaxSupply] = useState(0)
  const [croMinted, setCroMinted] = useState(0)
  const [crofamMinted, setCrofamMinted] = useState(0)
  const [copiedAddress, setCopiedAddress] = useState(false)

  useEffect(() => {
    if (contract && web3) {
      fetchContractData()
    }
  }, [contract, web3])

  const fetchContractData = async () => {
    if (!contract || !web3) {
      setError("Contract or Web3 not available. Please check your connection.")
      return
    }

    try {
      const [
        croPriceWei,
        crofamPriceWei,
        totalSupply,
        maxSupply,
        croMaxSupplyWei,
        crofamMaxSupplyWei,
        croSupply,
        crofamSupply,
      ] = await Promise.all([
        isWhitelisted ? contract.methods.croWlPrice().call() : contract.methods.croPrice().call(),
        isWhitelisted ? contract.methods.croFamWlPrice().call() : contract.methods.croFamPrice().call(),
        contract.methods.totalSupply().call(),
        contract.methods.maxSupply().call(),
        contract.methods.croMaxSupply().call(),
        contract.methods.croFamMaxSupply().call(),
        contract.methods.croSupply().call(),
        contract.methods.croFamSupply().call(),
      ])

      setCroPrice(web3.utils.fromWei(croPriceWei, "ether"))
      setCrofamPrice(web3.utils.fromWei(crofamPriceWei, "ether"))
      setTotalMinted(Number.parseInt(totalSupply))
      setMaxSupply(Number.parseInt(maxSupply))
      setCroMaxSupply(Number.parseInt(croMaxSupplyWei))
      setCrofamMaxSupply(Number.parseInt(crofamMaxSupplyWei))
      setCroMinted(Number.parseInt(croSupply))
      setCrofamMinted(Number.parseInt(crofamSupply))
    } catch (error) {
      setError(`Failed to fetch contract data: ${(error as Error).message}`)
    }
  }

  const mint = async (token: "cro" | "crofam") => {
    if (isPaused) {
      setShowPausedDialog(true)
      return
    }

    if (!contract || !web3) {
      setError("Contract or Web3 not available. Please connect your wallet.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const price = token === "cro" ? croPrice : crofamPrice
      const value = web3.utils.toWei((Number(price) * quantity).toString(), "ether")

      let tx
      if (token === "cro") {
        tx = await contract.methods.croMint(quantity).send({ from: address, value })
      } else {
        const crofamContract = new web3.eth.Contract(
          [
            {
              constant: false,
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              name: "approve",
              outputs: [{ name: "", type: "bool" }],
              type: "function",
            },
          ],
          await contract.methods.CroFamToken().call(),
        )

        await crofamContract.methods.approve(contract.options.address, value).send({ from: address })
        tx = await contract.methods.croFamMint(quantity).send({ from: address })
      }

      alert("Minting successful!")
      fetchContractData()
    } catch (error) {
      setError(`Minting failed: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const isSoldOut = (token: "cro" | "crofam") => {
    return token === "cro" ? croMinted >= croMaxSupply : crofamMinted >= crofamMaxSupply
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <>
      <Card className="glassmorphism glow-box animate-fade-in max-w-[95%] mx-auto">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold shiny-text">Mint Your NFT</CardTitle>
          <CardDescription className="cyber-text text-sm">Choose your minting options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          {error && <div className="bg-red-500 text-white p-2 rounded text-xs sm:text-sm">{error}</div>}
          {isPaused && (
            <div className="bg-yellow-500 text-white p-2 rounded text-xs sm:text-sm">
              Minting is currently paused by the developers.
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm cyber-text">Quantity:</span>
            <Input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number.parseInt(e.target.value))))}
              className="w-16 sm:w-20 bg-gray-700 text-white text-xs sm:text-sm"
            />
          </div>

          {/* Price Information */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <p className="cyber-text">CRO Price:</p>
              <p className="font-bold highlight-text">{croPrice} CRO</p>
              <p className="cyber-text mt-2">Total CRO:</p>
              <p className="font-bold highlight-text">{(Number(croPrice) * quantity).toFixed(6)}</p>
            </div>
            <div className="space-y-1">
              <p className="cyber-text">CROFAM Price:</p>
              <p className="font-bold highlight-text">{crofamPrice}</p>
              <p className="cyber-text mt-2">Total CROFAM:</p>
              <p className="font-bold highlight-text">{(Number(crofamPrice) * quantity).toFixed(6)}</p>
            </div>
          </div>

          {/* Minting Progress */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="cyber-text text-xs">CRO Progress</p>
                <p className="font-bold highlight-text text-xs">
                  {croMinted}/{croMaxSupply}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${(croMinted / croMaxSupply) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="cyber-text text-xs">CROFAM Progress</p>
                <p className="font-bold highlight-text text-xs">
                  {crofamMinted}/{crofamMaxSupply}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${(crofamMinted / crofamMaxSupply) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="cyber-text text-xs">Total Progress</p>
              <p className="font-bold highlight-text text-xs">
                {totalMinted}/{maxSupply}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="bg-gradient-to-r from-pink-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${(totalMinted / maxSupply) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Address Display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
            <p className="cyber-text">Your Address:</p>
            <div className="flex items-center gap-2">
              <p className="font-bold highlight-text truncate max-w-[120px] sm:max-w-[200px]">{address}</p>
              <button onClick={copyAddress} className="copy-address">
                {copiedAddress ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 p-3 sm:p-6">
          <Button
            onClick={() => mint("cro")}
            disabled={isLoading || isPaused || isSoldOut("cro")}
            className="cyber-btn neon-border w-full sm:w-auto text-xs sm:text-sm"
          >
            {isLoading ? "Minting..." : isSoldOut("cro") ? "SOLD OUT" : "Mint with CRO"}
          </Button>
          <Button
            onClick={() => mint("crofam")}
            disabled={isLoading || isPaused || isSoldOut("crofam")}
            className="cyber-btn neon-border w-full sm:w-auto text-xs sm:text-sm"
          >
            {isLoading ? "Minting..." : isSoldOut("crofam") ? "SOLD OUT" : "Mint with CROFAM"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPausedDialog} onOpenChange={setShowPausedDialog}>
        <DialogContent className="glassmorphism glow-box max-w-[90%] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="shiny-text text-lg sm:text-xl">Minting Paused</DialogTitle>
            <DialogDescription className="cyber-text text-sm">
              You have to wait a little until the devs... do something!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MintInterface

