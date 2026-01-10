'use client';

import { useState } from 'react';
import { ChevronDown, Plus, ExternalLink } from 'lucide-react';
import {
    indexFuturesData,
    optionChainData,
    foStatsGainers,
    foStatsLosers,
    sectorOIData,
    globalIndicesData,
    openInterestData,
    arbitrageData,
    corporateActionData,
    advanceDeclineData,
    announcementsData,
    glossaryTerms,
    foExpiryDates,
    foIndices,
    foSectors
} from '@/lib/fno-data';

type MarketType = 'FUTURES' | 'OPTIONS';
type StockType = 'Stocks' | 'Index';
type FOStatsTab = 'Top Gainers' | 'Top Losers' | 'Active Calls' | 'Active Puts';
type ExpiryTab = 'Near' | 'Next' | 'Far';
type OITab = 'OI' | 'Volume';

export default function FNOPage() {
    const [marketType, setMarketType] = useState<MarketType>('FUTURES');
    const [stockType, setStockType] = useState<StockType>('Index');
    const [selectedIndex, setSelectedIndex] = useState('Select');
    const [selectedExpiry, setSelectedExpiry] = useState('Select');
    const [foStatsTab, setFoStatsTab] = useState<FOStatsTab>('Top Gainers');
    const [expiryTab, setExpiryTab] = useState<ExpiryTab>('Near');
    const [optionExpiryTab, setOptionExpiryTab] = useState<ExpiryTab>('Near');
    const [oiTab, setOiTab] = useState<OITab>('OI');
    const [selectedSector, setSelectedSector] = useState('Banks');

    // Checkbox states
    const [showVolume, setShowVolume] = useState(true);
    const [showOpenInterest, setShowOpenInterest] = useState(false);
    const [showOIChange, setShowOIChange] = useState(true);

    const getColorClass = (value: number) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-700';
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6">F&O Market Snapshot</h1>

                {/* Market Type Selection Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap items-start gap-6">
                        {/* FUTURES / OPTIONS Toggle */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setMarketType('FUTURES')}
                                    className={`text-sm font-semibold ${marketType === 'FUTURES' ? 'text-teal-700' : 'text-gray-500'}`}
                                >
                                    FUTURES ▶
                                </button>
                                <div className="flex">
                                    <button
                                        onClick={() => setStockType('Stocks')}
                                        className={`px-4 py-1.5 text-sm font-medium border ${stockType === 'Stocks' ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} rounded-l-md`}
                                    >
                                        Stocks
                                    </button>
                                    <button
                                        onClick={() => setStockType('Index')}
                                        className={`px-4 py-1.5 text-sm font-medium ${stockType === 'Index' ? 'bg-teal-700 text-white' : 'bg-gray-100 border-gray-200 text-gray-600'} rounded-r-md`}
                                    >
                                        Index
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setMarketType('OPTIONS')}
                                className={`text-sm font-semibold ${marketType === 'OPTIONS' ? 'text-teal-700' : 'text-gray-500'}`}
                            >
                                OPTIONS
                            </button>
                        </div>

                        {/* Index and Expiry Dropdowns */}
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Index</label>
                                <select
                                    value={selectedIndex}
                                    onChange={(e) => setSelectedIndex(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm min-w-[120px]"
                                >
                                    {foIndices.map(idx => (
                                        <option key={idx} value={idx}>{idx}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
                                <select
                                    value={selectedExpiry}
                                    onChange={(e) => setSelectedExpiry(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm min-w-[120px]"
                                >
                                    {foExpiryDates.map(date => (
                                        <option key={date} value={date}>{date}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="px-4 py-1.5 bg-teal-700 text-white text-sm font-medium rounded mt-4">
                                Search Futures
                            </button>
                        </div>
                    </div>
                </div>

                {/* Index Futures Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Index Futures NIFTY</h2>
                        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                            <option>Select</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Price and Details */}
                        <div>
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-900">NIFTY</span>
                                    <span className="text-sm text-gray-500">{indexFuturesData.expiry}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900">{formatNumber(indexFuturesData.ltp)}</span>
                                    <span className="text-green-600">▲ {indexFuturesData.change}</span>
                                    <span className="text-green-600">({indexFuturesData.changePercent}%)</span>
                                    <button className="text-blue-600 text-sm flex items-center gap-1 ml-2">
                                        <Plus className="w-4 h-4" /> Add to Watchlist
                                    </button>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Open</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.open)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Avg. Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.avgPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">High</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.high)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Contracts Traded</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.contractsTraded)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Low</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.low)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Turnover (Rs.lakhs)</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.turnover)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Prev. Close</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.prevClose)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Market Lot</span>
                                    <span className="font-medium">{indexFuturesData.marketLot}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Spot Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.spotPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Open Interest</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.openInterest)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Open Int PCR</span>
                                    <span className="font-medium">{indexFuturesData.openIntPCR}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Open Int. Chg</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.openIntChange)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Prev OI PCR</span>
                                    <span className="font-medium">{indexFuturesData.prevOIPCR}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">OI Chg %</span>
                                    <span className="font-medium">{indexFuturesData.oiChangePercent}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Bid Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.bidPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Offer Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.offerPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Bid Qty</span>
                                    <span className="font-medium">{indexFuturesData.bidQty}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-1">
                                    <span className="text-gray-500">Offer Qty</span>
                                    <span className="font-medium">{indexFuturesData.offerQty}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Rollover %</span>
                                    <span className="font-medium">{indexFuturesData.rolloverPercent}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Expiry tabs and checkboxes */}
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex border border-gray-200 rounded overflow-hidden">
                                    {(['Near', 'Next', 'Far'] as ExpiryTab[]).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setExpiryTab(tab)}
                                            className={`px-4 py-1.5 text-sm ${expiryTab === tab ? 'bg-gray-100 font-medium' : 'text-gray-600'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={showVolume} onChange={(e) => setShowVolume(e.target.checked)} className="rounded" />
                                    Volume
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={showOpenInterest} onChange={(e) => setShowOpenInterest(e.target.checked)} className="rounded" />
                                    Open Interest
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={showOIChange} onChange={(e) => setShowOIChange(e.target.checked)} className="rounded" />
                                    Open Interest Change
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Option Chain Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Option Chain NIFTY</h2>
                        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                            <option>Select</option>
                        </select>
                    </div>

                    <div className="flex border border-gray-200 rounded overflow-hidden w-fit mb-4">
                        {(['Near', 'Next', 'Far'] as ExpiryTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setOptionExpiryTab(tab)}
                                className={`px-4 py-1.5 text-sm ${optionExpiryTab === tab ? 'bg-gray-100 font-medium' : 'text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th colSpan={3} className="py-2 text-center font-semibold text-gray-700">CALLS</th>
                                    <th className="py-2"></th>
                                    <th colSpan={3} className="py-2 text-center font-semibold text-gray-700">PUTS</th>
                                </tr>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 px-3 text-center">Premium</th>
                                    <th className="py-2 px-3 text-center">Volume</th>
                                    <th className="py-2 px-3 text-center">Open Int</th>
                                    <th className="py-2 px-3 text-center font-medium">Strike Price</th>
                                    <th className="py-2 px-3 text-center">Open Int</th>
                                    <th className="py-2 px-3 text-center">Volume</th>
                                    <th className="py-2 px-3 text-center">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {optionChainData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                        <td className="py-2 px-3 text-center text-gray-500">{row.callPremium}</td>
                                        <td className="py-2 px-3 text-center text-gray-500">{row.callVolume}</td>
                                        <td className="py-2 px-3 text-center text-gray-500">{row.callOpenInt}</td>
                                        <td className="py-2 px-3 text-center font-medium">{row.strikePrice.toFixed(2)}</td>
                                        <td className="py-2 px-3 text-center text-gray-500">{row.putOpenInt}</td>
                                        <td className="py-2 px-3 text-center text-gray-500">{row.putVolume}</td>
                                        <td className="py-2 px-3 text-center text-gray-500">{row.putPremium}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* F&O Stats and Announcements Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* F&O Stats */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">F&O Stats</h2>
                        <div className="flex border border-gray-200 rounded overflow-hidden w-fit mb-4">
                            {(['Top Gainers', 'Top Losers', 'Active Calls', 'Active Puts'] as FOStatsTab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFoStatsTab(tab)}
                                    className={`px-3 py-1.5 text-xs ${foStatsTab === tab ? 'bg-gray-100 font-medium' : 'text-gray-600 border-l border-gray-200 first:border-l-0'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left">Futures</th>
                                    <th className="py-2 text-right">CMP</th>
                                    <th className="py-2 text-right">Change</th>
                                    <th className="py-2 text-right">%Chg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(foStatsTab === 'Top Gainers' ? foStatsGainers : foStatsLosers).map((row) => (
                                    <tr key={row.symbol} className="border-b border-gray-100">
                                        <td className="py-2">
                                            <span className="text-blue-600 font-medium">{row.symbol}</span>
                                            <span className="text-gray-400 text-xs ml-1">{row.expiry}</span>
                                        </td>
                                        <td className="py-2 text-right">{formatNumber(row.cmp)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.change)}`}>{row.change.toFixed(2)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.changePercent)}`}>+{row.changePercent.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-right">
                            <a href="#" className="text-blue-600 text-sm">more</a>
                        </div>
                        <div className="mt-4 text-xs text-blue-600 flex flex-wrap gap-2">
                            <a href="#">Most Active (Shares)</a> |
                            <a href="#">Most Active (Value)</a> |
                            <a href="#">Increase in Open Interest</a> |
                            <a href="#">Decrease in Open Interest</a> |
                            <a href="#">Arbitrage</a> |
                            <a href="#">Advance/Decline & Vol. Breakup</a>
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Announcements on F&O Stocks</h2>
                        <div className="border border-gray-200 rounded overflow-hidden w-fit mb-4">
                            <button className="px-3 py-1.5 text-xs bg-gray-100 font-medium">Announcements</button>
                        </div>
                        <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                            {announcementsData.map((ann, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="text-gray-500 whitespace-nowrap">{ann.date} {ann.time} -</span>
                                    <a href={ann.link} className="text-blue-600 hover:underline truncate">{ann.title}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sector Wise OI and Global Indices Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sector Wise OI */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sector Wise Open Interest & Volume</h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Sector</label>
                                <select
                                    value={selectedSector}
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                                >
                                    {foSectors.map(sec => (
                                        <option key={sec} value={sec}>{sec}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Index</label>
                                <select className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                                    <option>Select</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex border border-gray-200 rounded overflow-hidden w-fit mb-4">
                            {(['OI', 'Volume'] as OITab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setOiTab(tab)}
                                    className={`px-4 py-1.5 text-sm ${oiTab === tab ? 'bg-gray-100 font-medium' : 'text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left">Index</th>
                                    <th className="py-2 text-right">CMP (% chg)</th>
                                    <th className="py-2 text-right">Open Int (% chg)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorOIData.map((row) => (
                                    <tr key={row.symbol} className="border-b border-gray-100">
                                        <td className="py-2 text-blue-600 font-medium">{row.symbol}</td>
                                        <td className="py-2 text-right">
                                            {formatNumber(row.cmp)} <span className={getColorClass(row.cmpChange)}>{row.cmpChange > 0 ? '+' : ''}{row.cmpChange.toFixed(2)}%</span>
                                        </td>
                                        <td className="py-2 text-right">
                                            {formatNumber(row.openInterest)} <span className={getColorClass(row.oiChange)}>{row.oiChange > 0 ? '+' : ''}{row.oiChange.toFixed(2)}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Global Indices */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Indices</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left">Index</th>
                                    <th className="py-2 text-right">CMP</th>
                                    <th className="py-2 text-right">Change</th>
                                    <th className="py-2 text-right">% Chg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['US Markets', 'European Markets', 'Asian Markets'].map(category => (
                                    <>
                                        <tr key={category} className="bg-gray-50">
                                            <td colSpan={4} className="py-2 font-medium text-gray-700">{category}</td>
                                        </tr>
                                        {globalIndicesData.filter(idx => idx.category === category).map(row => (
                                            <tr key={row.name} className="border-b border-gray-100">
                                                <td className="py-2 text-blue-600 font-medium">{row.name}</td>
                                                <td className="py-2 text-right">{formatNumber(row.cmp)}</td>
                                                <td className={`py-2 text-right ${getColorClass(row.change)}`}>{row.change.toFixed(2)}</td>
                                                <td className={`py-2 text-right ${getColorClass(row.changePercent)}`}>{row.changePercent.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Open Interest Breakup and Arbitrage Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Open Interest Breakup */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Open Interest Breakup</h2>
                            <a href="#" className="text-blue-600 text-sm">Detailed View</a>
                        </div>
                        <div className="flex border border-gray-200 rounded overflow-hidden w-fit mb-4">
                            {(['Near', 'Next', 'Far'] as ExpiryTab[]).map(tab => (
                                <button
                                    key={tab}
                                    className={`px-4 py-1.5 text-sm ${tab === 'Near' ? 'bg-gray-100 font-medium' : 'text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left">Symbol</th>
                                    <th className="py-2 text-right">Total OI</th>
                                    <th className="py-2 text-right">Change</th>
                                    <th className="py-2 text-right">% Chg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openInterestData.map((row) => (
                                    <tr key={row.symbol} className="border-b border-gray-100">
                                        <td className="py-2">
                                            <span className="text-blue-600 font-medium">{row.symbol}</span>
                                            <span className="text-gray-400 text-xs ml-1">{row.expiry}</span>
                                        </td>
                                        <td className="py-2 text-right">{formatNumber(row.totalOI)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.change)}`}>{formatNumber(row.change)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.changePercent)}`}>{row.changePercent.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-right">
                            <a href="#" className="text-blue-600 text-sm">more</a>
                        </div>
                    </div>

                    {/* Arbitrage */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Arbitrage</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left">Company</th>
                                    <th className="py-2 text-right">Future</th>
                                    <th className="py-2 text-right">Cash</th>
                                    <th className="py-2 text-right">Basis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arbitrageData.map((row) => (
                                    <tr key={row.company} className="border-b border-gray-100">
                                        <td className="py-2 text-blue-600 font-medium">{row.company}</td>
                                        <td className="py-2 text-right font-medium">{formatNumber(row.future)}</td>
                                        <td className="py-2 text-right">{formatNumber(row.cash)}</td>
                                        <td className="py-2 text-right">{row.basis.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-right">
                            <a href="#" className="text-blue-600 text-sm">Detailed View</a>
                        </div>
                    </div>
                </div>

                {/* Corporate Action and Advance Decline Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Corporate Action */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Corporate Action</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left">Stock</th>
                                    <th className="py-2 text-center">Ex-Date</th>
                                    <th className="py-2 text-left">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {corporateActionData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                        <td className="py-2 text-blue-600">{row.stock}</td>
                                        <td className="py-2 text-center font-medium">{row.exDate}</td>
                                        <td className="py-2">{row.purpose}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Advance Decline Table */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Advance Decline Table</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left"></th>
                                    <th className="py-2 text-center">Future</th>
                                    <th className="py-2 text-center">Calls</th>
                                    <th className="py-2 text-center">Puts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {advanceDeclineData.map((row) => (
                                    <tr key={row.category} className="border-b border-gray-100">
                                        <td className="py-2 font-medium">{row.category}</td>
                                        <td className="py-2 text-center">
                                            <span className="font-medium">{row.future}</span>
                                            <span className="text-green-600 text-xs ml-1">({row.futurePercent}%)</span>
                                        </td>
                                        <td className="py-2 text-center">
                                            <span className="font-medium">{formatNumber(row.calls)}</span>
                                            <span className="text-red-600 text-xs ml-1">({row.callsPercent}%)</span>
                                        </td>
                                        <td className="py-2 text-center">
                                            <span className="font-medium">{formatNumber(row.puts)}</span>
                                            <span className="text-red-600 text-xs ml-1">({row.putsPercent}%)</span>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="font-medium">
                                    <td className="py-2">Total</td>
                                    <td className="py-2 text-center">208</td>
                                    <td className="py-2 text-center">8,454</td>
                                    <td className="py-2 text-center">8,450</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Securities In Ban Period */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Securities In Ban Period for 12-Jan-26</h2>
                    <p className="text-blue-600">No Stocks In Ban Period</p>
                </div>

                {/* Glossary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">GLOSSARY</h2>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        {glossaryTerms.map((item) => (
                            <div key={item.term}>
                                <span className="text-yellow-600 mr-1">★</span>
                                <a href={item.link} className="text-blue-600 hover:underline">{item.term}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
