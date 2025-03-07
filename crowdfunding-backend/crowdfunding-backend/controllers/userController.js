// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({
      email,
      passwordHash: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Génération d’un token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'MaCléSecrèteSuperSécure',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Connecté avec succès', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// (Exemple) Créer une campagne
exports.createCampaign = async (req, res) => {
  try {
    // L'ID de l'utilisateur peut provenir du token JWT décodé
    const userId = req.userId; // supposons qu'on l'ait stocké dans un middleware d'auth
    const { title, description, goal } = req.body;

    const campaign = new Campaign({
      title,
      description,
      goal,
      owner: userId
    });

    await campaign.save();
    res.status(201).json({ message: 'Campagne créée avec succès', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// (Exemple) Faire une donation
exports.makeDonation = async (req, res) => {
  try {
    const userId = req.userId; // supposons qu'on l'ait stocké dans un middleware d'auth
    const { campaignId, amount, method } = req.body;

    // Vérifier la campagne
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne introuvable.' });
    }

    // Créer la transaction
    const transaction = new Transaction({
      amount,
      method,
      campaign: campaign._id,
      donor: userId
    });
    await transaction.save();

    // Mettre à jour le solde de la campagne
    campaign.balance += amount;
    await campaign.save();

    res.status(201).json({ message: 'Donation effectuée avec succès', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
