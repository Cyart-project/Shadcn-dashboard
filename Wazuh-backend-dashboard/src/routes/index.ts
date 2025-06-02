import { Router } from 'express';
import eventsRouter from './events.routes';
import agentsRouter from './agents.routes';

const router = Router();

router.use('/events', eventsRouter);
router.use('/agents', agentsRouter);

export default router;
