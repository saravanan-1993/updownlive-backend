import express from 'express';
import { getEconomicEvents } from '../controllers/economicCalendarController.js';

const router = express.Router();

router.get('/events', getEconomicEvents);

export default router;
