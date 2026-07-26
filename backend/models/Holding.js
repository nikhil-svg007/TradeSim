import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  quantity: {
    type: String, // Stored as string for decimal.js
    required: true
  },
  avgBuyPrice: {
    type: String, // Stored as string for decimal.js
    required: true
  }
});

// Ensure a user can only have one holding record per symbol
holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

const Holding = mongoose.model('Holding', holdingSchema);
export default Holding;
