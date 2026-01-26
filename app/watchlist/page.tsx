'use client';

import { useState } from 'react';
import { Eye, Trash2, Plus, Edit2, TrendingUp, Clock, Activity, BarChart2, Zap } from 'lucide-react';
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

const intradayStocks: WatchlistStock[] = [
  {
    sNo: 1,
    date: '2024-12-19',
    sourceFrom: 'Screener',
    segments: 'NSE',
    tradingSymbol: 'TATAMOTORS',
    sector: 'Automobile',
    industry: 'Auto Manufacturers',
    ltp: 785.50,
    entryPrice: 780.00,
    stopLoss: 770.00,
    target: 800.00,
    redFlags: 'None',
    note: 'Breakout pending',
  },
];

const fnoStocks: WatchlistStock[] = [
  {
    sNo: 1,
    date: '2024-12-19',
    sourceFrom: 'Chart',
    segments: 'F&O',
    tradingSymbol: 'NIFTY 21500 CE',
    sector: 'Index',
    industry: 'Indices',
    ltp: 145.00,
    entryPrice: 140.00,
    stopLoss: 120.00,
    target: 180.00,
    redFlags: 'High VIX',
    note: 'Intraday momentum',
  },
];

const swingStocks: WatchlistStock[] = [
  {
    sNo: 1,
    date: '2024-12-15',
    sourceFrom: 'Research',
    segments: 'NSE',
    tradingSymbol: 'HDFCBANK',
    sector: 'Financial',
    industry: 'Banking',
    ltp: 1650.00,
    entryPrice: 1640.00,
    stopLoss: 1580.00,
    target: 1800.00,
    redFlags: 'None',
    note: 'Support bounce',
  },
];

const positionalStocks: WatchlistStock[] = [
  {
    sNo: 1,
    date: '2024-11-20',
    sourceFrom: 'News',
    segments: 'BSE',
    tradingSymbol: 'ITC',
    sector: 'FMCG',
    industry: 'Tobacco',
    ltp: 450.00,
    entryPrice: 440.00,
    stopLoss: 400.00,
    target: 520.00,
    redFlags: 'None',
    note: 'Long term hold',
  },
];

const multiBaggerStocks: WatchlistStock[] = [
  {
    sNo: 1,
    date: '2024-10-10',
    sourceFrom: 'Analysis',
    segments: 'NSE',
    tradingSymbol: 'ZOMATO',
    sector: 'Tech',
    industry: 'Internet',
    ltp: 125.00,
    entryPrice: 100.00,
    stopLoss: 80.00,
    target: 300.00,
    redFlags: 'High Valuation',
    note: 'Growth story',
  },
];

type WatchlistCategory = 'intraday' | 'fno' | 'swing' | 'positional' | 'multibagger';

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<WatchlistCategory>('intraday');

  const getActiveData = () => {
    switch (activeTab) {
      case 'intraday': return intradayStocks;
      case 'fno': return fnoStocks;
      case 'swing': return swingStocks;
      case 'positional': return positionalStocks;
      case 'multibagger': return multiBaggerStocks;
      default: return intradayStocks;
    }
  };

  const stocks = getActiveData();

  const handleRemove = (sNo: number) => {
    console.log('Remove stock:', sNo);
  };

  const handleEdit = (sNo: number) => {
    console.log('Edit stock:', sNo);
  };

  const tabs = [
    { id: 'intraday', label: 'Intraday Trading', icon: Clock },
    { id: 'fno', label: 'F&O Trading', icon: TrendingUp },
    { id: 'swing', label: 'Swing Trading', icon: Activity },
    { id: 'positional', label: 'Positional Trading', icon: BarChart2 },
    { id: 'multibagger', label: 'Multi Bagger Stocks', icon: Zap, isSpecial: true },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  My Watchlist
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Track your favorite stocks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                <Plus className="h-5 w-5 mr-2" />
                Add Stock
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 bg-background p-1 w-full md:w-fit overflow-x-auto mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isSpecial = tab.isSpecial;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as WatchlistCategory)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? isSpecial 
                        ? 'bg-red-500 text-white shadow-md scale-105' 
                        : 'bg-primary text-primary-foreground shadow-md scale-105'
                      : isSpecial
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Watchlist Table */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background border border-border rounded-2xl shadow-luxury overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border bg-muted/5 flex items-center justify-between">
              <h2 className={`text-lg font-semibold capitalize flex items-center gap-2 ${activeTab === 'multibagger' ? 'text-red-500' : 'text-foreground'}`}>
                  {activeTab === 'multibagger' && <Zap className="w-5 h-5 fill-current" />}
                  {tabs.find(t => t.id === activeTab)?.label} Watchlist
              </h2>
              <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{stocks.length}</span> stocks
              </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">S No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source From</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Segments</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trading Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">LTP</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entry Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stop Loss</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Red Flags</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Note</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stocks.map((stock, index) => {
                  return (
                    <motion.tr
                      key={stock.sNo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/5 transition-colors group"
                    >
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{stock.sNo}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{stock.date}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{stock.sourceFrom}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${
                          stock.segments === 'NSE'
                            ? 'bg-blue-500/10 text-blue-600'
                            : stock.segments === 'BSE'
                            ? 'bg-purple-500/10 text-purple-600'
                            : 'bg-orange-500/10 text-orange-600'
                          }`}>
                          {stock.segments}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-foreground">{stock.tradingSymbol}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{stock.sector}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{stock.industry}</td>
                      <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">₹{stock.ltp.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-muted-foreground">₹{stock.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-error">₹{stock.stopLoss.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-success">₹{stock.target.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs">
                        {stock.redFlags !== 'None' ? (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded bg-error/10 text-error">
                            {stock.redFlags}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px] truncate" title={stock.note}>
                        {stock.note}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(stock.sNo)}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemove(stock.sNo)}
                            className="p-1.5 text-muted-foreground hover:text-error hover:bg-error/10 rounded-md transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {stocks.length === 0 && (
                    <tr>
                        <td colSpan={14} className="px-6 py-12 text-center text-muted-foreground">
                            No stocks found in this watchlist.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
