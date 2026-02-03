import mongoose, { Schema, models, Document } from 'mongoose';

export type WatchlistCategory = 'intraday' | 'fno' | 'swing' | 'positional' | 'multibagger';

export interface IWatchlistStock {
  _id?: mongoose.Types.ObjectId;
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
  category: WatchlistCategory;
  addedAt: Date;
}

export interface IWatchlist extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  stocks: IWatchlistStock[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistStockSchema = new Schema<IWatchlistStock>({
  sNo: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  sourceFrom: { type: String, required: true },
  segments: { type: String, required: true },
  tradingSymbol: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  ltp: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  stopLoss: { type: Number, required: true },
  target: { type: Number, required: true },
  redFlags: { type: String, default: '' },
  note: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['intraday', 'fno', 'swing', 'positional', 'multibagger'],
  },
  addedAt: { type: Date, default: Date.now },
});

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
