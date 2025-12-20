
import express from 'express';
import Chat from '../models/Chat';
import Message from '../models/Message';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/chats
router.get('/', protect, async (req: any, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.user.id] }
    })
    .populate('participants', 'name email avatar')
    .populate('listing', 'title price imageUrl')
    .sort({ lastMessageAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// @route   GET /api/chats/:id/messages
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.id })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// @route   POST /api/chats/:id/messages
router.post('/:id/messages', protect, async (req: any, res) => {
  const { text } = req.body;
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const message = new Message({
      chat: req.params.id,
      sender: req.user.id,
      text
    });

    await message.save();
    chat.lastMessage = text;
    chat.lastMessageAt = new Date();
    await chat.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
