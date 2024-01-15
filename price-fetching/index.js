import {
  fetchUSDPriceFromRemitano,
  fetchBTCPriceFromRemitano,
  fetchETHPriceFromRemitano,
  fetchRENECPriceFromRemitano,
  fetchNGNPriceFromRemitano,
} from "./remitano.js";
import { fetchRENECPriceFromNemo, fetchGASTPriceFromNemo } from "./nemo.js";
import {
  fetchUSDPriceFromCoinbase,
  fetchBTCPriceFromCoinbase,
  fetchETHPriceFromCoinbase,
} from "./coinbase.js";
import {
  fetchUSDPriceFromOkx,
  fetchUSDPriceFromOkxP2p,
  fetchBTCPriceFromOkx,
  fetchETHPriceFromOkx,
  fetchNGNPriceFromOkx,
} from "./okx.js";
import {
  fetchBTCPriceFromBinance,
  fetchETHPriceFromBinance,
} from "./binance.js";
import {
  fetchUSDPriceFromBinanceP2p,
  fetchNGNPriceFromBinanceP2p,
} from "./binance-p2p.js";
import {
  fetchUSDPriceFromKucoin,
  fetchUSDPriceFromKucoinP2p,
  fetchBTCPriceFromKucoin,
  fetchETHPriceFromKucoin,
} from "./kucoin.js";
import { PRICE_WEIGHTS, VALID_PRICE_RANGES } from "../constants.js";

export const calculateGASTPrice = async () => {
  const nemoPrice = await fetchGASTPriceFromNemo();

  const prices = {
    nemo: nemoPrice,
  };
  console.log("GAST prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.gast,
    VALID_PRICE_RANGES.gast
  );

  return avgPrice;
};

export const calculateUSDPrice = async () => {
  const remiPrice = await fetchUSDPriceFromRemitano();
  // const coinbasePrice = await fetchUSDPriceFromCoinbase();
  const okxPrice = await fetchUSDPriceFromOkxP2p("vnd");
  const binancePrice = await fetchUSDPriceFromBinanceP2p();
  const kucoinPrice = await fetchUSDPriceFromKucoinP2p("vnd");

  const prices = {
    // coinbase: coinbasePrice,
    okx: okxPrice,
    binance: binancePrice,
    kucoin: kucoinPrice,
    remitano: remiPrice,
  };
  console.log("USD prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.reusd,
    VALID_PRICE_RANGES.reusd_vnd
  );

  return avgPrice;
};

export const calculateBTCPrice = async () => {
  const remiPrice = await fetchBTCPriceFromRemitano();
  const coinbasePrice = await fetchBTCPriceFromCoinbase();
  const okxPrice = await fetchBTCPriceFromOkx();
  const binancePrice = await fetchBTCPriceFromBinance();
  const kucoinPrice = await fetchBTCPriceFromKucoin();

  const prices = {
    coinbase: coinbasePrice,
    okx: okxPrice,
    binance: binancePrice,
    kucoin: kucoinPrice,
    remitano: remiPrice,
  };
  console.log("BTC prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.default,
    VALID_PRICE_RANGES.rebtc
  );

  return avgPrice;
};

export const calculateETHPrice = async () => {
  const remiPrice = await fetchETHPriceFromRemitano();
  const coinbasePrice = await fetchETHPriceFromCoinbase();
  const okxPrice = await fetchETHPriceFromOkx();
  const binancePrice = await fetchETHPriceFromBinance();
  const kucoinPrice = await fetchETHPriceFromKucoin();

  const prices = {
    coinbase: coinbasePrice,
    okx: okxPrice,
    binance: binancePrice,
    kucoin: kucoinPrice,
    remitano: remiPrice,
  };
  console.log("ETH prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.default,
    VALID_PRICE_RANGES.reeth
  );

  return avgPrice;
};

export const calculateRENECPrice = async () => {
  const remiPrice = await fetchRENECPriceFromRemitano();
  const nemoPrice = await fetchRENECPriceFromNemo();

  const prices = {
    nemo: nemoPrice,
    remitano: remiPrice,
  };
  console.log("RENEC prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.renec,
    VALID_PRICE_RANGES.renec
  );

  return avgPrice;
};

export const calculateNGNPrice = async () => {
  const remiPrice = await fetchNGNPriceFromRemitano();
  const okxPrice = await fetchUSDPriceFromOkxP2p("ngn");
  const binancePrice = await fetchNGNPriceFromBinanceP2p();
  const kucoinPrice = await fetchUSDPriceFromKucoinP2p("ngn");
  // TODO: fetchRENECPriceFromNemo
  // const nemoPrice = await fetchRENECPriceFromNemo();

  const prices = {
    remitano: remiPrice,
    okx: okxPrice,
    binance: binancePrice,
    kucoin: kucoinPrice,
  };
  console.log("reNGN prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.reusd,
    VALID_PRICE_RANGES.reusd_ngn
  );
  return avgPrice;
};

const calculateAveragePrice = (prices, priceWeights, validPriceRange) => {
  let totalPrice = 0;
  let totalWeight = 0;
  Object.keys(prices).forEach((exchange) => {
    if (
      prices[exchange] &&
      prices[exchange] >= validPriceRange.low &&
      prices[exchange] <= validPriceRange.high
    ) {
      totalPrice += prices[exchange] * priceWeights[exchange];
      totalWeight += priceWeights[exchange];
    } else {
      console.error(`Invalid price from ${exchange}: ${prices[exchange]}`);
    }
  });

  const avgPrice = totalPrice / totalWeight;
  console.log(`AvgPrice: ${avgPrice}. Total weight: ${totalWeight}`);

  return avgPrice;
};
