import express from 'express';
import { getBusinessNews } from '../controllers/newsController.js';

const router = express.Router();

router.get('/business', getBusinessNews);

export default router;
