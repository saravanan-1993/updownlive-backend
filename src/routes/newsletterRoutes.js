import express from 'express';
const router = express.Router();
import newsletterController from '../controllers/newsletterController.js';

// Public routes
router.post('/subscribe', newsletterController.subscribe);
router.put('/unsubscribe/:id', newsletterController.unsubscribe);

// Admin routes (TODO: Add better-auth middleware to protect these routes)
router.get('/subscribers', newsletterController.getSubscribers);
router.post('/sync-users', newsletterController.syncUsersToNewsletter);
router.delete('/subscribers/:id', newsletterController.deleteSubscriber);
router.post('/send-bulk-email', newsletterController.sendBulkEmail);

export default router;

