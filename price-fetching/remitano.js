import axios from "axios";

export const fetchUSDPriceFromRemitano = async () => {
  return await fetchPriceFromRemitano("usdt", "vnd");
};

export const fetchNGNPriceFromRemitano = async () => {
  return await fetchPriceFromRemitano("usdt", "ngn");
};

export const fetchBTCPriceFromRemitano = async () => {
  return await fetchPriceFromRemitano("btc", "usdt");
};

export const fetchETHPriceFromRemitano = async () => {
  return await fetchPriceFromRemitano("eth", "usdt");
};

export const fetchRENECPriceFromRemitano = async () => {
  return await fetchPriceFromRemitano("renec", "usdt");
};

export const fetchPriceFromRemitano = async (tokenA, tokenB) => {
  try {
    const response = await axios.get(
      "https://remitano.com/api/v1/amm_pool_states"
    );
    const pools = Object.values(response.data.amm_pool_states);
    const vnd_pool = pools.find(
      (pool) => pool.token0 === tokenA && pool.token1 === tokenB
    );
    return vnd_pool.price;
  } catch (error) {
    console.log("Remitano: error when fetching price", error);
  }
};
