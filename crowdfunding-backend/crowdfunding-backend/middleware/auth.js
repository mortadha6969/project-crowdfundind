// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Accès refusé. Pas de token.' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MaCléSecrèteSuperSécure');
    req.userId = decoded.userId; // on stocke l'ID utilisateur dans la requête
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};
