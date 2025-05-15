import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { useNetworkStore } from "@/store/networkStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Network = "mainnet-beta" | "devnet"

interface NetworkSelectorProps {
  defaultNetwork: Network
  onNetworkChange: (network: Network) => void
}

export default function NetworkSelector({ 
  defaultNetwork = "mainnet-beta", 
  onNetworkChange 
}: NetworkSelectorProps) {
   const { network, setNetwork } = useNetworkStore()

  const handleNetworkChange = (newNetwork: Network) => {
    if (onNetworkChange) {
      setNetwork(newNetwork)
      onNetworkChange(newNetwork)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-purple-800/50 border-purple-700 text-white hover:bg-purple-700/60 hover:text-white ml-5">
          <Globe className="mr-2 h-4 w-4 text-yellow-400" />
          {network === "mainnet-beta" ? "Mainnet Beta" : "Devnet"}
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-purple-950 border-purple-700">
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-purple-900 ${network === "mainnet-beta" ? "text-yellow-400" : "text-white"}`}
          onClick={() => handleNetworkChange("mainnet-beta")}
        >
          Mainnet Beta
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-purple-900 ${network === "devnet" ? "text-yellow-400" : "text-white"}`}
          onClick={() => handleNetworkChange("devnet")}
        >
          Devnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}