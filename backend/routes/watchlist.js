import express from 'express';
import { getWatchlist, addSymbol, removeSymbol } from '../controllers/watchlistController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getWatchlist);
router.post('/add', addSymbol);
router.delete('/:symbol', removeSymbol);

export default router;
