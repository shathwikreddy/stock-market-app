'use client';

import { useState } from 'react';
import { Eye, Trash2, Plus, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface WatchlistStock {
  sNo: number;
  date: string;
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
}

// Dummy data matching the spreadsheet columns
const dummyStocks: WatchlistStock[] = [
  {
    sNo: 1,
    date: '2024-12-10',
    sourceFrom: 'Screener',
    segments: 'NSE',
    tradingSymbol: 'RELIANCE',
    sector: 'Energy',
    industry: 'Oil & Gas Refining',
    ltp: 2456.75,
    entryPrice: 2400.00,
    stopLoss: 2350.00,
    target: 2600.00,
    redFlags: 'None',
    note: 'Strong momentum play',
  },
  {
    sNo: 2,
    date: '2024-12-09',
    sourceFrom: 'Twitter',
    segments: 'BSE',
    tradingSymbol: 'TCS',
    sector: 'Technology',
    industry: 'IT Services',
    ltp: 3825.50,
    entryPrice: 3750.00,
    stopLoss: 3650.00,
    target: 4000.00,
    redFlags: 'High PE',
    note: 'Quarterly results due',
  },
  {
    sNo: 3,
    date: '2024-12-08',
    sourceFrom: 'News',
    segments: 'NSE',
    tradingSymbol: 'HDFCBANK',
    sector: 'Financial Services',
    industry: 'Banking',
    ltp: 1678.30,
    entryPrice: 1650.00,
    stopLoss: 1600.00,
    target: 1800.00,
    redFlags: 'None',
    note: 'Breakout above resistance',
  },
  {
    sNo: 4,
    date: '2024-12-07',
    sourceFrom: 'Research Report',
    segments: 'NSE',
    tradingSymbol: 'INFY',
    sector: 'Technology',
    industry: 'IT Services',
    ltp: 1845.20,
    entryPrice: 1800.00,
    stopLoss: 1750.00,
    target: 1950.00,
    redFlags: 'Weak guidance',
    note: 'Support level trade',
  },
  {
    sNo: 5,
    date: '2024-12-06',
    sourceFrom: 'Telegram',
    segments: 'BSE',
    tradingSymbol: 'TATAMOTORS',
    sector: 'Automobile',
    industry: 'Passenger Cars',
    ltp: 785.60,
    entryPrice: 750.00,
    stopLoss: 720.00,
    target: 850.00,
    redFlags: 'High debt',
    note: 'EV growth story',
  },
];

export default function WatchlistPage() {
  const [stocks] = useState<WatchlistStock[]>(dummyStocks);
  const [watchlistName] = useState('My Watchlist');

  const handleRemove = (sNo: number) => {
    console.log('Remove stock:', sNo);
  };

  const handleEdit = (sNo: number) => {
    console.log('Edit stock:', sNo);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  {watchlistName}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Track your favorite stocks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {stocks.length > 0 && (
                <div className="hidden md:block">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground text-2xl">{stocks.length}</span>
                    <span className="ml-2">stocks tracked</span>
                  </p>
                </div>
              )}
              <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                <Plus className="h-5 w-5 mr-2" />
                Add Stock
              </button>
            </div>
          </div>
        </motion.div>

        {/* Watchlist Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background border border-border rounded-2xl shadow-luxury overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">S No</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source From</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Segments</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trading Symbol</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">LTP</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entry Price</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stop Loss</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Red Flags</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Note</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stocks.map((stock, index) => {
                  const profitPercent = ((stock.target - stock.entryPrice) / stock.entryPrice * 100).toFixed(1);
                  const riskPercent = ((stock.entryPrice - stock.stopLoss) / stock.entryPrice * 100).toFixed(1);

                  return (
                    <motion.tr
                      key={stock.sNo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-foreground">{stock.sNo}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{stock.date}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{stock.sourceFrom}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${stock.segments === 'NSE'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                          {stock.segments}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground">{stock.tradingSymbol}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{stock.sector}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{stock.industry}</td>
                      <td className="px-4 py-4 text-sm font-mono text-right font-semibold text-foreground">₹{stock.ltp.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm font-mono text-right text-muted-foreground">₹{stock.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm font-mono text-right">
                        <span className="text-error">₹{stock.stopLoss.toFixed(2)}</span>
                        <span className="block text-xs text-error/60">-{riskPercent}%</span>
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-right">
                        <span className="text-success">₹{stock.target.toFixed(2)}</span>
                        <span className="block text-xs text-success/60">+{profitPercent}%</span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {stock.redFlags !== 'None' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-lg bg-warning/10 text-warning">
                            {stock.redFlags}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={stock.note}>
                        {stock.note}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(stock.sNo)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemove(stock.sNo)}
                            className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

