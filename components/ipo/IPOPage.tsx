'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Share2 } from 'lucide-react';
import IPOCard from './IPOCard';
import ClosedIPOTable from './ClosedIPOTable';
import ListedIPOTable from './ListedIPOTable';
import DraftIssuesTable from './DraftIssuesTable';
import {
    openIPOData,
    upcomingIPOData,
    closedIPOData,
    listedIPOData,
    draftIssuesData,
    upcomingIPOLinks,
    ipoTabs,
    ipoFilters
} from '@/lib/results-calendar-data';

type IPOTabType = 'Open IPO' | 'Upcoming IPO' | 'Closed IPO' | 'Listed IPO' | 'Draft Issues';
type IPOFilterType = 'All IPO' | 'Mainline IPO' | 'SME IPO';

export default function IPOPage() {
    const [activeTab, setActiveTab] = useState<IPOTabType>('Open IPO');
    const [activeFilter, setActiveFilter] = useState<IPOFilterType>('All IPO');
    const [visibleCount, setVisibleCount] = useState(10);

    // Filter data based on IPO type
    const filterByType = (type: IPOFilterType) => {
        if (type === 'All IPO') return null;
        return type === 'Mainline IPO' ? 'Mainline' : 'SME';
    };

    // Get filtered data for each tab
    const filteredOpenIPO = useMemo(() => {
        const filterType = filterByType(activeFilter);
        if (!filterType) return openIPOData;
        return openIPOData.filter(item => item.type === filterType);
    }, [activeFilter]);

    const filteredUpcomingIPO = useMemo(() => {
        const filterType = filterByType(activeFilter);
        if (!filterType) return upcomingIPOData;
        return upcomingIPOData.filter(item => item.type === filterType);
    }, [activeFilter]);

    const filteredClosedIPO = useMemo(() => {
        const filterType = filterByType(activeFilter);
        if (!filterType) return closedIPOData;
        return closedIPOData.filter(item => item.type === filterType);
    }, [activeFilter]);

    const filteredListedIPO = useMemo(() => {
        const filterType = filterByType(activeFilter);
        if (!filterType) return listedIPOData;
        return listedIPOData.filter(item => item.type === filterType);
    }, [activeFilter]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'Open IPO':
                return 'Open IPO';
            case 'Upcoming IPO':
                return 'Upcoming IPO';
            case 'Closed IPO':
                return 'Closed IPO';
            case 'Listed IPO':
                return 'Listed IPO';
            case 'Draft Issues':
                return 'Draft Issues';
            default:
                return 'Open IPO';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Open IPO':
                return (
                    <div className="py-6">
                        {filteredOpenIPO.length === 0 ? (
                            <div className="py-8 text-center text-gray-400">
                                No Open IPOs found for this filter.
                            </div>
                        ) : (
                            filteredOpenIPO.map((ipo) => (
                                <IPOCard key={ipo.id} data={ipo} />
                            ))
                        )}
                    </div>
                );

            case 'Upcoming IPO':
                return (
                    <div className="py-6">
                        {filteredUpcomingIPO.length === 0 ? (
                            <div className="py-8 text-center text-gray-400">
                                No Upcoming IPOs found for this filter.
                            </div>
                        ) : (
                            filteredUpcomingIPO.map((ipo) => (
                                <IPOCard key={ipo.id} data={ipo} />
                            ))
                        )}
                    </div>
                );

            case 'Closed IPO':
                return (
                    <div className="py-6">
                        {filteredClosedIPO.length === 0 ? (
                            <div className="py-8 text-center text-gray-400">
                                No Closed IPOs found for this filter.
                            </div>
                        ) : (
                            <ClosedIPOTable data={filteredClosedIPO} />
                        )}
                    </div>
                );

            case 'Listed IPO':
                return (
                    <div className="py-6">
                        {filteredListedIPO.length === 0 ? (
                            <div className="py-8 text-center text-gray-400">
                                No Listed IPOs found for this filter.
                            </div>
                        ) : (
                            <ListedIPOTable data={filteredListedIPO.slice(0, visibleCount)} />
                        )}
                    </div>
                );

            case 'Draft Issues':
                return (
                    <div className="py-6">
                        <DraftIssuesTable data={draftIssuesData.slice(0, visibleCount)} />
                    </div>
                );

            default:
                return null;
        }
    };

    // Check if we should show load more button
    const showLoadMore = () => {
        switch (activeTab) {
            case 'Listed IPO':
                return visibleCount < filteredListedIPO.length;
            case 'Draft Issues':
                return visibleCount < draftIssuesData.length;
            default:
                return false;
        }
    };

    return (
        <div className="w-full min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 border-b border-gray-200">
                <nav className="flex gap-6">
                    {ipoTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab as IPOTabType);
                                setVisibleCount(10);
                            }}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Announcement Banner */}
            {(activeTab === 'Open IPO' || activeTab === 'Upcoming IPO') && (
                <div className="px-6 py-3 text-sm text-gray-600 border-b border-gray-100">
                    The upcoming IPOs in India this week and coming weeks are{' '}
                    {upcomingIPOLinks.map((link, index) => (
                        <span key={link.name}>
                            <a href={link.link} className="text-blue-600 hover:underline">
                                {link.name}
                            </a>
                            {index < upcomingIPOLinks.length - 1 && ', '}
                        </span>
                    ))}
                    .
                    <a href="#" className="text-blue-600 hover:underline ml-1">Read More</a>
                </div>
            )}

            {/* Filter Bar */}
            <div className="px-6 py-4 flex items-center gap-6 border-b border-gray-100">
                {ipoFilters.map((filter) => (
                    <label key={filter} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="ipoFilter"
                            checked={activeFilter === filter}
                            onChange={() => setActiveFilter(filter as IPOFilterType)}
                            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">{filter}</span>
                    </label>
                ))}
            </div>

            {/* Content */}
            <div className="px-6 min-h-[400px]">
                {renderContent()}
            </div>

            {/* Load More Button */}
            {showLoadMore() && (
                <div className="flex justify-center py-6 border-t border-gray-100">
                    <button
                        onClick={handleLoadMore}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Load More <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
