const Flock = require('../models/Flock');
const EggProduction = require('../models/EggProduction');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Feed = require('../models/Feed');

const getDateRange = (period) => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === 'weekly') {
    start.setDate(start.getDate() - 7);
  } else if (period === 'monthly') {
    start.setMonth(start.getMonth() - 1);
  }

  return { start, end };
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const flocks = await Flock.find({ user: userId });
    const totalBirds = flocks.reduce(
      (sum, flock) => sum + Math.max(0, flock.totalBirds - flock.mortalityCount),
      0
    );

    const eggRecords = await EggProduction.find({ user: userId });
    const totalEggs = eggRecords.reduce((sum, r) => sum + (r.totalEggs || 0), 0);

    const sales = await Sale.find({ user: userId });
    const totalSales = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);

    const expenses = await Expense.find({ user: userId });
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const netProfit = totalSales - totalExpenses;

    res.json({ totalBirds, totalEggs, totalSales, totalExpenses, netProfit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = req.query.period || 'daily';
    const { start, end } = getDateRange(period);

    const dateFilter = { user: userId, date: { $gte: start, $lte: end } };

    const sales = await Sale.find(dateFilter);
    const totalSales = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);

    const expenses = await Expense.find(dateFilter);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const eggRecords = await EggProduction.find(dateFilter);
    const eggSummary = {
      totalEggs: eggRecords.reduce((sum, r) => sum + (r.totalEggs || 0), 0),
      goodEggs: eggRecords.reduce((sum, r) => sum + (r.goodEggs || 0), 0),
      damagedEggs: eggRecords.reduce((sum, r) => sum + (r.damagedEggs || 0), 0),
      recordCount: eggRecords.length,
    };

    const feedRecords = await Feed.find(dateFilter);
    const feedSummary = {
      totalCost: feedRecords.reduce((sum, f) => sum + (f.cost || 0), 0),
      totalQuantityKg: feedRecords.reduce((sum, f) => sum + (f.quantityKg || 0), 0),
      recordCount: feedRecords.length,
    };

    const netProfit = totalSales - totalExpenses;

    res.json({
      period,
      dateRange: { start, end },
      totalSales,
      totalExpenses,
      netProfit,
      eggSummary,
      feedSummary,
      salesCount: sales.length,
      expensesCount: expenses.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getReports };
