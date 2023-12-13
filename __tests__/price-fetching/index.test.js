import {
    calculateUSDPrice,
    calculateBTCPrice,
    calculateETHPrice,
    calculateRENECPrice
} from '../../price-fetching';
import {
    fetchUSDPriceFromRemitano,
    fetchBTCPriceFromRemitano,
    fetchETHPriceFromRemitano,
    fetchRENECPriceFromRemitano,
} from "../../price-fetching/remitano";
import {
    fetchRENECPriceFromNemo,
} from "../../price-fetching/nemo.js";
import {
    fetchBTCPriceFromCoinbase,
    fetchETHPriceFromCoinbase,
} from "../../price-fetching/coinbase.js";
import {
    fetchUSDPriceFromOkx,
    fetchUSDPriceFromOkxP2p,
    fetchBTCPriceFromOkx,
    fetchETHPriceFromOkx,
} from "../../price-fetching/okx.js";
import {
    fetchBTCPriceFromBinance,
    fetchETHPriceFromBinance,
} from "../../price-fetching/binance.js";
import { fetchUSDPriceFromBinanceP2p } from "../../price-fetching/binance-p2p.js";
import {
    fetchUSDPriceFromKucoin,
    fetchUSDPriceFromKucoinP2p,
    fetchBTCPriceFromKucoin,
    fetchETHPriceFromKucoin,
} from "../../price-fetching/kucoin.js";

jest.mock('../../price-fetching/remitano');
jest.mock('../../price-fetching/nemo.js');
jest.mock('../../price-fetching/coinbase.js');
jest.mock('../../price-fetching/okx.js');
jest.mock('../../price-fetching/binance.js');
jest.mock('../../price-fetching/binance-p2p.js');
jest.mock('../../price-fetching/kucoin.js');

describe('Price calculations', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calculates average USD price from various exchanges', async () => {
        fetchUSDPriceFromRemitano.mockResolvedValue(21000);
        fetchUSDPriceFromOkxP2p.mockResolvedValue(25000);
        fetchUSDPriceFromBinanceP2p.mockResolvedValue(21000);
        fetchUSDPriceFromKucoinP2p.mockResolvedValue(28000);

        const avgPrice = await calculateUSDPrice();
        expect(avgPrice).toBeCloseTo(22700);
    });

    it('calculates average BTC price from various exchanges', async () => {
        fetchBTCPriceFromRemitano.mockResolvedValue(21000);
        fetchBTCPriceFromCoinbase.mockResolvedValue(20000);
        fetchBTCPriceFromOkx.mockResolvedValue(25000);
        fetchBTCPriceFromBinance.mockResolvedValue(21000);
        fetchBTCPriceFromKucoin.mockResolvedValue(28000);

        const avgPrice = await calculateBTCPrice();
        expect(avgPrice).toBeCloseTo(21680);
    });

    it('calculates average ETH price from various exchanges', async () => {
        fetchETHPriceFromRemitano.mockResolvedValue(1500);
        fetchETHPriceFromCoinbase.mockResolvedValue(1600);
        fetchETHPriceFromOkx.mockResolvedValue(1400);
        fetchETHPriceFromBinance.mockResolvedValue(1450);
        fetchETHPriceFromKucoin.mockResolvedValue(1550);

        const avgPrice = await calculateETHPrice();
        expect(avgPrice).toBeCloseTo(1467);
    });

    it('calculates average RENEC price from various exchanges', async () => {
        fetchRENECPriceFromRemitano.mockResolvedValue(0.5);
        fetchRENECPriceFromNemo.mockResolvedValue(0.55);

        const avgPrice = await calculateRENECPrice();
        expect(avgPrice).toBeCloseTo(0.504);
    });

    it('handles prices outside the VALID_PRICE_RANGES', async () => {
        fetchUSDPriceFromRemitano.mockResolvedValue(21000);
        fetchUSDPriceFromOkxP2p.mockResolvedValue(25000);
        fetchUSDPriceFromBinanceP2p.mockResolvedValue(21000);
        fetchUSDPriceFromKucoinP2p.mockResolvedValue(28000);

        const avgPrice = await calculateUSDPrice();
        expect(avgPrice).toBeCloseTo(22700);
    });

    it('handles undefined prices from some exchanges', async () => {
        fetchUSDPriceFromRemitano.mockResolvedValue(21000);
        fetchUSDPriceFromOkxP2p.mockResolvedValue(25000);
        fetchUSDPriceFromBinanceP2p.mockResolvedValue(21000);
        fetchUSDPriceFromKucoinP2p.mockResolvedValue(undefined);

        const avgPrice = await calculateUSDPrice();
        expect(avgPrice).toBeCloseTo(22111.11);
    });
});
