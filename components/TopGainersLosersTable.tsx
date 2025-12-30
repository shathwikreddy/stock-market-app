'use client';

import { useState } from 'react';
import { TopGainerLoserStock } from '@/lib/mockData';
import { Lock, MoreVertical, ChevronDown, Settings, ArrowUpDown } from 'lucide-react';

interface TopGainersLosersTableProps {
    data: TopGainerLoserStock[];
    type: 'gainers' | 'losers' | '52wkHigh' | '52wkLow' | 'onlyBuyers' | 'onlySellers' | 'priceShockers';
    exchange: 'NSE' | 'BSE';
    index: string;
    date: string;
}

// Category titles and descriptions
const categoryInfo: Record<string, { title: string; description: string; isPositive: boolean }> = {
    gainers: {
        title: 'TOP GAINERS',
        description: 'Stocks that have recorded the highest percentage gains during the current trading session. It offers a quick snapshot of market momentum, helping users identify which stocks are driving the rally....',
        isPositive: true,
    },
    losers: {
        title: 'TOP LOSERS',
        description: 'Stocks that have recorded the highest percentage losses during the current trading session. It helps users identify which stocks are underperforming and may present buying opportunities or warning signs....',
        isPositive: false,
    },
    '52wkHigh': {
        title: '52 WEEK HIGH',
        description: 'Stocks that have reached their highest price in the last 52 weeks. These stocks are showing strong bullish momentum and could indicate continued upward trends....',
        isPositive: true,
    },
    '52wkLow': {
        title: '52 WEEK LOW',
        description: 'Stocks that have reached their lowest price in the last 52 weeks. These stocks may present value buying opportunities or could indicate ongoing weakness....',
        isPositive: false,
    },
    onlyBuyers: {
        title: 'ONLY BUYERS',
        description: 'Stocks with only buy orders and no sellers at the current price level. These stocks are in high demand and hitting upper circuit limits....',
        isPositive: true,
    },
    onlySellers: {
        title: 'ONLY SELLERS',
        description: 'Stocks with only sell orders and no buyers at the current price level. These stocks are facing heavy selling pressure and may be hitting lower circuit limits....',
        isPositive: false,
    },
    priceShockers: {
        title: 'PRICE SHOCKERS',
        description: 'Stocks experiencing unusual and significant price movements in either direction. These require careful analysis as they may indicate major news or market events....',
        isPositive: true,
    },
};

// Mini Sparkline Chart Component
const SparklineChart = ({ data, isGainer }: { data: number[]; isGainer: boolean }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 40;
    const width = 100;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const color = isGainer ? '#22c55e' : '#ef4444';

    return (
        <svg width={width} height={height} className="inline-block">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                points={points}
            />
        </svg>
    );
};

// Main Categories Tabs
const categoryTabs = [
    { id: 'gainers', label: 'Top Gainers' },
    { id: 'losers', label: 'Top Losers' },
    { id: '52wkHigh', label: '52 Wk High' },
    { id: '52wkLow', label: '52 Wk Low' },
    { id: 'onlyBuyers', label: 'Only Buyers' },
    { id: 'onlySellers', label: 'Only Sellers' },
    { id: 'priceShockers', label: 'Price Shockers' },
];

// Sub-tabs for data views
const subTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'fundamental', label: 'Fundamental' },
    { id: 'returns', label: 'Returns' },
    { id: 'financials', label: 'Financials' },
    { id: 'technicals', label: 'Technicals' },
    { id: 'seasonality', label: 'Seasonality Analysis for Dec' },
];

export default function TopGainersLosersTable({
    data,
    type,
    exchange,
    index,
    date,
}: TopGainersLosersTableProps) {
    const [activeCategory, setActiveCategory] = useState(type);
    const [activeSubTab, setActiveSubTab] = useState('overview');
    const [selectedExchange, setSelectedExchange] = useState<'NSE' | 'BSE'>(exchange);
    const [selectedIndex, setSelectedIndex] = useState(index);
    const [selectedPeriod, setSelectedPeriod] = useState('1 Day');

    const currentCategoryInfo = categoryInfo[activeCategory] || categoryInfo.gainers;
    const isPositive = currentCategoryInfo.isPositive;
    const title = currentCategoryInfo.title;
    const description = currentCategoryInfo.description;

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Main Category Tabs */}
            <div className="border-b border-gray-200 px-4 py-3 overflow-x-auto">
                <div className="flex space-x-2">
                    {categoryTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveCategory(tab.id as any)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === tab.id
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Description Section */}
            <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                    <a href="#" className="text-blue-600 hover:underline ml-1">Read more</a>
                </p>
            </div>

            {/* Title & Filters Section */}
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold text-gray-900">{title} - {selectedExchange}</h1>
                    <span className="text-sm text-gray-500">{date}</span>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Exchange Toggle */}
                    <div className="flex items-center space-x-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="exchange"
                                checked={selectedExchange === 'NSE'}
                                onChange={() => setSelectedExchange('NSE')}
                                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">NSE</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="exchange"
                                checked={selectedExchange === 'BSE'}
                                onChange={() => setSelectedExchange('BSE')}
                                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">BSE</span>
                        </label>
                    </div>

                    {/* Index Dropdown */}
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">{selectedIndex}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Period Dropdown */}
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">{selectedPeriod}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Settings Icon */}
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                        <Settings className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="px-6 border-b border-gray-200">
                <div className="flex space-x-1 overflow-x-auto">
                    {subTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeSubTab === tab.id
                                ? 'border-gray-900 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-500">
                            <th className="px-6 py-4 text-left font-medium">
                                <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>Stock Name</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-medium">
                                <div className="flex items-center justify-end space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>Price</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-medium">
                                <div className="flex items-center justify-end space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>Day&apos;s High</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-medium">
                                <div className="flex items-center justify-end space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>Day&apos;s Low</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-medium">
                                <div className="flex items-center justify-end space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>Open</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-4 py-4 text-right font-medium">
                                <div className="flex items-center justify-end space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>VWAP</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-4 py-4 text-center font-medium">
                                <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-700">
                                    <span>Analysis</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-2 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((stock, index) => (
                            <tr
                                key={stock.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {/* Stock Name with Sparkline */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center space-x-4">
                                        <span className="font-medium text-gray-900 min-w-[120px]">
                                            {stock.stockName}
                                        </span>
                                        <SparklineChart data={stock.sparklineData} isGainer={isPositive} />
                                    </div>
                                </td>

                                {/* Price with Change */}
                                <td className="px-4 py-5 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold text-gray-900">
                                            {stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <span className={`text-sm ${isPositive ? 'text-orange-500' : 'text-red-500'}`}>
                                            {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                                        </span>
                                    </div>
                                </td>

                                {/* Day's High */}
                                <td className="px-4 py-5 text-right text-gray-700">
                                    {stock.daysHigh.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* Day's Low */}
                                <td className="px-4 py-5 text-right text-gray-700">
                                    {stock.daysLow.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* Open */}
                                <td className="px-4 py-5 text-right text-gray-700">
                                    {stock.open.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* VWAP */}
                                <td className="px-4 py-5 text-right text-gray-700">
                                    {stock.vwap.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* Analysis Button */}
                                <td className="px-4 py-5">
                                    <div className="flex justify-center">
                                        <button className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                            <Lock className="w-3 h-3" />
                                            <span>Analysis</span>
                                        </button>
                                    </div>
                                </td>

                                {/* More Options */}
                                <td className="px-2 py-5">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
