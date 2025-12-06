'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart, Eye } from 'lucide-react';

const bseSectorsData = [
    { name: 'BSE BANKEX', prevClose: 60234.55, current: 60789.12, change: 554.57, changePercent: 0.92 },
    { name: 'BSE IT', prevClose: 40567.89, current: 40923.45, change: 355.56, changePercent: 0.88 },
    { name: 'BSE FINANCE', prevClose: 12567.89, current: 12678.34, change: 110.45, changePercent: 0.88 },
    { name: 'BSE HEALTHCARE', prevClose: 38945.30, current: 38823.15, change: -122.15, changePercent: -0.31 },
    { name: 'BSE AUTO', prevClose: 56234.75, current: 56678.90, change: 444.15, changePercent: 0.79 },
    { name: 'BSE FMCG', prevClose: 20567.40, current: 20534.56, change: -32.84, changePercent: -0.16 },
    { name: 'BSE METAL', prevClose: 32345.80, current: 32678.45, change: 332.65, changePercent: 1.03 },
    { name: 'BSE REALTY', prevClose: 7678.40, current: 7756.78, change: 78.38, changePercent: 1.02 },
    { name: 'BSE POWER', prevClose: 8234.55, current: 8189.23, change: -45.32, changePercent: -0.55 },
    { name: 'BSE OIL & GAS', prevClose: 28456.78, current: 28623.45, change: 166.67, changePercent: 0.59 },
    { name: 'BSE CAPITAL GOODS', prevClose: 71234.56, current: 71567.89, change: 333.33, changePercent: 0.47 },
    { name: 'BSE CONSUMER DURABLES', prevClose: 65432.10, current: 65234.56, change: -197.54, changePercent: -0.30 },
    { name: 'BSE TELECOM', prevClose: 3456.78, current: 3512.45, change: 55.67, changePercent: 1.61 },
    { name: 'BSE UTILITIES', prevClose: 6789.12, current: 6823.45, change: 34.33, changePercent: 0.51 },
    { name: 'BSE INDUSTRIALS', prevClose: 15678.90, current: 15756.34, change: 77.44, changePercent: 0.49 },
    { name: 'BSE BASIC MATERIALS', prevClose: 8234.56, current: 8312.78, change: 78.22, changePercent: 0.95 },
    { name: 'BSE ENERGY', prevClose: 12345.67, current: 12289.45, change: -56.22, changePercent: -0.46 },
    { name: 'BSE INFORMATION TECHNOLOGY', prevClose: 38234.56, current: 38567.89, change: 333.33, changePercent: 0.87 },
    { name: 'BSE TECK', prevClose: 18567.89, current: 18723.45, change: 155.56, changePercent: 0.84 },
    { name: 'BSE PSU', prevClose: 21345.67, current: 21456.78, change: 111.11, changePercent: 0.52 },
    { name: 'BSE CPSE', prevClose: 3456.78, current: 3478.90, change: 22.12, changePercent: 0.64 },
    { name: 'BSE GREENEX', prevClose: 4567.89, current: 4589.12, change: 21.23, changePercent: 0.46 },
    { name: 'BSE CARBONEX', prevClose: 3234.56, current: 3256.78, change: 22.22, changePercent: 0.69 },
    { name: 'BSE INFRASTRUCTURE', prevClose: 456.78, current: 461.23, change: 4.45, changePercent: 0.97 },
    { name: 'BSE ALLCAP', prevClose: 9876.54, current: 9934.56, change: 58.02, changePercent: 0.59 },
    { name: 'BSE LARGECAP', prevClose: 8765.43, current: 8823.45, change: 58.02, changePercent: 0.66 },
    { name: 'BSE MIDCAP', prevClose: 41234.60, current: 41456.78, change: 222.18, changePercent: 0.54 },
    { name: 'BSE SMALLCAP', prevClose: 51678.90, current: 52012.34, change: 333.44, changePercent: 0.65 },
    { name: 'BSE DIVIDEND STABILITY', prevClose: 6789.12, current: 6834.56, change: 45.44, changePercent: 0.67 },
    { name: 'BSE QUALITY', prevClose: 5678.90, current: 5723.45, change: 44.55, changePercent: 0.78 },
];

export default function BSESectorsPage() {
    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                            <PieChart className="h-6 w-6 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">BSE Sectors</h1>
                            <p className="text-sm text-muted-foreground">Sector-wise Performance on Bombay Stock Exchange</p>
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
                                    {bseSectorsData.map((sector, i) => (
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
