import { fetchUSDPriceFromRemitano } from "./remitano.js";
// import { fetchUSDPriceFromNemo } from "./nemo.js";
import { fetchUSDPriceFromCoinbase } from "./coinbase.js";
import { fetchUSDPriceFromOkx } from "./okx.js";
import { fetchUSDPriceFromBinance } from "./binance.js";
import { fetchUSDPriceFromKucoin } from "./kucoin.js";
import { PRICE_WEIGHTS, VALID_PRICE_RANGE } from "../constants.js"

export const calculateUSDPrice = async () => {
    const remiPrice = await fetchUSDPriceFromRemitano();
    // const nemoPrice = await fetchUSDPriceFromNemo();
    const coinbasePrice = await fetchUSDPriceFromCoinbase();
    const okxPrice = await fetchUSDPriceFromOkx();
    const binancePrice = await fetchUSDPriceFromBinance();
    const kucoinPrice = await fetchUSDPriceFromKucoin();

    const prices = {
        coinbase: coinbasePrice,
        okx: okxPrice,
        binance: binancePrice,
        kucoin: kucoinPrice,
        remitano: remiPrice,
    };

    let totalPrice = 0;
    let totalWeight = 0;
    Object.keys(prices).forEach((exchange) => {
        if (prices[exchange] && prices[exchange] >= VALID_PRICE_RANGE["low"] && prices[exchange] <= VALID_PRICE_RANGE["high"]) {
            totalPrice += prices[exchange] * PRICE_WEIGHTS[exchange];
            totalWeight += PRICE_WEIGHTS[exchange];
        } else {
            console.log(`Invalid price from ${exchange}: ${prices[exchange]}`);
        }
    });

    const newPrice = totalPrice / totalWeight;
    console.log("Total weight: ", totalWeight);
    return newPrice;
}
