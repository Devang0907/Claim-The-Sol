import { Connection, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js"
import { Transaction } from "@solana/web3.js"
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { WalletAdapter } from "@solana/wallet-adapter-base"

export interface EmptyTokenAccount {
  address: string
  mint: string
  mintAddress: string
  amount: number
}

/**
 * Scans a wallet for empty token accounts
 * @param connection Solana connection
 * @param walletAddress Public key of the wallet to scan
 * @returns Array of empty token accounts with their details
 */
export async function scanEmptyTokenAccounts(
  connection: Connection,
  walletAddress: PublicKey,
): Promise<EmptyTokenAccount[]> {
  try {
    // Get all token accounts owned by this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    })

    // Filter for accounts with 0 balance
    const emptyAccounts = tokenAccounts.value
      .filter((account) => {
        const parsedInfo = account.account.data.parsed.info
        const amount = parsedInfo.tokenAmount?.uiAmount || 0
        return amount === 0
      })
      .map((account) => {
        const parsedInfo = account.account.data.parsed.info
        const mintAddress = parsedInfo.mint

        // Get a shortened version of the mint name (in a real app, you'd use a token registry)
        // This is just a placeholder - in production you'd look up the actual token name
        const mintName = mintAddress.slice(0, 4)

        return {
          address: account.pubkey.toString(),
          mint: mintName,
          mintAddress: mintAddress,
          // Each account holds ~0.00203 SOL in rent
          amount: 0.00203,
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
    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;

    for (const accountAddress of accountAddresses) {
      const accountPubkey = new PublicKey(accountAddress);
      
      // Create close instruction - note the proper parameter order
      const closeInstruction = createCloseAccountInstruction(
        accountPubkey,         // Account to close
        walletPublicKey,       // Destination for recovered SOL
        walletPublicKey        // Authority (owner of the account)
      );
      
      transaction.add(closeInstruction);
    }

    // Sign and send the transaction
    const signature = await wallet.sendTransaction(transaction, connection);
    
    // Proper confirmation with commitment and timeout
    const confirmationResult = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');
    
    if (confirmationResult.value.err) {
      throw new Error(`Transaction failed: ${confirmationResult.value.err}`);
    }

    return signature;
  } catch (error) {
    console.error("Error closing accounts:", error);
    throw error;
  }
}
