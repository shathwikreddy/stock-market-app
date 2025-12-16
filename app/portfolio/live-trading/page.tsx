'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

interface Trade {
  sNo: number;
  date: string;
  time: string;
  instrument: string;
  tradingSymbol: string;
  sector: string;
  industry: string;
  quantity: number;
  entryPrice: number;
  stopLoss: number;
  target: number;
  exit: number;
  pnl: number;
  pnlPercent: number;
}

const dummyTrades: Trade[] = [
  {
    sNo: 1,
    date: '2024-12-16',
    time: '09:30:00',
    instrument: 'EQUITY',
    tradingSymbol: 'RELIANCE',
    sector: 'Energy',
    industry: 'Oil & Gas',
    quantity: 50,
    entryPrice: 2456.50,
    stopLoss: 2400.00,
    target: 2550.00,
    exit: 2520.75,
    pnl: 3212.50,
    pnlPercent: 2.62,
  },
  {
    sNo: 2,
    date: '2024-12-15',
    time: '10:15:00',
    instrument: 'EQUITY',
    tradingSymbol: 'TCS',
    sector: 'Technology',
    industry: 'IT Services',
    quantity: 25,
    entryPrice: 3890.00,
    stopLoss: 3800.00,
    target: 4000.00,
    exit: 3975.50,
    pnl: 2137.50,
    pnlPercent: 2.20,
  },
  {
    sNo: 3,
    date: '2024-12-14',
    time: '11:00:00',
    instrument: 'EQUITY',
    tradingSymbol: 'HDFCBANK',
    sector: 'Financial',
    industry: 'Banking',
    quantity: 40,
    entryPrice: 1675.25,
    stopLoss: 1640.00,
    target: 1720.00,
    exit: 1650.00,
    pnl: -1010.00,
    pnlPercent: -1.51,
  },
  {
    sNo: 4,
    date: '2024-12-13',
    time: '09:45:00',
    instrument: 'EQUITY',
    tradingSymbol: 'INFY',
    sector: 'Technology',
    industry: 'IT Services',
    quantity: 60,
    entryPrice: 1490.00,
    stopLoss: 1450.00,
    target: 1550.00,
    exit: 1545.25,
    pnl: 3315.00,
    pnlPercent: 3.71,
  },
  {
    sNo: 5,
    date: '2024-12-12',
    time: '14:30:00',
    instrument: 'EQUITY',
    tradingSymbol: 'ICICIBANK',
    sector: 'Financial',
    industry: 'Banking',
    quantity: 75,
    entryPrice: 1025.50,
    stopLoss: 1000.00,
    target: 1080.00,
    exit: 1068.75,
    pnl: 3243.75,
    pnlPercent: 4.22,
  },
];

export default function LiveTradingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const totalPnL = dummyTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalInvestment = dummyTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);
  const totalPnLPercent = (totalPnL / totalInvestment) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Live Trading
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Real trading portfolio with actual market positions
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-background border border-border rounded-2xl shadow-luxury overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">S.No</th>
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">Date</th>
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">Time</th>
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">Instrument</th>
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">Symbol</th>
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">Sector</th>
                  <th className="px-2 py-2 text-left text-[10px] font-bold text-foreground uppercase tracking-wider">Industry</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">Qty</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">Entry</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">SL</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">Target</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">Exit</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">P&L</th>
                  <th className="px-2 py-2 text-right text-[10px] font-bold text-foreground uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody>
                {dummyTrades.map((trade) => (
                  <motion.tr
                    key={trade.sNo}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-2 py-1.5 text-xs text-foreground">{trade.sNo}</td>
                    <td className="px-2 py-1.5 text-xs text-foreground">{trade.date}</td>
                    <td className="px-2 py-1.5 text-xs text-foreground">{trade.time}</td>
                    <td className="px-2 py-1.5 text-xs text-foreground">{trade.instrument}</td>
                    <td className="px-2 py-1.5 text-xs font-medium text-foreground">{trade.tradingSymbol}</td>
                    <td className="px-2 py-1.5 text-xs text-muted-foreground">{trade.sector}</td>
                    <td className="px-2 py-1.5 text-xs text-muted-foreground">{trade.industry}</td>
                    <td className="px-2 py-1.5 text-xs text-right text-foreground">{trade.quantity}</td>
                    <td className="px-2 py-1.5 text-xs text-right text-foreground">₹{trade.entryPrice.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-xs text-right text-red-500">₹{trade.stopLoss.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-xs text-right text-green-500">₹{trade.target.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-xs text-right text-foreground">₹{trade.exit.toFixed(2)}</td>
                    <td className={`px-2 py-1.5 text-xs text-right font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="inline-flex items-center gap-0.5">
                        {trade.pnl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        ₹{Math.abs(trade.pnl).toFixed(2)}
                      </span>
                    </td>
                    <td className={`px-2 py-1.5 text-xs text-right font-medium ${trade.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-secondary/70 border-t-2 border-border">
                  <td colSpan={12} className="px-2 py-2 text-xs font-bold text-foreground text-right">Total</td>
                  <td className={`px-2 py-2 text-xs text-right font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="inline-flex items-center gap-0.5">
                      {totalPnL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      ₹{Math.abs(totalPnL).toFixed(2)}
                    </span>
                  </td>
                  <td className={`px-2 py-2 text-xs text-right font-bold ${totalPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
