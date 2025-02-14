"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  activeComponent: "mint" | "view" | "royalties"
  setActiveComponent: (component: "mint" | "view" | "royalties") => void
}

const Header: React.FC<HeaderProps> = ({ activeComponent, setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleComponentChange = (component: "mint" | "view" | "royalties") => {
    setActiveComponent(component)
    setIsOpen(false)
  }

  return (
    <header className="bg-gray-800 p-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-lg font-bold shiny-text">My NFT Collection</h1>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="cyber-btn p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] bg-gray-800 border-l border-gray-700">
              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={() => handleComponentChange("mint")}
                  className={`cyber-btn neon-border w-full py-3 ${
                    activeComponent === "mint" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Mint NFT
                </button>
                <button
                  onClick={() => handleComponentChange("view")}
                  className={`cyber-btn neon-border w-full py-3 ${
                    activeComponent === "view" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  View NFTs
                </button>
                <button
                  onClick={() => handleComponentChange("royalties")}
                  className={`cyber-btn neon-border w-full py-3 ${
                    activeComponent === "royalties" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Collect Royalties
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-4">
          <button
            onClick={() => setActiveComponent("mint")}
            className={`cyber-btn neon-border px-4 py-2 ${
              activeComponent === "mint" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Mint NFT
          </button>
          <button
            onClick={() => setActiveComponent("view")}
            className={`cyber-btn neon-border px-4 py-2 ${
              activeComponent === "view" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            View NFTs
          </button>
          <button
            onClick={() => setActiveComponent("royalties")}
            className={`cyber-btn neon-border px-4 py-2 ${
              activeComponent === "royalties" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Collect Royalties
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

