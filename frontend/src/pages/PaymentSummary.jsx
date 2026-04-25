import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentSummary.css';

const PaymentSummary = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const savedDraft = localStorage.getItem('bookingDraft');
    if (savedDraft) {
      setDraft(JSON.parse(savedDraft));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate fake payment delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:5000/api/bookings',
          {
            showId: draft.showId,
            seats: draft.seats,
            totalAmount: draft.totalAmount,
            paymentId: 'mock_pay_' + Date.now()
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setBookingId(res.data._id);
        setSuccess(true);
        localStorage.removeItem('bookingDraft');
      } catch (error) {
        alert('Payment failed or seats expired. Please try again.');
        navigate('/');
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (!draft) return null;

  if (success) {
    return (
      <div className="container payment-container text-center">
        <div className="success-card card">
          <div className="check-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your tickets have been booked successfully.</p>
          <div className="ticket-info">
            <p><strong>Booking ID:</strong> {bookingId}</p>
            <p><strong>Movie:</strong> {draft.movieTitle}</p>
            <p><strong>Theatre:</strong> {draft.theatreName}</p>
            <p><strong>Time:</strong> {draft.time}</p>
            <p><strong>Seats:</strong> {draft.seats.map(s => `${s.row}${s.col}`).join(', ')}</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container payment-container">
      <h2>Booking Summary</h2>
      
      <div className="summary-layout">
        <div className="summary-details card">
          <h3>{draft.movieTitle}</h3>
          <p className="subtitle">{draft.theatreName} | {draft.time}</p>
          
          <div className="divider"></div>
          
          <div className="seat-list">
            <span>Seats:</span>
            <strong>{draft.seats.map(s => `${s.row}${s.col}`).join(', ')}</strong>
          </div>
          
          <div className="divider"></div>

          <div className="price-row">
            <span>Tickets ({draft.seats.length})</span>
            <span>₹{draft.totalAmount}</span>
          </div>
          <div className="price-row">
            <span>Convenience Fee</span>
            <span>₹40</span>
          </div>
          
          <div className="divider"></div>
          
          <div className="price-row total">
            <span>Total Payable</span>
            <span>₹{draft.totalAmount + 40}</span>
          </div>
        </div>

        <div className="payment-action card">
          <h3>Payment</h3>
          <p className="text-muted mb-4">Click below to simulate a secure mock payment.</p>
          <button 
            className="btn-primary btn-pay" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${draft.totalAmount + 40}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
