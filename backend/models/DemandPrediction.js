// models/DemandPrediction.js
import mongoose from 'mongoose';

const demandPredictionSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  predictedQuantity: {
    type: Number,
    required: true,
  },
  forDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('DemandPrediction', demandPredictionSchema);