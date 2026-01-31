import mongoose, { Schema, models, Document } from 'mongoose';

export interface IStrategy {
  name: string;
  allocationPercent: number;
  allocationRupees: number;
  usedFunds: number;
  unusedFunds: number;
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  marketCondition: 'Bull Market' | 'Bullish to Bearish' | 'Side Ways Market' | 'Bear Market' | 'Bearish to Bullish';
  strategies: IStrategy[];
  createdAt: Date;
  updatedAt: Date;
}

const StrategySchema = new Schema<IStrategy>({
  name: { type: String, required: true },
  allocationPercent: { type: Number, default: 0 },
  allocationRupees: { type: Number, default: 0 },
  usedFunds: { type: Number, default: 0 },
  unusedFunds: { type: Number, default: 0 },
});

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    marketCondition: {
      type: String,
      required: true,
      enum: ['Bull Market', 'Bullish to Bearish', 'Side Ways Market', 'Bear Market', 'Bearish to Bullish'],
    },
    strategies: [StrategySchema],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one portfolio per market condition per user
PortfolioSchema.index({ userId: 1, marketCondition: 1 }, { unique: true });

const Portfolio = models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
