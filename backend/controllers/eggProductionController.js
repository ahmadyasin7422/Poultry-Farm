const EggProduction = require('../models/EggProduction');

const getEggProductions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await EggProduction.find(query).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEggProductionById = async (req, res) => {
  try {
    const record = await EggProduction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!record) {
      return res.status(404).json({ message: 'Egg production record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEggProduction = async (req, res) => {
  try {
    const record = await EggProduction.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEggProduction = async (req, res) => {
  try {
    const record = await EggProduction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Egg production record not found' });
    }

    const updateData = { ...req.body };
    if (updateData.goodEggs != null || updateData.damagedEggs != null) {
      const good = updateData.goodEggs ?? record.goodEggs;
      const damaged = updateData.damagedEggs ?? record.damagedEggs;
      updateData.totalEggs = good + damaged;
    }

    const updated = await EggProduction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEggProduction = async (req, res) => {
  try {
    const record = await EggProduction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Egg production record not found' });
    }

    await record.deleteOne();
    res.json({ message: 'Egg production record removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEggProductions,
  getEggProductionById,
  createEggProduction,
  updateEggProduction,
  deleteEggProduction,
};
