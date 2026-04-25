const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    seats: [{ row: String, col: Number }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
    paymentId: { type: String, default: 'mock-id' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
