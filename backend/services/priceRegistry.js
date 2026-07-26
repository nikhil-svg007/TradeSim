// Simple in-memory object to store the latest prices
// Format: { "BTCUSDT": "65000.00", "ETHUSDT": "3500.00" }
const prices = {};

export const getPrices = () => {
  return prices;
};

export const updatePrice = (symbol, price) => {
  prices[symbol] = price;
};

export const getPrice = (symbol) => {
  return prices[symbol] || null;
};
