const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Aucun token fourni.' });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.userId };

    next();
  } catch (error) {
    console.error("Erreur middleware auth :", error);
    res.status(401).json({ error: 'Requête non authentifiée.' });
  }
};


