'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Eye } from 'lucide-react';

const nseIndicesData = [
    { name: 'NIFTY 50', prevClose: 26033.75, current: 26186.45, change: 152.7, changePercent: 0.59 },
    { name: 'NIFTY IT', prevClose: 38360.25, current: 38703.65, change: 343.4, changePercent: 0.9 },
    { name: 'NIFTY NEXT 50', prevClose: 68560.8, current: 68709.85, change: 149.05, changePercent: 0.22 },
    { name: 'NIFTY BANK', prevClose: 59288.7, current: 59777.2, change: 488.5, changePercent: 0.82 },
    { name: 'NIFTY 500', prevClose: 23741.1, current: 23835.25, change: 94.15, changePercent: 0.4 },
    { name: 'NIFTY 100', prevClose: 26557.0, current: 26696.9, change: 139.9, changePercent: 0.53 },
    { name: 'NIFTY MIDCAP 50', prevClose: 17252.35, current: 17383.0, change: 130.65, changePercent: 0.76 },
    { name: 'NIFTY REALTY', prevClose: 890.1, current: 893.15, change: 3.05, changePercent: 0.34 },
    { name: 'NIFTY INFRA', prevClose: 9501.2, current: 9540.65, change: 39.45, changePercent: 0.42 },
    { name: 'INDIA VIX', prevClose: 10.8175, current: 10.315, change: -0.5, changePercent: -4.65 },
    { name: 'NIFTY ENERGY', prevClose: 34986.1, current: 34971.8, change: -14.3, changePercent: -0.04 },
    { name: 'NIFTY FMCG', prevClose: 55209.3, current: 55202.85, change: -6.45, changePercent: -0.01 },
    { name: 'NIFTY MNC', prevClose: 30260.75, current: 30196.3, change: -64.45, changePercent: -0.21 },
    { name: 'NIFTY PHARMA', prevClose: 22958.95, current: 22947.15, change: -11.8, changePercent: -0.05 },
    { name: 'NIFTY PSE', prevClose: 9643.2, current: 9652.25, change: 9.05, changePercent: 0.09 },
    { name: 'NIFTY PSU BANK', prevClose: 8256.7, current: 8381.75, change: 125.05, changePercent: 1.51 },
    { name: 'NIFTY SERV SECTOR', prevClose: 33846.2, current: 34093.3, change: 247.1, changePercent: 0.73 },
    { name: 'NIFTY AUTO', prevClose: 27732.7, current: 27939.1, change: 206.4, changePercent: 0.74 },
    { name: 'NIFTY MEDIA', prevClose: 1441.4, current: 1434.55, change: -6.85, changePercent: -0.48 },
    { name: 'NIFTY METAL', prevClose: 10271.45, current: 10340.35, change: 68.9, changePercent: 0.67 },
    { name: 'NIFTY 200', prevClose: 14466.4, current: 14541.65, change: 75.25, changePercent: 0.52 },
    { name: 'NIFTY COMMODITIES', prevClose: 9136.7, current: 9162.7, change: 26, changePercent: 0.28 },
    { name: 'NIFTY CONSUMPTION', prevClose: 12349.65, current: 12376.15, change: 26.5, changePercent: 0.21 },
    { name: 'NIFTY50 DIV POINT', prevClose: 248.7, current: 249.14, change: 0.44, changePercent: 0.18 },
    { name: 'NIFTY100 LIQ 15', prevClose: 7455.45, current: 7510.75, change: 55.3, changePercent: 0.74 },
    { name: 'NIFTY CPSE', prevClose: 6320.35, current: 6324.2, change: 3.85, changePercent: 0.06 },
    { name: 'NIFTY50 TR 2X LEV', prevClose: 21930.5, current: 22184.5, change: 254, changePercent: 1.16 },
    { name: 'NIFTY50 PR 2X LEV', prevClose: 14655.95, current: 14825.7, change: 169.75, changePercent: 1.16 },
    { name: 'NIFTY50 TR 1X INV', prevClose: 163.7, current: 162.75, change: -0.95, changePercent: -0.58 },
    { name: 'NIFTY50 PR 1X INV', prevClose: 200.1, current: 198.95, change: -1.15, changePercent: -0.57 },
    { name: 'NIFTY50 VALUE 20', prevClose: 13173.05, current: 13276.55, change: 103.5, changePercent: 0.79 },
    { name: 'NIFTY MID LIQ 15', prevClose: 16476.7, current: 16630.0, change: 153.3, changePercent: 0.93 },
    { name: 'NIFTY PVT BANK', prevClose: 28720.6, current: 28862.3, change: 141.7, changePercent: 0.49 },
    { name: 'NIFTY GS 8 13YR', prevClose: 2970.94, current: 2974.49, change: 3.55, changePercent: 0.12 },
    { name: 'NIFTY GS 10YR', prevClose: 2617.01, current: 2621.06, change: 4.05, changePercent: 0.15 },
    { name: 'NIFTY GS 10YR CLN', prevClose: 897.43, current: 898.68, change: 1.25, changePercent: 0.14 },
    { name: 'NIFTY GS 4 8YR', prevClose: 3218.83, current: 3226.19, change: 7.36, changePercent: 0.23 },
    { name: 'NIFTY GS 11 15YR', prevClose: 3242.86, current: 3256.65, change: 13.79, changePercent: 0.43 },
    { name: 'NIFTY GS 15YRPLUS', prevClose: 3438.59, current: 3458.74, change: 20.15, changePercent: 0.59 },
    { name: 'NIFTY GS COMPSITE', prevClose: 3046.06, current: 3053.58, change: 7.52, changePercent: 0.25 },
];

export default function NSEIndicesPage() {
    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                            <Activity className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">NSE Indices</h1>
                            <p className="text-sm text-muted-foreground">National Stock Exchange Index Performance</p>
                        </div>
                    </div>

                    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-luxury">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Index Name
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Prev Close
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Current
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Change
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            % Change
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {nseIndicesData.map((index, i) => (
                                        <motion.tr
                                            key={index.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="hover:bg-secondary/50 transition-colors group"
                                        >
                                            <td className="px-3 py-1.5">
                                                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {index.name}
                                                </div>
                                            </td>
                                            <td className="px-3 py-1.5 text-xs text-muted-foreground text-right font-mono">
                                                {index.prevClose.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-1.5 text-xs font-semibold text-foreground text-right font-mono">
                                                {index.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-1.5 text-xs text-right font-mono">
                                                <span className={`font-semibold ${index.change >= 0 ? 'text-success' : 'text-error'}`}>
                                                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-1.5 text-right">
                                                <div className="flex items-center justify-end">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono ${index.changePercent >= 0
                                                            ? 'bg-success/10 text-success'
                                                            : 'bg-error/10 text-error'
                                                            }`}
                                                    >
                                                        {index.changePercent >= 0 ? (
                                                            <TrendingUp className="w-3.5 h-3.5 mr-1" />
                                                        ) : (
                                                            <TrendingDown className="w-3.5 h-3.5 mr-1" />
                                                        )}
                                                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-1.5 text-center">
                                                <button className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-all">
                                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                                    View
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
