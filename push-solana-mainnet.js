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
import fs from "fs";
import relayerJson from "./relayer.json" assert { type: "json" };
import {
  MAINNET_RPC_ENDPOINT_URL,
  SOLANA_MAINNET_RPC_ENDPOINT_URL,
} from "./constants.js";
import {
  calculateUSDPrice,
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

try {
  postReusdPrice();
}
catch(error) {
  catchError(error, "main");
}
