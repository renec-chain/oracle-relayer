import axios from 'axios';

const CONVERT_FEE = 0.001;

export const fetchUSDPriceFromKucoin = async () => {
    try {
        const response = await axios.get('https://www.kucoin.com/_api/currency/prices', {
            params: {
                base: 'VND',
            },
        });
        console.log(response.data.data.USDT)

        if (response.data && response.data.data && response.data.data.USDT) {
            const usdtVNDPrice = response.data.data.USDT * (1 - CONVERT_FEE);

            console.log('Kucoin: USDT/VND Price:', usdtVNDPrice);
            return usdtVNDPrice;
        } else {
            console.error('Kucoin: No data available for USDT/VND rate');
        }
    } catch (error) {
        console.error('Kucoin: Error fetching USDT/VND rate:', error);
    }
}
