const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/authController');
const { otpRateLimiter } = require('../middleware/rateLimiter');

router.post('/send-otp', otpRateLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
