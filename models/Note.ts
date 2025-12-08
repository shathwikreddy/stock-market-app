import mongoose, { Schema, models } from 'mongoose';

export interface INote {
    _id: string;
    userId: string;
    title: string;
    content: string;
    color: string;
    isPinned: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
        userId: {
            type: String,
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
