
import express from 'express';
import bcrypt from 'bcryptjs';
import Listing from '../models/Listing';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/escrow/commit/:id
// Use any for req to satisfy RequestHandler contravariance and avoid DOM type collisions
router.post('/commit/:id', protect, async (req: any, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.status !== 'available') {
      return res.status(400).json({ error: 'Listing no longer available' });
    }

    const rawCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    listing.status = 'committed';
    listing.escrowBuyer = req.user.id;
    listing.releaseCode = hashedCode;
    await listing.save();

    res.json({ message: 'Funds locked', releaseCode: rawCode });
  } catch (err) {
    res.status(500).json({ error: 'Escrow failed' });
  }
});

// @route   POST /api/escrow/verify/:id
// Use any for req to satisfy RequestHandler contravariance and avoid DOM type collisions
router.post('/verify/:id', protect, async (req: any, res) => {
  const { code } = req.body;
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.isCodeLocked) {
      return res.status(403).json({ error: 'Transaction is frozen for safety' });
    }

    const isMatch = await bcrypt.compare(code, listing.releaseCode || '');

    if (isMatch) {
      listing.status = 'sold';
      listing.releaseCode = undefined;
      await listing.save();
      res.json({ success: true, message: 'Payout released' });
    } else {
      listing.failedCodeAttempts += 1;
      if (listing.failedCodeAttempts >= 3) {
        listing.isCodeLocked = true;
      }
      await listing.save();
      res.status(401).json({ 
        error: 'Invalid code', 
        attemptsLeft: 3 - listing.failedCodeAttempts 
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification error' });
  }
});

export default router;
