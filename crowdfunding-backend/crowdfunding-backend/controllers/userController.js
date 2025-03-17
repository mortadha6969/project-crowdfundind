// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword",hashedPassword)
    // Création de l'utilisateur avec Sequelize
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
