// routes/restockRoutes.js
import express from 'express';
import * as restockController from '../controllers/restockController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// All restock routes should be protected for owners
router.use(auth);

router.get('/alerts', restockController.getLowStockAlerts);
router.post('/trigger', restockController.triggerManualRestock);
router.get('/plan', restockController.getAutoRestockPlans);

export default router;