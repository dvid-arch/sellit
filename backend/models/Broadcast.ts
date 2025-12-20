
import mongoose from 'mongoose';

const broadcastSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  need: { type: String, required: true },
  details: { type: String },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  location: { type: String },
  category: { type: String, required: true },
  isBoosted: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'fulfilled', 'expired'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Broadcast', broadcastSchema);
