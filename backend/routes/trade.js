import express from 'express';
import { executeTrade, getTrades } from '../controllers/tradeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All trade routes require authentication
router.use(verifyToken);

router.post('/execute', executeTrade);
router.get('/', getTrades);

export default router;
