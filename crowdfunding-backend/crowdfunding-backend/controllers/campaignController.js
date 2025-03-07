// controllers/campaignController.js
const Campaign = require('../models/Campaign');

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('owner');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('owner');
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne introuvable.' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Exemple : mise à jour de la campagne (updateProgress, etc.)
exports.updateCampaign = async (req, res) => {
  try {
    const { title, description, goal } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { title, description, goal },
      { new: true }
    );
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne introuvable.' });
    }
    res.json({ message: 'Campagne mise à jour', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Méthode simulant le partage sur les réseaux sociaux
exports.shareOnSocialMedia = async (req, res) => {
  // Dans un vrai cas, vous pourriez générer un lien, appeler une API tierce, etc.
  res.json({ message: 'Lien de partage généré', shareLink: 'http://socialmedia.com/campaign/xyz' });
};
