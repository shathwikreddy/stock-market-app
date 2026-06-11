'use client';

import { useState, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarFilters from './CalendarFilters';
import CalendarTable from './CalendarTable';
import HolidaysTable from './HolidaysTable';
import EarningsTable from './EarningsTable';
import DividendsTable from './DividendsTable';
import SplitsTable from './SplitsTable';
import IPOTable from './IPOTable';
import ExpirationTable from './ExpirationTable';
import AddEntryModal from './AddEntryModal';
import { useCalendarData } from '@/hooks/useCalendarData';
import dummyData from '@/data/economic-calendar-data.json';

const data = dummyData as any;

type TabType = 'Economic Calendar' | 'Holidays' | 'Earnings' | 'Dividends' | 'Splits' | 'IPO' | 'Expiration';

export default function EconomicCalendar() {
    const [activeTab, setActiveTab] = useState<TabType>('Economic Calendar');
    const [activeFilter, setActiveFilter] = useState('Today');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        customData,
        isLoaded,
        addEconomicEvent,
        deleteEconomicEvent,
        addHoliday,
        deleteHoliday,
        addEarning,
        deleteEarning,
        addDividend,
        deleteDividend,
        addSplit,
        deleteSplit,
        addIPO,
        deleteIPO,
        addExpiration,
        deleteExpiration,
    } = useCalendarData();

    const filterData = (categoryData: any[]) => {
        if (!categoryData) return [];

        if (activeTab === 'Economic Calendar') {
            if (activeFilter === 'Yesterday' || activeFilter === 'Today' || activeFilter === 'Tomorrow') {
                return categoryData.filter((item: any) => item.date === activeFilter);
            }
        }

        return categoryData;
    };

    const applySearch = (items: any[]) => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter((item: any) => {
            return Object.values(item).some((value) =>
                String(value).toLowerCase().includes(query)
            );
        });
    };

    const allEconomic = useMemo(() => {
        return [...(data.economic || []), ...customData.economic];
    }, [customData.economic]);

    const allHolidays = useMemo(() => {
        return [...(data.holidays || []), ...customData.holidays];
    }, [customData.holidays]);

    const allEarnings = useMemo(() => {
        return [...(data.earnings || []), ...customData.earnings];
    }, [customData.earnings]);

    const allDividends = useMemo(() => {
        return [...(data.dividends || []), ...customData.dividends];
    }, [customData.dividends]);

    const allSplits = useMemo(() => {
        return [...(data.splits || []), ...customData.splits];
    }, [customData.splits]);

    const allIPO = useMemo(() => {
        return [...(data.ipo || []), ...customData.ipo];
    }, [customData.ipo]);

    const allExpiration = useMemo(() => {
        return [...(data.expiration || []), ...customData.expiration];
    }, [customData.expiration]);

    const getCustomIds = (category: keyof typeof customData) => {
        return customData[category].map((item: any) => item.id);
    };

    const renderContent = () => {
        if (!isLoaded) {
            return <div className="p-4 text-center text-gray-400">Loading...</div>;
        }

        switch (activeTab) {
            case 'Economic Calendar':
                return (
                    <CalendarTable
                        events={applySearch(filterData(allEconomic))}
                        onDeleteEvent={deleteEconomicEvent}
                        customEventIds={getCustomIds('economic')}
                    />
                );
            case 'Holidays':
                return (
                    <HolidaysTable
                        events={applySearch(filterData(allHolidays))}
                        onDeleteHoliday={deleteHoliday}
                        customHolidayIds={getCustomIds('holidays')}
                    />
                );
            case 'Earnings':
                return (
                    <EarningsTable
                        events={applySearch(filterData(allEarnings))}
                        onDeleteEarning={deleteEarning}
                        customEarningIds={getCustomIds('earnings')}
                    />
                );
            case 'Dividends':
                return (
                    <DividendsTable
                        events={applySearch(filterData(allDividends))}
                        onDeleteDividend={deleteDividend}
                        customDividendIds={getCustomIds('dividends')}
                    />
                );
            case 'Splits':
                return (
                    <SplitsTable
                        events={applySearch(filterData(allSplits))}
                        onDeleteSplit={deleteSplit}
                        customSplitIds={getCustomIds('splits')}
                    />
                );
            case 'IPO':
                return (
                    <IPOTable
                        events={applySearch(filterData(allIPO))}
                        onDeleteIPO={deleteIPO}
                        customIPOIds={getCustomIds('ipo')}
                    />
                );
            case 'Expiration':
                return (
                    <ExpirationTable
                        events={applySearch(filterData(allExpiration))}
                        onDeleteExpiration={deleteExpiration}
                        customExpirationIds={getCustomIds('expiration')}
                    />
                );
            default:
                return <div className="p-4 text-center">Select a tab</div>;
        }
    };

    const getAddButtonLabel = () => {
        switch (activeTab) {
            case 'Economic Calendar': return 'Add Event';
            case 'Holidays': return 'Add Holiday';
            case 'Earnings': return 'Add Earnings';
            case 'Dividends': return 'Add Dividend';
            case 'Splits': return 'Add Split';
            case 'IPO': return 'Add IPO';
            case 'Expiration': return 'Add Expiration';
            default: return 'Add Entry';
        }
    };

    return (
        <div className="w-full bg-white font-sans text-[#333333]">
            <CalendarHeader activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} />

            <CalendarFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {getAddButtonLabel()}
                </button>
            </div>

            <div className="min-h-[300px]">
                {renderContent()}
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Real-time {activeTab} provided by Investing.com.</p>
            </div>

            <AddEntryModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                activeTab={activeTab}
                onAddEconomic={addEconomicEvent}
                onAddHoliday={addHoliday}
                onAddEarning={addEarning}
                onAddDividend={addDividend}
                onAddSplit={addSplit}
                onAddIPO={addIPO}
                onAddExpiration={addExpiration}
            />
        </div>
    );
}
