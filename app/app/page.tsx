"use client"

import { useState } from "react"
import Link from "next/link"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { ArrowLeft, Check, Coins, ExternalLink, Loader2, RefreshCw, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import WalletConnectButton from "@/components/wallet-connect-button"
import { scanEmptyTokenAccounts, closeEmptyAccounts, type EmptyTokenAccount } from "@/utils/solana-helpers"

export default function AppPage() {
  const { toast } = useToast()
  const { connection } = useConnection()
  const { connected, publicKey, wallet } = useWallet()
  const [isScanning, setIsScanning] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [emptyAccounts, setEmptyAccounts] = useState<EmptyTokenAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [donationPercentage, setDonationPercentage] = useState(5)
  const [scanComplete, setScanComplete] = useState(false)
  const [txSignature, setTxSignature] = useState("")
  const [scanProgress, setScanProgress] = useState(0)
  const totalSelected = selectedAccounts.length
  const totalRecoverable = totalSelected * 0.00203
  const donationAmount = (totalRecoverable * donationPercentage) / 100
  const userReceives = totalRecoverable - donationAmount

  const handleScanAccounts = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to scan for empty accounts",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    setScanComplete(false)
    setEmptyAccounts([])
    setSelectedAccounts([])
    setScanProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const emptyAccounts = await scanEmptyTokenAccounts(connection, publicKey)
      clearInterval(progressInterval)
      setScanProgress(100)

      if (emptyAccounts.length > 0) {
        setEmptyAccounts(emptyAccounts)
        setSelectedAccounts(emptyAccounts.map((account) => account.address))
      }

      setIsScanning(false)
      setScanComplete(true)
    } catch (error: any) {
      clearInterval(progressInterval)
      toast({
        title: "Scan failed",
        description: error?.message || "Failed to scan for empty accounts",
        variant: "destructive",
      })
      setIsScanning(false)
    }
  }

  const handleCloseAccounts = async () => {
    if (selectedAccounts.length === 0) {
      toast({
        title: "No accounts selected",
        description: "Please select at least one account to close",
        variant: "destructive",
      })
      return
    }

    setIsClosing(true)

    try {
      if (!publicKey || !wallet) {
        throw new Error("Wallet not connected")
      }
      const signature = await closeEmptyAccounts(connection, publicKey, selectedAccounts, wallet.adapter)
      setTxSignature(signature)
      setIsClosing(false)
      toast({
        title: "Accounts closed successfully!",
        description: `Recovered ${totalRecoverable.toFixed(5)} SOL`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error?.message || "Failed to close accounts",
        variant: "destructive",
      })
      setIsClosing(false)
    }
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(emptyAccounts.map((account) => account.address))
    } else {
      setSelectedAccounts([])
    }
  }

  const toggleAccount = (address: any) => {
    if (selectedAccounts.includes(address)) {
      setSelectedAccounts(selectedAccounts.filter((a) => a !== address))
    } else {
      setSelectedAccounts([...selectedAccounts, address])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-purple-200">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <WalletConnectButton />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="border-purple-700 bg-purple-950/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">Empty Token Accounts</CardTitle>
                    <CardDescription className="text-purple-300">
                      Select accounts to close and reclaim SOL
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-200 hover:bg-purple-800 hover:text-white"
                    onClick={handleScanAccounts}
                    disabled={isScanning || !connected}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Scan Accounts
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <div className="flex flex-col items-center justify-center rounded-lg bg-purple-900/40 p-12 text-center">
                    <Wallet className="mb-4 h-12 w-12 text-purple-400" />
                    <h3 className="mb-2 text-xl font-medium text-white">Connect Your Wallet</h3>
                    <p className="mb-6 text-purple-300">Connect your Solana wallet to scan for empty token accounts</p>
                    <WalletConnectButton />
                  </div>
                ) : isScanning ? (
                  <div className="space-y-4 p-4">
                    <div className="flex items-center justify-between text-purple-200">
                      <span>Scanning wallet for empty token accounts...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress 
                      value={scanProgress} 
                      className="h-2 bg-purple-900 [&>div]:bg-yellow-500" 
                    />
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-5 w-5 rounded-sm bg-purple-800/50" />
                          <Skeleton className="h-6 w-full rounded-md bg-purple-800/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : emptyAccounts.length > 0 ? (
                  <div>
                    <div className="mb-4 flex items-center">
                      <Checkbox
                        id="select-all"
                        checked={selectedAccounts.length === emptyAccounts.length}
                        onCheckedChange={toggleSelectAll}
                        className="border-purple-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
                      />
                      <label htmlFor="select-all" className="ml-2 text-sm text-purple-200">
                        Select All ({emptyAccounts.length} accounts)
                      </label>
                    </div>

                    <div className="rounded-md border border-purple-800">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-800 hover:bg-transparent">
                            <TableHead className="w-[50px] text-purple-300"></TableHead>
                            <TableHead className="text-purple-300">Token</TableHead>
                            <TableHead className="text-purple-300">Account Address</TableHead>
                            <TableHead className="text-right text-purple-300">Recoverable SOL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {emptyAccounts.map((account) => (
                            <TableRow
                              key={account.address}
                              className="border-purple-800 text-purple-100 hover:bg-purple-900/30"
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedAccounts.includes(account.address)}
                                  onCheckedChange={() => toggleAccount(account.address)}
                                  className="border-purple-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
                                />
                              </TableCell>
                              <TableCell>{account.mint}</TableCell>
                              <TableCell className="font-mono text-xs">
                                {account.address.slice(0, 4)}...{account.address.slice(-4)}
                              </TableCell>
                              <TableCell className="text-right">{account.amount.toFixed(5)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : scanComplete ? (
                  <div className="flex flex-col items-center justify-center rounded-lg bg-purple-900/40 p-12 text-center">
                    <Check className="mb-4 h-12 w-12 text-green-400" />
                    <h3 className="mb-2 text-xl font-medium text-white">No Empty Accounts Found</h3>
                    <p className="text-purple-300">Your wallet doesn't have any empty token accounts to close</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg bg-purple-900/40 p-12 text-center">
                    <Coins className="mb-4 h-12 w-12 text-purple-400" />
                    <h3 className="mb-2 text-xl font-medium text-white">Scan Your Wallet</h3>
                    <p className="mb-6 text-purple-300">Click the scan button to find empty token accounts</p>
                    <Button
                      onClick={handleScanAccounts}
                      className="bg-yellow-500 text-black hover:bg-yellow-400"
                      disabled={!connected}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Scan Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8 border-purple-700 bg-purple-950/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Summary</CardTitle>
                <CardDescription className="text-purple-300">
                  {connected ? "Close accounts and reclaim your SOL" : "Connect your wallet to get started"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg bg-purple-900/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Selected Accounts</span>
                    <span className="font-medium text-white">{totalSelected}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Total Recoverable</span>
                    <span className="font-medium text-white">{totalRecoverable.toFixed(5)} SOL</span>
                  </div>
                  <Separator className="bg-purple-800" />
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-purple-300">Optional Donation</span>
                      <span className="font-medium text-white">{donationPercentage}%</span>
                    </div>
                    <Slider
                      value={[donationPercentage]}
                      onValueChange={(value) => setDonationPercentage(value[0])}
                      max={20}
                      step={1}
                      className="py-2"
                    />
                    <div className="mt-1 flex justify-between text-xs text-purple-400">
                      <span>0%</span>
                      <span>5%</span>
                      <span>10%</span>
                      <span>15%</span>
                      <span>20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Donation Amount</span>
                    <span className="font-medium text-purple-200">{donationAmount.toFixed(5)} SOL</span>
                  </div>
                  <Separator className="bg-purple-800" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-100">You Receive</span>
                    <span className="text-lg font-bold text-yellow-400">{userReceives.toFixed(5)} SOL</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                  disabled={!connected || isClosing || selectedAccounts.length === 0}
                  onClick={handleCloseAccounts}
                >
                  {isClosing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Claim Your SOL"
                  )}
                </Button>

                {txSignature && (
                  <div className="rounded-lg border border-green-500 bg-green-900/20 p-4 text-center">
                    <Check className="mx-auto mb-2 h-6 w-6 text-green-400" />
                    <p className="mb-2 text-sm font-medium text-green-400">Transaction Successful!</p>
                    <a
                      href={`https://explorer.solana.com/tx/${txSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-green-200"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-purple-400">
                  Donations help cover RPC costs and support ongoing development. Thank you!
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card className="border-purple-700 bg-purple-950/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-purple-900/40">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="technical"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    Technical Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                  >
                    Security
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 text-purple-100">
                  <p className="mb-4">
                    On Solana, each token you receive creates a dedicated account that holds ~0.002 SOL as rent. When
                    you send all tokens away, this account remains open with the SOL still locked inside.
                  </p>
                  <p>
                    This app scans your wallet for these empty accounts, lets you select which ones to close, and
                    returns that locked SOL directly to your wallet in a single transaction.
                  </p>
                </TabsContent>
                <TabsContent value="technical" className="mt-4 text-purple-100">
                  <p className="mb-4">
                    Under the hood, this app uses{" "}
                    <code className="rounded bg-purple-900 px-1 py-0.5">@solana/web3.js</code> and{" "}
                    <code className="rounded bg-purple-900 px-1 py-0.5">@solana/spl-token</code> to:
                  </p>
                  <ol className="ml-6 list-decimal space-y-2">
                    <li>
                      Call <code className="rounded bg-purple-900 px-1 py-0.5">getParsedTokenAccountsByOwner</code> to
                      find all your SPL token accounts
                    </li>
                    <li>Filter those with a balance of 0 tokens</li>
                    <li>
                      Create <code className="rounded bg-purple-900 px-1 py-0.5">closeAccountInstructions</code> for
                      each selected account
                    </li>
                    <li>Bundle them into a single transaction for efficiency</li>
                  </ol>
                </TabsContent>
                <TabsContent value="security" className="mt-4 text-purple-100">
                  <p className="mb-4">This app is designed with security as a priority:</p>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Your private keys never leave your wallet</li>
                    <li>All code runs client-side in your browser</li>
                    <li>You only sign transactions to close your own accounts</li>
                    <li>The app cannot access any funds beyond the empty accounts you select</li>
                    <li>All transaction details are visible in your wallet before signing</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
