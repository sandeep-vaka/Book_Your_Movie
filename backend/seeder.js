const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Show = require('./models/Show');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movietickets');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const moviesData = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
        duration: 148,
        genre: ["Sci-Fi", "Action"],
        language: ["English", "Hindi"],
        releaseDate: new Date("2010-07-16"),
        posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0"
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        duration: 169,
        genre: ["Sci-Fi", "Drama"],
        language: ["English"],
        releaseDate: new Date("2014-11-07"),
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
    }
];

const theatresData = [
    { name: "PVR Cinemas", city: "Mumbai", address: "Andheri West" },
    { name: "INOX", city: "Delhi", address: "Connaught Place" }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear DB
        await User.deleteMany();
        await Movie.deleteMany();
        await Theatre.deleteMany();
        await Show.deleteMany();

        // Insert
        const createdMovies = await Movie.insertMany(moviesData);
        const createdTheatres = await Theatre.insertMany(theatresData);

        // Generate dynamic seats
        const seats = [];
        const rows = ['A', 'B', 'C', 'D'];
        rows.forEach(row => {
            for (let i = 1; i <= 10; i++) {
                seats.push({ row, col: i, status: 'available' });
            }
        });

        // Insert Shows
        const showData = [
            {
                movie: createdMovies[0]._id,
                theatre: createdTheatres[0]._id,
                date: "2026-05-01",
                time: "10:00",
                ticketPrice: 250,
                seats: seats
            },
            {
                movie: createdMovies[1]._id,
                theatre: createdTheatres[1]._id,
                date: "2026-05-01",
                time: "13:00",
                ticketPrice: 300,
                seats: seats
            }
        ];

        await Show.insertMany(showData);

        console.log('Data Imported successfully');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
