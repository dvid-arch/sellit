
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  lastMessage: { type: String },
  lastMessageAt: { type: Date, default: Date.now },
  isSupport: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', chatSchema);
