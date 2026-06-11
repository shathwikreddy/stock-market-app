'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart, Eye } from 'lucide-react';

const nseSectorsData = [
    { name: 'NIFTY BANK', prevClose: 51234.56, current: 51678.90, change: 444.34, changePercent: 0.87 },
    { name: 'NIFTY IT', prevClose: 38360.25, current: 38703.65, change: 343.4, changePercent: 0.9 },
    { name: 'NIFTY FINANCIAL SERVICES', prevClose: 24567.89, current: 24789.12, change: 221.23, changePercent: 0.90 },
    { name: 'NIFTY PHARMA', prevClose: 22958.95, current: 22947.15, change: -11.8, changePercent: -0.05 },
    { name: 'NIFTY AUTO', prevClose: 27732.7, current: 27939.1, change: 206.4, changePercent: 0.74 },
    { name: 'NIFTY FMCG', prevClose: 55209.3, current: 55202.85, change: -6.45, changePercent: -0.01 },
    { name: 'NIFTY METAL', prevClose: 10271.45, current: 10340.35, change: 68.9, changePercent: 0.67 },
    { name: 'NIFTY REALTY', prevClose: 890.1, current: 893.15, change: 3.05, changePercent: 0.34 },
    { name: 'NIFTY ENERGY', prevClose: 34986.1, current: 34971.8, change: -14.3, changePercent: -0.04 },
    { name: 'NIFTY MEDIA', prevClose: 1441.4, current: 1434.55, change: -6.85, changePercent: -0.48 },
    { name: 'NIFTY PRIVATE BANK', prevClose: 28720.6, current: 28862.3, change: 141.7, changePercent: 0.49 },
    { name: 'NIFTY PSU BANK', prevClose: 8256.7, current: 8381.75, change: 125.05, changePercent: 1.51 },
    { name: 'NIFTY HEALTHCARE INDEX', prevClose: 14567.89, current: 14623.45, change: 55.56, changePercent: 0.38 },
    { name: 'NIFTY CONSUMER DURABLES', prevClose: 32456.78, current: 32234.56, change: -222.22, changePercent: -0.68 },
    { name: 'NIFTY OIL & GAS', prevClose: 12345.67, current: 12456.78, change: 111.11, changePercent: 0.90 },
    { name: 'NIFTY COMMODITIES', prevClose: 9136.7, current: 9162.7, change: 26, changePercent: 0.28 },
    { name: 'NIFTY CPSE', prevClose: 6320.35, current: 6324.2, change: 3.85, changePercent: 0.06 },
    { name: 'NIFTY INFRASTRUCTURE', prevClose: 9501.2, current: 9540.65, change: 39.45, changePercent: 0.42 },
    { name: 'NIFTY MNC', prevClose: 30260.75, current: 30196.3, change: -64.45, changePercent: -0.21 },
    { name: 'NIFTY SERVICES SECTOR', prevClose: 33846.2, current: 34093.3, change: 247.1, changePercent: 0.73 },
    { name: 'NIFTY GROWSECT 15', prevClose: 12456.78, current: 12567.89, change: 111.11, changePercent: 0.89 },
    { name: 'NIFTY100 QUALITY 30', prevClose: 5678.90, current: 5712.34, change: 33.44, changePercent: 0.59 },
    { name: 'NIFTY MIDCAP LIQUID 15', prevClose: 16476.7, current: 16630.0, change: 153.3, changePercent: 0.93 },
    { name: 'NIFTY LARGEMIDCAP 250', prevClose: 18234.56, current: 18345.67, change: 111.11, changePercent: 0.61 },
    { name: 'NIFTY SMLCAP 250', prevClose: 19567.89, current: 19678.90, change: 111.01, changePercent: 0.57 },
    { name: 'NIFTY SMLCAP 50', prevClose: 8234.56, current: 8312.34, change: 77.78, changePercent: 0.94 },
    { name: 'NIFTY MIDCAP SELECT', prevClose: 13567.89, current: 13689.01, change: 121.12, changePercent: 0.89 },
    { name: 'NIFTY TOTAL MARKET', prevClose: 12456.78, current: 12523.45, change: 66.67, changePercent: 0.54 },
    { name: 'NIFTY MICROCAP 250', prevClose: 23456.78, current: 23678.90, change: 222.12, changePercent: 0.95 },
    { name: 'NIFTY FIN SERVICES 25/50', prevClose: 24567.89, current: 24789.12, change: 221.23, changePercent: 0.90 },
];

export default function NSESectorsPage() {
    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                            <PieChart className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">NSE Sectors</h1>
                            <p className="text-sm text-muted-foreground">Sector-wise Performance on National Stock Exchange</p>
                        </div>
                    </div>

                    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-luxury">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Sector Name
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
                                    {nseSectorsData.map((sector, i) => (
                                        <motion.tr
                                            key={sector.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="hover:bg-secondary/50 transition-colors group"
                                        >
                                            <td className="px-3 py-1.5">
                                                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {sector.name}
                                                </div>
                                            </td>
                                            <td className="px-3 py-1.5 text-xs text-muted-foreground text-right font-mono">
                                                {sector.prevClose.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-1.5 text-xs font-semibold text-foreground text-right font-mono">
                                                {sector.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-1.5 text-xs text-right font-mono">
                                                <span className={`font-semibold ${sector.change >= 0 ? 'text-success' : 'text-error'}`}>
                                                    {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-1.5 text-right">
                                                <div className="flex items-center justify-end">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono ${sector.changePercent >= 0
                                                            ? 'bg-success/10 text-success'
                                                            : 'bg-error/10 text-error'
                                                            }`}
                                                    >
                                                        {sector.changePercent >= 0 ? (
                                                            <TrendingUp className="w-3.5 h-3.5 mr-1" />
                                                        ) : (
                                                            <TrendingDown className="w-3.5 h-3.5 mr-1" />
                                                        )}
                                                        {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
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
