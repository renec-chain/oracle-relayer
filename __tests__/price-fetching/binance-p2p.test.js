import axios from 'axios';
import { fetchUSDPriceFromBinanceP2p } from '../../price-fetching/binance-p2p';

jest.mock('axios');

describe('Binance P2P price fetching', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches USD price from Binance P2P', async () => {
        const mockResponse = {
            data: {
                data: [
                    { adv: { tradableQuantity: '10', price: '100' } },
                    { adv: { tradableQuantity: '20', price: '150' } }
                ]
            }
        };
        // Given that, totalValuation = (10*100) + (20*150) = 1000 + 3000 = 4000
        // and totalQuantity = 10 + 20 = 30
        // Then, usdtVNDPrice = 4000 / 30 * (1 - 0.001) = 133.2

        axios.post.mockResolvedValue(mockResponse);

        const price = await fetchUSDPriceFromBinanceP2p();
        expect(price).toBeCloseTo(133.2);
    });

    it('handles case with no data available', async () => {
        const mockResponse = {
            data: {
                data: []
            }
        };
        axios.post.mockResolvedValue(mockResponse);

        const price = await fetchUSDPriceFromBinanceP2p();
        expect(price).toBeUndefined();
    });
    
    it('handles request error', async () => {
        axios.post.mockRejectedValue(new Error('Request error'));

        const price = await fetchUSDPriceFromBinanceP2p();
        expect(price).toBeUndefined();
    });
});
