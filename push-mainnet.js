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
    ORACLE_PROGRAM_ID,
    REUSD,
    REVND,
} from "@renec-foundation/oracle-sdk";
import fs from 'fs';
import relayerJson from "./relayer.json" assert { type: "json" };
import { MAINNET_RPC_ENDPOINT_URL } from "./constants.js"
import { calculateUSDPrice } from "./price-fetching/index.js";

const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson))

const commitment = "confirmed";
const connection = new Connection(MAINNET_RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(relayerKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, ORACLE_PROGRAM_ID);

const quote = REUSD;
const base = REVND;
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
