"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { useNetworkStore } from "@/store/networkStore"
import "../styles/globals.css"
import '@solana/wallet-adapter-react-ui/styles.css'

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
   const { network } = useNetworkStore()

  let endpoint;
  if(network == "mainnet-beta"){
     endpoint = process.env.NEXT_PUBLIC_RPC_MAINNET || "https://api.mainnet-beta.solana.com";
  } else{
    endpoint = process.env.NEXT_PUBLIC_RPC_DEVNET || "https://api.devnet.solana.com";
  }
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
