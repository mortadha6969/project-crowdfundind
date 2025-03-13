const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this model exists
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Ensure this middleware exists

// 📌 Create a user (Signup)
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📌 User login
router.post('/login', userController.login);

// 📌 Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Protected routes (require authentication)
router.post('/create-campaign', auth, userController.createCampaign);
router.post('/donate', auth, userController.makeDonation);

module.exports = router;
