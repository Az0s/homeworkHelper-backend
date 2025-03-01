import express from 'express';
import * as accountController from '../controllers/accountController';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes (no JWT required)
router.post('/register', accountController.register);
router.post('/login', accountController.login);

// Protected routes (JWT required)
router.put('/info', auth, accountController.updateUserInfo);
router.put('/avatar', auth, upload.single('avatar'), accountController.updateAvatar);
router.get('/info', auth, accountController.getUserInfo);

export default router; 