import { NextResponse } from 'next/server';
import { topLosersData } from '@/lib/mockData';
import { getUserIdFromToken } from '@/lib/auth';
import { handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    // Verify authentication
    await getUserIdFromToken();

    return NextResponse.json(
      {
        success: true,
        message: 'Top losers fetched successfully',
        count: topLosersData.length,
        data: topLosersData,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
