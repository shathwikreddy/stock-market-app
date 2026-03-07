import mongoose, { Schema, models, Document } from 'mongoose';

export interface IHistoricalPrice extends Document {
  securityId: number;
  exchangeSegment: string;
  closes: number[];
  timestamps: number[];
  lastDate: string; // YYYY-MM-DD of the most recent data point
}

const HistoricalPriceSchema = new Schema<IHistoricalPrice>(
  {
    securityId: { type: Number, required: true },
    exchangeSegment: { type: String, required: true },
    closes: { type: [Number], default: [] },
    timestamps: { type: [Number], default: [] },
    lastDate: { type: String, default: '' },
  },
  { timestamps: true }
);

HistoricalPriceSchema.index({ securityId: 1, exchangeSegment: 1 }, { unique: true });
HistoricalPriceSchema.index({ exchangeSegment: 1 });

const HistoricalPrice =
  models.HistoricalPrice ||
  mongoose.model<IHistoricalPrice>('HistoricalPrice', HistoricalPriceSchema);

export default HistoricalPrice;
