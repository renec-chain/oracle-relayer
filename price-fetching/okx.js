import axios from "axios";

export const fetchUSDPriceFromOkx = async () => {
  try {
    const response = await axios.get(
      "https://www.okx.com/priapi/v3/b2c/deposit/quotedPrice",
      {
        params: {
          t: Date.now(),
          side: "sell",
          quoteCurrency: "VND",
          baseCurrency: "USDT",
        },
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      const usdtTicker = response.data.data[0];
      const usdtVNDPrice = parseFloat(usdtTicker.price);

      return usdtVNDPrice;
    } else {
      console.error("OKX: No data available for USDT/VND rate");
    }
  } catch (error) {
    console.error("OKX: Error fetching USDT/VND rate:", error);
  }
};

export const fetchBTCPriceFromOkx = async () => {
  return await fetchPriceFromOkx("BTC");
};

export const fetchETHPriceFromOkx = async () => {
  return await fetchPriceFromOkx("ETH");
};

export const fetchNGNPriceFromOkx = async () => {
  try {
    const response = await axios.get(
      "https://www.okx.com/priapi/v3/b2c/deposit/quotedPrice",
      {
        params: {
          t: Date.now(),
          side: "sell",
          quoteCurrency: "NGN",
          baseCurrency: "USDT",
        },
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      const ngnTicker = response.data.data[0];
      const ngnPrice = parseFloat(ngnTicker.price);

      return ngnPrice;
    } else {
      console.error("OKX: No data available for USDT/NGN rate");
    }
  } catch (error) {
    console.error("OKX: Error fetching USDT/NGN rate:", error);
  }
};

export const fetchUSDPriceFromOkxP2p = async (fiatCurrency) => {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    }
    const response = await axios.get(
      "https://www.okx.com/v3/c2c/tradingOrders/getMarketplaceAdsPrelogin",
      {
        params: {
          t: Date.now(),
          side: "buy",
          paymentMethod: "all",
          userType: "all",
          hideOverseasVerificationAds: "false",
          sortType: "price_desc",
          urlId: 4,
          limit: 20,
          cryptoCurrency: "usdt",
          fiatCurrency,
          currentPage: 1,
          numberPerPage: 20,
        },
        headers,
      }
    );

    if (response.data && response.data.data && response.data.data.buy.length > 0) {
      const offers = response.data.data.buy;
      let totalQuantity = 0;
      let totalValuation = 0;
      offers.forEach((offer) => {
        totalValuation +=
          parseFloat(offer.availableAmount) * parseFloat(offer.price);
        totalQuantity += parseFloat(offer.availableAmount);
      });

      const usdtPrice = totalValuation / totalQuantity;
      return usdtPrice;
    } else {
      console.error(`OKX: No data available for USDT/${fiatCurrency} rate`);
    }
  } catch (error) {
    console.error(`OKX: Error fetching USDT/${fiatCurrency} rate:`, error);
  }
};

export const fetchPriceFromOkx = async (coin) => {
  const endpoint = `https://www.okx.com/api/v5/market/ticker?instId=${coin}-USDT`;
  try {
    const response = await axios.get(endpoint);
    const price = parseFloat(response.data.data[0].last);
    return price;
  } catch (error) {
    console.error(`Error fetching ${coin} price from Okx:`, error);
  }
};
