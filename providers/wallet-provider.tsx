"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

// Import the wallet adapter styles
import "../styles/globals.css"
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css'

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  
  // You can also use a custom RPC endpoint
  const endpoint = process.env.NEXT_PUBLIC_RPC || "https://api.devnet.solana.com";

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
