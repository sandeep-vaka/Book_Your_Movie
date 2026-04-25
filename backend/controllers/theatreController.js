const Theatre = require('../models/Theatre');

// @desc    Get all theatres (with optional city filter)
// @route   GET /api/theatres
exports.getTheatres = async (req, res) => {
    try {
        const { city } = req.query;
        let query = {};
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }
        
        const theatres = await Theatre.find(query);
        res.status(200).json(theatres);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching theatres', error: error.message });
    }
};

// @desc    Add a theatre (Admin)
// @route   POST /api/theatres
exports.addTheatre = async (req, res) => {
    try {
        const theatre = await Theatre.create(req.body);
        res.status(201).json(theatre);
    } catch (error) {
        res.status(400).json({ message: 'Error adding theatre', error: error.message });
    }
};
