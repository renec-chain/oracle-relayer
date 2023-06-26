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
        console.log('Binance: USDT/VND Price:', usdtVndPrice);

        return usdtVndPrice;
    } catch (error) {
        console.error('Binance: Error fetching USDT/VND rate:', error);
    }
}
