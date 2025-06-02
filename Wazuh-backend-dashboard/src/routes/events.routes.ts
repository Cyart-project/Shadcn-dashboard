import { Router } from 'express';
import { getEvents, getEventStats } from '../controllers/events.controller';

const router = Router();

router.get('/', getEvents);
router.get('/stats', getEventStats);

export default router;
