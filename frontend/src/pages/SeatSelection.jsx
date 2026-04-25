import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeatSelection.css';

const SeatSelection = () => {
  const { id } = useParams(); // showId
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shows/${id}`);
        setShow(res.data);
      } catch (err) {
        setError('Error fetching seat data');
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [id]);

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;

    const isSelected = selectedSeats.some(s => s.row === seat.row && s.col === seat.col);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => !(s.row === seat.row && s.col === seat.col)));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // save state and redirect
        // For simplicity, just alert to login
        alert('Please login to book tickets');
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/bookings/lock', 
        { showId: id, seats: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store booking draft in local storage for payment page
      const totalAmount = selectedSeats.length * show.ticketPrice;
      localStorage.setItem('bookingDraft', JSON.stringify({
        showId: id,
        seats: selectedSeats,
        totalAmount,
        movieTitle: show.movie.title,
        theatreName: show.theatre.name,
        time: show.time
      }));

      navigate('/payment');
    } catch (err) {
      setError(err.response?.data?.message || 'Error locking seats. They might be taken.');
      // Refresh to get latest states
      const res = await axios.get(`http://localhost:5000/api/shows/${id}`);
      setShow(res.data);
      setSelectedSeats([]);
    }
  };

  if (loading) return <div className="loading">Loading seats...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  // Group seats by row
  const rows = {};
  show.seats.forEach(s => {
    if (!rows[s.row]) rows[s.row] = [];
    rows[s.row].push(s);
  });
  // Sort rows A, B, C...
  const sortedRows = Object.keys(rows).sort();

  return (
    <div className="container seat-selection-container">
      <div className="header-info">
        <h2>{show.movie.title}</h2>
        <p>{show.theatre.name} | {show.date} - {show.time}</p>
      </div>

      <div className="screen-indicator">
        <div className="screen-line"></div>
        <span>SCREEN THIS WAY</span>
      </div>

      <div className="seat-map card">
        {sortedRows.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats">
              {rows[row].sort((a,b) => a.col - b.col).map(seat => {
                const isSelected = selectedSeats.some(s => s.row === seat.row && s.col === seat.col);
                let seatClass = 'seat available';
                if (seat.status === 'booked' || seat.status === 'locked') seatClass = 'seat booked';
                if (isSelected) seatClass = 'seat selected';

                return (
                  <button 
                    key={`${seat.row}${seat.col}`} 
                    className={seatClass}
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.status !== 'available'}
                  >
                    {seat.col}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item"><div className="seat available-legend"></div> Available</div>
        <div className="legend-item"><div className="seat booked-legend"></div> Booked/Locked</div>
        <div className="legend-item"><div className="seat selected-legend"></div> Selected</div>
      </div>

      <div className="booking-bar card">
        <div className="booking-summary">
          {selectedSeats.length > 0 ? (
            <p>{selectedSeats.length} Ticket(s) | ₹{selectedSeats.length * show.ticketPrice}</p>
          ) : (
            <p>Select seats to proceed.</p>
          )}
        </div>
        <button 
          className="btn-primary" 
          disabled={selectedSeats.length === 0}
          onClick={handleProceed}
        >
          Pay ₹{selectedSeats.length * show.ticketPrice}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
