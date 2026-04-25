const Movie = require('../models/Movie');

// @desc    Get all movies (with search & filter)
// @route   GET /api/movies
exports.getMovies = async (req, res) => {
    try {
        const { search, genre, language } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (genre) {
            query.genre = { $in: [genre] };
        }
        if (language) {
            query.language = { $in: [language] };
        }

        const movies = await Movie.find(query);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie', error: error.message });
    }
};

// @desc    Add a movie (Admin)
// @route   POST /api/movies
exports.addMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ message: 'Error adding movie', error: error.message });
    }
};
