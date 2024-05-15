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
  plus1: {
    nemo: 100,
  },
};

export const VALID_PRICE_RANGES = {
  reusd_vnd: {
    low: 10000,
    high: 40000,
  },
  reusd_ngn: {
    low: 100,
    high: 5500,
  },
  rebtc: {
    low: 1000,
    high: 200000,
  },
  reeth: {
    low: 100,
    high: 50000,
  },
  renec: {
    low: 0.01,
    high: 9,
  },
  gast: {
    low: 0.1,
    high: 9.97,
  },
  plus1: {
    low: 0.01,
    high: 9.97,
  },
};

export const GAST = new PublicKey(
  "GvTwnAQLTdM6fMZbuGQoVj5odefCC2FsDvaMgxqZV1fi"
);

export const PLUS1 = new PublicKey(
  "AhDXc3sRW1xKPXwDwAmGb4JonRTka5rdSjg43owF53gg"
);

export const REBNB = new PublicKey(
  "7G8x2UZSgVDZzbPSUKGjg2e2YAkMV8zwiP1525yxEK47"
);

export const RESOL = new PublicKey(
  "3r7AzTijvTDoLGgMqcNXTJimwg8XyxUG6EaVqHXF8EWC"
);
