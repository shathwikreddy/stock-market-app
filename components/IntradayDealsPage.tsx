'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MoreVertical } from 'lucide-react';
import {
    intradayDealsData,
    filterTabs,
    sortOptions,
    IntradayDeal,
} from '@/lib/intradayDealsMockData';

function formatQuantity(num: number): string {
    return num.toLocaleString('en-IN');
}

interface IntradayDealCardProps {
    deal: IntradayDeal;
}

function IntradayDealCard({ deal }: IntradayDealCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            {/* Date and Time Row */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-blue-600">
                    {deal.date} | {deal.time}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
            </div>

            {/* Stock Name */}
            <h3 className="font-semibold text-gray-900 text-base mb-1">{deal.stockName}</h3>

            {/* Industry */}
            <p className="text-sm text-amber-700 mb-4">{deal.industry}</p>

            {/* Stats Grid - Row 1 */}
            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                    <p className="font-semibold text-gray-900 text-sm">{formatQuantity(deal.quantity)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Traded Price</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.tradedPrice.toFixed(2)}</p>
                </div>
            </div>

            {/* Stats Grid - Row 2 */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Deal Value (Rs. Cr.)</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.dealValue.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Exchange</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.exchange}</p>
                </div>
            </div>
        </div>
    );
}

export default function IntradayDealsPage() {
    const [activeTab, setActiveTab] = useState(filterTabs[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('Time (Latest)');

    const filteredData = useMemo(() => {
        let result = intradayDealsData.filter((deal) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !deal.stockName.toLowerCase().includes(query) &&
                    !deal.symbol.toLowerCase().includes(query) &&
                    !deal.industry.toLowerCase().includes(query)
                ) {
                    return false;
                }
            }
            return true;
        });

        switch (selectedSort) {
            case 'Time (Oldest)':
                result = [...result].reverse();
                break;
            case 'Deal Value (High)':
                result = [...result].sort((a, b) => b.dealValue - a.dealValue);
                break;
            case 'Deal Value (Low)':
                result = [...result].sort((a, b) => a.dealValue - b.dealValue);
                break;
            case 'Quantity (High)':
                result = [...result].sort((a, b) => b.quantity - a.quantity);
                break;
            case 'Quantity (Low)':
                result = [...result].sort((a, b) => a.quantity - b.quantity);
                break;
            default:
                break;
        }

        return result;
    }, [searchQuery, selectedSort]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex flex-wrap gap-1">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                        ? 'text-gray-900 border-b-2 border-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Company Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter By Button */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <span>Filter by</span>
                        <Filter className="h-4 w-4" />
                    </button>

                    <div className="flex-1" />

                    {/* Today Button */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <span>Today</span>
                        <Calendar className="h-4 w-4" />
                    </button>

                    {/* Sort By Button */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <span>Sort By</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((deal) => (
                        <IntradayDealCard key={deal.id} deal={deal} />
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No intraday deals found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
