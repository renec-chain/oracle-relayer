import axios from 'axios';
import { MAX_VOLUME_EACH_OFFER } from '../constants.js';

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

export const fetchUSDPriceFromKucoinP2p = async (fiatCurrency) => {
  try {
    const response = await axios.get('https://www.kucoin.com/_api/otc/ad/list', {
      params: {
        status: 'PUTUP',
        currency: 'USDT',
        legal: fiatCurrency,
        page: 1,
        pageSize: 20,
        side: 'BUY',
      },
    });

    if (response.data && response.data.items && response.data.items.length > 0) {
      const offers = response.data.items;
      let totalQuantity = 0;
      let totalValuation = 0;
      offers.forEach((offer) => {
        const quantity = offer.currencyBalanceQuantity > MAX_VOLUME_EACH_OFFER ? MAX_VOLUME_EACH_OFFER : offer.currencyBalanceQuantity;
        totalValuation +=
          parseFloat(quantity) * parseFloat(offer.premium);
        totalQuantity += parseFloat(quantity);
      });

      const usdtPrice = totalValuation / totalQuantity;
      return usdtPrice;
    } else {
      console.error(`Kucoin: No data available for USDT/${fiatCurrency} rate`);
    }
  } catch (error) {
    console.error(`Kucoin: Error fetching USDT/${fiatCurrency} rate:`, error);
  }
}

export const fetchBTCPriceFromKucoin = async () => {
  return await fetchPriceFromKucoin('BTC');
}

export const fetchETHPriceFromKucoin = async () => {
  return await fetchPriceFromKucoin('ETH');
}

export const fetchPriceFromKucoin = async (coin) => {
  const endpoint = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${coin}-USDT`;
  try {
    const response = await axios.get(endpoint);
    const price = parseFloat(response.data.data.price);
    return price;
  } catch (error) {
    console.error('Error fetching ${coin} price from Kucoin:', error);
  }
}
