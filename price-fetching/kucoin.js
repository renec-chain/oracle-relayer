import axios from 'axios';

const CONVERT_FEE = 0.001;

export const fetchUSDPriceFromKucoin = async () => {
    try {
        const response = await axios.get('https://www.kucoin.com/_api/currency/prices', {
            params: {
                base: 'VND',
            },
        });

        if (response.data && response.data.data && response.data.data.USDT) {
            const usdtVNDPrice = response.data.data.USDT * (1 - CONVERT_FEE);

            return usdtVNDPrice;
        } else {
            console.error('Kucoin: No data available for USDT/VND rate');
        }
    } catch (error) {
        console.error('Kucoin: Error fetching USDT/VND rate:', error);
    }
}

export const fetchBTCPriceFromKucoin = async () => {
    return await fetchPriceFromKucoin('BTC');
}

export const fetchETHPriceFromKucoin = async () => {
    return await fetchPriceFromKucoin('ETH');
}

const fetchPriceFromKucoin = async (coin) => {
    const endpoint = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${coin}-USDT`;
    try {
        const response = await axios.get(endpoint);
        const price = parseFloat(response.data.data.price);
        return price;
    } catch (error) {
        console.error('Error fetching ${coin} price from Kucoin:', error);
    }
}
