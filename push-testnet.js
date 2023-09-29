import {
      PublicKey,
      Connection,
      Keypair,
} from "@solana/web3.js";
import anchor from "@project-serum/anchor";
const { AnchorProvider, Wallet, BN } = anchor;
import {
    Context,
    ProductClient,
    appendTxs,
    ORACLE_PROGRAM_ID_TESTNET,
    REUSD_TESTNET,
    REVND_TESTNET,
    REBTC_TESTNET,
    REETH_TESTNET,
    RENEC_TESTNET,
} from "@renec-foundation/oracle-sdk";
import fs from 'fs';
import relayerJson from "./relayer.json" assert { type: "json" };
import { TESTNET_RPC_ENDPOINT_URL } from "./constants.js"
import { 
    calculateUSDPrice,
    calculateBTCPrice,
    calculateETHPrice,
    calculateRENECPrice,
} from "./price-fetching/index.js";

const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson))

const commitment = "confirmed";
const connection = new Connection(TESTNET_RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(relayerKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, ORACLE_PROGRAM_ID_TESTNET);

const reusdPrice = await calculateUSDPrice();
const btcPrice = await calculateBTCPrice();
const ethPrice = await calculateETHPrice();
const renecPrice = await calculateRENECPrice();

const reusdPriceClient = await ProductClient.getProduct(ctx, REVND_TESTNET, REUSD_TESTNET);
const reusdTx = await reusdPriceClient.postPrice(
    reusdPrice,
    reusdPriceClient.ctx.wallet.publicKey
);

const btcPriceClient = await ProductClient.getProduct(ctx, REUSD_TESTNET, REBTC_TESTNET);
const btcTx = await btcPriceClient.postPrice(
    btcPrice,
    btcPriceClient.ctx.wallet.publicKey
);

const ethPriceClient = await ProductClient.getProduct(ctx, REUSD_TESTNET, REETH_TESTNET);
const ethTx = await ethPriceClient.postPrice(
    ethPrice,
    ethPriceClient.ctx.wallet.publicKey
);

const renecPriceClient = await ProductClient.getProduct(ctx, REUSD_TESTNET, RENEC_TESTNET);
const renecTx = await renecPriceClient.postPrice(
    renecPrice,
    renecPriceClient.ctx.wallet.publicKey
);

const finalTx = await appendTxs([reusdTx, btcTx, ethTx, renecTx]);
await finalTx.buildAndExecute();

await reusdPriceClient.refresh();
await btcPriceClient.refresh();
await ethPriceClient.refresh();
await renecPriceClient.refresh();

console.log("=============RESULT=============");
console.log("reusdPrice", await reusdPriceClient.getPrice());
console.log("btcPrice", await btcPriceClient.getPrice());
console.log("ethPrice", await ethPriceClient.getPrice());
console.log("renecPrice", await renecPriceClient.getPrice());
