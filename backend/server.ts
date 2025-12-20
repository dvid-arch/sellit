
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import escrowRoutes from './routes/escrow';
import aiRoutes from './routes/ai';
import broadcastRoutes from './routes/broadcasts';
import chatRoutes from './routes/chats';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json() as any);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sellit';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Sellit Backend active on port ${PORT}`);
});
