import Watchlist from '../models/Watchlist.js';

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    let watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      watchlist = new Watchlist({ userId, symbols: [] });
      await watchlist.save();
    }

    res.json({ symbols: watchlist.symbols });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching watchlist' });
  }
};

export const addSymbol = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, symbols: [] });
    }

    if (!watchlist.symbols.includes(symbol)) {
      watchlist.symbols.push(symbol);
      await watchlist.save();
    }

    res.json({ message: 'Symbol added to watchlist', symbols: watchlist.symbols });
  } catch (error) {
    res.status(500).json({ error: 'Server error adding symbol' });
  }
};

export const removeSymbol = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const watchlist = await Watchlist.findOne({ userId });
    if (watchlist) {
      watchlist.symbols = watchlist.symbols.filter(s => s !== symbol);
      await watchlist.save();
      res.json({ message: 'Symbol removed from watchlist', symbols: watchlist.symbols });
    } else {
      res.json({ message: 'Watchlist not found', symbols: [] });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error removing symbol' });
  }
};
