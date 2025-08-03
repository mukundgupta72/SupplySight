// models/RestockRequest.js
import mongoose from 'mongoose';

const restockRequestSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  requestedQuantity: {
    type: Number,
    required: true,
  },
  triggeredBy: {
    type: String,
    enum: ['threshold', 'manual', 'ai'],
    default: 'threshold',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RestockRequest', restockRequestSchema);