import axios from 'axios';
import {
  fetchUSDPriceFromOkx,
  fetchBTCPriceFromOkx,
  fetchETHPriceFromOkx
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
