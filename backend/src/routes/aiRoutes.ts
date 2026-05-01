import express from 'express';
import { getAIGuidance, getAIDemoGuidance } from '../controllers/aiController';

const router = express.Router();

router.post('/guide/:slug', getAIGuidance);
router.post('/demo', getAIDemoGuidance);

export default router;
