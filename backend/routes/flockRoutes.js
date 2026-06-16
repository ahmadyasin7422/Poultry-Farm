const express = require('express');
const router = express.Router();
const {
  getFlocks,
  getFlockById,
  createFlock,
  updateFlock,
  deleteFlock,
} = require('../controllers/flockController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getFlocks).post(protect, createFlock);
router
  .route('/:id')
  .get(protect, getFlockById)
  .put(protect, updateFlock)
  .delete(protect, deleteFlock);

module.exports = router;
