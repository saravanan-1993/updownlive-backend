import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { sendEmail } from '../config/emailService.js';
import { generateWelcomeEmail, generateWelcomeEmailText } from '../templates/welcomeEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const setCookieAndRespond = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token, // include token so frontend can store it for cross-domain auth
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (user) {
      // Send professional welcome email
      try {
        await sendEmail({
          to: email,
          subject: '🎉 Welcome to UpDownLive - Your Market Journey Starts Here!',
          text: generateWelcomeEmailText(name),
          html: generateWelcomeEmail(name),
        });
        console.log(`Welcome email sent successfully to ${email}`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError.message);
        // Don't fail registration if email fails
      }
      setCookieAndRespond(res, user, 201);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // User exists but has no password (e.g. OAuth-only account or migrated from BetterAuth)
    if (!user.password) {
      return res.status(401).json({ message: 'This account uses Google sign-in. Please use "Continue with Google".' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    setCookieAndRespond(res, user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    secure: process.env.NODE_ENV !== 'development',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user session
// @route   GET /api/auth/session
// @access  Public (returns null user if not logged in)
export const getSession = async (req, res) => {
  try {
    // Accept token from cookie OR Authorization header (for cross-domain production)
    let token = req.cookies.jwt;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.json({ user: null });
    }

    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({ user: null });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Redirect to Google OAuth
// @route   GET /api/auth/google
// @access  Public
export const googleAuth = (req, res) => {
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/callback/google`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

// @desc    Google OAuth callback
// @route   GET /api/auth/callback/google
// @access  Public
export const googleCallback = async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/callback/google`;

  if (!code) {
    return res.redirect(`${frontendUrl}/admin/login?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenRes.data;

    // Get user info from Google
    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name } = userInfoRes.data;

    // Find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
      const role = email === adminEmail ? 'admin' : 'user';
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36) + Math.random().toString(36),
        role,
      });
      isNewUser = true;

      // Send welcome email for new Google OAuth users
      if (role !== 'admin') {
        try {
          await sendEmail({
            to: email,
            subject: '🎉 Welcome to UpDownLive - Your Market Journey Starts Here!',
            text: generateWelcomeEmailText(name),
            html: generateWelcomeEmail(name),
          });
          console.log(`Welcome email sent successfully to ${email} (Google OAuth)`);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError.message);
        }
      }
    }

    // Ensure admin email always has admin role
    const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
    if (email === adminEmail && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = generateToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Pass token as query param so the frontend can store it in localStorage for cross-domain auth
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${user.role}`);
  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    res.redirect(`${frontendUrl}/admin/login?error=oauth_failed`);
  }
};
