import axios from 'axios';
import {
  fetchUSDPriceFromRemitano,
  fetchPriceFromRemitano,
} from '../../price-fetching/remitano';

jest.mock('axios');

describe('Remitano price fetching', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches USD price from Remitano', async () => {
    axios.get.mockResolvedValue({
      data: {
        amm_pool_states: [
          {
            token0: 'usdt',
            token1: 'vnd',
            price: 23000
          }
        ]
      }
    });

    const price = await fetchUSDPriceFromRemitano();
    expect(price).toEqual(23000);
  });

  it('fetches BTC price from Remitano', async () => {
    axios.get.mockResolvedValue({
      data: {
        amm_pool_states: [
          {
            token0: 'btc',
            token1: 'usdt',
            price: 50000
          }
        ]
      }
    });

    const price = await fetchPriceFromRemitano("BTC");
    expect(price).toEqual(50000);
  });
});
