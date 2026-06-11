'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, BarChart3, Menu, X } from 'lucide-react';
import {
    nifty50Stocks,
    indexCategories,
    categoryTabs,
    dataViewTabs,
    heatmapData,
} from '@/lib/nseIndicesMockData';
import DataSettingsModal, { getAllDefaultColumns } from './DataSettingsModal';

export default function NSEIndicesTerminal() {
    const [selectedCategory, setSelectedCategory] = useState('keyIndices');
    const [selectedIndex, setSelectedIndex] = useState('nifty50');
    const [selectedDataView, setSelectedDataView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<Record<string, string[]>>(getAllDefaultColumns());

    const currentIndex = indexCategories.find(i => i.id === selectedIndex) || indexCategories[0];

    return (
        <div className="min-h-screen bg-white">
            {/* Header Tabs */}
            <div className="flex items-center border-b border-gray-200 px-2 sm:px-4 overflow-x-auto">
                <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-gray-800 text-white text-xs sm:text-sm font-medium rounded-t whitespace-nowrap">
                    <span className="hidden sm:inline">Markets Terminal</span>
                    <span className="sm:hidden">Terminal</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <div className="flex items-center gap-1 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">
                    <span className="bg-green-500 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded">NSE</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm font-medium hover:text-gray-800 whitespace-nowrap">
                    <span className="hidden sm:inline">Live Markets</span>
                    <span className="sm:hidden">Live</span>
                    <span className="bg-green-500 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded">NSE</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Category Tabs - Scrollable on mobile */}
            <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 border-b border-gray-200 text-xs sm:text-sm overflow-x-auto scrollbar-hide">
                {categoryTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedCategory(tab.id)}
                        className={`py-1 sm:py-2 whitespace-nowrap ${selectedCategory === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Market Map Section */}
            <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    <span className="text-xs sm:text-sm text-gray-600">Market Map</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">Stocks filtered based on their performance</span>
                </div>

                {/* Heatmap Boxes - Responsive */}
                <div className="flex flex-wrap sm:flex-nowrap items-end gap-1 mb-2">
                    <div className="flex items-end gap-1 flex-wrap sm:flex-nowrap">
                        {heatmapData.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div
                                    className="flex items-center justify-center text-white text-[10px] sm:text-sm font-bold rounded"
                                    style={{
                                        backgroundColor: item.color,
                                        width: `${Math.max(30, item.count * 2)}px`,
                                        height: `${Math.max(24, item.count * 1.5 + 16)}px`,
                                    }}
                                >
                                    {item.count}
                                </div>
                                <span className="text-[8px] sm:text-[10px] text-gray-500 mt-1 whitespace-nowrap">{item.range}</span>
                            </div>
                        ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                        <div className="text-center">
                            <div className="text-green-600 font-bold text-sm sm:text-base">39</div>
                            <div className="text-gray-500 text-[10px] sm:text-xs">Advances</div>
                        </div>
                        <div className="text-center">
                            <div className="text-red-600 font-bold text-sm sm:text-base">11</div>
                            <div className="text-gray-500 text-[10px] sm:text-xs">Declines</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-600 font-bold text-sm sm:text-base">0</div>
                            <div className="text-gray-500 text-[10px] sm:text-xs">Unchanged</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Index Display - Responsive */}
            <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-gray-900">{currentIndex.name}</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                        {currentIndex.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm font-medium ${currentIndex.pctChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ▲ {Math.abs(currentIndex.change).toFixed(2)} ({Math.abs(currentIndex.pctChange).toFixed(2)}%)
                    </span>
                </div>
                <button className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:underline">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    Market Snapshot
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden px-2 py-2 border-b border-gray-200">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-lg w-full"
                >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    {currentIndex.name}
                    <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row">
                {/* Left Sidebar - Collapsible on mobile */}
                <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-48 border-b lg:border-b-0 lg:border-r border-gray-200 py-2 bg-white z-10`}>
                    <div className="px-3 mb-2">
                        <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded">
                            <option>Key Indices</option>
                            <option>Sectoral Indices</option>
                            <option>Other Indices</option>
                        </select>
                    </div>
                    <div className="space-y-0.5 max-h-64 lg:max-h-none overflow-y-auto">
                        {indexCategories.map((index) => (
                            <button
                                key={index.id}
                                onClick={() => {
                                    setSelectedIndex(index.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 ${selectedIndex === index.id ? 'bg-gray-100 font-medium' : ''
                                    }`}
                            >
                                <span className="truncate">{index.name}</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                    <div className="px-3 mt-4 text-xs text-gray-500 hidden lg:block">
                        <strong>Note:</strong> You can change the category by selecting the options on top
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="flex-1 min-w-0">
                    {/* Data View Tabs - Scrollable */}
                    <div className="flex items-center justify-between px-2 sm:px-4 border-b border-gray-200 overflow-x-auto">
                        <div className="flex items-center gap-2 sm:gap-4">
                            {dataViewTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedDataView(tab.id)}
                                    className={`py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap ${selectedDataView === tab.id
                                        ? 'text-gray-900 border-b-2 border-gray-900 font-medium'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setSettingsModalOpen(true)}
                            className="hidden sm:flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            * choose your choice of data
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Stock Table - Responsive */}
                    <div className="overflow-x-auto">
                        {selectedDataView === 'technical' ? (
                            /* Technical View Table */
                            <table className="w-full text-xs sm:text-sm min-w-[1000px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Name ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">LTP ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">SMA50 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">SMA200 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">RSI(14) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">MACD(12,26,9) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Stochastic(20,3) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">MFI(14) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">ADX(14) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">Technical Rating ↕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nifty50Stocks.map((stock) => (
                                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-900 whitespace-nowrap">{stock.name}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right font-medium whitespace-nowrap ${stock.pctChg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.sma50.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.sma200.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.rsi14.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.macd >= 0 ? 'text-gray-700' : 'text-red-600'}`}>{stock.macd.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.stochastic.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.mfi14.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.adx14.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {stock.technicalRating === 'buy' && (<><span className="text-green-500">↗</span><span className="text-gray-400">⊙</span><span className="text-green-500">▼</span></>)}
                                                    {stock.technicalRating === 'sell' && (<><span className="text-red-500">↘</span><span className="text-gray-400">⊙</span><span className="text-red-500">▲</span></>)}
                                                    {stock.technicalRating === 'neutral' && (<><span className="text-gray-400">→</span><span className="text-gray-400">⊙</span><span className="text-gray-400">−</span></>)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : selectedDataView === 'fundamental' ? (
                            /* Fundamental View Table */
                            <table className="w-full text-xs sm:text-sm min-w-[1000px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Name ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">LTP ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">P/E ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Debt to Equity ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">EPS(Rs.) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">BVPS(Rs.) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Net Profit(Rs. Cr) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">DPS(Rs.) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">NPM% ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">ROE% ↕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nifty50Stocks.map((stock) => (
                                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-900 whitespace-nowrap">{stock.name}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right font-medium whitespace-nowrap ${stock.pctChg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.pe.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.debtToEquity.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.eps.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.bvps.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.dps.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.npm.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.roe.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : selectedDataView === 'performance' ? (
                            /* Performance View Table */
                            <table className="w-full text-xs sm:text-sm min-w-[1100px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Name ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">LTP ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">YTD(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">1 Week(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">1 Month(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">3 Months(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">6 Months(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">1 Year(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">2 Years(%) ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">3 Years(%) ↕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nifty50Stocks.map((stock) => (
                                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-900 whitespace-nowrap">{stock.name}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right font-medium whitespace-nowrap ${stock.pctChg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.ytd >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.ytd.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.week1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.week1.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.month1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.month1.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.months3 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.months3.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.months6 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.months6.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.year1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.year1.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.year2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.year2.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.year3 >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.year3.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : selectedDataView === 'pivotLevel' ? (
                            /* Pivot Level View Table */
                            <table className="w-full text-xs sm:text-sm min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Name ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">LTP ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Pivot Point ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">R1 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">R2 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">R3 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">S1 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">S2 ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">S3 ↕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nifty50Stocks.map((stock) => (
                                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-900 whitespace-nowrap">{stock.name}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right font-medium whitespace-nowrap ${stock.pctChg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.pivotPoint.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-green-600 whitespace-nowrap">{stock.r1.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-green-600 whitespace-nowrap">{stock.r2.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-green-600 whitespace-nowrap">{stock.r3.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-red-600 whitespace-nowrap">{stock.s1.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-red-600 whitespace-nowrap">{stock.s2.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-red-600 whitespace-nowrap">{stock.s3.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            /* Overview Table (default) */
                            <table className="w-full text-xs sm:text-sm min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Name ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">LTP ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">%Chg ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Chg ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Volume ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Buy Price ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Sell Price ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Buy Qty ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">Sell Qty ↕</th>
                                        <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">Analysis</th>
                                        <th className="px-2 sm:px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">Technical Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nifty50Stocks.map((stock) => (
                                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-900 whitespace-nowrap">{stock.name}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right font-medium whitespace-nowrap ${stock.pctChg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right font-medium whitespace-nowrap ${stock.pctChg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.pctChg >= 0 ? '+' : ''}{stock.pctChg.toFixed(2)}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.chg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.chg >= 0 ? '+' : ''}{stock.chg.toFixed(2)}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.volume.toLocaleString('en-IN')}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.buyPrice > 0 ? stock.buyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-gray-700 whitespace-nowrap">{stock.sellPrice > 0 ? stock.sellPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.buyQty > 0 ? 'text-green-600' : 'text-gray-400'}`}>{stock.buyQty.toLocaleString('en-IN')}</td>
                                            <td className={`px-2 sm:px-3 py-1.5 sm:py-2 text-right whitespace-nowrap ${stock.sellQty > 0 ? 'text-red-600' : 'text-gray-400'}`}>{stock.sellQty.toLocaleString('en-IN')}</td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                                                <button className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap">🔒 Analysis &gt;</button>
                                            </td>
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                                                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                                    <span className="text-green-500 text-xs sm:text-sm">📈</span>
                                                    <span className="text-gray-400 text-xs sm:text-sm">⚪</span>
                                                    <span className="text-green-500 text-xs sm:text-sm">▼</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-2 px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-200">
                        <button className="p-1.5 sm:p-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                            &lt;
                        </button>
                        <button className="p-1.5 sm:p-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Settings Modal */}
            <DataSettingsModal
                isOpen={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
                selectedColumns={selectedColumns}
                onSave={(columns) => setSelectedColumns(columns)}
            />
        </div>
    );
}
