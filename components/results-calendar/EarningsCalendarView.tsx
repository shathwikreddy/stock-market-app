'use client';

import { useState, useMemo } from 'react';
import { earningsData, dateFilters, EarningsData } from '@/lib/results-calendar-data';
import { ExternalLink } from 'lucide-react';

export default function EarningsCalendarView() {
    const [activeFilter, setActiveFilter] = useState('Today');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Market Cap');

    const getDateFromFilter = (filter: string): string => {
        const today = new Date();
        switch (filter) {
            case 'Yesterday':
                return '6 Jan';
            case 'Today':
                return '7 Jan';
            case 'Tomorrow':
                return '8 Jan';
            default:
                return '';
        }
    };

    const filteredData = useMemo(() => {
        let data = [...earningsData];

        // Filter by date
        if (activeFilter === 'Yesterday' || activeFilter === 'Today' || activeFilter === 'Tomorrow') {
            const targetDate = getDateFromFilter(activeFilter);
            data = data.filter(item => item.date === targetDate);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.stockName.toLowerCase().includes(query)
            );
        }

        return data;
    }, [activeFilter, searchQuery]);

    return (
        <div className="w-full">
            {/* Date Filters */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    {dateFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${activeFilter === filter
                                    ? 'bg-white border border-gray-300 text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                    Select Date 📅
                </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        <ExternalLink className="w-4 h-4" />
                        All
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        📅 Add to Calendar
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Market Cap</option>
                        <option>% Change</option>
                        <option>LTP</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-xs font-medium text-gray-500">
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search stock"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </th>
                            <th className="py-3 px-4 text-left">Result Type</th>
                            <th className="py-3 px-4 text-right">LTP</th>
                            <th className="py-3 px-4 text-right">% Change</th>
                            <th className="py-3 px-4 text-center">Tentative Time</th>
                            <th className="py-3 px-4 text-center">See Financials</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400">
                                    No earnings data found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-600">{item.date}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-900">{item.stockName}</td>
                                    <td className="py-3 px-4 text-gray-600">{item.resultType}</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900">{item.ltp.toFixed(2)}</td>
                                    <td className={`py-3 px-4 text-right font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} %
                                    </td>
                                    <td className="py-3 px-4 text-center text-gray-500 text-xs">
                                        {item.tentativeTime}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600">
                                            <ExternalLink className="w-4 h-4 mx-auto" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
