import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Portfolio, { IPortfolio } from '@/models/Portfolio';
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

export async function GET(request: Request) {
  try {
    await connectDB();

    const headersList = await headers();
    const authorization = headersList.get('authorization');
    const userId = await getUserIdFromToken(authorization);

    const { searchParams } = new URL(request.url);
    const marketCondition = searchParams.get('marketCondition');

    if (!marketCondition) {
      return NextResponse.json(
        { success: false, message: 'Market condition is required' },
        { status: 400 }
      );
    }

    let portfolio = await Portfolio.findOne({ userId, marketCondition });
    
    // If no portfolio exists for this condition, return null (UI will handle defaults)
    // Or we could return default structure here.
    // Let's return null and let UI establish defaults if needed, or 
    // better, return an empty structure if not found so UI can initialize.

    if (!portfolio) {
        // Return a shape that indicates no saved data, or empty strategies
       return NextResponse.json({ success: true, portfolio: null });
    }

    return NextResponse.json(
      { success: true, portfolio },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const headersList = await headers();
    const authorization = headersList.get('authorization');
    const userId = await getUserIdFromToken(authorization);

    const body = await request.json();
    const { marketCondition, strategies } = body;

    if (!marketCondition || !strategies) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upsert the portfolio for this user and market condition
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId, marketCondition },
      { strategies },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      { success: true, message: 'Portfolio updated', portfolio },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
