import axios from 'axios';

export const fetchUSDPriceFromRemitano = async () => {
  try {
    const response = await axios.get('https://remitano.com/api/v1/amm_pool_states');
    const pools = Object.values(response.data.amm_pool_states);
    const vnd_pool = pools.find((pool) => pool.token0 === 'usdt' && pool.token1 === 'vnd');
    console.log('Remitano: USDT/VND Price:', vnd_pool.price);
    return vnd_pool.price;
  } catch (error) {
    console.log("Remitano: error when fetching price", error);
  }
};
