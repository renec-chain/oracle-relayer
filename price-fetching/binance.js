import axios from 'axios';

const CONVERT_FEE = 0.0006;

export const fetchUSDPriceFromBinance = async () => {
    try {
        let usdtUsdPrice, usdVndPrice;
        const currencyResponse = await axios.get('https://www.binance.com/bapi/asset/v1/public/asset-service/product/currency');

        if (currencyResponse.data && currencyResponse.data.data && currencyResponse.data.data.length > 0) {
            const usdVndData = currencyResponse.data.data.find((record) => record.pair === 'VND_USD');
            usdVndPrice = usdVndData.rate;
        } else {
            console.error('Binance: No data available for USD/VND rate', currencyResponse.data);
        }

        const chartResponse = await axios.get('https://www.binance.com/bapi/composite/v1/public/promo/cmc/cryptocurrency/detail/chart?id=825&range=1D');

        const dataPoints = chartResponse?.data?.data?.body?.data?.points;
        if (dataPoints) {
            const latestPoint = dataPoints[Math.max(...Object.keys(dataPoints))];
            usdtUsdPrice = latestPoint.v[0];
        } else {
            console.error('Binance: No data available for USDT/USD rate', chartResponse.data);
        }

        const usdtVndPrice = usdtUsdPrice * usdVndPrice * (1 - CONVERT_FEE);

        return usdtVndPrice;
    } catch (error) {
        console.error('Binance: Error fetching USDT/VND rate:', error);
    }
}

export const fetchBTCPriceFromBinance = async () => {
    return await fetchPriceFromBinance('BTC');
}

export const fetchETHPriceFromBinance = async () => {
    return await fetchPriceFromBinance('ETH');
}

const fetchPriceFromBinance = async (coin) => {
    const endpoint = `https://api.binance.com/api/v3/ticker/price?symbol=${coin}USDT`;
    try {
        const response = await axios.get(endpoint);
        const price = parseFloat(response.data.price);
        return price;
    } catch (error) {
        console.error('Error fetching ${coin} price from Binance:', error);
    }
}

export const fetchCoinsPriceFromBinance = async () => {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT"]');
        const data = response?.data;
        let prices = {};
        data.forEach(element => {
            prices[element.symbol] = parseFloat(element.price);
        });
        return prices;
    } catch (error) {
        console.error('Error fetching ${coin} price from Binance:', error);
    }
}
