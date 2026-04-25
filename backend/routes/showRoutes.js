const express = require('express');
const router = express.Router();
const { getShows, getShowById, addShow } = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getShows).post(protect, admin, addShow);
router.route('/:id').get(getShowById);

module.exports = router;
