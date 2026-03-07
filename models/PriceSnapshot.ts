import mongoose, { Schema, models } from 'mongoose';

const PriceSnapshotSchema = new Schema(
  {
    timestamp: { type: Date, required: true, index: true },
    // securityId (as string key) → last_price
    prices: { type: Map, of: Number, required: true },
  },
  { timestamps: false }
);

// Auto-delete snapshots older than 3 hours
PriceSnapshotSchema.index({ timestamp: 1 }, { expireAfterSeconds: 10800 });

const PriceSnapshot =
  models.PriceSnapshot ||
  mongoose.model('PriceSnapshot', PriceSnapshotSchema);

export default PriceSnapshot;
