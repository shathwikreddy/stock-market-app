'use client';

import { useState, useMemo } from 'react';
import { corporateActionsData, eventTypes, CorporateActionData } from '@/lib/results-calendar-data';
import { ExternalLink } from 'lucide-react';

export default function CorporateCalendarView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('All');
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredData = useMemo(() => {
        let data = [...corporateActionsData];

        // Filter by event type
        if (eventTypeFilter !== 'All') {
            data = data.filter(item => item.eventType === eventTypeFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.stockName.toLowerCase().includes(query)
            );
        }

        return data;
    }, [eventTypeFilter, searchQuery]);

    return (
        <div className="w-full">
            {/* Filters Row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        <ExternalLink className="w-4 h-4" />
                        All NSE
                    </button>

                    {/* Event Type Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Event Type
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {eventTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setEventTypeFilter(type);
                                            setShowDropdown(false);
                                        }}
                                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${eventTypeFilter === type ? 'bg-gray-50 font-medium' : ''
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <span className="text-sm text-gray-500">Last Updated 07/01/2026</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-xs font-medium text-gray-500">
                            <th className="py-3 px-4 text-left">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search stock"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-36 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </th>
                            <th className="py-3 px-4 text-left">Event Type</th>
                            <th className="py-3 px-4 text-center">Announced Date</th>
                            <th className="py-3 px-4 text-center">Ex- Date</th>
                            <th className="py-3 px-4 text-right">Dividend(Rs.)</th>
                            <th className="py-3 px-4 text-right">Ratio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">
                                    No corporate actions found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-semibold text-gray-900">{item.stockName}</td>
                                    <td className="py-3 px-4 text-gray-600">{item.eventType}</td>
                                    <td className="py-3 px-4 text-center text-gray-600">{item.announcedDate}</td>
                                    <td className="py-3 px-4 text-center text-gray-600">{item.exDate}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{item.dividend || '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{item.ratio || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
