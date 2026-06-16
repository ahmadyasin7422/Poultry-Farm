const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flocks', require('./routes/flockRoutes'));
app.use('/api/feeds', require('./routes/feedRoutes'));
app.use('/api/eggs', require('./routes/eggProductionRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api', require('./routes/reportRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Poultry Farm Management System API is running' });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
