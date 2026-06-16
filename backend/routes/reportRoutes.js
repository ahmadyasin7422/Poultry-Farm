const express = require('express');
const router = express.Router();
const { getDashboardStats, getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/reports', protect, getReports);

module.exports = router;
