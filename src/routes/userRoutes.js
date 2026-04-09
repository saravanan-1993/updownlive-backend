import express from 'express';
import { getUsers, updateUserStatus, getUserById, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// TODO: In a production app, add admin verification middleware here
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/:userId/status', updateUserStatus);
router.put('/:userId', updateUserProfile);

export default router;
