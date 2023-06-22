import axios from 'axios';

export const fetchUSDPriceFromBinance = async () => {
    try {
        const response = await axios.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
            fiat: "VND",
            page: 1,
            rows: 20,
            tradeType: "BUY",
            asset: "USDT",
            countries: [],
            proMerchantAds: false,
            payTypes: []
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
            const offers = response.data.data;
            let totalQuantity = 0;
            let totalValuation = 0;
            offers.forEach((offer) => {
                const adv = offer.adv
                totalValuation += parseFloat(adv.tradableQuantity) * parseFloat(adv.price);
                totalQuantity += parseFloat(adv.tradableQuantity);
            });

            console.log({totalQuantity, totalValuation});
            const usdtVNDPrice = totalValuation / totalQuantity * 0.999;
            console.log('Binance: USDT/VND Price:', usdtVNDPrice);
            return usdtVNDPrice;
        } else {
            console.error('Binance: No data available for USDT/VND rate', response.data);
        }
    } catch (error) {
        console.error('Binance: Error fetching USDT/VND rate:', error);
    }
}
