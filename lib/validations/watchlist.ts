import { z } from 'zod';

export const watchlistCategories = [
  'intraday',
  'fno',
  'swing',
  'positional',
  'multibagger',
] as const;

export const watchlistCategorySchema = z.enum(watchlistCategories);

export const watchlistStockSchema = z.object({
  sNo: z.number().int().positive(),
  date: z.coerce.date(),
  sourceFrom: z.string().min(1, 'Source is required'),
  segments: z.string().min(1, 'Segment is required'),
  tradingSymbol: z.string().min(1, 'Trading symbol is required'),
  sector: z.string().min(1, 'Sector is required'),
  industry: z.string().min(1, 'Industry is required'),
  ltp: z.number().min(0, 'LTP must be non-negative'),
  entryPrice: z.number().min(0, 'Entry price must be non-negative'),
  stopLoss: z.number().min(0, 'Stop loss must be non-negative'),
  target: z.number().min(0, 'Target must be non-negative'),
  redFlags: z.string().default(''),
  note: z.string().default(''),
  category: watchlistCategorySchema,
});

export const addStockSchema = watchlistStockSchema;

export const removeStockSchema = z.object({
  stockId: z.string().min(1, 'Stock ID is required'),
});

export const updateStockSchema = watchlistStockSchema.partial().extend({
  stockId: z.string().min(1, 'Stock ID is required'),
});

export type WatchlistCategory = z.infer<typeof watchlistCategorySchema>;
export type WatchlistStockInput = z.infer<typeof watchlistStockSchema>;
export type AddStockInput = z.infer<typeof addStockSchema>;
export type RemoveStockInput = z.infer<typeof removeStockSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
