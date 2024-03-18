import axios from "axios";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import anchor from "@project-serum/anchor";
const { AnchorProvider, Wallet, BN } = anchor;
import {
  Context,
  ProductClient,
  appendTxs,
  ORACLE_PROGRAM_ID,
  REUSD,
  REVND,
  REBTC,
  REETH,
  RENEC,
  RENGN,
} from "@renec-foundation/oracle-sdk";
import fs from "fs";
import relayerJson from "./relayer.json" assert { type: "json" };
import { MAINNET_RPC_ENDPOINT_URL, GAST, PLUS1 } from "./constants.js";
import {
  calculateUSDPrice,
  calculateBTCPrice,
  calculateETHPrice,
  calculateRENECPrice,
  calculateNGNPrice,
  calculateGASTPrice,
  calculatePLUS1Price,
} from "./price-fetching/index.js";

const catchError = (error) => {
  console.log("Got error: ", error.message)
  const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"
  const SLACK_CHANNEL = "#renec-relayers-noti"
  const message = `Hey <@ngocbv>, we got exception: ${error.message}`
  const payload = `payload={\"channel\": \"${SLACK_CHANNEL}\", \"text\": \"${message}\"}`

  axios.post(SLACK_WEBHOOK_URL, payload);
}

try {
  const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson));

  const commitment = "confirmed";
  const connection = new Connection(MAINNET_RPC_ENDPOINT_URL, { commitment });
  const wallet = new Wallet(relayerKeypair);
  const provider = new AnchorProvider(connection, wallet, { commitment });

  const ctx = Context.withProvider(provider, ORACLE_PROGRAM_ID);

  try {
    const gastPrice = await calculateGASTPrice();

    const gastPriceClient = await ProductClient.getProduct(ctx, REUSD, GAST);
    const gastTx = await gastPriceClient.postPrice(
      gastPrice,
      gastPriceClient.ctx.wallet.publicKey
    );
    await gastTx.buildAndExecute();
    console.log("Post gast price done.")
    await gastPriceClient.refresh();
    console.log("gastPrice", await gastPriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }

  try {
    const plus1Price = await calculatePLUS1Price();

    const plus1PriceClient = await ProductClient.getProduct(ctx, REUSD, PLUS1);
    const plus1Tx = await plus1PriceClient.postPrice(
      plus1Price,
      plus1PriceClient.ctx.wallet.publicKey
    );
    await plus1Tx.buildAndExecute();
    console.log("Post plus1 price done.")
    await plus1PriceClient.refresh();
    console.log("plus1Price", await plus1PriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }

  try {
    const reusdPrice = await calculateUSDPrice();

    const reusdPriceClient = await ProductClient.getProduct(ctx, REVND, REUSD);
    const reusdTx = await reusdPriceClient.postPrice(
      reusdPrice,
      reusdPriceClient.ctx.wallet.publicKey
    );

    await reusdTx.buildAndExecute();
    console.log("Post reusd price done.")
    await reusdPriceClient.refresh();
    console.log("reusdPrice", await reusdPriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }

  try {
    const btcPrice = await calculateBTCPrice();

    const btcPriceClient = await ProductClient.getProduct(ctx, REUSD, REBTC);
    const btcTx = await btcPriceClient.postPrice(
      btcPrice,
      btcPriceClient.ctx.wallet.publicKey
    );

    await btcTx.buildAndExecute();
    console.log("Post rebtc price done.")
    await btcPriceClient.refresh();
    console.log("btcPrice", await btcPriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }

  try {
    const ethPrice = await calculateETHPrice();

    const ethPriceClient = await ProductClient.getProduct(ctx, REUSD, REETH);
    const ethTx = await ethPriceClient.postPrice(
      ethPrice,
      ethPriceClient.ctx.wallet.publicKey
    );
    await ethTx.buildAndExecute();
    console.log("Post reeth price done.")
    await ethPriceClient.refresh();
    console.log("ethPrice", await ethPriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }

  try {
    const rengnPrice = await calculateNGNPrice();

    const rengnPriceClient = await ProductClient.getProduct(ctx, RENGN, REUSD);
    const rengnTx = await rengnPriceClient.postPrice(
      rengnPrice,
      rengnPriceClient.ctx.wallet.publicKey
    );
    await rengnTx.buildAndExecute();
    console.log("Post rengn price done.")
    await rengnPriceClient.refresh();
    console.log("rengnPrice", await rengnPriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }

  try {
    const renecPrice = await calculateRENECPrice();

    const renecPriceClient = await ProductClient.getProduct(ctx, REUSD, RENEC);
    const renecTx = await renecPriceClient.postPrice(
      renecPrice,
      renecPriceClient.ctx.wallet.publicKey
    );
    await renecTx.buildAndExecute();
    console.log("Post renec price done.")
    await renecPriceClient.refresh();
    console.log("renecPrice", await renecPriceClient.getPrice());
  } catch (error) {
    catchError(error);
  }
}
catch(error) {
  catchError(error);
}
