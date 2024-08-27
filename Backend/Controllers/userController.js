const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); 

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No user found with that email' });
      }
  
      const resetToken = user.generatePasswordReset();
      await user.save();
  
      // Create reset URL
      const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
  
      // Email text
      const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`;
  
      // Send email
      await sendEmail(user.email, 'Password Reset Request', message);
  
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Reset password
exports.resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;
  
    try {
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };