import { NextResponse } from 'next/server';
import { topGainersData, topLosersData } from '@/lib/mockData';
import { getUserIdFromToken } from '@/lib/auth';
import { handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    // Verify authentication
    await getUserIdFromToken();

    const totalGainers = topGainersData.length;
    const totalLosers = topLosersData.length;

    const avgGain =
      totalGainers > 0
        ? topGainersData.reduce((sum, stock) => sum + stock.percentInChange, 0) / totalGainers
        : 0;

    const avgLoss =
      totalLosers > 0
        ? topLosersData.reduce((sum, stock) => sum + stock.percentInChange, 0) / totalLosers
        : 0;

    const topGainer = topGainersData[0] || null;
    const topLoser = topLosersData[0] || null;

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
  } catch (error) {
    return handleApiError(error);
  }
}
