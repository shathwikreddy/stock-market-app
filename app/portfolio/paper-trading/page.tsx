'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
        time: '09:35:00',
        instrument: 'EQUITY',
        tradingSymbol: 'TATAMOTORS',
        sector: 'Automobile',
        industry: 'Auto Manufacturers',
        quantity: 100,
        entryPrice: 785.50,
        stopLoss: 770.00,
        target: 820.00,
        exit: 812.25,
        pnl: 2675.00,
        pnlPercent: 3.41,
    },
    {
        sNo: 2,
        date: '2024-12-15',
        time: '10:00:00',
        instrument: 'EQUITY',
        tradingSymbol: 'WIPRO',
        sector: 'Technology',
        industry: 'IT Services',
        quantity: 80,
        entryPrice: 465.75,
        stopLoss: 450.00,
        target: 490.00,
        exit: 488.50,
        pnl: 1820.00,
        pnlPercent: 4.88,
    },
    {
        sNo: 3,
        date: '2024-12-14',
        time: '11:30:00',
        instrument: 'EQUITY',
        tradingSymbol: 'SBIN',
        sector: 'Financial',
        industry: 'Banking',
        quantity: 120,
        entryPrice: 628.00,
        stopLoss: 610.00,
        target: 660.00,
        exit: 615.50,
        pnl: -1500.00,
        pnlPercent: -1.99,
    },
    {
        sNo: 4,
        date: '2024-12-13',
        time: '13:15:00',
        instrument: 'EQUITY',
        tradingSymbol: 'BHARTIARTL',
        sector: 'Telecom',
        industry: 'Telecommunications',
        quantity: 45,
        entryPrice: 1540.00,
        stopLoss: 1500.00,
        target: 1600.00,
        exit: 1595.75,
        pnl: 2508.75,
        pnlPercent: 3.62,
    },
    {
        sNo: 5,
        date: '2024-12-12',
        time: '15:00:00',
        instrument: 'EQUITY',
        tradingSymbol: 'MARUTI',
        sector: 'Automobile',
        industry: 'Auto Manufacturers',
        quantity: 10,
        entryPrice: 11250.00,
        stopLoss: 11000.00,
        target: 11600.00,
        exit: 11580.00,
        pnl: 3300.00,
        pnlPercent: 2.93,
    },
    {
        sNo: 6,
        date: '2024-12-11',
        time: '09:50:00',
        instrument: 'EQUITY',
        tradingSymbol: 'SUNPHARMA',
        sector: 'Healthcare',
        industry: 'Pharmaceuticals',
        quantity: 55,
        entryPrice: 1180.25,
        stopLoss: 1150.00,
        target: 1230.00,
        exit: 1225.50,
        pnl: 2488.75,
        pnlPercent: 3.84,
    },
];

export default function PaperTradingPage() {
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
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <FileText className="w-7 h-7 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                                Paper Trading
                            </h1>
                            <p className="text-lg text-muted-foreground mt-1">
                                Practice trading with simulated positions
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
