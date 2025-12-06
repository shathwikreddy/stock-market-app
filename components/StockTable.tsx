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
    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-luxury">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Company
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sector
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Industry
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Group
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Price Band
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Mkt Cap
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pre Close
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                LTP
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Net Change
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                % Change
              </th>
              {onAddToWatchlist && (
                <th className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                transition={{ delay: index * 0.02 }}
                className="hover:bg-secondary/50 transition-colors group"
              >
                <td className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                  {stock.sNo}
                </td>
                <td className="px-2 py-1.5">
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {stock.company}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-xs text-muted-foreground">
                  {stock.sector}
                </td>
                <td className="px-2 py-1.5 text-xs text-muted-foreground">
                  {stock.industry}
                </td>
                <td className="px-2 py-1.5">
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-secondary border border-border text-foreground">
                      {stock.group}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-xs font-semibold whitespace-nowrap">
                  <span className={stock.netChange >= 0 ? 'text-success' : 'text-error'}>
                    {stock.priceBand}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-xs text-muted-foreground whitespace-nowrap">
                  {stock.mktCapital}
                </td>
                <td className="px-2 py-1.5 text-xs text-muted-foreground text-right font-mono">
                  ₹{stock.preClose.toFixed(2)}
                </td>
                <td className="px-2 py-1.5 text-xs font-semibold text-foreground text-right font-mono">
                  ₹{stock.ltp.toFixed(2)}
                </td>
                <td className="px-2 py-1.5 text-xs text-right font-mono">
                  <span
                    className={`font-semibold ${stock.netChange >= 0 ? 'text-success' : 'text-error'
                      }`}
                  >
                    {stock.netChange >= 0 ? '+' : ''}₹{stock.netChange.toFixed(2)}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <div className="flex items-center justify-end">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono ${stock.percentInChange >= 0
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                        }`}
                    >
                      {stock.percentInChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                      )}
                      {stock.percentInChange >= 0 ? '+' : ''}
                      {stock.percentInChange.toFixed(2)}%
                    </span>
                  </div>
                </td>
                {onAddToWatchlist && (
                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={() => onAddToWatchlist(stock)}
                      className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-all"
                    >
                      <Plus className="w-3 h-3 mr-0.5" />
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
