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
    ORACLE_PROGRAM_ID_TESTNET,
    REUSD_TESTNET,
    REVND_TESTNET,
} from "@renec-foundation/oracle-sdk";
import fs from 'fs';
import relayerJson from "./relayer.json" assert { type: "json" };
import { RPC_ENDPOINT_URL } from "./constants.js"
import { calculateUSDPrice } from "./price-fetching/index.js";

const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson))

const commitment = "confirmed";
const connection = new Connection(RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(relayerKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, ORACLE_PROGRAM_ID_TESTNET);

const quote = REUSD_TESTNET;
const base = REVND_TESTNET;
const newPrice = await calculateUSDPrice();
console.log("Final reusd price: ", newPrice);

const productClient = await ProductClient.getProduct(ctx, quote, base);
const tx = await productClient.postPrice(
    newPrice,
    productClient.ctx.wallet.publicKey
);

await tx.buildAndExecute();
await productClient.refresh();

const price = await productClient.getPrice();
console.log("price", price);
