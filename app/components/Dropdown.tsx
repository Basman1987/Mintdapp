import type React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DropdownProps {
  activeComponent: "mint" | "view"
  setActiveComponent: (component: "mint" | "view") => void
}

export const Dropdown: React.FC<DropdownProps> = ({ activeComponent, setActiveComponent }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glow-button">
          {activeComponent === "mint" ? "Mint NFT" : "View NFTs"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setActiveComponent("mint")}>Mint NFT</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setActiveComponent("view")}>View NFTs</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

