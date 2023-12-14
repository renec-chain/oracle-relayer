import Decimal from 'decimal.js';

import {
  DecimalUtil,
  Percentage,
} from '@orca-so/common-sdk';
import {
  AnchorProvider,
  Wallet,
} from '@project-serum/anchor';
import {
  buildWhirlpoolClient,
  swapQuoteByInputToken,
  WhirlpoolContext,
} from '@renec-foundation/redex-sdk';
import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';

import myWallet from "../wallet-for-reading.json" assert { type: "json" };

export const PROGRAM_ID = '7rh7ZtPzHqdY82RWjHf1Q8NaQiWnyNqkC48vSixcBvad'
export const RPC_ENDPOINT_URL = 'https://api-mainnet-beta.renec.foundation:8899'

export const fetchUSDPriceFromNemo = async () => {
  const poolAddress = '7uBREo1HRKmqQvWHahmAU92E3eZNFQBSKffwLx5jGBV7' // reVND/reUSD
  const inputMintAddress = '4Q89182juiadeFgGw3fupnrwnnDmBhf7e7fHWxnUP3S3' // reUSD

  return await fetchPriceFromNemo(poolAddress, inputMintAddress)
}

export const fetchRENECPriceFromNemo = async () => {
  const poolAddress = 'BQ2sH6LqkhnNZofKXtApHz12frTv1wfbihMg6osMnHx8' // RENEC/reUSD
  const inputMintAddress = 'So11111111111111111111111111111111111111112' // reUSD

  return await fetchPriceFromNemo(poolAddress, inputMintAddress)
}

export const fetchPriceFromNemo = async (poolAddress, inputMintAddress) => {
  try {
    const SLIPPAGE = 1
    const inputAmount = '1'
    const connection = new Connection(RPC_ENDPOINT_URL)
    const wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(myWallet)))
    const provider = new AnchorProvider(connection, wallet, {})
    const ctx = WhirlpoolContext.withProvider(provider, new PublicKey(PROGRAM_ID))

    const client = buildWhirlpoolClient(ctx)
    const whirlpool = await client.getPool(poolAddress)

    if (whirlpool) {
      const tokenInfoA = whirlpool.getTokenAInfo()
      const tokenInfoB = whirlpool.getTokenBInfo()

      const [tokenIn, tokenOut] = [tokenInfoA, tokenInfoB].sort((a, b) => a.mint.toBase58() === inputMintAddress ? -1 : 1)

      const tokenAmount = DecimalUtil.toU64(new Decimal(Number(inputAmount)), tokenIn.decimals)
      const slippageTolerance = Percentage.fromDecimal(new Decimal(SLIPPAGE))

      const quote = await swapQuoteByInputToken(
        whirlpool,
        inputMintAddress,
        tokenAmount,
        slippageTolerance,
        ctx.program.programId,
        ctx.fetcher,
        true,
      )

      const price = DecimalUtil.fromU64(quote.estimatedAmountOut, tokenOut.decimals);
      return price;
    }
  } catch (error) {
    console.log("Nemo: error when fetching price", error);
  }
}
