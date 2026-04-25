import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
      } catch (error) {
        console.error('Error fetching movie details', error);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <div className="loading">Loading movie details...</div>;

  return (
    <div className="movie-details-container">
      <div 
        className="movie-backdrop"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container movie-content">
        <div className="movie-poster-large">
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
        <div className="movie-info-large">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span>{movie.duration} mins</span>
            <span>•</span>
            <span>{movie.genre?.join(', ')}</span>
            <span>•</span>
            <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
          </div>
          <p className="movie-desc">{movie.description}</p>
          
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={() => navigate(`/movie/${movie._id}/theatres`)}
            >
              Book Tickets
            </button>
            {movie.trailerUrl && (
              <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
