import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  quantity: {
    type: String, // Stored as string for decimal.js
    required: true
  },
  price: {
    type: String, // Stored as string for decimal.js
    required: true
  },
  totalValue: {
    type: String, // Stored as string for decimal.js
    required: true
  },
  executedAt: {
    type: Date,
    default: Date.now
  }
});

const Trade = mongoose.model('Trade', tradeSchema);
export default Trade;
