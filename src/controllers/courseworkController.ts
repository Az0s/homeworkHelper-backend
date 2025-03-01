import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Coursework from '../models/Coursework';
import { UserRole } from '../models/User';

// Upload coursework (student)
export const uploadCoursework = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.STUDENT) {
      return res.status(403).json({ message: 'Only students can upload coursework' });
    }
    
    const { imageUrls, content, subject, priceRange, deadline, tags } = req.body;
    
    const coursework = new Coursework({
      imageUrls,
      content,
      subject,
      priceRange,
      deadline: new Date(deadline),
      tags,
      userId: req.user._id
    });
    
    await coursework.save();
    
    res.status(201).json({ id: coursework._id });
  } catch (error) {
    console.error('Upload coursework error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get coursework list (student)
export const getStudentCourseworkList = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.STUDENT) {
      return res.status(403).json({ message: 'Only students can access this' });
    }
    
    const courseworks = await Coursework.find({ userId: req.user._id })
      .select('-content -imageUrls')
      .sort({ createdAt: -1 });
    
    res.json(courseworks);
  } catch (error) {
    console.error('Get student coursework list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get coursework details (student)
export const getStudentCourseworkDetail = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.STUDENT) {
      return res.status(403).json({ message: 'Only students can access this' });
    }
    
    const coursework = await Coursework.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!coursework) {
      return res.status(404).json({ message: 'Coursework not found' });
    }
    
    res.json(coursework);
  } catch (error) {
    console.error('Get student coursework detail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get coursework list (teacher)
export const getTeacherCourseworkList = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.TEACHER) {
      return res.status(403).json({ message: 'Only teachers can access this' });
    }
    
    const courseworks = await Coursework.find({ status: 'pending' })
      .select('-content -imageUrls')
      .sort({ deadline: 1 });
    
    res.json(courseworks);
  } catch (error) {
    console.error('Get teacher coursework list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get coursework details (teacher)
export const getTeacherCourseworkDetail = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.TEACHER) {
      return res.status(403).json({ message: 'Only teachers can access this' });
    }
    
    const coursework = await Coursework.findById(req.params.id);
    
    if (!coursework) {
      return res.status(404).json({ message: 'Coursework not found' });
    }
    
    res.json(coursework);
  } catch (error) {
    console.error('Get teacher coursework detail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete coursework (teacher)
export const completeCoursework = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.TEACHER) {
      return res.status(403).json({ message: 'Only teachers can complete coursework' });
    }
    
    const { imageUrls, description } = req.body;
    
    const coursework = await Coursework.findById(req.params.id);
    
    if (!coursework) {
      return res.status(404).json({ message: 'Coursework not found' });
    }
    
    coursework.status = 'completed';
    coursework.solution = {
      imageUrls,
      description
    };
    
    await coursework.save();
    
    res.json({ message: 'Coursework completed successfully' });
  } catch (error) {
    console.error('Complete coursework error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload coursework image
export const uploadCourseworkImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload coursework image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 