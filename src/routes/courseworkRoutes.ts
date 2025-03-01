 import express from 'express';
import * as courseworkController from '../controllers/courseworkController';
import { auth, checkRole } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { UserRole } from '../models/User';

const router = express.Router();

// Image upload route
router.post('/image', auth, upload.single('image'), courseworkController.uploadCourseworkImage);

// Student routes
router.post('/', auth, checkRole(UserRole.STUDENT), courseworkController.uploadCoursework);
router.get('/student', auth, checkRole(UserRole.STUDENT), courseworkController.getStudentCourseworkList);
router.get('/student/:id', auth, checkRole(UserRole.STUDENT), courseworkController.getStudentCourseworkDetail);

// Teacher routes
router.get('/teacher', auth, checkRole(UserRole.TEACHER), courseworkController.getTeacherCourseworkList);
router.get('/teacher/:id', auth, checkRole(UserRole.TEACHER), courseworkController.getTeacherCourseworkDetail);
router.put('/complete/:id', auth, checkRole(UserRole.TEACHER), courseworkController.completeCoursework);

export default router;