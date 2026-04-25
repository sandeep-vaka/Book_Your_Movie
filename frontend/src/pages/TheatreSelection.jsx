import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TheatreSelection.css';

const TheatreSelection = () => {
  const { id } = useParams(); // movieId
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-05-01'); // Hardcoded initially for mock data

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shows?movieId=${id}&date=${selectedDate}`);
        setShows(res.data);
      } catch (error) {
        console.error('Error fetching shows', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [id, selectedDate]);

  // Group shows by Theatre
  const theatresMap = {};
  shows.forEach(show => {
    const tId = show.theatre._id;
    if (!theatresMap[tId]) {
      theatresMap[tId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    theatresMap[tId].shows.push(show);
  });

  return (
    <div className="container theatre-selection-container">
      <h2>Select Theatre and Show Time</h2>
      
      <div className="date-selector">
        <button className="date-btn active">
          <span className="month">MAY</span>
          <span className="day">01</span>
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading theatres...</div>
      ) : (
        <div className="theatres-list">
          {Object.values(theatresMap).length === 0 && <p>No shows available for this date.</p>}
          {Object.values(theatresMap).map(data => (
            <div key={data.theatre._id} className="theatre-row card">
              <div className="theatre-info">
                <h3>{data.theatre.name}</h3>
                <p>{data.theatre.address}, {data.theatre.city}</p>
              </div>
              <div className="show-times">
                {data.shows.map(show => (
                  <button 
                    key={show._id} 
                    className="time-btn"
                    onClick={() => navigate(`/show/${show._id}/seats`)}
                  >
                    {show.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatreSelection;
