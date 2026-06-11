'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import EarningsCalendarView from './EarningsCalendarView';
import CorporateCalendarView from './CorporateCalendarView';
import IPOCalendarView from './IPOCalendarView';

type TabType = 'Economic Calendar' | 'Earnings Calendar' | 'Corporate Calendar' | 'IPO Calendar';

const tabs: TabType[] = ['Economic Calendar', 'Earnings Calendar', 'Corporate Calendar', 'IPO Calendar'];

export default function ResultsCalendarPage() {
    const [activeTab, setActiveTab] = useState<TabType>('Earnings Calendar');

    const getTitle = () => {
        switch (activeTab) {
            case 'Earnings Calendar':
                return 'Earnings Calendar';
            case 'Corporate Calendar':
                return 'Corporate Calendar';
            case 'IPO Calendar':
                return 'IPO Calendar';
            default:
                return 'Economic Calendar';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Earnings Calendar':
                return <EarningsCalendarView />;
            case 'Corporate Calendar':
                return <CorporateCalendarView />;
            case 'IPO Calendar':
                return <IPOCalendarView />;
            default:
                return (
                    <div className="p-8 text-center text-gray-500">
                        Economic Calendar - Coming Soon
                    </div>
                );
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
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
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

            {/* Content */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
}
