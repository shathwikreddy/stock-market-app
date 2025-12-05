import mongoose, { Schema, models } from 'mongoose';

export interface IWatchlistStock {
  sNo: number;
  company: string;
  sector: string;
  industry: string;
  group: string;
  priceBand: string;
  mktCapital: string;
  preClose: number;
  ltp: number;
  netChange: number;
  percentInChange: number;
  addedAt: Date;
}

export interface IWatchlist {
  userId: string;
  stocks: IWatchlistStock[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistStockSchema = new Schema({
  sNo: Number,
  company: String,
  sector: String,
  industry: String,
  group: String,
  priceBand: String,
  mktCapital: String,
  preClose: Number,
  ltp: Number,
  netChange: Number,
  percentInChange: Number,
  addedAt: { type: Date, default: Date.now },
});

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    stocks: [WatchlistStockSchema],
  },
  {
    timestamps: true,
  }
);

const Watchlist = models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);

export default Watchlist;
