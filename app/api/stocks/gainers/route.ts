import { NextResponse } from 'next/server';
import { topGainersData } from '@/lib/mockData';
import { getUserIdFromToken } from '@/lib/auth';
import { handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    // Verify authentication
    await getUserIdFromToken();

    return NextResponse.json(
      {
        success: true,
        message: 'Top gainers fetched successfully',
        count: topGainersData.length,
        data: topGainersData,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
