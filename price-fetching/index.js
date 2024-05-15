import {
  fetchUSDPriceFromRemitano,
  fetchNGNPriceFromRemitano,
  fetchPriceFromRemitano,
} from "./remitano.js";
import {
  fetchRENECPriceFromNemo,
  fetchGASTPriceFromNemo,
  fetchPLUS1PriceFromNemo,
} from "./nemo.js";
import {
  fetchUSDPriceFromCoinbase,
  fetchPriceFromCoinbase,
} from "./coinbase.js";
import {
  fetchUSDPriceFromOkx,
  fetchUSDPriceFromOkxP2p,
  fetchNGNPriceFromOkx,
  fetchPriceFromOkx,
} from "./okx.js";
import {
  fetchPriceFromBinance,
} from "./binance.js";
import {
  fetchUSDPriceFromBinanceP2p,
  fetchNGNPriceFromBinanceP2p,
} from "./binance-p2p.js";
import {
  fetchUSDPriceFromKucoin,
  fetchUSDPriceFromKucoinP2p,
  fetchPriceFromKucoin,
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
  );

  return avgPrice;
};

export const calculatePLUS1Price = async () => {
  const nemoPrice = await fetchPLUS1PriceFromNemo();

  const prices = {
    nemo: nemoPrice,
  };
  console.log("PLUS1 prices", prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.plus1,
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
  );

  return avgPrice;
};

export const calculateBTCPrice = async () => {
  const remiPrice = await fetchPriceFromRemitano("BTC");
  const coinbasePrice = await fetchPriceFromCoinbase("BTC");
  const okxPrice = await fetchPriceFromOkx("BTC");
  const binancePrice = await fetchPriceFromBinance("BTC");
  const kucoinPrice = await fetchPriceFromKucoin("BTC");

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
  );

  return avgPrice;
};

export const calculateETHPrice = async () => {
  const remiPrice = await fetchPriceFromRemitano("ETH");
  const coinbasePrice = await fetchPriceFromCoinbase("ETH");
  const okxPrice = await fetchPriceFromOkx("ETH");
  const binancePrice = await fetchPriceFromBinance("ETH");
  const kucoinPrice = await fetchPriceFromKucoin("ETH");

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
  );

  return avgPrice;
};

export const calculateCommonCoinPrice = async (coin) => {
  const remiPrice = await fetchPriceFromRemitano(coin);
  const coinbasePrice = await fetchPriceFromCoinbase(coin);
  const okxPrice = await fetchPriceFromOkx(coin);
  const binancePrice = await fetchPriceFromBinance(coin);
  const kucoinPrice = await fetchPriceFromKucoin(coin);

  const prices = {
    coinbase: coinbasePrice,
    okx: okxPrice,
    binance: binancePrice,
    kucoin: kucoinPrice,
    remitano: remiPrice,
  };
  console.log(`${coin} prices`, prices);
  const avgPrice = calculateAveragePrice(
    prices,
    PRICE_WEIGHTS.default,
  );

  return avgPrice;
};

export const calculateRENECPrice = async () => {
  const remiPrice = await fetchPriceFromRemitano("RENEC");
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

const calculateAveragePrice = (prices, priceWeights) => {
  let totalPrice = 0;
  let totalWeight = 0;
  Object.keys(prices).forEach((exchange) => {
    if (prices[exchange]) {
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
