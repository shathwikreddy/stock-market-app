'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
  slTsl: number;
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
    slTsl: 2400.00,
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
    slTsl: 3800.00,
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
    slTsl: 1640.00,
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
    slTsl: 1450.00,
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
    slTsl: 1000.00,
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">
                Real Trading Live
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Real trading portfolio with actual market positions
              </p>
            </div>
          </div>
        </div>

        <div className="border border-black rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">S No</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Time</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Instrument</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Trading Symbol</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Sector</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Industry</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Quantity</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Entry Price</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">
                    <span className="text-black">SL / </span>
                    <span className="text-red-600">TSL</span>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Target</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">Exit</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider border-r border-gray-300">P&L</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-black uppercase tracking-wider">% in P&L</th>
                </tr>
              </thead>
              <tbody>
                {dummyTrades.map((trade) => (
                  <tr
                    key={trade.sNo}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 text-sm text-black border-r border-gray-200">{trade.sNo}</td>
                    <td className="px-3 py-2 text-sm text-black border-r border-gray-200">{trade.date}</td>
                    <td className="px-3 py-2 text-sm text-black border-r border-gray-200">{trade.time}</td>
                    <td className="px-3 py-2 text-sm text-black border-r border-gray-200">{trade.instrument}</td>
                    <td className="px-3 py-2 text-sm font-medium text-black border-r border-gray-200">{trade.tradingSymbol}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-r border-gray-200">{trade.sector}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-r border-gray-200">{trade.industry}</td>
                    <td className="px-3 py-2 text-sm text-right text-black border-r border-gray-200">{trade.quantity}</td>
                    <td className="px-3 py-2 text-sm text-right text-black border-r border-gray-200">₹{trade.entryPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right text-red-600 border-r border-gray-200">₹{trade.slTsl.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right text-black border-r border-gray-200">₹{trade.target.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right text-black border-r border-gray-200">₹{trade.exit.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-sm text-right font-medium border-r border-gray-200 ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="inline-flex items-center gap-0.5">
                        {trade.pnl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        ₹{Math.abs(trade.pnl).toFixed(2)}
                      </span>
                    </td>
                    <td className={`px-3 py-2 text-sm text-right font-medium ${trade.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 border-t-2 border-black">
                  <td colSpan={12} className="px-3 py-3 text-sm font-bold text-black text-right border-r border-gray-200">Total</td>
                  <td className={`px-3 py-3 text-sm text-right font-bold border-r border-gray-200 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="inline-flex items-center gap-0.5">
                      {totalPnL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      ₹{Math.abs(totalPnL).toFixed(2)}
                    </span>
                  </td>
                  <td className={`px-3 py-3 text-sm text-right font-bold ${totalPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
