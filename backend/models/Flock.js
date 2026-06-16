const mongoose = require('mongoose');

const flockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    batchName: {
      type: String,
      required: [true, 'Please provide a batch name'],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'Please provide breed name'],
      trim: true,
    },
    totalBirds: {
      type: Number,
      required: [true, 'Please provide total birds count'],
      min: 0,
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Please provide purchase date'],
    },
    age: {
      type: Number,
      default: 0,
      min: 0,
    },
    mortalityCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flock', flockSchema);
