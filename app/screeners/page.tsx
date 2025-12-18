'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const technicalData = {
    'Candlestick Patterns': [
        'Single Candlestick Patterns',
        'Dual Candlestick Patterns',
        'Three Candlestick Patterns',
        'Introduced by vgsreddy',
    ],
    'Chart Patterns': [
        'Bullish Chart Patterns',
        'Bearish Chart Patterns',
    ],
    'Drawing Tools': [
        'Support & Resistance',
        'Trendline',
        'Price Action',
        'Swing High & Lows',
        'Demand & Supply Zones',
    ],
    'Indicators': [],
    'Strategies': [],
};

const fundamentalData = {
    'Valuation Metrics': [
        'P/E Ratio',
        'P/B Ratio',
        'EV/EBITDA',
        'Price to Sales',
    ],
    'Financial Health': [
        'Debt to Equity',
        'Current Ratio',
        'Quick Ratio',
        'Interest Coverage',
    ],
    'Profitability': [
        'ROE',
        'ROA',
        'ROCE',
        'Net Profit Margin',
    ],
    'Growth': [
        'Revenue Growth',
        'Earnings Growth',
        'Book Value Growth',
    ],
    'Dividends': [
        'Dividend Yield',
        'Payout Ratio',
    ],
};

export default function ScreenersPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-black mb-8 text-center border-b-2 border-black pb-4">
                    Screeners
                </h1>

                <div className="border border-black">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="w-1/2 py-3 px-4 text-left text-lg font-bold text-black border-r border-black bg-gray-50">
                                    Technical
                                </th>
                                <th className="w-1/2 py-3 px-4 text-left text-lg font-bold text-black bg-gray-50">
                                    Fundamental
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="align-top border-r border-black p-0">
                                    {Object.entries(technicalData).map(([category, items], idx) => (
                                        <div key={category} className={idx > 0 ? 'border-t border-black' : ''}>
                                            <div className="py-2 px-4 font-bold text-black bg-gray-50">
                                                {category}
                                            </div>
                                            {items.length > 0 && (
                                                <div>
                                                    {items.map((item, itemIdx) => (
                                                        <Link
                                                            key={item}
                                                            href={`/screeners/${category.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className={`block py-2 px-4 text-black hover:bg-gray-100 transition-colors ${itemIdx > 0 ? 'border-t border-gray-200' : ''}`}
                                                        >
                                                            <span className="flex items-center justify-between">
                                                                {item}
                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </td>
                                <td className="align-top p-0">
                                    {Object.entries(fundamentalData).map(([category, items], idx) => (
                                        <div key={category} className={idx > 0 ? 'border-t border-black' : ''}>
                                            <div className="py-2 px-4 font-bold text-black bg-gray-50">
                                                {category}
                                            </div>
                                            {items.length > 0 && (
                                                <div>
                                                    {items.map((item, itemIdx) => (
                                                        <Link
                                                            key={item}
                                                            href={`/screeners/${category.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className={`block py-2 px-4 text-black hover:bg-gray-100 transition-colors ${itemIdx > 0 ? 'border-t border-gray-200' : ''}`}
                                                        >
                                                            <span className="flex items-center justify-between">
                                                                {item}
                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
