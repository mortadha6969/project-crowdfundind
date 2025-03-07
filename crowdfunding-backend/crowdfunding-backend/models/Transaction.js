// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    default: 'card' // ou 'paypal', etc.
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  // Lien vers la campagne concernée
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  // Lien vers l'utilisateur qui a fait la donation
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
