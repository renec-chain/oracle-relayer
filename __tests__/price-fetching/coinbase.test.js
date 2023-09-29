import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchUSDPriceFromCoinbase, fetchBTCPriceFromCoinbase, fetchETHPriceFromCoinbase } from '../../price-fetching/coinbase';

const mock = new MockAdapter(axios);

describe('Coinbase API functions', () => {
    afterEach(() => {
        mock.reset();
    });

    test('fetchUSDPriceFromCoinbase returns correct price', async () => {
        const mockPrice = 23000;
        mock.onGet('https://api.coinbase.com/v2/prices/USDT-VND/sell').reply(200, {
            data: {
                amount: mockPrice.toString(),
            }
        });

        const result = await fetchUSDPriceFromCoinbase();
        expect(result).toBe(mockPrice);
    });

    test('fetchBTCPriceFromCoinbase returns correct price', async () => {
        const mockPrice = 40000;
        mock.onGet('https://api.coinbase.com/v2/prices/BTC-USD/spot').reply(200, {
            data: {
                amount: mockPrice.toString(),
            }
        });

        const result = await fetchBTCPriceFromCoinbase();
        expect(result).toBe(mockPrice);
    });

    test('fetchETHPriceFromCoinbase returns correct price', async () => {
        const mockPrice = 2000;
        mock.onGet('https://api.coinbase.com/v2/prices/ETH-USD/spot').reply(200, {
            data: {
                amount: mockPrice.toString(),
            }
        });

        const result = await fetchETHPriceFromCoinbase();
        expect(result).toBe(mockPrice);
    });
});
