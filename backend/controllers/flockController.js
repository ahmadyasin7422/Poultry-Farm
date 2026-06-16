const Flock = require('../models/Flock');

const getFlocks = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { batchName: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      query.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const flocks = await Flock.find(query).sort({ createdAt: -1 });
    res.json(flocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFlockById = async (req, res) => {
  try {
    const flock = await Flock.findOne({ _id: req.params.id, user: req.user._id });
    if (!flock) return res.status(404).json({ message: 'Flock not found' });
    res.json(flock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFlock = async (req, res) => {
  try {
    const flock = await Flock.create({ user: req.user._id, ...req.body });
    res.status(201).json(flock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFlock = async (req, res) => {
  try {
    const flock = await Flock.findOne({ _id: req.params.id, user: req.user._id });
    if (!flock) return res.status(404).json({ message: 'Flock not found' });

    const updated = await Flock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFlock = async (req, res) => {
  try {
    const flock = await Flock.findOne({ _id: req.params.id, user: req.user._id });
    if (!flock) return res.status(404).json({ message: 'Flock not found' });
    await flock.deleteOne();
    res.json({ message: 'Flock removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFlocks, getFlockById, createFlock, updateFlock, deleteFlock };
