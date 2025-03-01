import mongoose, { Document, Schema } from 'mongoose';

export interface ICoursework extends Document {
  imageUrls: string[];
  content: string;
  subject: string;
  priceRange: {
    min: number;
    max: number;
  };
  deadline: Date;
  tags?: string[];
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'completed';
  solution?: {
    imageUrls: string[];
    description: string;
  };
}

const CourseworkSchema = new Schema<ICoursework>({
  imageUrls: [{ type: String, required: true }],
  content: { type: String, required: true },
  subject: { type: String, required: true },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  deadline: { type: Date, required: true },
  tags: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  solution: {
    imageUrls: [{ type: String }],
    description: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<ICoursework>('Coursework', CourseworkSchema); 