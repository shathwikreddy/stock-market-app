import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Watchlist, { IWatchlistStock } from '@/models/Watchlist';
import { getUserIdFromToken } from '@/lib/auth';
import {
  handleApiError,
  badRequest,
  notFound,
} from '@/lib/api-response';
import {
  validateRequest,
  addStockSchema,
  removeStockSchema,
} from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = await Watchlist.create({ userId, stocks: [] });
    }

    return NextResponse.json({
      success: true,
      watchlist,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    const stockData = await validateRequest(request, addStockSchema);

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId,
        stocks: [{ ...stockData, addedAt: new Date() }],
      });
    } else {
      const exists = watchlist.stocks.some(
        (stock: IWatchlistStock) =>
          stock.tradingSymbol === stockData.tradingSymbol &&
          stock.category === stockData.category
      );

      if (exists) {
        return badRequest('Stock already in this watchlist category');
      }

      watchlist.stocks.push({ ...stockData, addedAt: new Date() } as IWatchlistStock);
      await watchlist.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Stock added to watchlist',
      watchlist,
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

    const { stockId } = await validateRequest(request, removeStockSchema);

    const watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      return notFound('Watchlist not found');
    }

    const stockIndex = watchlist.stocks.findIndex(
      (stock: IWatchlistStock) => stock._id?.toString() === stockId
    );

    if (stockIndex === -1) {
      return notFound('Stock not found in watchlist');
    }

    watchlist.stocks.splice(stockIndex, 1);
    await watchlist.save();

    return NextResponse.json({
      success: true,
      message: 'Stock removed from watchlist',
      watchlist,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return handleApiError(error);
  }
}
