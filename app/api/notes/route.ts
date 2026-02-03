import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import { getUserIdFromToken } from '@/lib/auth';
import {
  handleApiError,
  notFound,
  created,
} from '@/lib/api-response';
import {
  validateRequest,
  createNoteSchema,
  updateNoteSchema,
  deleteNoteSchema,
} from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    const notes = await Note.find({ userId })
      .sort({ isPinned: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      notes,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    const { title, content, color, tags } = await validateRequest(
      request,
      createNoteSchema
    );

    const note = await Note.create({
      userId,
      title,
      content,
      color,
      tags,
      isPinned: false,
    });

    return created({ note }, 'Note created');
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    const { _id, title, content, color, isPinned, tags } = await validateRequest(
      request,
      updateNoteSchema
    );

    const note = await Note.findOne({ _id, userId });

    if (!note) {
      return notFound('Note not found');
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (tags !== undefined) note.tags = tags;

    await note.save();

    return NextResponse.json({
      success: true,
      message: 'Note updated',
      note,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    const { _id } = await validateRequest(request, deleteNoteSchema);

    const result = await Note.deleteOne({ _id, userId });

    if (result.deletedCount === 0) {
      return notFound('Note not found');
    }

    return NextResponse.json({
      success: true,
      message: 'Note deleted',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return handleApiError(error);
  }
}
