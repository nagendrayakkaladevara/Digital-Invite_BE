import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIChatHistory extends Document {
  question: string;
  response: string;
  aiModel: string;
  createdAt: Date;
}

const AIChatHistorySchema = new Schema<IAIChatHistory>(
  {
    question: { type: String, required: true },
    response: { type: String, required: true },
    aiModel: { type: String, required: true },
  },
  { timestamps: true }
);

AIChatHistorySchema.index({ createdAt: -1 });
AIChatHistorySchema.index({ aiModel: 1, createdAt: -1 });

const AIChatHistory: Model<IAIChatHistory> =
  mongoose.models.AIChatHistory ??
  mongoose.model<IAIChatHistory>('AIChatHistory', AIChatHistorySchema);

export default AIChatHistory;
