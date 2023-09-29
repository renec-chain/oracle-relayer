import axios from 'axios';
import {
  fetchUSDPriceFromKucoin,
  fetchBTCPriceFromKucoin,
  fetchETHPriceFromKucoin
} from '../../price-fetching/kucoin';

jest.mock('axios');

describe('Kucoin price fetching', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches USD price from Kucoin', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          USDT: 23000
        }
      }
    });

    const price = await fetchUSDPriceFromKucoin();
    expect(price).toEqual(23000 * (1 - 0.001));
  });

  it('fetches BTC price from Kucoin', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          price: '50000'
        }
      }
    });

    const price = await fetchBTCPriceFromKucoin();
    expect(price).toEqual(50000);
  });

  it('fetches ETH price from Kucoin', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          price: '3500'
        }
      }
    });

    const price = await fetchETHPriceFromKucoin();
    expect(price).toEqual(3500);
  });
});
