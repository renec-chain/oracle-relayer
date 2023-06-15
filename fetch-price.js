import axios from 'axios';

export const fetchUSDPrice = async () => {
    try {
        const response = await axios.get('https://remitano.com/api/v1/amm_pool_states');
        const pools = Object.values(response.data.amm_pool_states);
        const reusd_pool = pools.find((pool) => pool.token0 === 'reusd' && pool.token1 === 'usdt');
        const vnd_pool = pools.find((pool) => pool.token0 === 'usdt' && pool.token1 === 'vnd');
        return reusd_pool.price * vnd_pool.price;
    } catch (error) {
        console.log(error);
    }
};
