// routes/storeRoutes.js
import express from 'express';
import auth from '../middlewares/auth.js';
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStoreInventory,
  deleteStore,
  getMyStores,
  processOrder // <-- FIX: Correctly import the new function
} from '../controllers/storeController.js';

const router = express.Router();

// Public route to get all stores for Browse
router.get('/', getAllStores);

// Protected route for owners to see only their stores
router.get('/mystores', auth, getMyStores);

// Protected route to process an order and update stock
router.post('/order', auth, processOrder);

// Protected route, but logic inside controller will check for ownership
router.get('/:id', auth, getStoreById);

// Protected routes (require owner role)
router.post('/', auth, createStore);
router.put('/:id/inventory', auth, updateStoreInventory);
router.delete('/:id', auth, deleteStore);

export default router;