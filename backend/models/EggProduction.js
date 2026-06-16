const mongoose = require('mongoose');

const eggProductionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
    },
    goodEggs: {
      type: Number,
      required: [true, 'Please provide good eggs count'],
      min: 0,
    },
    damagedEggs: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEggs: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

eggProductionSchema.pre('save', function (next) {
  this.totalEggs = this.goodEggs + this.damagedEggs;
  next();
});

module.exports = mongoose.model('EggProduction', eggProductionSchema);
