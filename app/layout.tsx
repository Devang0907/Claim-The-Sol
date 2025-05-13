import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/toaster"
import { SolanaWalletProvider } from "@/providers/wallet-provider"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SOLBACK",
  description: "Scan your wallet for empty SPL token accounts and reclaim your locked SOL",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
        <Toaster />
      </body>
    </html>
  )
}
