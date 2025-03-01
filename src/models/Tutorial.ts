import mongoose, { Document, Schema } from 'mongoose';

export interface ITutorial extends Document {
  school: string;
  major: string;
  course: string;
  content: string;
  status: 'open' | 'matched' | 'completed';
  arrangement?: string;
  userId: mongoose.Types.ObjectId;
}

const TutorialSchema = new Schema<ITutorial>({
  school: { type: String, required: true },
  major: { type: String, required: true },
  course: { type: String, required: true },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'matched', 'completed'], 
    default: 'open' 
  },
  arrangement: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<ITutorial>('Tutorial', TutorialSchema); 