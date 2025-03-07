// app.js
require('dotenv').config();  // charge les variables d'environnement depuis .env
const express = require('express');
const mongoose = require('mongoose');

// Import des routes
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(express.json()); // pour parser le JSON

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crowdfundingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB est connecté'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/transactions', transactionRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
