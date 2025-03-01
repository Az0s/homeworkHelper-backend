import express from 'express';
import * as tutorialController from '../controllers/tutorialController';
import { auth, checkRole } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Student routes
router.post('/', auth, checkRole(UserRole.STUDENT), tutorialController.createTutorialRequest);
router.get('/student', auth, checkRole(UserRole.STUDENT), tutorialController.getStudentTutorialRequests);

// Teacher routes
router.get('/teacher', auth, checkRole(UserRole.TEACHER), tutorialController.getMatchingTutorialRequests);
router.put('/accept/:id', auth, checkRole(UserRole.TEACHER), tutorialController.acceptTutorialRequest);

export default router; 