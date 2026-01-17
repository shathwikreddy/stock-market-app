'use client';

import { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
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

// Enhanced Option Chain Data with more realistic values
const enhancedOptionChainData = [
    {
        callPremium: '337', callPremiumPct: '17.18%', callVolume: '18,260',
        callOpenInt: '103,935', callOpenIntPct: '-12.68%',
        strikePrice: 25500.00,
        putOpenInt: '456,950', putOpenIntPct: '47.91%', putVolume: '126,295',
        putPremium: '83.5', putPremiumPct: '-42.34'
    },
    {
        callPremium: '300.9', callPremiumPct: '17.70%', callVolume: '256,035',
        callOpenInt: '716,250', callOpenIntPct: '1.26%',
        strikePrice: 25600.00,
        putOpenInt: '2,307,500', putOpenIntPct: '11.93%', putVolume: '589,725',
        putPremium: '97.5', putPremiumPct: '-26.28'
    },
    {
        callPremium: '266.8', callPremiumPct: '17.34%', callVolume: '108,225',
        callOpenInt: '214,385', callOpenIntPct: '-5.98%',
        strikePrice: 25650.00,
        putOpenInt: '454,740', putOpenIntPct: '25.38%', putVolume: '260,520',
        putPremium: '112.45', putPremiumPct: '-25.87'
    },
    {
        callPremium: '234.9', callPremiumPct: '16.78%', callVolume: '931,255',
        callOpenInt: '2,329,080', callOpenIntPct: '20.19%',
        strikePrice: 25700.00,
        putOpenInt: '3,486,775', putOpenIntPct: '36.38%', putVolume: '914,225',
        putPremium: '130.05', putPremiumPct: '-24.07'
    },
];

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
    const [optionType, setOptionType] = useState('Select');
    const [strikePrice, setStrikePrice] = useState('Select');

    const getColorClass = (value: number) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-700';
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="text-xs text-gray-500 mb-4">
                    <span className="text-blue-600">YOU ARE HERE:</span>
                    <span className="mx-1">»</span>
                    <a href="#" className="text-blue-600 hover:underline">MONEYCONTROL</a>
                    <span className="mx-1">»</span>
                    <a href="#" className="text-blue-600 hover:underline">MARKETS</a>
                    <span className="mx-1">»</span>
                    <span className="text-gray-600">F&O MARKET SNAPSHOT</span>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6">F&O Market Snapshot</h1>

                {/* Market Type Selection Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                    <div className="flex flex-wrap items-start gap-8">
                        {/* FUTURES / OPTIONS Toggle */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setMarketType('FUTURES')}
                                    className={`text-sm font-bold flex items-center gap-1 ${marketType === 'FUTURES' ? 'text-teal-700' : 'text-gray-500'}`}
                                >
                                    FUTURES {marketType === 'FUTURES' && <ChevronRight className="w-4 h-4" />}
                                </button>

                                {marketType === 'FUTURES' && (
                                    <div className="flex border border-gray-300 rounded overflow-hidden">
                                        <button
                                            onClick={() => setStockType('Stocks')}
                                            className={`px-4 py-1.5 text-sm font-medium transition-colors ${stockType === 'Stocks'
                                                    ? 'bg-teal-700 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Stocks
                                        </button>
                                        <button
                                            onClick={() => setStockType('Index')}
                                            className={`px-4 py-1.5 text-sm font-medium transition-colors ${stockType === 'Index'
                                                    ? 'bg-teal-700 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Index
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setMarketType('OPTIONS')}
                                className={`text-sm font-bold flex items-center gap-1 ${marketType === 'OPTIONS' ? 'text-teal-700' : 'text-gray-500'}`}
                            >
                                OPTIONS {marketType === 'OPTIONS' && <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Dropdowns Section */}
                        <div className="flex flex-wrap items-end gap-4">
                            {marketType === 'FUTURES' && stockType === 'Index' && (
                                <>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Index</label>
                                        <select
                                            value={selectedIndex}
                                            onChange={(e) => setSelectedIndex(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[140px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[140px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            {foExpiryDates.map(date => (
                                                <option key={date} value={date}>{date}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded transition-colors">
                                        Search Futures
                                    </button>
                                </>
                            )}

                            {marketType === 'FUTURES' && stockType === 'Stocks' && (
                                <>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Stock</label>
                                        <select
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[140px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option>Select</option>
                                            <option>RELIANCE</option>
                                            <option>TCS</option>
                                            <option>INFY</option>
                                            <option>HDFCBANK</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
                                        <select
                                            value={selectedExpiry}
                                            onChange={(e) => setSelectedExpiry(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[140px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            {foExpiryDates.map(date => (
                                                <option key={date} value={date}>{date}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded transition-colors">
                                        Search Futures
                                    </button>
                                </>
                            )}

                            {marketType === 'OPTIONS' && (
                                <>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Stock</label>
                                        <select
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[120px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option>Select</option>
                                            <option>RELIANCE</option>
                                            <option>TCS</option>
                                            <option>INFY</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
                                        <select
                                            value={selectedExpiry}
                                            onChange={(e) => setSelectedExpiry(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[120px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            {foExpiryDates.map(date => (
                                                <option key={date} value={date}>{date}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Option Type</label>
                                        <select
                                            value={optionType}
                                            onChange={(e) => setOptionType(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[100px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option>Select</option>
                                            <option>CE</option>
                                            <option>PE</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Strike Price</label>
                                        <select
                                            value={strikePrice}
                                            onChange={(e) => setStrikePrice(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[100px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option>Select</option>
                                            <option>25500</option>
                                            <option>25600</option>
                                            <option>25700</option>
                                        </select>
                                    </div>
                                    <button className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded transition-colors">
                                        Search Options
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Index Futures Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                    <div className="flex items-center gap-4 mb-5">
                        <h2 className="text-lg font-semibold text-gray-900">Index Futures NIFTY</h2>
                        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white min-w-[120px]">
                            <option>Select</option>
                            {foIndices.filter(i => i !== 'Select').map(idx => (
                                <option key={idx} value={idx}>{idx}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Price and Details */}
                        <div>
                            {/* Price Header */}
                            <div className="mb-5 pb-4 border-b border-gray-200">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-bold text-gray-900 text-lg">NIFTY</span>
                                    <span className="text-sm text-gray-500">{indexFuturesData.expiry}</span>
                                </div>
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <span className="text-3xl font-bold text-gray-900">{formatNumber(indexFuturesData.ltp)}</span>
                                    <span className="text-lg text-green-600 font-medium">▲ {indexFuturesData.change}</span>
                                    <span className="text-lg text-green-600 font-medium">({indexFuturesData.changePercent}%)</span>
                                    <button className="text-blue-600 text-sm flex items-center gap-1 ml-2 hover:underline">
                                        <Plus className="w-4 h-4" /> Add to Watchlist
                                    </button>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-0 text-sm">
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Open</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.open)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Avg. Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.avgPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">High</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.high)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Contracts Traded</span>
                                    <span className="font-medium text-blue-600">{formatNumber(indexFuturesData.contractsTraded)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Low</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.low)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Turnover (Rs.lakhs)</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.turnover)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Prev. Close</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.prevClose)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Market Lot</span>
                                    <span className="font-medium">{indexFuturesData.marketLot}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Spot Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.spotPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Open Interest</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.openInterest)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Open Int PCR</span>
                                    <span className="font-medium">{indexFuturesData.openIntPCR}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Open Int. Chg</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.openIntChange)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Prev OI PCR</span>
                                    <span className="font-medium">{indexFuturesData.prevOIPCR}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">OI Chg %</span>
                                    <span className="font-medium">{indexFuturesData.oiChangePercent}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Bid Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.bidPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Offer Price</span>
                                    <span className="font-medium">{formatNumber(indexFuturesData.offerPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Bid Qty</span>
                                    <span className="font-medium">{indexFuturesData.bidQty}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 py-2">
                                    <span className="text-gray-500">Offer Qty</span>
                                    <span className="font-medium">{indexFuturesData.offerQty}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Rollover %</span>
                                    <span className="font-medium">{indexFuturesData.rolloverPercent}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Placeholder for chart or additional info */}
                        <div className="hidden lg:block">
                            {/* This space can be used for charts or additional widgets */}
                        </div>
                    </div>
                </div>

                {/* Option Chain Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                    <div className="flex items-center gap-4 mb-5">
                        <h2 className="text-lg font-semibold text-gray-900">Option Chain NIFTY</h2>
                        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white min-w-[120px]">
                            <option>Select</option>
                            {foIndices.filter(i => i !== 'Select').map(idx => (
                                <option key={idx} value={idx}>{idx}</option>
                            ))}
                        </select>
                    </div>

                    {/* Expiry Tabs */}
                    <div className="flex border border-gray-300 rounded overflow-hidden w-fit mb-5">
                        {(['Near', 'Next', 'Far'] as ExpiryTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setOptionExpiryTab(tab)}
                                className={`px-5 py-2 text-sm font-medium transition-colors ${optionExpiryTab === tab
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                    } ${tab !== 'Near' ? 'border-l border-gray-300' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Option Chain Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th colSpan={4} className="py-3 text-center font-bold text-gray-800 bg-gray-50">CALLS</th>
                                    <th className="py-3 bg-gray-100"></th>
                                    <th colSpan={4} className="py-3 text-center font-bold text-gray-800 bg-gray-50">PUTS</th>
                                </tr>
                                <tr className="border-b border-gray-200 text-gray-600 text-xs">
                                    <th className="py-2 px-2 text-center font-medium">Premium</th>
                                    <th className="py-2 px-2 text-center font-medium">Volume</th>
                                    <th className="py-2 px-2 text-center font-medium">Open Int</th>
                                    <th className="py-2 px-2 text-center font-medium">Open Int</th>
                                    <th className="py-2 px-3 text-center font-bold bg-gray-100">Strike Price</th>
                                    <th className="py-2 px-2 text-center font-medium">Open Int</th>
                                    <th className="py-2 px-2 text-center font-medium">Open Int</th>
                                    <th className="py-2 px-2 text-center font-medium">Volume</th>
                                    <th className="py-2 px-2 text-center font-medium">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enhancedOptionChainData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-2 text-center">
                                            <span className="text-red-600 font-medium">{row.callPremium}</span>
                                            <br />
                                            <span className="text-xs text-gray-500">({row.callPremiumPct})</span>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-700">{row.callVolume}</td>
                                        <td className="py-3 px-2 text-center">
                                            <span className="text-red-600 font-medium">{row.callOpenInt}</span>
                                            <br />
                                            <span className="text-xs text-red-500">({row.callOpenIntPct})</span>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-700">-</td>
                                        <td className="py-3 px-3 text-center font-bold bg-gray-50">{formatNumber(row.strikePrice)}</td>
                                        <td className="py-3 px-2 text-center">
                                            <span className="text-green-600 font-medium">{row.putOpenInt}</span>
                                            <br />
                                            <span className="text-xs text-green-500">({row.putOpenIntPct})</span>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-700">-</td>
                                        <td className="py-3 px-2 text-center text-gray-700">{row.putVolume}</td>
                                        <td className="py-3 px-2 text-center">
                                            <span className="text-red-600 font-medium">{row.putPremium}</span>
                                            <br />
                                            <span className="text-xs text-red-500">{row.putPremiumPct}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* F&O Stats and Announcements Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* F&O Stats */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">F&O Stats</h2>
                        <div className="flex flex-wrap border border-gray-300 rounded overflow-hidden w-fit mb-4">
                            {(['Top Gainers', 'Top Losers', 'Active Calls', 'Active Puts'] as FOStatsTab[]).map((tab, idx) => (
                                <button
                                    key={tab}
                                    onClick={() => setFoStatsTab(tab)}
                                    className={`px-3 py-2 text-xs font-medium transition-colors ${foStatsTab === tab
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                        } ${idx !== 0 ? 'border-l border-gray-300' : ''}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium">Futures</th>
                                    <th className="py-2 text-right font-medium">CMP</th>
                                    <th className="py-2 text-right font-medium">Change</th>
                                    <th className="py-2 text-right font-medium">%Chg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(foStatsTab === 'Top Gainers' ? foStatsGainers : foStatsLosers).slice(0, 5).map((row) => (
                                    <tr key={row.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2">
                                            <span className="text-blue-600 font-medium hover:underline cursor-pointer">{row.symbol}</span>
                                            <span className="text-gray-400 text-xs ml-1">{row.expiry}</span>
                                        </td>
                                        <td className="py-2 text-right">{formatNumber(row.cmp)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.change)}`}>{row.change.toFixed(2)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.changePercent)}`}>
                                            {row.changePercent > 0 ? '+' : ''}{row.changePercent.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-right">
                            <a href="#" className="text-blue-600 text-sm hover:underline">more</a>
                        </div>
                        <div className="mt-4 text-xs text-blue-600 flex flex-wrap gap-2">
                            <a href="#" className="hover:underline">Most Active (Shares)</a> |
                            <a href="#" className="hover:underline">Most Active (Value)</a> |
                            <a href="#" className="hover:underline">Increase in Open Interest</a> |
                            <a href="#" className="hover:underline">Decrease in Open Interest</a> |
                            <a href="#" className="hover:underline">Arbitrage</a> |
                            <a href="#" className="hover:underline">Advance/Decline & Vol. Breakup</a>
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Announcements on F&O Stocks</h2>
                        <div className="border border-gray-300 rounded overflow-hidden w-fit mb-4">
                            <button className="px-4 py-2 text-sm bg-gray-200 font-medium">Announcements</button>
                        </div>
                        <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                            {announcementsData.map((ann, idx) => (
                                <div key={idx} className="flex gap-2 py-1">
                                    <span className="text-gray-500 whitespace-nowrap text-xs">{ann.date} {ann.time} -</span>
                                    <a href={ann.link} className="text-blue-600 hover:underline truncate text-xs">{ann.title}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sector Wise OI and Global Indices Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sector Wise OI */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sector Wise Open Interest & Volume</h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Sector</label>
                                <select
                                    value={selectedSector}
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                                >
                                    {foSectors.map(sec => (
                                        <option key={sec} value={sec}>{sec}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Index</label>
                                <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                                    <option>Select</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex border border-gray-300 rounded overflow-hidden w-fit mb-4">
                            {(['OI', 'Volume'] as OITab[]).map((tab, idx) => (
                                <button
                                    key={tab}
                                    onClick={() => setOiTab(tab)}
                                    className={`px-5 py-2 text-sm font-medium transition-colors ${oiTab === tab
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                        } ${idx !== 0 ? 'border-l border-gray-300' : ''}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium">Index</th>
                                    <th className="py-2 text-right font-medium">CMP (% chg)</th>
                                    <th className="py-2 text-right font-medium">Open Int (% chg)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorOIData.slice(0, 6).map((row) => (
                                    <tr key={row.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 text-blue-600 font-medium hover:underline cursor-pointer">{row.symbol}</td>
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
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Indices</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium">Index</th>
                                    <th className="py-2 text-right font-medium">CMP</th>
                                    <th className="py-2 text-right font-medium">Change</th>
                                    <th className="py-2 text-right font-medium">% Chg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['US Markets', 'European Markets', 'Asian Markets'].map(category => (
                                    <>
                                        <tr key={category} className="bg-gray-100">
                                            <td colSpan={4} className="py-2 font-semibold text-gray-700">{category}</td>
                                        </tr>
                                        {globalIndicesData.filter(idx => idx.category === category).slice(0, 2).map(row => (
                                            <tr key={row.name} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-2 text-blue-600 font-medium hover:underline cursor-pointer">{row.name}</td>
                                                <td className="py-2 text-right">{formatNumber(row.cmp)}</td>
                                                <td className={`py-2 text-right ${getColorClass(row.change)}`}>{row.change.toFixed(2)}</td>
                                                <td className={`py-2 text-right ${getColorClass(row.changePercent)}`}>{row.changePercent.toFixed(2)}%</td>
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
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Open Interest Breakup</h2>
                            <a href="#" className="text-blue-600 text-sm hover:underline">Detailed View</a>
                        </div>
                        <div className="flex border border-gray-300 rounded overflow-hidden w-fit mb-4">
                            {(['Near', 'Next', 'Far'] as ExpiryTab[]).map((tab, idx) => (
                                <button
                                    key={tab}
                                    className={`px-5 py-2 text-sm font-medium ${tab === 'Near' ? 'bg-gray-200' : 'bg-white text-gray-600'
                                        } ${idx !== 0 ? 'border-l border-gray-300' : ''}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium">Symbol</th>
                                    <th className="py-2 text-right font-medium">Total OI</th>
                                    <th className="py-2 text-right font-medium">Change</th>
                                    <th className="py-2 text-right font-medium">% Chg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openInterestData.slice(0, 5).map((row) => (
                                    <tr key={row.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2">
                                            <span className="text-blue-600 font-medium hover:underline cursor-pointer">{row.symbol}</span>
                                            <span className="text-gray-400 text-xs ml-1">{row.expiry}</span>
                                        </td>
                                        <td className="py-2 text-right">{formatNumber(row.totalOI)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.change)}`}>{formatNumber(row.change)}</td>
                                        <td className={`py-2 text-right ${getColorClass(row.changePercent)}`}>{row.changePercent.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-right">
                            <a href="#" className="text-blue-600 text-sm hover:underline">more</a>
                        </div>
                    </div>

                    {/* Arbitrage */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Arbitrage</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium">Company</th>
                                    <th className="py-2 text-right font-medium">Future</th>
                                    <th className="py-2 text-right font-medium">Cash</th>
                                    <th className="py-2 text-right font-medium">Basis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arbitrageData.slice(0, 6).map((row) => (
                                    <tr key={row.company} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 text-blue-600 font-medium hover:underline cursor-pointer">{row.company}</td>
                                        <td className="py-2 text-right font-medium">{formatNumber(row.future)}</td>
                                        <td className="py-2 text-right">{formatNumber(row.cash)}</td>
                                        <td className="py-2 text-right">{row.basis.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 text-right">
                            <a href="#" className="text-blue-600 text-sm hover:underline">Detailed View</a>
                        </div>
                    </div>
                </div>

                {/* Corporate Action and Advance Decline Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Corporate Action */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Corporate Action</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium">Stock</th>
                                    <th className="py-2 text-center font-medium">Ex-Date</th>
                                    <th className="py-2 text-left font-medium">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {corporateActionData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 text-blue-600 hover:underline cursor-pointer">{row.stock}</td>
                                        <td className="py-2 text-center font-medium">{row.exDate}</td>
                                        <td className="py-2">{row.purpose}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Advance Decline Table */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Advance Decline Table</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 text-left font-medium"></th>
                                    <th className="py-2 text-center font-medium">Future</th>
                                    <th className="py-2 text-center font-medium">Calls</th>
                                    <th className="py-2 text-center font-medium">Puts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {advanceDeclineData.map((row) => (
                                    <tr key={row.category} className="border-b border-gray-100 hover:bg-gray-50">
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
                                <tr className="font-semibold bg-gray-50">
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
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Securities In Ban Period for 17-Jan-26</h2>
                    <p className="text-blue-600 font-medium">No Stocks In Ban Period</p>
                </div>

                {/* Glossary */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">GLOSSARY</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {glossaryTerms.map((item) => (
                            <div key={item.term} className="flex items-center gap-2">
                                <span className="text-orange-500">★</span>
                                <a href={item.link} className="text-blue-600 hover:underline">{item.term}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
