// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
  // On pourrait ajouter d'autres champs (nom, etc.)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
