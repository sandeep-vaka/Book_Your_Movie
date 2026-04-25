const express = require('express');
const router = express.Router();
const { getTheatres, addTheatre } = require('../controllers/theatreController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getTheatres).post(protect, admin, addTheatre);

module.exports = router;
