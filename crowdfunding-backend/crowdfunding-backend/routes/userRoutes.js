// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées (exemple) :
// Il faudrait un middleware d'authentification (JWT) pour protéger ces routes
// Par exemple : router.post('/create-campaign', authMiddleware, userController.createCampaign);

router.post('/create-campaign', userController.createCampaign);
router.post('/donate', userController.makeDonation);

module.exports = router;
