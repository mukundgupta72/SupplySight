// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);