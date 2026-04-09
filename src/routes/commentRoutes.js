import express from 'express';
import { getComments, createComment, deleteComment, getAllComments } from '../controllers/commentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', protect, admin, getAllComments);
router.get('/', getComments);
router.post('/', protect, createComment);
router.delete('/:id', protect, admin, deleteComment);

export default router;
