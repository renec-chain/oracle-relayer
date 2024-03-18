import Decimal from "decimal.js";

import { DecimalUtil, Percentage } from "@orca-so/common-sdk";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import {
  buildWhirlpoolClient,
  swapQuoteByInputToken,
  WhirlpoolContext,
  PriceMath,
} from "@renec-foundation/nemoswap-sdk";

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { GAST, PLUS1 } from "../constants.js";

import myWallet from "../wallet-for-reading.json" assert { type: "json" };

export const PROGRAM_ID = "7rh7ZtPzHqdY82RWjHf1Q8NaQiWnyNqkC48vSixcBvad";
export const RPC_ENDPOINT_URL =
  "https://api-mainnet-beta.renec.foundation:8899";

export const fetchGASTPriceFromNemo = async () => {
  const poolAddress = "BG83LmjZ5o1GdsmuUM6EJKLFj9LZqtLz12Aud3XEe1cU"; // GAST/reUSD
  const inputMintAddress = GAST.toBase58();

  return await fetchPriceFromNemo(poolAddress, inputMintAddress);
};

export const fetchPLUS1PriceFromNemo = async () => {
  const poolAddress = "Bb23Ye3amaNUrXkbK1NBLpVEpzeQrXStaHhjsy1Enb86"; // PLUS1/reUSD
  const inputMintAddress = PLUS1.toBase58();

  return await fetchPriceFromNemo(poolAddress, inputMintAddress);
};

export const fetchUSDPriceFromNemo = async () => {
  const poolAddress = "7uBREo1HRKmqQvWHahmAU92E3eZNFQBSKffwLx5jGBV7"; // reVND/reUSD
  const inputMintAddress = "4Q89182juiadeFgGw3fupnrwnnDmBhf7e7fHWxnUP3S3"; // reUSD

  return await fetchPriceFromNemo(poolAddress, inputMintAddress);
};

export const fetchRENECPriceFromNemo = async () => {
  const poolAddress = "BQ2sH6LqkhnNZofKXtApHz12frTv1wfbihMg6osMnHx8"; // RENEC/reUSD
  const inputMintAddress = "So11111111111111111111111111111111111111112"; // reUSD

  return await fetchPriceFromNemo(poolAddress, inputMintAddress);
};

export const fetchPriceFromNemo = async (poolAddress, tokenA) => {
  try {
    const nemoProgramClient = await getNemoProgramClient();
    const pool = await nemoProgramClient.getPool(poolAddress);

    const poolData = pool.getData();
    const tokenAInfo = pool.getTokenAInfo();
    const tokenBInfo = pool.getTokenBInfo();

    const tokenBperAPrice = PriceMath.sqrtPriceX64ToPrice(
      poolData.sqrtPrice,
      tokenAInfo.decimals,
      tokenBInfo.decimals
    );

    const tokenAperBPrice = PriceMath.invertPrice(
      tokenBperAPrice,
      tokenAInfo.decimals,
      tokenBInfo.decimals
    );

    if (tokenA === tokenAInfo.mint.toBase58()) {
      return tokenBperAPrice;
    }
    if (tokenA === tokenBInfo.mint.toBase58()) {
      return tokenAperBPrice;
    }
  } catch (error) {
    console.log("Nemo: error when fetching price", error);
  }
};

export const getNemoProgramClient = async () => {
  const connection = new Connection(RPC_ENDPOINT_URL);
  const wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(myWallet)));
  const provider = new AnchorProvider(connection, wallet, {});

  const context = WhirlpoolContext.withProvider(
    provider,
    new PublicKey(PROGRAM_ID)
  );
  const client = buildWhirlpoolClient(context);
  return client;
};
