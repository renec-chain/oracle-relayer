import { PublicKey } from "@solana/web3.js";

export const TESTNET_RPC_ENDPOINT_URL =
  "https://api-testnet.renec.foundation:8899";
export const MAINNET_RPC_ENDPOINT_URL =
  "https://api-mainnet-beta.renec.foundation:8899";
export const MAX_VOLUME_EACH_OFFER = 1000000;

export const PRICE_WEIGHTS = {
  default: {
    binance: 74,
    coinbase: 10,
    kucoin: 6,
    okx: 9,
    remitano: 1,
  },
  renec: {
    remitano: 92,
    nemo: 8,
  },
  reusd: {
    remitano: 15,
    binance: 50,
    okx: 25,
    kucoin: 10,
  },
  gast: {
    nemo: 100,
  },
};

export const VALID_PRICE_RANGES = {
  reusd_vnd: {
    low: 20000,
    high: 30000,
  },
  reusd_ngn: {
    low: 800,
    high: 1500,
  },
  rebtc: {
    low: 10000,
    high: 100000,
  },
  reeth: {
    low: 500,
    high: 5000,
  },
  renec: {
    low: 0.01,
    high: 3,
  },
  gast: {
    low: 0.1,
    high: 0.97,
  },
};

export const GAST = new PublicKey(
  "GvTwnAQLTdM6fMZbuGQoVj5odefCC2FsDvaMgxqZV1fi"
);
