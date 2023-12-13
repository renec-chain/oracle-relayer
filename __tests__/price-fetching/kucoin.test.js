import axios from 'axios';
import {
  fetchUSDPriceFromKucoin,
  fetchUSDPriceFromKucoinP2p,
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

describe('Kucoin P2P price fetching', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches USD price from Kucoin P2P', async () => {
    const mockResponse = {
      data: {
        items: [
          { currencyBalanceQuantity: '10', premium: '100' },
          { currencyBalanceQuantity: '20', premium: '150' },
        ]
      }
    };
    // Given that, totalValuation = (10*100) + (20*150) = 1000 + 3000 = 4000
    // and totalQuantity = 10 + 20 = 30
    // Then, usdtVNDPrice = 4000 / 30 = 133.33

    axios.get.mockResolvedValue(mockResponse);

    const price = await fetchUSDPriceFromKucoinP2p();
    expect(price).toBeCloseTo(133.33);
  });

  it('handles case with no data available', async () => {
    const mockResponse = {
      data: {
        data: {
          buy: []
        }
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    const price = await fetchUSDPriceFromKucoinP2p();
    expect(price).toBeUndefined();
  });

  it('handles request error', async () => {
    axios.get.mockRejectedValue(new Error('Request error'));

    const price = await fetchUSDPriceFromKucoinP2p();
    expect(price).toBeUndefined();
  });
});
