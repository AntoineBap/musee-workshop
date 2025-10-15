const User = require('../models/User');

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { museumId } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (user.favorites.includes(museumId)) {
      user.favorites = user.favorites.filter(id => id !== museumId);
    } else {
      user.favorites.push(museumId);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
