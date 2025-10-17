const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on recupere le header authorization 
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Aucun token fourni.' });
    }

    // on separe le "bearer" du token
    const token = authHeader.split(' ')[1];

    // verify compare le token avec notre secret en .env
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.userId };

    next();
  } catch (error) {
    console.error("Erreur middleware auth :", error);
    res.status(401).json({ error: 'Requête non authentifiée.' });
  }
};


