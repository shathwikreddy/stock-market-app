'use client';

import { useState, useMemo } from 'react';
import { ipoData, ipoTabs, IPOData } from '@/lib/results-calendar-data';

export default function IPOCalendarView() {
    const [activeTab, setActiveTab] = useState('Draft Issues');

    const getCategoryFromTab = (tab: string): string => {
        switch (tab) {
            case 'Upcoming/Ongoing Issues':
                return 'upcoming';
            case 'Recently Listed':
                return 'recently-listed';
            case 'NFOs':
                return 'nfos';
            case 'Draft Issues':
                return 'draft-issues';
            default:
                return 'draft-issues';
        }
    };

    const filteredData = useMemo(() => {
        const category = getCategoryFromTab(activeTab);
        return ipoData.filter(item => item.category === category);
    }, [activeTab]);

    const renderTable = () => {
        if (activeTab === 'Draft Issues') {
            return (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Equity</th>
                            <th className="py-3 px-4 text-right font-semibold text-gray-700">Date Of Filing With Sebi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-semibold text-gray-900">{item.equity}</td>
                                <td className="py-3 px-4 text-right text-gray-600">{item.dateOfFiling}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'Upcoming/Ongoing Issues') {
            return (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Equity</th>
                            <th className="py-3 px-4 text-center font-semibold text-gray-700">Issue Date</th>
                            <th className="py-3 px-4 text-right font-semibold text-gray-700">Issue Size</th>
                            <th className="py-3 px-4 text-right font-semibold text-gray-700">Price Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-semibold text-gray-900">{item.equity}</td>
                                <td className="py-3 px-4 text-center text-gray-600">{item.dateOfFiling}</td>
                                <td className="py-3 px-4 text-right text-gray-600">{item.issueSize || '-'}</td>
                                <td className="py-3 px-4 text-right text-gray-600">{item.priceRange || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'Recently Listed') {
            return (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Equity</th>
                            <th className="py-3 px-4 text-center font-semibold text-gray-700">Listing Date</th>
                            <th className="py-3 px-4 text-right font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-semibold text-gray-900">{item.equity}</td>
                                <td className="py-3 px-4 text-center text-gray-600">{item.dateOfFiling}</td>
                                <td className="py-3 px-4 text-right text-green-600">{item.status || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // NFOs
        return (
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-gray-900">
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Fund Name</th>
                        <th className="py-3 px-4 text-right font-semibold text-gray-700">NFO Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-gray-900">{item.equity}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{item.dateOfFiling}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="w-full">
            {/* Sub-tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    {ipoTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${activeTab === tab
                                    ? 'bg-white border border-gray-300 text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <span className="text-sm text-gray-500">Last updated on 07/01/2026</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {filteredData.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                        No data found for this category.
                    </div>
                ) : (
                    renderTable()
                )}
            </div>
        </div>
    );
}
