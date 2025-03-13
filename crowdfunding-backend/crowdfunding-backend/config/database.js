const { Sequelize } = require('sequelize'); 
require('dotenv').config(); // Load environment variables

// ✅ Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'crowdfunding',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql', // ✅ Ensure dialect is set for MySQL
        logging: false,   // Set to true if you want to see SQL queries
    }
);

// ✅ Test Database Connection
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully."))
  .catch(err => console.error("❌ Unable to connect to database:", err));

module.exports = sequelize;  // ✅ Export Sequelize instance