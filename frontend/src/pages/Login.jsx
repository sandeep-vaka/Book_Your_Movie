import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:5000/api';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await axios.post(`${API_URL}/auth/send-otp`, { mobileNumber });
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { mobileNumber, otpCode });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box card">
        <h2>{step === 1 ? 'Sign In / Sign Up' : 'Enter OTP'}</h2>
        
        {error && <div className="error-msg">{error}</div>}
        {msg && <div className="success-msg">{msg}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label>Mobile Number</label>
              <input 
                type="tel" 
                placeholder="Enter 10 digit number" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label>We sent an OTP to {mobileNumber}</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Verify & Login</button>
            <button type="button" className="btn-link" onClick={() => setStep(1)}>Go Back</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
