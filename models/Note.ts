import mongoose, { Schema, models, Document } from 'mongoose';

export type NoteColor = 'slate' | 'zinc' | 'stone' | 'neutral' | 'gray' | 'dark';

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'slate',
      enum: ['slate', 'zinc', 'stone', 'neutral', 'gray', 'dark'],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
NoteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

const Note = models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
