/**
 * GET /api/market/filters
 *
 * Returns distinct values for filter dropdowns (sectors, industries, etc.)
 * from the LiveQuote table. Cached per exchange.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const raw = request.nextUrl.searchParams.get('exchange') || 'NSE';
    const exchange = ['NSE', 'BSE', 'Both', 'Only NSE', 'Only BSE'].includes(raw) ? raw : 'NSE';

    // Normalize "Only X" → "X"
    const dbExchange = exchange.replace('Only ', '');
    const cond = dbExchange === 'Both' ? 'TRUE' : `exchange = '${dbExchange}'`;

    const [sectors, industries, marketCaps, priceBands, seriesVals] = await Promise.all([
      prisma.$queryRawUnsafe<{ v: string }[]>(
        `SELECT DISTINCT sector AS v FROM "LiveQuote" WHERE ${cond} AND sector != '-' ORDER BY sector`
      ),
      prisma.$queryRawUnsafe<{ v: string }[]>(
        `SELECT DISTINCT industry AS v FROM "LiveQuote" WHERE ${cond} AND industry != '-' ORDER BY industry`
      ),
      prisma.$queryRawUnsafe<{ v: string }[]>(
        `SELECT DISTINCT "marketCapLabel" AS v FROM "LiveQuote" WHERE ${cond} AND "marketCapLabel" != '-' ORDER BY "marketCapLabel"`
      ),
      prisma.$queryRawUnsafe<{ v: string }[]>(
        `SELECT DISTINCT "priceBand" AS v FROM "LiveQuote" WHERE ${cond} ORDER BY "priceBand"`
      ),
      prisma.$queryRawUnsafe<{ v: string }[]>(
        `SELECT DISTINCT series AS v FROM "LiveQuote" WHERE ${cond} AND series != '' ORDER BY series`
      ),
    ]);

    return NextResponse.json({
      sectors: sectors.map(r => r.v),
      industries: industries.map(r => r.v),
      marketCaps: marketCaps.map(r => r.v),
      priceBands: priceBands.map(r => r.v),
      series: seriesVals.map(r => r.v),
    });
  } catch (error) {
    console.error('[API:market/filters] Error:', error);
    return NextResponse.json({ error: 'Failed to load filter options' }, { status: 500 });
  }
}
