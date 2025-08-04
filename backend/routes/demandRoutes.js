// routes/demandRoutes.js
import express from 'express';
import {
  getDemandStats,
  recordOrder,
  getOrderHistory
} from '../controllers/demandController.js';

const router = express.Router();


router.get('/', getDemandStats);
router.post('/order', recordOrder);
router.get('/history', getOrderHistory);

export default router;