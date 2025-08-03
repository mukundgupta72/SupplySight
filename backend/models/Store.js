// models/Store.js
import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  cur: { type: Number, default: 0, min: 0 },    // current stock
  min: { type: Number, default: 0, min: 0 },
  max: { type: Number, default: 100, min: 1 },
  rop: { type: Number, default: 10, min: 0 }     // reorder point
}, { _id: false });

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inventory: {
    type: Map,
    of: inventoryItemSchema,
    default: {},
  }
}, { timestamps: true });

export default mongoose.model('Store', storeSchema);