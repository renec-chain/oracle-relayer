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

const fetchPriceFromOkx = async (coin) => {
  const endpoint = `https://www.okx.com/api/v5/market/ticker?instId=${coin}-USD-SWAP`;
  try {
    const response = await axios.get(endpoint);
    const price = parseFloat(response.data.data[0].last);
    return price;
  } catch (error) {
    console.error("Error fetching ${coin} price from Okx:", error);
  }
};
