const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    genre: [{ type: String }],
    language: [{ type: String }],
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true },
    trailerUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
