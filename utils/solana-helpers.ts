import { Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js"
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token"
import { WalletAdapter } from "@solana/wallet-adapter-base"

export interface EmptyTokenAccount {
  address: string
  mint: string
  mintAddress: string
  amount: number
}

/**
 * Scans a wallet for empty token accounts that are rent-exempt (reclaimable)
 * @param connection Solana connection
 * @param walletAddress Public key of the wallet to scan
 * @returns Array of empty token accounts with their details
 */
export async function scanEmptyTokenAccounts(
  connection: Connection,
  walletAddress: PublicKey,
): Promise<EmptyTokenAccount[]> {
  try {
    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    })

    // Get the rent-exempt minimum for a token account
    const rentExemptAmount = await connection.getMinimumBalanceForRentExemption(AccountLayout.span)

    // Convert lamports to SOL
    const rentExemptSOL = rentExemptAmount / LAMPORTS_PER_SOL

    // Filter for 0 balance accounts (empty)
    const emptyAccounts = tokenAccounts.value
      .filter((account) => {
        const parsedInfo = account.account.data.parsed.info
        const amount = parsedInfo.tokenAmount?.uiAmount || 0
        return amount === 0
      })
      .map((account) => {
        const parsedInfo = account.account.data.parsed.info
        const mintAddress = parsedInfo.mint

        return {
          address: account.pubkey.toString(),
          mint: mintAddress.slice(0, 4), // Just a placeholder
          mintAddress,
          amount: rentExemptSOL,
        }
      })

    return emptyAccounts
  } catch (error) {
    console.error("Error scanning for empty token accounts:", error)
    throw error
  }
}

/**
 * Creates instructions to close multiple token accounts and splits the recovered SOL
 * between the user's wallet and a donation address
 * 
 * @param connection Solana connection
 * @param walletPublicKey User's wallet public key
 * @param accountAddresses Array of token account addresses to close
 * @param wallet User's wallet adapter
 * @param donationPercentage Percentage of recovered SOL to donate (0-100)
 * @returns Transaction signature
 */
export async function closeEmptyAccounts(
  connection: Connection,
  walletPublicKey: PublicKey,
  accountAddresses: string[],
  wallet: WalletAdapter,
  donationPercentage: number = 10
): Promise<string> {
  try {
    // Step 1: Get donation address from environment variable
    const donationAddressString = process.env.NEXT_PUBLIC_DONATION_ADDRESS;
    if (!donationAddressString) {
      throw new Error("Donation address not configured in environment variables");
    }

    const donationAddress = new PublicKey(donationAddressString);

    // Step 2: Get latest blockhash
    const latestBlockhash = await connection.getLatestBlockhash();

    // Step 3: Create transaction with close instructions
    const transaction = new Transaction();

    // For each account, we'll first get its balance
    const rentExemptAmount = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);

    for (const address of accountAddresses) {
      const tokenAccountPubkey = new PublicKey(address);

      // Calculate donation amount in lamports
      const donationLamports = Math.floor((rentExemptAmount * donationPercentage) / 100);
      const userLamports = rentExemptAmount - donationLamports;

      // First, close the token account but send funds to a temporary address (the user)
      const closeIx = createCloseAccountInstruction(
        tokenAccountPubkey,   // account to close
        walletPublicKey,      // temporary destination
        walletPublicKey       // authority (user who owns the token account)
      );

      // Then, transfer the donation portion to the donation address
      const transferIx = SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: donationAddress,
        lamports: donationLamports
      });

      // Add both instructions to the transaction
      transaction.add(closeIx, transferIx);
    }

    // Step 4: Set blockhash & fee payer 
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = walletPublicKey;

    // Step 5: Send transaction
    const signature = await wallet.sendTransaction(transaction, connection);

    // Step 6: Confirm transaction with new style API
    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: signature,
    }, 'confirmed');

    return signature;
  } catch (error) {
    console.error("Error closing accounts:", error);
    throw error;
  }
}
