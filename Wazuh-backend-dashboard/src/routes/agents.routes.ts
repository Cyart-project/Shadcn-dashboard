import { Router } from 'express';
import { getAgents, getAgentStats } from '../controllers/agents.controller';

const router = Router();

router.get('/', getAgents);
router.get('/:id/stats', getAgentStats);

export default router;
