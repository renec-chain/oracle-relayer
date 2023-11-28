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
import { MAINNET_RPC_ENDPOINT_URL } from "./constants.js";
import {
  calculateUSDPrice,
  calculateBTCPrice,
  calculateETHPrice,
  calculateRENECPrice,
  calculateNGNPrice,
} from "./price-fetching/index.js";

const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson));

const commitment = "confirmed";
const connection = new Connection(MAINNET_RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(relayerKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, ORACLE_PROGRAM_ID);

const reusdPrice = await calculateUSDPrice();
const btcPrice = await calculateBTCPrice();
const ethPrice = await calculateETHPrice();
const renecPrice = await calculateRENECPrice();
const rengnPrice = await calculateNGNPrice();

const reusdPriceClient = await ProductClient.getProduct(ctx, REVND, REUSD);
const reusdTx = await reusdPriceClient.postPrice(
  reusdPrice,
  reusdPriceClient.ctx.wallet.publicKey
);

const btcPriceClient = await ProductClient.getProduct(ctx, REUSD, REBTC);
const btcTx = await btcPriceClient.postPrice(
  btcPrice,
  btcPriceClient.ctx.wallet.publicKey
);

const ethPriceClient = await ProductClient.getProduct(ctx, REUSD, REETH);
const ethTx = await ethPriceClient.postPrice(
  ethPrice,
  ethPriceClient.ctx.wallet.publicKey
);

const renecPriceClient = await ProductClient.getProduct(ctx, REUSD, RENEC);
const renecTx = await renecPriceClient.postPrice(
  renecPrice,
  renecPriceClient.ctx.wallet.publicKey
);

const rengnPriceClient = await ProductClient.getProduct(ctx, RENGN, REUSD);
const rengnTx = await rengnPriceClient.postPrice(
  rengnPrice,
  rengnPriceClient.ctx.wallet.publicKey
);

const finalTx = await appendTxs([reusdTx, btcTx, ethTx, renecTx, rengnTx]);
await finalTx.buildAndExecute();

await reusdPriceClient.refresh();
await btcPriceClient.refresh();
await ethPriceClient.refresh();
await renecPriceClient.refresh();
await rengnPriceClient.refresh();

console.log("=============RESULT=============");
console.log("reusdPrice", await reusdPriceClient.getPrice());
console.log("btcPrice", await btcPriceClient.getPrice());
console.log("ethPrice", await ethPriceClient.getPrice());
console.log("renecPrice", await renecPriceClient.getPrice());
console.log("rengnPrice", await rengnPriceClient.getPrice());
