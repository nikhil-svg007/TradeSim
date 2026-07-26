import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbols: {
    type: [String],
    default: []
  }
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
