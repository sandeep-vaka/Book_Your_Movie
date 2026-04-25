const Show = require('../models/Show');

// @desc    Get shows for a specific movie & city
// @route   GET /api/shows
exports.getShows = async (req, res) => {
    try {
        const { movieId, city, date } = req.query;
        
        let query = {};
        if (movieId) query.movie = movieId;
        if (date) query.date = date;

        // Note: Filtering by city requires joining (populating) theatre and filtering.
        // For simplicity, we fetch shows and then filter, or assume frontend passes theatreIds.
        
        const shows = await Show.find(query).populate('theatre').populate('movie');
        
        // Filter by City in memory if city param exists
        let filteredShows = shows;
        if (city) {
            filteredShows = shows.filter(s => s.theatre && s.theatre.city.toLowerCase() === city.toLowerCase());
        }

        res.status(200).json(filteredShows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shows', error: error.message });
    }
};

// @desc    Get show details with seats
// @route   GET /api/shows/:id
exports.getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('movie').populate('theatre');
        if (!show) return res.status(404).json({ message: 'Show not found' });
        
        // Free up expired locked seats before sending to user
        const now = new Date();
        let changed = false;
        show.seats.forEach(seat => {
            if (seat.status === 'locked' && seat.lockedUntil && seat.lockedUntil < now) {
                seat.status = 'available';
                seat.lockedUntil = null;
                changed = true;
            }
        });
        
        if (changed) {
            await show.save();
        }

        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching show', error: error.message });
    }
};

// @desc    Add a show (Admin)
// @route   POST /api/shows
exports.addShow = async (req, res) => {
    try {
        const show = await Show.create(req.body);
        res.status(201).json(show);
    } catch (error) {
        res.status(400).json({ message: 'Error adding show', error: error.message });
    }
};
