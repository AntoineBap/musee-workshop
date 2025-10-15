const express = require('express');
const router = express.Router();
const favoriteCtrl = require('../controllers/favorite');
const auth = require('../middleware/auth'); // middleware pour vérifier JWT ou session

// Ajouter ou retirer un musée des favoris
router.post('/favorites', auth, favoriteCtrl.toggleFavorite);

// Récupérer les favoris de l'utilisateur
router.get('/favorites', auth, favoriteCtrl.getFavorites);

module.exports = router;
