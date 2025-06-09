import { Router } from 'express';
import eventsRouter from './events.routes';
import agentsRouter from './agents.routes';
import webhookRouter from './webhook.routes';

const router = Router();

router.use('/events', eventsRouter);
router.use('/agents', agentsRouter);
router.use('/webhook', webhookRouter); // Add this line

export default router;
