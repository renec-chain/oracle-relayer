import axios from 'axios';

export const fetchUSDPriceFromCoinbase = async () => {
  try {
    const response = await axios.get('https://api.coinbase.com/v2/prices/USDT-VND/sell');

    if (response.data && response.data.data && response.data.data.amount) {
      const usdtVNDPrice = parseFloat(response.data.data.amount);
      return usdtVNDPrice;
    } else {
      console.error('Coinbase: No data available for USDT/VND rate');
    }
  } catch (error) {
    console.error('Coinbase: Error fetching USDT/VND rate:', error);
  }
}

export const fetchBTCPriceFromCoinbase = async () => {
  return await fetchPriceFromCoinbase('BTC');
}

export const fetchETHPriceFromCoinbase = async () => {
  return await fetchPriceFromCoinbase('ETH');
}

export const fetchPriceFromCoinbase = async (coin) => {
  const endpoint = `https://api.coinbase.com/v2/prices/${coin}-USD/spot`;
  try {
    const response = await axios.get(endpoint);
    const price = parseFloat(response.data.data.amount);
    return price;
  } catch (error) {
    console.error('Error fetching ${coin} price from Coinbase:', error);
  }
}
