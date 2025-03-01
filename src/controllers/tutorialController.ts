import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Tutorial from '../models/Tutorial';
import User, { UserRole } from '../models/User';

// Create tutorial request (student)
export const createTutorialRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.STUDENT) {
      return res.status(403).json({ message: 'Only students can create tutorial requests' });
    }
    
    const { school, major, course, content } = req.body;
    
    const tutorial = new Tutorial({
      school,
      major,
      course,
      content,
      userId: req.user._id
    });
    
    await tutorial.save();
    
    res.status(201).json({ message: 'Tutorial request created successfully' });
  } catch (error) {
    console.error('Create tutorial request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tutorial requests list (student)
export const getStudentTutorialRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.STUDENT) {
      return res.status(403).json({ message: 'Only students can access this' });
    }
    
    const tutorials = await Tutorial.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(tutorials);
  } catch (error) {
    console.error('Get student tutorial requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get matching tutorial requests (teacher)
export const getMatchingTutorialRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.TEACHER) {
      return res.status(403).json({ message: 'Only teachers can access this' });
    }
    
    // Get teacher major for filtering
    const teacher = await User.findById(req.user._id);
    const teacherMajor = teacher?.major || '';
    
    // Find open requests, prioritizing those matching teacher's major
    const tutorials = await Tutorial.find({ 
      status: 'open',
      ...(teacherMajor ? { major: { $regex: teacherMajor, $options: 'i' } } : {})
    }).sort({ createdAt: -1 });
    
    // If no matching requests found by major, get all open requests
    if (tutorials.length === 0 && teacherMajor) {
      const allTutorials = await Tutorial.find({ 
        status: 'open' 
      }).sort({ createdAt: -1 });
      
      return res.json(allTutorials);
    }
    
    res.json(tutorials);
  } catch (error) {
    console.error('Get matching tutorial requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept tutorial request (teacher)
export const acceptTutorialRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== UserRole.TEACHER) {
      return res.status(403).json({ message: 'Only teachers can accept tutorial requests' });
    }
    
    const { id } = req.params;
    const { arrangement } = req.body;
    
    const tutorial = await Tutorial.findById(id);
    
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial request not found' });
    }
    
    if (tutorial.status !== 'open') {
      return res.status(400).json({ message: 'This tutorial request is no longer available' });
    }
    
    tutorial.status = 'matched';
    tutorial.arrangement = arrangement;
    
    await tutorial.save();
    
    // Get updated list of matching tutorials
    const teacher = await User.findById(req.user._id);
    const teacherMajor = teacher?.major || '';
    
    const tutorials = await Tutorial.find({ 
      status: 'open',
      ...(teacherMajor ? { major: { $regex: teacherMajor, $options: 'i' } } : {})
    }).sort({ createdAt: -1 });
    
    res.json(tutorials);
  } catch (error) {
    console.error('Accept tutorial request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 