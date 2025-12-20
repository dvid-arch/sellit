
import express from 'express';
import Broadcast from '../models/Broadcast';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/broadcasts
router.get('/', async (req, res) => {
  try {
    const broadcasts = await Broadcast.find({ status: 'active' })
      .populate('author', 'name avatar campus hostel')
      .sort({ isBoosted: -1, createdAt: -1 });
    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broadcasts' });
  }
});

// @route   POST /api/broadcasts
router.post('/', protect, async (req: any, res) => {
  try {
    const newBroadcast = new Broadcast({
      ...req.body,
      author: req.user.id
    });
    const broadcast = await newBroadcast.save();
    res.json(broadcast);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create broadcast' });
  }
});

export default router;
