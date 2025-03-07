// routes/campaignRoutes.js
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// Liste de toutes les campagnes (accessible à tous, y compris les visiteurs)
router.get('/', campaignController.getAllCampaigns);

// Récupérer une campagne par ID
router.get('/:id', campaignController.getCampaignById);

// Mettre à jour une campagne (normalement protégé par un middleware d'auth)
router.put('/:id', campaignController.updateCampaign);

// Partager une campagne sur les réseaux (simulation)
router.post('/:id/share', campaignController.shareOnSocialMedia);

module.exports = router;
