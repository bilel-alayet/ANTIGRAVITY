const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

// @route   GET /api/favorites
router.get('/favorites', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id }).sort({ addedAt: -1 });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/favorites
router.post('/favorites', auth, async (req, res) => {
    const { tmdbId, title, posterPath, releaseDate, voteAverage, userReview } = req.body;
    try {
        let favorite = await Favorite.findOne({ tmdbId, userId: req.user.id });
        if (favorite) return res.status(400).json({ message: 'Movie already in favorites' });
        
        favorite = new Favorite({ userId: req.user.id, tmdbId, title, posterPath, releaseDate, voteAverage, userReview });
        const newFavorite = await favorite.save();
        res.status(201).json(newFavorite);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/favorites/:id
router.delete('/favorites/:tmdbId', auth, async (req, res) => {
    try {
        const result = await Favorite.findOneAndDelete({ tmdbId: req.params.tmdbId, userId: req.user.id });
        if (!result) return res.status(404).json({ message: 'Movie not found in favorites' });
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/favorites/:id
router.put('/favorites/:tmdbId', auth, async (req, res) => {
    try {
        const { userReview } = req.body;
        const favorite = await Favorite.findOneAndUpdate(
            { tmdbId: req.params.tmdbId, userId: req.user.id },
            { userReview },
            { new: true }
        );
        if (!favorite) return res.status(404).json({ message: 'Movie not found' });
        res.json(favorite);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
