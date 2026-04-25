const rateLimit = require('express-rate-limit');

// Limit OTP requests to 3 per 10 minutes per IP
exports.otpRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 3,
    message: { message: 'Too many OTP requests from this IP, please try again after 10 minutes.' }
});
