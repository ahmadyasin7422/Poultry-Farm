require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Flock = require('../models/Flock');
const Feed = require('../models/Feed');
const EggProduction = require('../models/EggProduction');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Customer = require('../models/Customer');

/**
 * Seed sample data for demo/testing
 * Run: npm run seed
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Flock.deleteMany({}),
      Feed.deleteMany({}),
      EggProduction.deleteMany({}),
      Sale.deleteMany({}),
      Expense.deleteMany({}),
      Customer.deleteMany({}),
    ]);

    console.log('Cleared existing data...');

    // Create demo user (password: demo1234)
    const user = await User.create({
      name: 'Ahmad Farm Owner',
      email: 'ahmad@poultryfarm.com',
      password: 'demo1234',
    });

    console.log('Created demo user: ahmad@poultryfarm.com / demo1234');

    const userId = user._id;
    const today = new Date();
    const daysAgo = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return d;
    };

    // Sample flocks
    await Flock.insertMany([
      {
        user: userId,
        batchName: 'Batch-A1',
        breed: 'Rhode Island Red',
        totalBirds: 500,
        purchaseDate: daysAgo(60),
        age: 8,
        mortalityCount: 12,
        notes: 'Healthy batch, good egg production',
      },
      {
        user: userId,
        batchName: 'Batch-B2',
        breed: 'Leghorn',
        totalBirds: 300,
        purchaseDate: daysAgo(30),
        age: 4,
        mortalityCount: 5,
        notes: 'New batch for egg laying',
      },
    ]);

    // Sample feeds
    await Feed.insertMany([
      {
        user: userId,
        feedName: 'Layer Mash',
        quantityKg: 200,
        cost: 450,
        supplier: 'Agro Feed Co.',
        date: daysAgo(5),
      },
      {
        user: userId,
        feedName: 'Starter Feed',
        quantityKg: 100,
        cost: 280,
        supplier: 'Farm Supplies Ltd',
        date: daysAgo(2),
      },
    ]);

    // Sample egg production
    await EggProduction.insertMany([
      { user: userId, date: daysAgo(1), goodEggs: 420, damagedEggs: 15 },
      { user: userId, date: daysAgo(0), goodEggs: 435, damagedEggs: 10 },
    ]);

    // Sample customers
    await Customer.insertMany([
      {
        user: userId,
        name: 'Ali Traders',
        phone: '+92-300-1234567',
        address: 'Main Market, Lahore',
        notes: 'Regular egg buyer',
      },
      {
        user: userId,
        name: 'Fresh Mart',
        phone: '+92-321-9876543',
        address: 'Gulberg, Lahore',
        notes: 'Weekly bulk orders',
      },
    ]);

    // Sample sales
    await Sale.insertMany([
      {
        user: userId,
        customerName: 'Ali Traders',
        productType: 'Eggs',
        quantity: 120,
        unitPrice: 15,
        date: daysAgo(1),
      },
      {
        user: userId,
        customerName: 'Fresh Mart',
        productType: 'Eggs',
        quantity: 200,
        unitPrice: 14,
        date: daysAgo(0),
      },
    ]);

    // Sample expenses
    await Expense.insertMany([
      {
        user: userId,
        title: 'Electricity Bill',
        category: 'Utilities',
        amount: 8500,
        description: 'Monthly farm electricity',
        date: daysAgo(3),
      },
      {
        user: userId,
        title: 'Vaccination',
        category: 'Health',
        amount: 3500,
        description: 'Flock vaccination program',
        date: daysAgo(7),
      },
    ]);

    console.log('Sample data seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('  Email: ahmad@poultryfarm.com');
    console.log('  Password: demo1234');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
