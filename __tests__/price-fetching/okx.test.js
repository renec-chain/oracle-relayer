import axios from 'axios';
import {
  fetchUSDPriceFromOkx,
  fetchBTCPriceFromOkx,
  fetchETHPriceFromOkx,
  fetchUSDPriceFromOkxP2p
} from '../../price-fetching/okx';

jest.mock('axios');

describe('Okx price fetching', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches USD price from Okx', async () => {
    const mockResponse = {
      data: {
        data: [{
          price: '23000'
        }]
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    const price = await fetchUSDPriceFromOkx();
    expect(price).toEqual(23000);
  });

  it('fetches BTC price from Okx', async () => {
    const mockResponse = {
      data: {
        data: [{
          last: '50000'
        }]
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    const price = await fetchBTCPriceFromOkx();
    expect(price).toEqual(50000);
  });

  it('fetches ETH price from Okx', async () => {
    const mockResponse = {
      data: {
        data: [{
          last: '3500'
        }]
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    const price = await fetchETHPriceFromOkx();
    expect(price).toEqual(3500);
  });
});


describe('OKX P2P price fetching', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches USD price from OKX P2P', async () => {
    const mockResponse = {
      data: {
        data: {
          buy: [
            { availableAmount: '10', price: '100' },
            { availableAmount: '20', price: '150' },
          ]
        }
      }
    };
    // Given that, totalValuation = (10*100) + (20*150) = 1000 + 3000 = 4000
    // and totalQuantity = 10 + 20 = 30
    // Then, usdtVNDPrice = 4000 / 30 = 133.33

    axios.get.mockResolvedValue(mockResponse);

    const price = await fetchUSDPriceFromOkxP2p();
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

    const price = await fetchUSDPriceFromOkxP2p();
    expect(price).toBeUndefined();
  });

  it('handles request error', async () => {
    axios.get.mockRejectedValue(new Error('Request error'));

    const price = await fetchUSDPriceFromOkxP2p();
    expect(price).toBeUndefined();
  });
});
