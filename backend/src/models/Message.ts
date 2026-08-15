import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IMessageDocument extends Document {
  conversationId: Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sent' | 'failed';
}

const messageSchema = new Schema<IMessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: [true, 'Role is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [1, 'Message content must not be empty'],
      maxlength: [10000, 'Message content must not exceed 10000 characters'],
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
    },
  },
  {
    collection: 'messages',
  }
);

// Compound index for efficient conversation message queries
messageSchema.index({ conversationId: 1, timestamp: -1 });

// Index for finding messages by role (useful for analytics)
messageSchema.index({ conversationId: 1, role: 1 });

export const Message: Model<IMessageDocument> = model<IMessageDocument>(
  'Message',
  messageSchema
);
