'use client';

import { Stock } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface StockTableProps {
  stocks: Stock[];
  type: 'gainers' | 'losers';
  onAddToWatchlist?: (stock: Stock) => void;
}

export default function StockTable({ stocks, type, onAddToWatchlist }: StockTableProps) {
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-luxury">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sector
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Group
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Price Band
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Mkt Cap
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pre Close
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                LTP
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Net Change
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                % Change
              </th>
              {onAddToWatchlist && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stocks.map((stock, index) => (
              <motion.tr
                key={stock.sNo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-secondary/50 transition-colors group"
              >
                <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                  {stock.sNo}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {stock.company}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {stock.sector}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {stock.industry}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary border border-border text-foreground">
                      {stock.group}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                  {stock.priceBand}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                  {stock.mktCapital}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground text-right font-mono">
                  ₹{stock.preClose.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground text-right font-mono">
                  ₹{stock.ltp.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-mono">
                  <span
                    className={`font-semibold ${
                      stock.netChange >= 0 ? 'text-success' : 'text-error'
                    }`}
                  >
                    {stock.netChange >= 0 ? '+' : ''}₹{stock.netChange.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold font-mono ${
                        stock.percentInChange >= 0
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {stock.percentInChange >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 mr-1" />
                      )}
                      {stock.percentInChange >= 0 ? '+' : ''}
                      {stock.percentInChange.toFixed(2)}%
                    </span>
                  </div>
                </td>
                {onAddToWatchlist && (
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onAddToWatchlist(stock)}
                      className="inline-flex items-center px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add
                    </button>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
