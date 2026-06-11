'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Search, BarChart2, Globe, TrendingUp, DollarSign, Award, Layers, PieChart, Activity } from 'lucide-react';
import {
    indexETFs,
    sectorETFs,
    factorETFs,
    globalETFs,
    debtETFs,
    bullionETFs,
    mostTradedETFs,
    topPerformerETFs,
    etfFAQs,
    etfCategories,
    sortOptions,
    ETF,
    ETFCategory,
} from '@/lib/etf-data';

export default function ETFPage() {
    const [activeCategory, setActiveCategory] = useState<ETFCategory>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('selected');
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>('1');

    // Get category icon
    const getCategoryIcon = (iconType: string) => {
        const iconClass = "w-5 h-5";
        switch (iconType) {
            case 'all':
                return <Layers className={iconClass} />;
            case 'index':
                return <BarChart2 className={iconClass} />;
            case 'sector':
                return <PieChart className={iconClass} />;
            case 'factor':
                return <Activity className={iconClass} />;
            case 'global':
                return <Globe className={iconClass} />;
            case 'debt':
                return <DollarSign className={iconClass} />;
            case 'bullion':
                return <Award className={iconClass} />;
            case 'traded':
                return <TrendingUp className={iconClass} />;
            case 'performer':
                return <Award className={iconClass} />;
            default:
                return <Layers className={iconClass} />;
        }
    };

    // Helper function to filter ETFs by search
    const filterBySearch = (etfs: ETF[]) => {
        if (!searchQuery) return etfs;
        return etfs.filter(etf =>
            etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            etf.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Filter ETFs based on category and search
    const filteredIndexETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Index') return [];
        return filterBySearch(indexETFs);
    }, [activeCategory, searchQuery]);

    const filteredSectorETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Sector') return [];
        return filterBySearch(sectorETFs);
    }, [activeCategory, searchQuery]);

    const filteredFactorETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Factor') return [];
        return filterBySearch(factorETFs);
    }, [activeCategory, searchQuery]);

    const filteredGlobalETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Global') return [];
        return filterBySearch(globalETFs);
    }, [activeCategory, searchQuery]);

    const filteredDebtETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Debt') return [];
        return filterBySearch(debtETFs);
    }, [activeCategory, searchQuery]);

    const filteredBullionETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Bullion') return [];
        return filterBySearch(bullionETFs);
    }, [activeCategory, searchQuery]);

    const filteredMostTradedETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Most Traded') return [];
        return filterBySearch(mostTradedETFs);
    }, [activeCategory, searchQuery]);

    const filteredTopPerformerETFs = useMemo(() => {
        if (activeCategory !== 'All' && activeCategory !== 'Top Performer') return [];
        return filterBySearch(topPerformerETFs);
    }, [activeCategory, searchQuery]);

    // Check if any ETFs are displayed
    const hasResults = filteredIndexETFs.length > 0 ||
        filteredSectorETFs.length > 0 ||
        filteredFactorETFs.length > 0 ||
        filteredGlobalETFs.length > 0 ||
        filteredDebtETFs.length > 0 ||
        filteredBullionETFs.length > 0 ||
        filteredMostTradedETFs.length > 0 ||
        filteredTopPerformerETFs.length > 0;

    // Format helpers
    const formatPrice = (price: number) => price.toFixed(2);
    const formatAUM = (aum: number) => aum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatPercent = (value: number | null) => value !== null ? value.toFixed(2) : '-';

    // ETF Card Component
    const ETFCard = ({ etf }: { etf: ETF }) => {
        const [activeReturn, setActiveReturn] = useState<'1Y' | '3Y' | '5Y'>('1Y');

        const getReturnValue = () => {
            switch (activeReturn) {
                case '1Y': return etf.returns.oneYear;
                case '3Y': return etf.returns.threeYear;
                case '5Y': return etf.returns.fiveYear;
            }
        };

        const returnValue = getReturnValue();

        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{etf.name}</h3>
                        <p className="text-xs text-gray-500">{etf.exchange}: {etf.lastUpdated}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(etf.price)}</p>
                        <p className={`text-xs ${etf.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%)
                        </p>
                    </div>
                </div>

                {/* Volume */}
                <div className="text-right text-xs text-gray-500 mb-3">
                    Vol: {etf.volume}
                </div>

                {/* Returns Tabs */}
                <div className="flex gap-4 mb-3">
                    {(['1Y', '3Y', '5Y'] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => setActiveReturn(period)}
                            className={`text-xs font-medium ${activeReturn === period ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                            {period}(%)
                        </button>
                    ))}
                </div>

                {/* Return Value */}
                <div className={`text-lg font-bold mb-4 ${returnValue !== null && returnValue >= 0 ? 'text-gray-900' : returnValue !== null ? 'text-red-600' : 'text-gray-400'}`}>
                    {formatPercent(returnValue)}
                </div>

                {/* Tracking Error & Expense Ratio */}
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Tracking Error <span className="font-semibold text-red-600">{etf.trackingError.toFixed(2)}%</span></span>
                    <span>AUM (Rs. Cr.)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                    <span>Expense Ratio <span className="font-semibold text-red-600">{etf.expenseRatio.toFixed(2)}%</span></span>
                    <span className="font-semibold text-gray-900">{formatAUM(etf.aum)}</span>
                </div>
            </div>
        );
    };

    // ETF Section Component
    const ETFSection = ({ title, etfs }: { title: string; etfs: ETF[] }) => {
        if (etfs.length === 0) return null;
        return (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {etfs.map((etf) => (
                        <ETFCard key={etf.id} etf={etf} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Exchange Traded Funds (ETFs)</h1>
                        <div className="flex items-center gap-4">
                            {/* Sort By */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sort by :</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search ETFs"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 bg-white border border-gray-300 rounded-md pl-3 pr-9 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {etfCategories.map((category) => (
                            <button
                                key={category.label}
                                onClick={() => setActiveCategory(category.label)}
                                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border transition-all min-w-[90px] ${activeCategory === category.label
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <span className={activeCategory === category.label ? 'text-white' : 'text-gray-500'}>
                                    {getCategoryIcon(category.icon)}
                                </span>
                                <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex">
                {/* ETFs Section */}
                <div className="flex-1 p-6">
                    <ETFSection title="Index ETFs" etfs={filteredIndexETFs} />
                    <ETFSection title="Sector ETFs" etfs={filteredSectorETFs} />
                    <ETFSection title="Factor ETFs" etfs={filteredFactorETFs} />
                    <ETFSection title="Global ETFs" etfs={filteredGlobalETFs} />
                    <ETFSection title="Debt ETFs" etfs={filteredDebtETFs} />
                    <ETFSection title="Bullion ETFs" etfs={filteredBullionETFs} />
                    <ETFSection title="Most Traded ETFs" etfs={filteredMostTradedETFs} />
                    <ETFSection title="Top Performer ETFs" etfs={filteredTopPerformerETFs} />

                    {/* No Results */}
                    {!hasResults && (
                        <div className="text-center py-12 text-gray-500">
                            No ETFs found matching your criteria.
                        </div>
                    )}
                </div>

                {/* FAQ Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 p-6 hidden lg:block">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">FAQ&apos;s</h2>
                    <div className="space-y-2">
                        {etfFAQs.map((faq) => (
                            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                                    {expandedFAQ === faq.id ? (
                                        <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                {expandedFAQ === faq.id && (
                                    <div className="px-4 pb-4 text-sm text-gray-600">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
