import axios from 'axios';
import {
    fetchUSDPriceFromBinance,
    fetchBTCPriceFromBinance,
    fetchETHPriceFromBinance,
    fetchCoinsPriceFromBinance
} from '../../price-fetching/binance';

jest.mock('axios');

describe('Binance price fetching', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches USD price from Binance', async () => {
        const mockCurrencyResponse = {
            data: {
                data: [{ pair: 'VND_USD', rate: 23000 }]
            }
        };
        const mockChartResponse = {
            data: {
                data: {
                    body: {
                        data: {
                            points: {
                                1: { v: [1] }
                            }
                        }
                    }
                }
            }
        };

        axios.get.mockResolvedValueOnce(mockCurrencyResponse).mockResolvedValueOnce(mockChartResponse);

        const price = await fetchUSDPriceFromBinance();
        expect(price).toBeCloseTo(22986.2); // 1 * 23000 * (1 - 0.0006)
    });

    it('fetches BTC price from Binance', async () => {
        const mockResponse = {
            data: { price: '50000' }
        };
        axios.get.mockResolvedValue(mockResponse);

        const price = await fetchBTCPriceFromBinance();
        expect(price).toEqual(50000);
    });

    it('fetches ETH price from Binance', async () => {
        const mockResponse = {
            data: { price: '3500' }
        };
        axios.get.mockResolvedValue(mockResponse);

        const price = await fetchETHPriceFromBinance();
        expect(price).toEqual(3500);
    });

    it('fetches multiple coin prices from Binance', async () => {
        const mockResponse = {
            data: [
                { symbol: 'BTCUSDT', price: '50000' },
                { symbol: 'ETHUSDT', price: '3500' }
            ]
        };
        axios.get.mockResolvedValue(mockResponse);

        const prices = await fetchCoinsPriceFromBinance();
        expect(prices).toEqual({
            BTCUSDT: 50000,
            ETHUSDT: 3500
        })
    }); 
});
