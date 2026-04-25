const express = require('express');
const router = express.Router();
const { lockSeats, createBooking, getUserBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/lock', protect, lockSeats);
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getUserBookings);

module.exports = router;
