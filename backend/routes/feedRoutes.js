const express = require('express');
const router = express.Router();
const {
  getFeeds,
  getFeedById,
  createFeed,
  updateFeed,
  deleteFeed,
} = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getFeeds).post(protect, createFeed);
router
  .route('/:id')
  .get(protect, getFeedById)
  .put(protect, updateFeed)
  .delete(protect, deleteFeed);

module.exports = router;
