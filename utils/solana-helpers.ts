import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Transaction } from "@solana/web3.js"
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID, AccountLayout  } from "@solana/spl-token"
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
 * Creates instructions to close multiple token accounts
 * This is a placeholder - in a real implementation you would:
 * 1. Import createCloseAccountInstruction from @solana/spl-token
 * 2. Create instructions for each account
 * 3. Bundle them into a transaction
 * 4. Sign and send the transaction
 */
export async function closeEmptyAccounts(
  connection: Connection,
  walletPublicKey: PublicKey,
  accountAddresses: string[],
  wallet: WalletAdapter,
): Promise<string> {
  try {
    // Step 1: Get latest blockhash
    const latestBlockhash = await connection.getLatestBlockhash();

    // Step 2: Create transaction with close instructions
    const transaction = new Transaction();

    for (const address of accountAddresses) {
      const tokenAccountPubkey = new PublicKey(address);

      const closeIx = createCloseAccountInstruction(
        tokenAccountPubkey,   // account to close
        walletPublicKey,      // destination (reclaimed SOL goes here)
        walletPublicKey       // authority (user who owns the token account)
      );

      transaction.add(closeIx);
    }

    // Step 3: Set blockhash & fee payer 
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = walletPublicKey;

    // Step 4: Send transaction
    const signature = await wallet.sendTransaction(transaction, connection);

    // Step 5: Confirm transaction with new style API
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
