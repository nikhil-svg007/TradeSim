import mongoose from 'mongoose';
import Decimal from 'decimal.js';
import User from '../models/User.js';
import Holding from '../models/Holding.js';
import Trade from '../models/Trade.js';
import { getPrice } from '../services/priceRegistry.js';

export const executeTrade = async (req, res) => {
  // Removing MongoDB transaction to support standalone local MongoDB instances.
  // Sequential saves are sufficient for this portfolio project.

  try {
    const { symbol, type, quantity } = req.body;
    const userId = req.user.userId;

    if (!symbol || !type || !quantity) {
      throw new Error('Symbol, type, and quantity are required');
    }

    if (type !== 'BUY' && type !== 'SELL') {
      throw new Error('Type must be BUY or SELL');
    }

    const currentPriceStr = getPrice(symbol);
    if (!currentPriceStr) {
      throw new Error(`Price for ${symbol} is currently unavailable`);
    }

    const qtyDec = new Decimal(quantity);
    if (qtyDec.lte(0)) {
      throw new Error('Quantity must be greater than zero');
    }

    const priceDec = new Decimal(currentPriceStr);
    const totalValueDec = qtyDec.times(priceDec);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const balanceDec = new Decimal(user.virtualBalance);
    let holding = await Holding.findOne({ userId, symbol });

    if (type === 'BUY') {
      // Validate balance
      if (balanceDec.lt(totalValueDec)) {
        throw new Error('Insufficient virtual balance');
      }

      // Deduct balance
      user.virtualBalance = balanceDec.minus(totalValueDec).toString();

      // Update or create holding
      if (holding) {
        // Calculate new average buy price
        const currentQty = new Decimal(holding.quantity);
        const currentAvgPrice = new Decimal(holding.avgBuyPrice);
        const totalCostBefore = currentQty.times(currentAvgPrice);
        
        const newTotalQty = currentQty.plus(qtyDec);
        const newTotalCost = totalCostBefore.plus(totalValueDec);
        
        holding.quantity = newTotalQty.toString();
        holding.avgBuyPrice = newTotalCost.dividedBy(newTotalQty).toString();
      } else {
        holding = new Holding({
          userId,
          symbol,
          quantity: qtyDec.toString(),
          avgBuyPrice: priceDec.toString()
        });
      }
    } else {
      // SELL logic
      if (!holding) {
        throw new Error(`You do not own any ${symbol}`);
      }

      const holdingQtyDec = new Decimal(holding.quantity);
      if (holdingQtyDec.lt(qtyDec)) {
        throw new Error('Insufficient holdings to sell');
      }

      // Add to balance
      user.virtualBalance = balanceDec.plus(totalValueDec).toString();

      // Update holding
      const newQty = holdingQtyDec.minus(qtyDec);
      if (newQty.eq(0)) {
        // If they sold everything, we delete the holding record
        await Holding.deleteOne({ _id: holding._id });
        holding = null; // Mark as null so we don't try to save it below
      } else {
        holding.quantity = newQty.toString();
      }
    }

    // Save changes
    await user.save();
    if (holding) {
      await holding.save();
    }

    // Record the trade
    const trade = new Trade({
      userId,
      symbol,
      type,
      quantity: qtyDec.toString(),
      price: priceDec.toString(),
      totalValue: totalValueDec.toString()
    });
    await trade.save();

    res.json({
      message: `${type} order executed successfully`,
      trade,
      newBalance: user.virtualBalance
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTrades = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol, type, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (symbol) query.symbol = symbol;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const trades = await Trade.find(query)
      .sort({ executedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trade.countDocuments(query);

    res.json({
      trades,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching trades' });
  }
};
