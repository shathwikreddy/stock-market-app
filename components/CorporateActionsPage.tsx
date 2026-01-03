'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Calendar, Filter, ExternalLink } from 'lucide-react';
import {
    corporateActionsData,
    filterTabs,
    purposeOptions,
    CorporateAction,
} from '@/lib/corporateActionsMockData';

function formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parts[2];
    return `${day.toString().padStart(2, '0')} ${months[month]} ${year}`;
}

function getBadgeStyle(badge: string): string {
    switch (badge) {
        case 'AGM-EGM':
            return 'bg-green-100 text-green-700 border-green-300';
        case 'Board Meetings':
            return 'bg-gray-100 text-gray-700 border-gray-300';
        case 'Dividends':
            return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'Bonus':
            return 'bg-purple-100 text-purple-700 border-purple-300';
        case 'Splits':
            return 'bg-orange-100 text-orange-700 border-orange-300';
        case 'Rights':
            return 'bg-cyan-100 text-cyan-700 border-cyan-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
}

interface CorporateActionCardProps {
    action: CorporateAction;
    isExpanded: boolean;
    onToggle: () => void;
}

function CorporateActionCard({ action, isExpanded, onToggle }: CorporateActionCardProps) {
    const isPositive = action.percentChange >= 0;
    const showDividendInfo = action.badge === 'AGM-EGM' || action.badge === 'Dividends';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base">{action.companyName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getBadgeStyle(action.badge)}`}>
                        {action.badge}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">LTP</p>
                        <p className="font-semibold text-gray-900">{action.ltp.toFixed(2)}</p>
                        <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            ({isPositive ? '+' : ''}{action.percentChange.toFixed(2)}%)
                        </p>
                    </div>
                    {showDividendInfo ? (
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Dividend (Rs.)</p>
                            <p className="font-medium text-gray-700">{action.dividendAmount ?? '-'}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs text-gray-500 mb-4">&nbsp;</p>
                            <p className="text-sm text-gray-700">
                                {formatDate(action.exDate)}{action.purpose ? ` : ${action.purpose}` : ''}
                            </p>
                        </div>
                    )}
                </div>

                {showDividendInfo && (
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Announcement Date</p>
                            <p className="text-sm text-gray-700">{action.announcementDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Ex-Date</p>
                            <p className="text-sm text-gray-700">{action.exDate}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={onToggle}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Historical Board Meeting Data</h4>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-600">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {action.historicalData.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-3 text-sm text-amber-700">{item.date}</td>
                                    <td className="py-3 text-sm text-amber-700">{item.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-center">
                        <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                            Show More <ExternalLink className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CorporateActionsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('All Purposes');
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const filteredData = useMemo(() => {
        return corporateActionsData.filter((action) => {
            if (activeTab !== 'All') {
                if (activeTab === 'AGM/EGM') {
                    if (action.badge !== 'AGM-EGM') return false;
                } else if (action.badge !== activeTab) {
                    return false;
                }
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !action.companyName.toLowerCase().includes(query) &&
                    !action.symbol.toLowerCase().includes(query)
                ) {
                    return false;
                }
            }

            if (selectedPurpose !== 'All Purposes') {
                if (!action.purpose?.toLowerCase().includes(selectedPurpose.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }, [activeTab, searchQuery, selectedPurpose]);

    const toggleCard = (id: string) => {
        setExpandedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
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

                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Stock Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedPurpose}
                            onChange={(e) => setSelectedPurpose(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            {purposeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filter By
                    </button>

                    <div className="flex-1" />

                    <div className="relative">
                        <select
                            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            defaultValue="Upcoming"
                        >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Past">Past</option>
                            <option value="All">All</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Add to Calendar
                    </button>
                </div>

                <div className="bg-gray-100 px-4 py-2 rounded-t-lg mb-0">
                    <p className="text-sm font-medium text-gray-700">{dateString}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {filteredData.map((action) => (
                        <CorporateActionCard
                            key={action.id}
                            action={action}
                            isExpanded={expandedCards.has(action.id)}
                            onToggle={() => toggleCard(action.id)}
                        />
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No corporate actions found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
