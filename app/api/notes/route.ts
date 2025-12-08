import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserIdFromToken(authorization: string | null) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
}

// GET - Fetch all notes for authenticated user
export async function GET() {
    try {
        await connectDB();

        const headersList = await headers();
        const authorization = headersList.get('authorization');
        const userId = await getUserIdFromToken(authorization);

        const notes = await Note.find({ userId })
            .sort({ isPinned: -1, updatedAt: -1 })
            .lean();

        return NextResponse.json(
            { success: true, notes },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// POST - Create a new note
export async function POST(request: Request) {
    try {
        await connectDB();

        const headersList = await headers();
        const authorization = headersList.get('authorization');
        const userId = await getUserIdFromToken(authorization);

        const body = await request.json();
        const { title, content, color, tags } = body;

        if (!title || !title.trim()) {
            return NextResponse.json(
                { success: false, message: 'Title is required' },
                { status: 400 }
            );
        }

        const note = await Note.create({
            userId,
            title: title.trim(),
            content: content || '',
            color: color || 'yellow',
            tags: tags || [],
            isPinned: false,
        });

        return NextResponse.json(
            { success: true, message: 'Note created', note },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// PUT - Update an existing note
export async function PUT(request: Request) {
    try {
        await connectDB();

        const headersList = await headers();
        const authorization = headersList.get('authorization');
        const userId = await getUserIdFromToken(authorization);

        const body = await request.json();
        const { _id, title, content, color, isPinned, tags } = body;

        if (!_id) {
            return NextResponse.json(
                { success: false, message: 'Note ID is required' },
                { status: 400 }
            );
        }

        const note = await Note.findOne({ _id, userId });

        if (!note) {
            return NextResponse.json(
                { success: false, message: 'Note not found' },
                { status: 404 }
            );
        }

        // Update fields if provided
        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content;
        if (color !== undefined) note.color = color;
        if (isPinned !== undefined) note.isPinned = isPinned;
        if (tags !== undefined) note.tags = tags;

        await note.save();

        return NextResponse.json(
            { success: true, message: 'Note updated', note },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// DELETE - Delete a note by ID
export async function DELETE(request: Request) {
    try {
        await connectDB();

        const headersList = await headers();
        const authorization = headersList.get('authorization');
        const userId = await getUserIdFromToken(authorization);

        const body = await request.json();
        const { _id } = body;

        if (!_id) {
            return NextResponse.json(
                { success: false, message: 'Note ID is required' },
                { status: 400 }
            );
        }

        const result = await Note.deleteOne({ _id, userId });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Note deleted' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
