import mongoose, { Schema, models } from 'mongoose';

export interface IWatchlistStock {
  sNo: number;
  date: Date;
  sourceFrom: string;
  segments: string;
  tradingSymbol: string;
  sector: string;
  industry: string;
  ltp: number;
  entryPrice: number;
  stopLoss: number;
  target: number;
  redFlags: string;
  note: string;
  addedAt: Date;
}

export interface IWatchlist {
  userId: string;
  name: string;
  stocks: IWatchlistStock[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistStockSchema = new Schema({
  sNo: Number,
  date: { type: Date, default: Date.now },
  sourceFrom: String,
  segments: String,
  tradingSymbol: String,
  sector: String,
  industry: String,
  ltp: Number,
  entryPrice: Number,
  stopLoss: Number,
  target: Number,
  redFlags: String,
  note: String,
  addedAt: { type: Date, default: Date.now },
});

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: 'My Watchlist',
    },
    stocks: [WatchlistStockSchema],
  },
  {
    timestamps: true,
  }
);

const Watchlist = models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);

export default Watchlist;
