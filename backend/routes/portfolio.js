import express from 'express';
import { getPortfolio, getLeaderboard } from '../controllers/portfolioController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getPortfolio);
router.get('/leaderboard', getLeaderboard);

export default router;
