import axios from 'axios';

export const fetchUSDPriceFromOkx = async () => {
    try {
        const response = await axios.get('https://www.okx.com/priapi/v3/b2c/deposit/quotedPrice', {
            params: {
                t: Date.now(),
                side: 'sell',
                quoteCurrency: 'VND',
                baseCurrency: 'USDT'
            },
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
            const usdtTicker = response.data.data[0];
            const usdtVNDPrice = usdtTicker.price;

            console.log('OKX: USDT/VND Price:', usdtVNDPrice);
            return usdtVNDPrice;
        } else {
            console.error('OKX: No data available for USDT/VND rate');
        }
    } catch (error) {
        console.error('OKX: Error fetching USDT/VND rate:', error);
    }
}
