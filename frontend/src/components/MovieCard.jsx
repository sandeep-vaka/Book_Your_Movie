import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie._id}`)}>
      <div className="movie-poster-wrapper">
        <img 
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
          className="movie-poster"
        />
        <div className="movie-overlay">
          <button className="btn-book">Book Now</button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.genre?.join(', ')}</p>
      </div>
    </div>
  );
};

export default MovieCard;
