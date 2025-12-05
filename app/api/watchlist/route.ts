import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Watchlist from '@/models/Watchlist';
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

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = await Watchlist.create({ userId, stocks: [] });
    }

    return NextResponse.json(
      { success: true, watchlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const headersList = await headers();
    const authorization = headersList.get('authorization');
    const userId = await getUserIdFromToken(authorization);

    const body = await request.json();
    const stockData = body;

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = await Watchlist.create({ userId, stocks: [stockData] });
    } else {
      const exists = watchlist.stocks.some(
        (stock: any) => stock.company === stockData.company
      );

      if (exists) {
        return NextResponse.json(
          { success: false, message: 'Stock already in watchlist' },
          { status: 400 }
        );
      }

      watchlist.stocks.push(stockData);
      await watchlist.save();
    }

    return NextResponse.json(
      { success: true, message: 'Stock added to watchlist', watchlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const headersList = await headers();
    const authorization = headersList.get('authorization');
    const userId = await getUserIdFromToken(authorization);

    const body = await request.json();
    const { company } = body;

    const watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      return NextResponse.json(
        { success: false, message: 'Watchlist not found' },
        { status: 404 }
      );
    }

    watchlist.stocks = watchlist.stocks.filter(
      (stock: any) => stock.company !== company
    );

    await watchlist.save();

    return NextResponse.json(
      { success: true, message: 'Stock removed from watchlist', watchlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
