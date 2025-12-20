
import express from 'express';
import Listing from '../models/Listing';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/listings
router.get('/', async (req, res) => {
  const { category, search, sort } = req.query;
  let query: any = { status: 'available' };

  if (category && category !== 'All Categories') {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search as string };
  }

  try {
    let listings = Listing.find(query);

    if (sort === 'Newest') listings = listings.sort({ createdAt: -1 });
    else if (sort === 'Price: Low to High') listings = listings.sort({ price: 1 });
    else if (sort === 'Price: High to Low') listings = listings.sort({ price: -1 });

    const results = await listings.populate('seller', 'name campus hostel');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// @route   POST /api/listings
// Use any for req to satisfy RequestHandler contravariance and avoid DOM type collisions
router.post('/', protect, async (req: any, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      seller: req.user.id
    });
    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// @route   GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name phone campus hostel');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
    // Increment view count
    listing.viewCount += 1;
    await listing.save();
    
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
