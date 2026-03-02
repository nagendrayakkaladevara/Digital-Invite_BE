import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback extends Document {
  description?: string;
  number?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    description: { type: String, required: false, maxlength: 2000 },
    number: { type: String, required: false, maxlength: 50 },
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ??
  mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
