const Sale = require('../models/Sale');

const getSales = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { productType: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sale.find(query).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const sale = await Sale.create({ user: req.user._id, ...req.body });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    const updateData = { ...req.body };
    if (updateData.quantity != null && updateData.unitPrice != null) {
      updateData.totalPrice = updateData.quantity * updateData.unitPrice;
    }

    const updated = await Sale.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    await sale.deleteOne();
    res.json({ message: 'Sale removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSales, getSaleById, createSale, updateSale, deleteSale };
