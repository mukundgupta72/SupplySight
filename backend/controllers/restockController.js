// controllers/restockController.js
import Store from '../models/Store.js';
import { checkInventoryThresholds, generateRestockRequest } from '../utils/thresholdChecker.js';

export const getLowStockAlerts = async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Access denied.' });
    
    // FIX IS HERE: Removed .lean()
    const stores = await Store.find({ owner: req.user.id });
    let allAlerts = [];

    for (const store of stores) {
        const lowStockItems = await checkInventoryThresholds(store);
        if(lowStockItems.length > 0) {
            allAlerts = [...allAlerts, ...lowStockItems];
        }
    }
    
    res.json({ message: 'Low stock alerts fetched', alerts: allAlerts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get alerts', error: error.message });
  }
};

export const triggerManualRestock = async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Access denied.' });
    
    const { store_id, sku, quantity } = req.body;
    if (!store_id || !sku || !quantity) {
      return res.status(400).json({ message: 'Store ID, SKU, and quantity are required.' });
    }

    const store = await Store.findById(store_id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    if (store.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You do not own this store.' });
    }

    const inventoryItem = store.inventory.get(sku) || { cur: 0, min: 0, max: 100, rop: 10 };
    inventoryItem.cur += quantity;
    store.inventory.set(sku, inventoryItem);
    
    await store.save();

    res.json({ message: 'Manual restock successful', store });
  } catch (error) {
    res.status(500).json({ message: 'Manual restock failed', error: error.message });
  }
};

export const getAutoRestockPlans = async (req, res) => {
    try {
        if (req.user.role !== 'owner') return res.status(403).json({ message: 'Access denied.' });

        // FIX IS HERE: Removed .lean()
        const stores = await Store.find({ owner: req.user.id });
        const restockPlans = [];

        for (const store of stores) {
            const lowStockItems = await checkInventoryThresholds(store);
            for (const item of lowStockItems) {
                restockPlans.push(generateRestockRequest(store, item));
            }
        }

        res.json({ message: 'Auto restock plans generated', plans: restockPlans });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate restock plans', error: error.message });
    }
};