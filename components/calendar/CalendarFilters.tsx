'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface CalendarFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export default function CalendarFilters({ activeFilter, onFilterChange }: CalendarFiltersProps) {
    const filters = ['Yesterday', 'Today', 'Tomorrow', 'This Week', 'Next Week'];

    return (
        <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onFilterChange(filter)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${activeFilter === filter
                                ? 'bg-white border-[#1256A0] text-[#1256A0]' // Investing.com style: solid border when active
                                : 'bg-[#F5F5F5] border-transparent text-[#333333] hover:bg-gray-200'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333333] hover:bg-gray-200 border border-transparent">
                        <Calendar className="w-4 h-4" />
                        <span>Custom dates</span>
                    </button>
                </div>

                <div>
                    <button className="flex items-center gap-1 font-semibold text-[#1256A0] text-sm border border-[#DCE4EC] rounded px-3 py-1.5 bg-white hover:bg-gray-50">
                        Show Filters
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>Current Time: <span className="font-bold text-black">10:23</span> (GMT+5:30)</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
                </div>
                <div className="border-l border-gray-300 h-3 mx-1"></div>
                <div className="flex items-center gap-1">
                    <span>Display Time: <span className="text-black">remaining</span></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
                </div>
                <div className="ml-auto">
                    All data are streaming and updated automatically.
                </div>
            </div>
        </div>
    );
}
