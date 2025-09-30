import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { isOfficial } from '../middleware/role.js';
import { 
  getLocationPetitions,
  updatePetitionStatus,
  closePetition 
} from '../controllers/petition.controller.js';
import {
  getLocationPolls,
  createOfficialPoll,
  closePoll
} from '../controllers/poll.controller.js';

const router = Router();

// Apply auth and official middleware to all routes
router.use(requireAuth, isOfficial);

// Petition routes
router.get('/petitions', getLocationPetitions);
router.put('/petitions/:petitionId/status', updatePetitionStatus);
router.post('/petitions/:petitionId/close', closePetition);

// Poll routes
router.get('/polls', getLocationPolls);
router.post('/polls', createOfficialPoll);
router.post('/polls/:pollId/close', closePoll);

export default router;