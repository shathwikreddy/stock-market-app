import { NextResponse } from 'next/server';
import { topGainersData, topLosersData } from '@/lib/mockData';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const totalGainers = topGainersData.length;
    const totalLosers = topLosersData.length;

    const avgGain = totalGainers > 0
      ? topGainersData.reduce((sum, stock) => sum + stock.percentInChange, 0) / totalGainers
      : 0;

    const avgLoss = totalLosers > 0
      ? topLosersData.reduce((sum, stock) => sum + stock.percentInChange, 0) / totalLosers
      : 0;

    const topGainer = topGainersData[0];
    const topLoser = topLosersData[0];

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalGainers,
          totalLosers,
          avgGain: parseFloat(avgGain.toFixed(2)),
          avgLoss: parseFloat(avgLoss.toFixed(2)),
          topGainer,
          topLoser,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
