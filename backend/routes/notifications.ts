
import express from 'express';
import Notification from '../models/Notification';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/notifications
router.get('/', protect, async (req: any, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// @route   PUT /api/notifications/read-all
router.put('/read-all', protect, async (req: any, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

export default router;
