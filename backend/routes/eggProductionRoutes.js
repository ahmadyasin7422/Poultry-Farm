const express = require('express');
const router = express.Router();
const {
  getEggProductions,
  getEggProductionById,
  createEggProduction,
  updateEggProduction,
  deleteEggProduction,
} = require('../controllers/eggProductionController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getEggProductions).post(protect, createEggProduction);
router
  .route('/:id')
  .get(protect, getEggProductionById)
  .put(protect, updateEggProduction)
  .delete(protect, deleteEggProduction);

module.exports = router;
