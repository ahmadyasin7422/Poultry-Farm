const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    productType: {
      type: String,
      required: [true, 'Please provide product type'],
      enum: ['Eggs', 'Birds', 'Other'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Please provide unit price'],
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
    },
  },
  { timestamps: true }
);

saleSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
