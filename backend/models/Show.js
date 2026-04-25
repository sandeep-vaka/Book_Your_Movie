const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    ticketPrice: { type: Number, required: true },
    seats: [{
        row: { type: String }, // e.g., 'A', 'B'
        col: { type: Number }, // e.g., 1, 2, 3
        status: { 
            type: String, 
            enum: ['available', 'booked', 'locked'], 
            default: 'available' 
        },
        lockedUntil: { type: Date, default: null } // used for 5-min lock
    }]
}, { timestamps: true });

module.exports = mongoose.model('Show', showSchema);
