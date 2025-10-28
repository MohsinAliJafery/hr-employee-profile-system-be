const { protect } = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); 

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register new user with logo
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', upload.single('logo'), async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      companyName,
      phoneNumber,
      mobileNumber,
      companyEmailId,
      website,
      address,
      password,
      confirmPassword
    } = req.body;

    // Validation
    if (!firstName || !lastName || !companyName || !phoneNumber || !companyEmailId || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ companyEmailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Handle logo file
    let logoPath = null;
    if (req.file) {
      logoPath = req.file.filename; // Store only the filename
    }

    // Create user
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      companyName,
      phoneNumber,
      mobileNumber,
      companyEmailId,
      website,
      address,
      password,
      logo: logoPath
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        companyEmailId: user.companyEmailId,
        phoneNumber: user.phoneNumber,
        logo: user.logo
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Add this to serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ companyEmailId: email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        companyEmailId: user.companyEmailId,
        phoneNumber: user.phoneNumber
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    // Find user by email
    const user = await User.findOne({ companyEmailId: email });

    // Always return success even if email doesn't exist (for security)
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }else {
      console.log("User Exists with this email: Forgot Password")
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiry (1 hour)
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Email message
    const message = `
      <h2>Password Reset Request</h2>
      <p>You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #8C00FF;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 10px 0;
      ">Reset Your Password</a>
      <p>This reset link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <hr>
      <p><strong>Company:</strong> ${user.companyName}</p>
    `;

    try {
      await sendEmail({
        to: user.companyEmailId,
        subject: 'Password Reset Request',
        html: message
      });

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Reset the token if email fails to send
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reset token and new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Send confirmation email
    const message = `
      <h2>Password Reset Successful</h2>
      <p>Your password has been successfully reset.</p>
      <p>If you did not perform this action, please contact support immediately.</p>
      <hr>
      <p><strong>Company:</strong> ${user.companyName}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `;

    try {
      await sendEmail({
        to: user.companyEmailId,
        subject: 'Password Reset Successful',
        html: message
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      // Don't fail the reset request if confirmation email fails
    }

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        companyEmailId: user.companyEmailId,
        phoneNumber: user.phoneNumber,
        website: user.website,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;