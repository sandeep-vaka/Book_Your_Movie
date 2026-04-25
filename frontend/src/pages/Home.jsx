import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
      } catch (error) {
        console.error('Error fetching movies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Banner / Carousel placeholder */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Experience Magic on the Big Screen</h1>
          <p>Book your tickets for the latest blockbusters now.</p>
        </div>
      </div>

      <div className="container">
        <h2 className="section-title">Recommended Movies</h2>
        
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
