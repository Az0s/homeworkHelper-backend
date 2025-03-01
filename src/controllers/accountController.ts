import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import { JWT_SECRET } from '../config/env';
import { AuthRequest } from '../middleware/auth';

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      username,
      password,
      role: role === 'student' ? UserRole.STUDENT : UserRole.TEACHER
    });
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user info
export const updateUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { gender, contactInfo, enrollmentYear, college, major } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const updates: Partial<IUser> = {};
    
    if (gender !== undefined) updates.gender = gender;
    if (contactInfo !== undefined) updates.contactInfo = contactInfo;
    if (enrollmentYear !== undefined) updates.enrollmentYear = new Date(enrollmentYear);
    if (college !== undefined) updates.college = college;
    if (major !== undefined) updates.major = major;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Update user info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update avatar
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatarUrl } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ avatarUrl });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user info
export const getUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      gender: user.gender,
      contactInfo: user.contactInfo,
      enrollmentYear: user.enrollmentYear,
      college: user.college,
      major: user.major,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 