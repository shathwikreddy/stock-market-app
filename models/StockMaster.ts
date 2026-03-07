import mongoose, { Schema, models, Document } from 'mongoose';

export interface IStockMaster extends Document {
  securityId: number;
  tradingSymbol: string;
  displayName: string;
  exchange: string;
  exchangeSegment: string;
  series: string;
  instrumentType: string;
  isin: string;
  faceValue: number;
  refreshedAt: Date;
}

const StockMasterSchema = new Schema<IStockMaster>(
  {
    securityId: { type: Number, required: true },
    tradingSymbol: { type: String, required: true },
    displayName: { type: String, required: true },
    exchange: { type: String, enum: ['NSE', 'BSE'], required: true },
    exchangeSegment: { type: String, enum: ['NSE_EQ', 'BSE_EQ'], required: true },
    series: { type: String, default: '' },
    instrumentType: { type: String, default: 'ES' },
    isin: { type: String, default: '' },
    faceValue: { type: Number, default: 1 },
    refreshedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

StockMasterSchema.index({ securityId: 1, exchange: 1 }, { unique: true });
StockMasterSchema.index({ exchange: 1 });
StockMasterSchema.index({ isin: 1 });

const StockMaster =
  models.StockMaster || mongoose.model<IStockMaster>('StockMaster', StockMasterSchema);

export default StockMaster;
