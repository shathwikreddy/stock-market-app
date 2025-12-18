'use client';

import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarFilters from './CalendarFilters';
import CalendarTable from './CalendarTable';
import HolidaysTable from './HolidaysTable';
import EarningsTable from './EarningsTable';
import DividendsTable from './DividendsTable';
import SplitsTable from './SplitsTable';
import IPOTable from './IPOTable';
import ExpirationTable from './ExpirationTable';
import dummyData from '@/data/economic-calendar-data.json';

// Type assertion for dummyData to handle loose typing of JSON import
const data = dummyData as any;

export default function EconomicCalendar() {
    const [activeTab, setActiveTab] = useState('Economic Calendar');
    const [activeFilter, setActiveFilter] = useState('Today');

    // Generic filter function based on date
    const filterData = (categoryData: any[]) => {
        if (!categoryData) return [];

        // Extended filtering logic for demo:
        // If the category has exact dates like "Dec 16, 2025" in JSON, we can't easily map "Today" to it without a real date library and knowing what "Today" is.
        // For this demo, we will Just Return All Data for the new categories (Holidays, Dividends, etc.) 
        // to ensure the user sees the expanded tables immediately without fighting the "Today" filter being empty.
        // The Economic Calendar tab still uses "Today"/"Tomorrow" strings so we keep logic for that.

        if (activeTab === 'Economic Calendar') {
            if (activeFilter === 'Yesterday' || activeFilter === 'Today' || activeFilter === 'Tomorrow') {
                return categoryData.filter((item: any) => item.date === activeFilter);
            }
        }

        // For other tabs with hardcoded specific dates (Dec 16, Dec 17...), show all for now
        // so the user can verify the structure regardless of the filter button state.
        return categoryData;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Economic Calendar':
                return <CalendarTable events={filterData(data.economic)} />;
            case 'Holidays':
                return <HolidaysTable events={filterData(data.holidays)} />;
            case 'Earnings':
                return <EarningsTable events={filterData(data.earnings)} />;
            case 'Dividends':
                return <DividendsTable events={filterData(data.dividends)} />;
            case 'Splits':
                return <SplitsTable events={filterData(data.splits)} />;
            case 'IPO':
                return <IPOTable events={filterData(data.ipo)} />;
            case 'Expiration':
                return <ExpirationTable events={filterData(data.expiration)} />;
            default:
                return <div className="p-4 text-center">Select a tab</div>;
        }
    };

    return (
        <div className="w-full bg-white font-sans text-[#333333]">
            <CalendarHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Filters usually apply to most tabs, but maybe not all in real life. 
          For consistency with Investing.com, dates apply to most. */}
            <CalendarFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            <div className="min-h-[300px]">
                {renderContent()}
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Real-time {activeTab} provided by Investing.com.</p>
            </div>
        </div>
    );
}
