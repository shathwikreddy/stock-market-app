'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import {
    bulkDealsData,
    exchangeOptions,
    transactionOptions,
    sortOptions,
    BulkDeal,
} from '@/lib/bulkDealsMockData';

function formatQuantity(num: number): string {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(0) + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(0) + ' L';
    }
    return num.toLocaleString('en-IN');
}

interface BulkDealCardProps {
    deal: BulkDeal;
}

function BulkDealCard({ deal }: BulkDealCardProps) {
    const isPurchase = deal.transactionType === 'PURCHASE';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            {/* Date Row */}
            <div className="text-xs text-gray-500 mb-3">{deal.date}</div>

            {/* Deal Type and Transaction Badge Row */}
            <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs font-semibold bg-gray-800 text-white rounded">
                    {deal.dealType}
                </span>
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded ${isPurchase
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                >
                    {deal.transactionType}
                </span>
            </div>

            {/* Stock Name */}
            <h3 className="font-semibold text-gray-900 text-base mb-1">{deal.stockName}</h3>

            {/* Client Info */}
            <p className="text-sm text-gray-500 mb-4">
                <span className={isPurchase ? 'text-green-600' : 'text-red-600'}>
                    {isPurchase ? 'Bought by' : 'Sold by'}
                </span>{' '}
                <span className="text-blue-600">{deal.clientName}</span>
            </p>

            {/* Stats Grid - Row 1 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                    <p className="font-semibold text-gray-900 text-sm">{formatQuantity(deal.quantity)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Traded Price</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.tradedPrice.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Deal Value (Rs. Cr.)</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.dealValue.toFixed(2)}</p>
                </div>
            </div>

            {/* Stats Grid - Row 2 */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">% Traded</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.percentTraded.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Exchange</p>
                    <p className="font-semibold text-gray-900 text-sm">{deal.exchange}</p>
                </div>
            </div>
        </div>
    );
}

export default function BulkDealsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExchange, setSelectedExchange] = useState('All Exchanges');
    const [selectedTransaction, setSelectedTransaction] = useState('All Transactions');
    const [selectedSort, setSelectedSort] = useState('Date (Newest)');
    const [dateRange, setDateRange] = useState('');

    const filteredData = useMemo(() => {
        let result = bulkDealsData.filter((deal) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !deal.stockName.toLowerCase().includes(query) &&
                    !deal.symbol.toLowerCase().includes(query) &&
                    !deal.clientName.toLowerCase().includes(query)
                ) {
                    return false;
                }
            }

            if (selectedExchange !== 'All Exchanges' && deal.exchange !== selectedExchange) {
                return false;
            }

            if (selectedTransaction !== 'All Transactions' && deal.transactionType !== selectedTransaction) {
                return false;
            }

            return true;
        });

        switch (selectedSort) {
            case 'Date (Oldest)':
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
    }, [searchQuery, selectedExchange, selectedTransaction, selectedSort]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search and Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Stock Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <span className="text-gray-400 text-sm">OR</span>

                    {/* Advanced Search Link */}
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        Advance Search
                    </button>

                    <div className="flex-1" />

                    {/* Date Range Selector */}
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[160px]"
                        >
                            <option value="">Select Date Range</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="quarter">Last Quarter</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Sort By */}
                    <div className="relative">
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[100px]"
                        >
                            {sortOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option === sortOptions[0] ? 'Sort By' : option}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((deal) => (
                        <BulkDealCard key={deal.id} deal={deal} />
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No bulk deals found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
