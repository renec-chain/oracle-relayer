import dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/oracle-relayer/.env' })

import axios from "axios";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import anchor from "@project-serum/anchor";
const { AnchorProvider, Wallet, BN } = anchor;
import {
  Context,
  ProductClient,
  appendTxs,
  ORACLE_PROGRAM_ID_SOLANA,
  REVND_SOLANA,
  USDT_SOLANA,
} from "@renec-foundation/oracle-sdk";
const RENEC_SOLANA = new PublicKey("Ed6wQTbHwnoaSGx1y9YeqNkXJqNYYLCcAQoBhA3nuYYH");
import fs from "fs";
import relayerJson from "./relayer.json" assert { type: "json" };
import {
  MAINNET_RPC_ENDPOINT_URL,
  REL_SOLANA,
  SOLANA_MAINNET_RPC_ENDPOINT_URL,
} from "./constants.js";
import {
  calculateUSDPrice,
  calculateRENECPrice,
  calculateRELPrice,
} from "./price-fetching/index.js";

const postSlack = (message) => {
  const SLACK_CHANNEL = "#renec-relayers-noti"
  const payload = `payload={\"channel\": \"${SLACK_CHANNEL}\", \"text\": \"${message}\"}`

  axios.post(process.env.SLACK_WEBHOOK_URL, payload);
}

const catchError = (error, coin) => {
  console.log("Got error: ", error.message)
  const message = `Hey <@ngocbv>, we got exception on ${coin}: ${error.message}`
  postSlack(message);
}
const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson));

const commitment = "confirmed";
const wallet = new Wallet(relayerKeypair);
const solanaConnection = new Connection(SOLANA_MAINNET_RPC_ENDPOINT_URL, { commitment });
const solanaProvider = new AnchorProvider(solanaConnection, wallet, { commitment });
const solanaCtx = Context.withProvider(solanaProvider, ORACLE_PROGRAM_ID_SOLANA);

const postReusdPrice = async () => {
  try {
    const reusdPrice = await calculateUSDPrice();

    const reusdPriceClient = await ProductClient.getProduct(solanaCtx, REVND_SOLANA, USDT_SOLANA);
    const reusdTx = await reusdPriceClient.postPrice(
      reusdPrice,
      reusdPriceClient.ctx.wallet.publicKey
    );

    await reusdTx.buildAndExecute();
    console.log("Post reusd (solana) price done.")
    await reusdPriceClient.refresh();
    console.log("reusdPrice", await reusdPriceClient.getPrice());
  } catch (error) {
    catchError(error, "reUSD");
  }
}

const postRenecPrice = async (renecPrice) => {
  try {
    const renecPriceClient = await ProductClient.getProduct(solanaCtx, USDT_SOLANA, RENEC_SOLANA);
    const renecTx = await renecPriceClient.postPrice(
      renecPrice,
      renecPriceClient.ctx.wallet.publicKey
    );
    await renecTx.buildAndExecute();
    console.log("Post renec price done.")
    await renecPriceClient.refresh();
    console.log("renecPrice", await renecPriceClient.getPrice());
  } catch (error) {
    catchError(error, "RENEC");
  }
}

const postRenecStrenecPrice = async () => {
  try {
    const renecPrice = await calculateRENECPrice();

    await postRenecPrice(renecPrice);
  } catch (error) {
    catchError(error, "RENEC-stRENEC");
  }
}

const postRelPrice = async () => {
  try {
    const relPrice = await calculateRELPrice();
    const relPriceClient = await ProductClient.getProduct(solanaCtx, USDT_SOLANA, REL_SOLANA);
    const relTx = await relPriceClient.postPrice(
      relPrice,
      relPriceClient.ctx.wallet.publicKey
    );

    await relTx.buildAndExecute();
    console.log("Post rel (solana) price done.")
    await relPriceClient.refresh();
    console.log("relPrice", await relPriceClient.getPrice());
  } catch (error) {
    catchError(error, "REL");
  }
}

try {
  postReusdPrice();
  postRenecStrenecPrice();
  postRelPrice();
}
catch (error) {
  catchError(error, "main");
}
