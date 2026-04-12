const mongoose = require('mongoose');
const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String },
    releaseDate: { type: String },
    voteAverage: { type: Number },
    userReview: { type: String },
    addedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Favorite', FavoriteSchema);
