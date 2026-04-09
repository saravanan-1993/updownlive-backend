import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getSession,
  googleAuth,
  googleCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/session', getSession);

// Google OAuth
router.get('/google', googleAuth);
router.get('/callback/google', googleCallback);

export default router;
