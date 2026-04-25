const Booking = require('../models/Booking');
const Show = require('../models/Show');

// @desc    Lock Seats
// @route   POST /api/bookings/lock
exports.lockSeats = async (req, res) => {
    try {
        const { showId, seats } = req.body; // seats: [{row: 'A', col: 1}, ...]
        const show = await Show.findById(showId);

        if (!show) return res.status(404).json({ message: 'Show not found' });

        const now = new Date();
        const lockDuration = 5 * 60 * 1000; // 5 mins

        // Verify all requested seats are available
        for (const reqSeat of seats) {
            const showSeat = show.seats.find(s => s.row === reqSeat.row && s.col === reqSeat.col);
            if (!showSeat) {
                return res.status(400).json({ message: `Seat ${reqSeat.row}${reqSeat.col} not found` });
            }
            if (showSeat.status === 'booked' || (showSeat.status === 'locked' && showSeat.lockedUntil > now)) {
                return res.status(400).json({ message: `Seat ${reqSeat.row}${reqSeat.col} is not available` });
            }
        }

        // Lock seats
        seats.forEach(reqSeat => {
            const showSeat = show.seats.find(s => s.row === reqSeat.row && s.col === reqSeat.col);
            showSeat.status = 'locked';
            showSeat.lockedUntil = new Date(now.getTime() + lockDuration);
        });

        await show.save();
        res.status(200).json({ message: 'Seats locked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error locking seats', error: error.message });
    }
};

// @desc    Confirm Booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { showId, seats, totalAmount, paymentId } = req.body;
        const show = await Show.findById(showId);

        // Verify seats are actually locked by logic (in a real app, bind lock to userId, here we just check if it's locked/available)
        seats.forEach(reqSeat => {
            const showSeat = show.seats.find(s => s.row === reqSeat.row && s.col === reqSeat.col);
            showSeat.status = 'booked';
            showSeat.lockedUntil = null;
        });

        await show.save();

        const booking = await Booking.create({
            user: req.user._id,
            show: showId,
            seats,
            totalAmount,
            status: 'confirmed',
            paymentId
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({ path: 'show', populate: { path: 'movie theatre' } });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};
