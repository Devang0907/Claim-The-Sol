"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { LogOut, Wallet, ExternalLink, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useNetworkStore } from "@/store/networkStore"
export default function WalletConnectButton() {
  const { toast } = useToast()
  const { publicKey, connected, disconnect } = useWallet()
   const { network } = useNetworkStore()
  // Custom styled wallet button for non-connected state
  if (!connected || !publicKey) {
    return (
      <div className="wallet-adapter-dropdown">
        <WalletMultiButton className="wallet-adapter-button bg-yellow-500 text-black hover:bg-yellow-400" />
      </div>
    )
  }

  // Custom dropdown for connected state
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-purple-600 bg-purple-900/60 text-white hover:bg-purple-800">
          <Wallet className="mr-2 h-4 w-4 text-yellow-400" />
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-purple-700 bg-purple-950">
        <DropdownMenuLabel className="text-purple-300">My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-800" />
        <DropdownMenuItem
          className="cursor-pointer text-purple-200 focus:bg-purple-900 focus:text-white"
          onClick={() => {
            navigator.clipboard.writeText(publicKey.toString())
            toast({
              title: "Address copied",
              description: "Wallet address copied to clipboard",
            })
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-purple-200 focus:bg-purple-900 focus:text-white"
          onClick={() => {
            window.open(
              `https://explorer.solana.com/address/${publicKey.toString()}${network !== 'mainnet-beta' ? `?cluster=${network}` : ''}`,
              "_blank"
            )
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-purple-800" />
        <DropdownMenuItem
          className="cursor-pointer text-red-400 focus:bg-red-900/50 focus:text-red-300"
          onClick={() => {
            disconnect().catch((error) => {
              toast({
                title: "Disconnection failed",
                description: error.message || "Failed to disconnect wallet",
                variant: "destructive",
              })
            })
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
