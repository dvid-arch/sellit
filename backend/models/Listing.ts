
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  condition: { type: String, enum: ['Brand New', 'Like New', 'Fairly used'], default: 'Fairly used' },
  location: String,
  imageUrl: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'committed', 'sold'], default: 'available' },
  isUrgent: { type: Boolean, default: false },
  isBoosted: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  escrowBuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  releaseCode: String,
  failedCodeAttempts: { type: Number, default: 0 },
  isCodeLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

listingSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Listing', listingSchema);
