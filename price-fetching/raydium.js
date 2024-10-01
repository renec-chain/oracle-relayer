import dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/oracle-relayer/.env' })
import { Connection, PublicKey } from '@solana/web3.js';
import { LIQUIDITY_STATE_LAYOUT_V4, PoolInfoLayout, WSOL } from "@raydium-io/raydium-sdk";


export const RPC_ENDPOINT_URL = process.env.SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com";

const USDT_SOL_POOL_ID = "3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF"

export const getTokenBalance = async (connection, vault, decimals) => {
    const balance = await connection.getTokenAccountBalance(vault);
    return parseFloat(balance.value.amount) / Math.pow(10, decimals); // Adjust the balance for the token's decimals
};

/**
 * @description Fetch the price of a token in SOL using Raydium onchain data from a CLMM pool
 *
 * @param {*} poolAddress The pool address of the token and SOL
 * @returns 
 */
export const fetchPriceFromRaydiumClmmPool = async (poolAddress) => {
    const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");

    const info = await connection.getAccountInfo(new PublicKey(poolAddress));
    if (!info) {
        throw new Error(`Pool ${poolAddress} not exists`);
    }

    const poolState = PoolInfoLayout.decode(info.data);

    const tokenABalance = await getTokenBalance(connection, poolState.vaultA, poolState.mintDecimalsA);
    const tokenBBalance = await getTokenBalance(connection, poolState.vaultB, poolState.mintDecimalsB);

    if (poolState.mintA.toBase58() === WSOL.mint)
        return tokenABalance / tokenBBalance;
    else if (poolState.mintB.toBase58() === WSOL.mint)
        return tokenBBalance / tokenABalance;
    else
        throw new Error(`Invalid pool ${poolAddress}`);
}

/**
 * @description Fetch the price of a token in SOL using Raydium onchain data from a AMM pool
 *
 * @param {*} poolAddress The pool address of the token and SOL
 * @returns 
 */
export const fetchPriceFromRaydiumAmmPool = async (poolAddress) => {
    const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");

    const info = await connection.getAccountInfo(new PublicKey(poolAddress));
    if (!info) {
        throw new Error(`Pool ${poolAddress} not exists`);
    }

    const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);

    const baseTokenBalance = await getTokenBalance(connection, poolState.baseVault, poolState.baseDecimal);
    const quoteTokenBalance = await getTokenBalance(connection, poolState.quoteVault, poolState.quoteDecimal);

    // The calculation remains the same, but the clarification is that these decimals are now hardcoded
    if (poolState.baseMint.toBase58() === WSOL.mint) {
        return baseTokenBalance / quoteTokenBalance;
    } else if (poolState.quoteMint.toBase58() === WSOL.mint) {
        return quoteTokenBalance / baseTokenBalance;
    } else {
        throw new Error(`Invalid pool ${poolAddress}`);
    }
}

export const fetchRELPriceFromRaydium = async () => {
    // REL_SOL_RAYDIUM_POOL_ID
    const poolAddress = "3nehW6xGkW8cEQPcYg6BctR8eYmnRKwNkGxvJbNdnyiE";
    return await fetchPriceFromRaydium(poolAddress);
}


/**
 * @description Fetch the price of a token in USDT using Raydium onchain data
 * @param {*} poolAddress The pool address of the token and SOL
 * @returns 
 */
export const fetchPriceFromRaydium = async (poolAddress) => {
    const tokenSolPrice = await fetchPriceFromRaydiumAmmPool(poolAddress);
    const usdtSolPrice = await fetchPriceFromRaydiumClmmPool(USDT_SOL_POOL_ID);
    return tokenSolPrice / usdtSolPrice;
}
