'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
    topUnlistedShareCompanies,
    topGainersShares,
    topLosersShares,
    weekHigh52Shares,
    weekLow52Shares,
    preferredPartner,
    partners,
    unlistedSharesFAQs,
    unlistedSharesTabs,
    timePeriods,
    UnlistedSharesTabType,
    TimePeriodType,
    UnlistedShare
} from '@/lib/unlisted-shares-data';

export default function UnlistedSharesPage() {
    const [activeTab, setActiveTab] = useState<UnlistedSharesTabType>('Top Unlisted Share Companies');
    const [timePeriod, setTimePeriod] = useState<TimePeriodType>('1W');
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>('1');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Get data based on active tab
    const getSharesData = (): UnlistedShare[] => {
        switch (activeTab) {
            case 'Top Unlisted Share Companies':
                return topUnlistedShareCompanies;
            case 'Top Gainers':
                return topGainersShares;
            case 'Top Losers':
                return topLosersShares;
            case '52 Week High':
                return weekHigh52Shares;
            case '52 Week Low':
                return weekLow52Shares;
            default:
                return topUnlistedShareCompanies;
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = () => {
        const data = [...getSharesData()];
        if (!sortConfig) return data;

        return data.sort((a, b) => {
            const aValue = a[sortConfig.key as keyof UnlistedShare];
            const bValue = b[sortConfig.key as keyof UnlistedShare];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatChange = (change: number) => {
        const formatted = Math.abs(change).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return change >= 0 ? formatted : `-${formatted}`;
    };

    const getLastColumnLabel = () => {
        if (activeTab === '52 Week High') return '52 Week High';
        if (activeTab === '52 Week Low') return '52 Week Low';
        return null;
    };

    const sharesData = sortedData();
    const lastColumnLabel = getLastColumnLabel();

    return (
        <div className="w-full min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Unlisted Shares</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    Powered by
                    <span className="flex items-center gap-1 font-medium text-blue-600">
                        <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">InCred</span>
                        Money
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 border-b border-gray-200">
                <nav className="flex gap-6">
                    {unlistedSharesTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'border-gray-900 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Section */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Derived Prices</span>
                </div>
                <span className="text-xs text-gray-500">As on 9 Jan, 23:02</span>
            </div>

            {/* Table */}
            <div className="px-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <div className="col-span-2 px-4 py-3">Symbol</div>
                        <div className="px-4 py-3 text-right cursor-pointer hover:text-gray-900 flex items-center justify-end gap-1" onClick={() => handleSort('price')}>
                            Price
                            <ChevronDown className="w-3 h-3" />
                        </div>
                        <div className="px-4 py-3 text-right cursor-pointer hover:text-gray-900 flex items-center justify-end gap-1" onClick={() => handleSort('change')}>
                            Chg
                            <ChevronDown className="w-3 h-3" />
                        </div>
                        <div className="px-4 py-3 text-right">Chg%</div>
                        <div className="px-4 py-3 text-right cursor-pointer hover:text-gray-900 flex items-center justify-end gap-1" onClick={() => handleSort('previousClose')}>
                            {lastColumnLabel || 'Previous Close'}
                            <ChevronDown className="w-3 h-3" />
                        </div>
                        <div className="px-4 py-3 text-right">
                            <select
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value as TimePeriodType)}
                                className="bg-white border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {timePeriods.map((period) => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Body */}
                    {sharesData.length === 0 ? (
                        <div className="px-6 py-8 text-center text-blue-600 text-sm">
                            No data available in {activeTab}. Check after some time.
                        </div>
                    ) : (
                        sharesData.map((share) => (
                            <div key={share.id} className="grid grid-cols-7 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
                                <div className="col-span-2 px-4 py-3 flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: share.logoColor || '#6366F1' }}
                                    >
                                        {share.symbol.substring(0, 2)}
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm">{share.name}</span>
                                    <button className="ml-auto px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                                        Invest
                                    </button>
                                </div>
                                <div className="px-4 py-3 text-right font-medium text-gray-900 text-sm">
                                    {formatPrice(share.price)}
                                </div>
                                <div className={`px-4 py-3 text-right text-sm ${share.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatChange(share.change)}
                                </div>
                                <div className={`px-4 py-3 text-right text-sm ${share.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {share.changePercent >= 0 ? '' : ''}{share.changePercent.toFixed(2)}
                                </div>
                                <div className="px-4 py-3 text-right text-gray-600 text-sm">
                                    {formatPrice(share.previousClose)}
                                </div>
                                <div className={`px-4 py-3 text-right text-sm ${share.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {share.changePercent >= 0 ? '' : ''}{share.changePercent.toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Note */}
            <div className="px-6 py-4 text-xs text-gray-500">
                Note: Prices are derived on Moneycontrol from below partners
            </div>

            {/* Partners Section */}
            <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Preferred Partner & Our Partners */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preferred Partner */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Partner</h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg w-fit">
                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                IC
                            </div>
                            <span className="font-medium text-gray-900">{preferredPartner.name}</span>
                        </div>
                    </div>

                    {/* Our Partners */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Partners</h3>
                        <div className="flex flex-wrap gap-4">
                            {partners.map((partner) => (
                                <div key={partner.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs font-bold">
                                        {partner.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-700">{partner.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top News - Only show for 52 Week tabs */}
                {(activeTab === '52 Week High' || activeTab === '52 Week Low') && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">Top News</h3>
                            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                Show More <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                                <p className="text-sm text-gray-700">Six IPOs worth over Rs 2,000 crore to hit Dalal Street next week; live t...</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                                <p className="text-sm text-gray-700">Nifty closes at a 43-session low: Is it time to go short on every rise?</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FAQs */}
            <div className="px-6 py-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {unlistedSharesFAQs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-900">{faq.question}</span>
                                {expandedFAQ === faq.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            {expandedFAQ === faq.id && (
                                <div className="px-4 pb-4 text-sm text-gray-600">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
