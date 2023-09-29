import { 
    fetchUSDPriceFromRemitano,
    fetchBTCPriceFromRemitano,
    fetchETHPriceFromRemitano,
    fetchRENECPriceFromRemitano,
} from "./remitano.js";
import { 
    fetchRENECPriceFromNemo,
} from "./nemo.js";
import { 
    fetchUSDPriceFromCoinbase,
    fetchBTCPriceFromCoinbase,
    fetchETHPriceFromCoinbase,
} from "./coinbase.js";
import { 
    fetchUSDPriceFromOkx,
    fetchBTCPriceFromOkx,
    fetchETHPriceFromOkx,
} from "./okx.js";
import { 
    fetchBTCPriceFromBinance,
    fetchETHPriceFromBinance,
} from "./binance.js";
import { fetchUSDPriceFromBinanceP2p } from "./binance-p2p.js";
import { 
    fetchUSDPriceFromKucoin,
    fetchBTCPriceFromKucoin,
    fetchETHPriceFromKucoin,
} from "./kucoin.js";
import { PRICE_WEIGHTS, VALID_PRICE_RANGES } from "../constants.js"

export const calculateUSDPrice = async () => {
    const remiPrice = await fetchUSDPriceFromRemitano();
    const coinbasePrice = await fetchUSDPriceFromCoinbase();
    const okxPrice = await fetchUSDPriceFromOkx();
    const binancePrice = await fetchUSDPriceFromBinanceP2p();
    const kucoinPrice = await fetchUSDPriceFromKucoin();

    const prices = {
        coinbase: coinbasePrice,
        okx: okxPrice,
        binance: binancePrice,
        kucoin: kucoinPrice,
        remitano: remiPrice,
    };
    console.log('USD prices', prices);
    const avgPrice = calculateAveragePrice(prices, PRICE_WEIGHTS.default, VALID_PRICE_RANGES.reusd);
    
    return avgPrice;
}

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
    console.log('BTC prices', prices);
    const avgPrice = calculateAveragePrice(prices, PRICE_WEIGHTS.default, VALID_PRICE_RANGES.rebtc);
    
    return avgPrice;
}

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
    console.log('ETH prices', prices);
    const avgPrice = calculateAveragePrice(prices, PRICE_WEIGHTS.default, VALID_PRICE_RANGES.reeth);
    
    return avgPrice;
}

export const calculateRENECPrice = async () => {
    const remiPrice = await fetchRENECPriceFromRemitano();
    const nemoPrice = await fetchRENECPriceFromNemo();

    const prices = {
        nemo: nemoPrice,
        remitano: remiPrice,
    };
    console.log('RENEC prices', prices);
    const avgPrice = calculateAveragePrice(prices, PRICE_WEIGHTS.renec, VALID_PRICE_RANGES.renec);
    
    return avgPrice;
}

const calculateAveragePrice = (prices, priceWeights, validPriceRange) => {
    let totalPrice = 0;
    let totalWeight = 0;
    Object.keys(prices).forEach((exchange) => {
        if (prices[exchange] && prices[exchange] >= validPriceRange.low && prices[exchange] <= validPriceRange.high) {
            totalPrice += prices[exchange] * priceWeights[exchange];
            totalWeight += priceWeights[exchange];
        } else {
            console.error(`Invalid price from ${exchange}: ${prices[exchange]}`);
        }
    });

    const avgPrice = totalPrice / totalWeight;
    console.log(`AvgPrice: ${avgPrice}. Total weight: ${totalWeight}`);

    return avgPrice;
}
