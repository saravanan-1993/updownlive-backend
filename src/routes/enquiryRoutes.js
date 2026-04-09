import express from 'express';
import { submitEnquiry, getEnquiries, updateEnquiryNotice } from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/', submitEnquiry);
router.get('/', getEnquiries); // TODO: Add better-auth middleware to protect this route
router.patch('/:id/notice', updateEnquiryNotice);

export default router;
