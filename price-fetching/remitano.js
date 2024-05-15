import axios from "axios";

export const fetchUSDPriceFromRemitano = async () => {
  return await fetchPrice("usdt", "vnd");
};

export const fetchNGNPriceFromRemitano = async () => {
  return await fetchPrice("usdt", "ngn");
};

export const fetchPriceFromRemitano = async (token) => {
  return await fetchPrice(token, "usdt");
};

export const fetchPrice = async (tokenA, tokenB) => {
  tokenA = tokenA.toLowerCase();
  tokenB = tokenB.toLowerCase();
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
