import { fetchUSDPriceFromRemitano } from "./fetch-price-from-remitano.js";
import { fetchUSDPriceFromCoinbase } from "./fetch-price-from-coinbase.js";
import { fetchUSDPriceFromOkx } from "./fetch-price-from-okx.js";
import { fetchUSDPriceFromNemo } from "./fetch-price-from-nemo.js";
import { fetchUSDPriceFromBinance } from "./fetch-price-from-binance.js";
import { PRICE_WEIGHTS, VALID_PRICE_RANGE } from "./constants.js"

export const calculateUSDPrice = async () => {
    const remiPrice = await fetchUSDPriceFromRemitano();
    const coinbasePrice = await fetchUSDPriceFromCoinbase();
    const okxPrice = await fetchUSDPriceFromOkx();
    const nemoPrice = await fetchUSDPriceFromNemo();
    const binancePrice = await fetchUSDPriceFromBinance();

    const prices = {
        remitano: remiPrice,
        coinbase: coinbasePrice,
        okx: okxPrice,
        nemo: nemoPrice,
        binance: binancePrice
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
    console.log("total weight: ", totalWeight);
    return newPrice;
}
