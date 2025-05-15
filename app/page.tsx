import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Coins, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WalletConnectButton from "@/components/wallet-connect-button"

export const metadata: Metadata = {
  title: "Claim Your SOL - Reclaim Rent from Empty Token Accounts",
  description: "Scan your wallet for empty SPL token accounts and reclaim your locked SOL",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-900 to-indigo-950">
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Coins className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">SOLBACK</h1>
        </div>
        <WalletConnectButton />
      </header>

      <main className="container mx-auto flex-1 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Reclaim Your <span className="text-yellow-400">Locked SOL</span>
              </h1>
              <p className="mt-4 text-xl text-purple-100">
                Recover SOL from empty token accounts and put it back in your wallet where it belongs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white">1</div>
                <div>
                  <h3 className="font-medium text-white">Connect Your Wallet</h3>
                  <p className="text-purple-200">Securely connect your Solana wallet</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white">2</div>
                <div>
                  <h3 className="font-medium text-white">Scan For Empty Accounts</h3>
                  <p className="text-purple-200">We'll find all your empty token accounts with locked SOL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white">3</div>
                <div>
                  <h3 className="font-medium text-white">Reclaim Your SOL</h3>
                  <p className="text-purple-200">Close empty accounts and get your SOL back in one transaction</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400" asChild>
                <Link href="/app">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-purple-700 bg-purple-950/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Potential SOL to Reclaim</CardTitle>
                <CardDescription className="text-purple-300">
                  Each empty token account holds ~0.002 SOL in rent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-purple-900/60 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-purple-300">Typical user with 50 empty accounts</p>
                      <p className="text-2xl font-bold text-white">~0.1 SOL</p>
                    </div>
                    <Wallet className="h-10 w-10 text-yellow-400" />
                  </div>
                </div>
                <div className="rounded-lg bg-purple-900/60 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-purple-300">Active trader with 250+ empty accounts</p>
                      <p className="text-2xl font-bold text-white">~0.5 SOL</p>
                    </div>
                    <Wallet className="h-10 w-10 text-yellow-400" />
                  </div>
                </div>
                <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400" asChild>
                  <Link href="/app">Scan Your Wallet Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-purple-800 pt-6 text-purple-300 md:flex-row">
          <p>© {new Date().getFullYear()} Claim Your SOL. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-purple-100">
              Terms
            </Link>
            <Link href="#" className="hover:text-purple-100">
              Privacy
            </Link>
            <Link href="https://github.com/Devang0907/Solback" target="_blank" className="hover:text-purple-100">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
