import {
      PublicKey,
      Connection,
      Keypair,
} from "@solana/web3.js";
// import pkg from '@project-serum/anchor';
// import { AnchorProvider, Wallet, BN } from "@project-serum/anchor";
import anchor from "@project-serum/anchor";
const { AnchorProvider, Wallet, BN } = anchor;

import { Context, ProductClient, ORACLE_PROGRAM_ID_TESTNET } from "@renec-foundation/oracle-sdk";
import { fetchUSDPrice } from "./fetch-price.js";
import fs from 'fs';
import relayerJson from "./relayer.json" assert { type: "json" };

const relayerKeypair = Keypair.fromSecretKey(Uint8Array.from(relayerJson))

const commitment = "confirmed";
const RPC_ENDPOINT_URL = "https://api-testnet.renec.foundation:8899";
const connection = new Connection(RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(relayerKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, new PublicKey(ORACLE_PROGRAM_ID_TESTNET));


const quote = "USD";
const base = "VND";
const newPrice = await fetchUSDPrice();
console.log("reusd price: ", newPrice);

const productClient = await ProductClient.getProduct(ctx, quote, base);
const tx = await productClient.postPrice(
    newPrice,
    productClient.ctx.wallet.publicKey
);

await tx.buildAndExecute();
await productClient.refresh();

const price = await productClient.getPrice();
console.log("price", price);
