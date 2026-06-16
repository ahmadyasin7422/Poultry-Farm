const Feed = require('../models/Feed');

const getFeeds = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { feedName: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const feeds = await Feed.find(query).sort({ date: -1 });
    res.json(feeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeedById = async (req, res) => {
  try {
    const feed = await Feed.findOne({ _id: req.params.id, user: req.user._id });
    if (!feed) return res.status(404).json({ message: 'Feed record not found' });
    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFeed = async (req, res) => {
  try {
    const feed = await Feed.create({ user: req.user._id, ...req.body });
    res.status(201).json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFeed = async (req, res) => {
  try {
    const feed = await Feed.findOne({ _id: req.params.id, user: req.user._id });
    if (!feed) return res.status(404).json({ message: 'Feed record not found' });

    const updated = await Feed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFeed = async (req, res) => {
  try {
    const feed = await Feed.findOne({ _id: req.params.id, user: req.user._id });
    if (!feed) return res.status(404).json({ message: 'Feed record not found' });
    await feed.deleteOne();
    res.json({ message: 'Feed record removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeeds, getFeedById, createFeed, updateFeed, deleteFeed };
