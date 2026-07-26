import Holding from '../models/Holding.js';
import User from '../models/User.js';
import Decimal from 'decimal.js';
import { getPrices } from '../services/priceRegistry.js';

export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const holdings = await Holding.find({ userId });
    const livePrices = getPrices();

    let totalPortfolioValueDec = new Decimal(user.virtualBalance);
    
    // Enrich holdings with live prices and calculate unrealized PnL
    const enrichedHoldings = holdings.map(h => {
      const livePrice = livePrices[h.symbol] || h.avgBuyPrice; // Fallback to avg price if live not available
      const currentQtyDec = new Decimal(h.quantity);
      const avgPriceDec = new Decimal(h.avgBuyPrice);
      const livePriceDec = new Decimal(livePrice);
      
      const totalCostDec = currentQtyDec.times(avgPriceDec);
      const currentValueDec = currentQtyDec.times(livePriceDec);
      const pnlDec = currentValueDec.minus(totalCostDec);
      const pnlPercentDec = pnlDec.dividedBy(totalCostDec).times(100);

      totalPortfolioValueDec = totalPortfolioValueDec.plus(currentValueDec);

      return {
        _id: h._id,
        symbol: h.symbol,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        livePrice: livePrice,
        totalCost: totalCostDec.toString(),
        currentValue: currentValueDec.toString(),
        pnl: pnlDec.toString(),
        pnlPercent: pnlPercentDec.toString()
      };
    });

    const initialBalanceDec = new Decimal("10000"); // Based on our user model default
    const totalPnlDec = totalPortfolioValueDec.minus(initialBalanceDec);
    const totalPnlPercentDec = totalPnlDec.dividedBy(initialBalanceDec).times(100);

    res.json({
      balance: user.virtualBalance,
      totalPortfolioValue: totalPortfolioValueDec.toString(),
      totalPnl: totalPnlDec.toString(),
      totalPnlPercent: totalPnlPercentDec.toString(),
      holdings: enrichedHoldings
    });
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ error: 'Server error fetching portfolio' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    const holdings = await Holding.find();
    const livePrices = getPrices();

    const leaderboard = users.map(user => {
      let totalPortfolioValueDec = new Decimal(user.virtualBalance);
      
      const userHoldings = holdings.filter(h => h.userId.toString() === user._id.toString());
      userHoldings.forEach(h => {
        const livePrice = livePrices[h.symbol] || h.avgBuyPrice;
        const currentQtyDec = new Decimal(h.quantity);
        const livePriceDec = new Decimal(livePrice);
        const currentValueDec = currentQtyDec.times(livePriceDec);
        totalPortfolioValueDec = totalPortfolioValueDec.plus(currentValueDec);
      });

      return {
        _id: user._id,
        email: user.email,
        totalPortfolioValue: parseFloat(totalPortfolioValueDec.toString())
      };
    });

    // Sort by descending portfolio value
    leaderboard.sort((a, b) => b.totalPortfolioValue - a.totalPortfolioValue);

    res.json({ leaderboard: leaderboard.slice(0, 50) }); // Return top 50
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
};
