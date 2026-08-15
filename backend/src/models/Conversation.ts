import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IConversationDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must have at least 1 character'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'conversations',
  }
);

// Compound index for user-specific queries
conversationSchema.index({ userId: 1, createdAt: -1 });

// Index for finding recent conversations
conversationSchema.index({ updatedAt: -1 });

export const Conversation: Model<IConversationDocument> = model<
  IConversationDocument
>('Conversation', conversationSchema);
