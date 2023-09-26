export const TESTNET_RPC_ENDPOINT_URL = "https://api-testnet.renec.foundation:8899";
export const MAINNET_RPC_ENDPOINT_URL = "https://api-mainnet-beta.renec.foundation:8899";

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
    }
};

export const VALID_PRICE_RANGES = {
    reusd: {
        low: 20000,
        high: 30000,
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
};
