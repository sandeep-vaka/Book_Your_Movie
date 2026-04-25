const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;

    if (!mobileNumber || mobileNumber.length < 10) {
        return res.status(400).json({ message: 'Please provide a valid mobile number' });
    }

    // Generate 6 digit mock OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    try {
        // Delete any existing OTP for this number
        await OTP.deleteOne({ mobileNumber });

        await OTP.create({
            mobileNumber,
            otpCode,
            expiresAt
        });

        // Simulate sending OTP (Logs to terminal for Dev)
        console.log(`\n\n=== MOCK SMS ===`);
        console.log(`To: ${mobileNumber}`);
        console.log(`Your OTP for MovieTickets is: ${otpCode}`);
        console.log(`================\n\n`);

        res.status(200).json({ message: 'OTP sent successfully (Check server console)' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

// @desc    Verify OTP & Login/Signup
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
    const { mobileNumber, otpCode } = req.body;

    try {
        const otpRecord = await OTP.findOne({ mobileNumber, otpCode });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // OTP is valid. Check if user exists, else create
        let user = await User.findOne({ mobileNumber });

        if (!user) {
            user = await User.create({ mobileNumber, isVerified: true });
        } else if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        // Clean up OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            message: 'Authentication successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                mobileNumber: user.mobileNumber,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};
