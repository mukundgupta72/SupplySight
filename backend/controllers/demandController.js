// controllers/demandController.js
import Order from '../models/Order.js';

export const getDemandStats = async (req, res) => {
  try {
    const { pincode, sku } = req.query;
    const filter = {};
    if (pincode) filter.pincode = pincode;
    if (sku) filter.sku = sku;
    const demandData = await Order.find(filter).sort({ createdAt: -1 });
    res.json({
      message: 'Demand data fetched',
      count: demandData.length,
      data: demandData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching demand stats', error });
  }
};

export const recordOrder = async (req, res) => {
  try {
    const { pincode, sku, quantity } = req.body;
    if (!pincode || !sku || !quantity)
      return res.status(400).json({ message: 'Missing fields in order data' });
    const newOrder = new Order({ pincode, sku, quantity });
    await newOrder.save();
    res.status(201).json({ message: 'Order recorded', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error recording order', error });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const { pincode } = req.query;
    const query = pincode ? { pincode } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ message: 'Order history fetched', orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
};