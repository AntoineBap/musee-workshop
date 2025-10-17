const express = require('express');
const router = express.Router();
const favoriteCtrl = require('../controllers/favorite');
const auth = require('../middleware/auth'); // middleware pour vérifier JWT et recuperer l'userId

router.post('/favorites', auth, favoriteCtrl.toggleFavorite);
router.get('/favorites', auth, favoriteCtrl.getFavorites);

module.exports = router;
