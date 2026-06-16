const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedName: {
      type: String,
      required: [true, 'Please provide feed name'],
      trim: true,
    },
    quantityKg: {
      type: Number,
      required: [true, 'Please provide quantity in kg'],
      min: 0,
    },
    cost: {
      type: Number,
      required: [true, 'Please provide cost'],
      min: 0,
    },
    supplier: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feed', feedSchema);
