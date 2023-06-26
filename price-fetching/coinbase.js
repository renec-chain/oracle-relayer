import axios from 'axios';

export const fetchUSDPriceFromCoinbase = async () => {
    try {
        const response = await axios.get('https://api.coinbase.com/v2/prices/USDT-VND/sell');

        if (response.data && response.data.data && response.data.data.amount) {
            const usdtVNDPrice = response.data.data.amount;
            console.log('Coinbase: USDT/VND Price:', usdtVNDPrice);
            return usdtVNDPrice;
        } else {
            console.error('Coinbase: No data available for USDT/VND rate');
        }
    } catch (error) {
        console.error('Coinbase: Error fetching USDT/VND rate:', error);
    }
}
