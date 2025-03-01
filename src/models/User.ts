import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export interface IUser extends Document {
  username: string;
  password: string;
  role: UserRole;
  gender?: string;
  contactInfo?: string; // phone or email
  enrollmentYear?: Date;
  college?: string;
  major?: string;
  avatarUrl?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  gender: { type: String },
  contactInfo: { type: String },
  enrollmentYear: { type: Date },
  college: { type: String },
  major: { type: String },
  avatarUrl: { type: String }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 