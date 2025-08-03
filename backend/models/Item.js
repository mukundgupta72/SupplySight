// models/Item.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  unit: {
    type: String,
    default: 'pcs',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);