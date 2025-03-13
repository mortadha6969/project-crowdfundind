require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Database Connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'crowdfundingDB',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

// ✅ Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log('✅ Connected to MySQL/MariaDB'))
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// ✅ Import Models (All in One File)
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Transaction = require('./models/Transaction');

// ✅ Sync Models with Database
sequelize
  .sync({ alter: true }) // `alter: true` avoids data loss
  .then(() => console.log('✅ Database synchronized'))
  .catch((err) => console.error('❌ Database sync error:', err));

// ✅ Import Routes
const userRoutes = require('./routes/userRoutes');
// Add these if they exist
// const campaignRoutes = require('./routes/campaignRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');

app.use('/users', userRoutes);
// Uncomment if they exist
// app.use('/campaigns', campaignRoutes);
// app.use('/transactions', transactionRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Crowdfunding Backend API is running!");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
