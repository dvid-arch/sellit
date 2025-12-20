
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  campus: { type: String, default: 'University of Lagos' },
  hostel: String,
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
