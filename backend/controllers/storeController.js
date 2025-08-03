// controllers/storeController.js
import Store from '../models/Store.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

// @desc    Get a single store by its ID, with fully detailed inventory
export const getStoreById = async (req, res) => {
    try {
        const allItems = await Item.find().lean();
        const itemDetailsMap = allItems.reduce((map, item) => {
            map[item.sku] = { name: item.name, price: item.price, category: item.category, description: item.description };
            return map;
        }, {});

        const store = await Store.findById(req.params.id).populate('owner', 'name').lean();
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const enrichedInventory = {};
        if (store.inventory) {
            for (const sku in store.inventory) {
                 const inventoryData = store.inventory[sku];
                 if (inventoryData) {
                    enrichedInventory[sku] = {
                        ...(itemDetailsMap[sku] || {}), // Add name, price, etc.
                        cur: inventoryData.cur,
                        rop: inventoryData.rop,
                        min: inventoryData.min,
                        max: inventoryData.max,
                    };
                 }
            }
        }
        
        res.json({ ...store, inventory: enrichedInventory });

    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Store not found' });
        }
        console.error("Error in getStoreById:", err);
        res.status(500).json({ message: 'Error fetching store', error: err.message });
    }
};

// @desc    Get all stores for any user to see
export const getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().populate('owner', 'name').lean();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stores', error });
    }
};

// @desc    Get all stores for a specific owner
export const getMyStores = async (req, res) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const stores = await Store.find({ owner: req.user.id }).lean();
        res.json(stores);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch owner stores', error: err.message });
    }
};

// @desc    Create a store
export const createStore = async (req, res) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ msg: 'Access denied. Only owners can create stores.' });
    }
    const { name, location, inventory } = req.body;
    try {
        const newStore = new Store({
            name,
            location,
            inventory: inventory || {},
            owner: req.user.id,
        });
        const store = await newStore.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create store', error: error.message });
    }
};

// @desc    Update inventory for a store
export const updateStoreInventory = async (req, res) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const { id } = req.params;
        const { inventory } = req.body;
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        if (store.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        store.inventory = inventory;
        await store.save();
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update inventory', error: error.message });
    }
};

// @desc    Delete a store
export const deleteStore = async (req, res) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ msg: 'Store not found' });
        }
        if (store.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        await Store.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete store', error: error.message });
    }
};

// @desc    Process a customer order and decrement stock
export const processOrder = async (req, res) => {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({ message: 'Cart data is required.' });
    }
    try {
        const updatesByStore = {};
        cart.forEach(item => {
            if (!updatesByStore[item.storeId]) {
                updatesByStore[item.storeId] = [];
            }
            updatesByStore[item.storeId].push({ sku: item.sku, quantity: item.quantity });
        });

        for (const storeId in updatesByStore) {
            // FIX IS HERE: Removed .lean() to get a full Mongoose document
            const store = await Store.findById(storeId); 
            if (store) {
                const itemsToUpdate = updatesByStore[storeId];
                itemsToUpdate.forEach(item => {
                    const inventoryItem = store.inventory.get(item.sku);
                    if (inventoryItem && inventoryItem.cur >= item.quantity) {
                        inventoryItem.cur -= item.quantity;
                        store.inventory.set(item.sku, inventoryItem);
                    } else {
                        console.warn(`Stock for SKU ${item.sku} in store ${storeId} could not be updated.`);
                    }
                });
                await store.save();
            }
        }
        res.status(200).json({ message: 'Order processed and stock updated successfully.' });
    } catch (error) {
        console.error('Order processing error:', error);
        res.status(500).json({ message: 'Failed to process order', error: error.message });
    }
};