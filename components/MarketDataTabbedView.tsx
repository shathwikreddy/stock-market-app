'use client';

import { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allStocksNSE, sectorDataNSE, industryDataNSE, fnoStocksNSE, TopGainerLoserStock } from '@/lib/mockData';

interface MarketDataTabbedViewProps {
  initialTab?: 'stocks' | 'sectors' | 'industry' | 'fnoStocks';
}

// Sparkline Chart Component (matching TopGainersLosersTable)
const SparklineChart = ({ data }: { data: number[] }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] >= data[0];

  return (
    <svg width="80" height="30" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const categoryInfo = {
  stocks: {
    title: 'ALL STOCKS',
    description: 'Comprehensive listing of all stocks trading on NSE/BSE with real-time prices, market capitalization, sector classification, and detailed performance metrics. Filter by exchange, index, and various parameters....',
  },
  sectors: {
    title: 'SECTOR-WISE PERFORMANCE',
    description: 'Sector indices showing aggregate performance of stocks grouped by sectors like Banking, IT, Pharma, Auto, FMCG, and more. Track sector rotation and identify trending industries....',
  },
  industry: {
    title: 'INDUSTRY-WISE PERFORMANCE',
    description: 'Industry-wise market performance showing granular classification within sectors. Analyze sub-sector trends like Software Services, Private Banks, Steel Products, and more for detailed insights....',
  },
  fnoStocks: {
    title: 'F&O ELIGIBLE STOCKS',
    description: 'Stocks eligible for Futures and Options trading with higher liquidity and institutional participation. These stocks meet NSE/BSE criteria for derivatives trading....',
  },
};

const subTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'fundamental', label: 'Fundamental' },
  { id: 'returns', label: 'Returns' },
  { id: 'financials', label: 'Financials' },
  { id: 'technicals', label: 'Technicals' },
  { id: 'seasonality', label: 'Seasonality Analysis for Dec' },
];

export default function MarketDataTabbedView({ initialTab = 'stocks' }: MarketDataTabbedViewProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'stocks' | 'sectors' | 'industry' | 'fnoStocks'>(initialTab);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [selectedExchange, setSelectedExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [selectedIndex, setSelectedIndex] = useState('NIFTY 500');
  const [selectedPeriod, setSelectedPeriod] = useState('1 Day');

  // Category tabs matching TopGainersLosersTable style
  const categoryTabs = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'sectors', label: 'Sectors' },
    { id: 'industry', label: 'Industry' },
    { id: 'fnoStocks', label: 'F&O Stocks' },
  ];

  // Get data based on active category
  const getCategoryData = (): TopGainerLoserStock[] => {
    switch (activeCategory) {
      case 'stocks':
        return allStocksNSE;
      case 'sectors':
        return sectorDataNSE;
      case 'industry':
        return industryDataNSE;
      case 'fnoStocks':
        return fnoStocksNSE;
      default:
        return allStocksNSE;
    }
  };

  const data = getCategoryData();
  const currentCategoryInfo = categoryInfo[activeCategory];
  const title = currentCategoryInfo.title;
  const description = currentCategoryInfo.description;

  // Get current date in the format: Feb 2, 23:51
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Main Category Tabs - Rounded Pills Style */}
      <div className="border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex space-x-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm text-gray-900 leading-relaxed">
          {description}
          <a href="#" className="text-blue-600 hover:underline ml-1">Read more</a>
        </p>
      </div>

      {/* Title & Filters Section */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-900">{title} - {selectedExchange}</h1>
          <span className="text-sm text-gray-900">{dateStr}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Exchange Toggle */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="exchange"
                checked={selectedExchange === 'NSE'}
                onChange={() => setSelectedExchange('NSE')}
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
              />
              <span className="ml-2 text-sm font-medium text-gray-900">NSE</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="exchange"
                checked={selectedExchange === 'BSE'}
                onChange={() => setSelectedExchange('BSE')}
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
              />
              <span className="ml-2 text-sm font-medium text-gray-900">BSE</span>
            </label>
          </div>

          {/* Index Dropdown */}
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-900">{selectedIndex}</span>
            <ChevronDown className="w-4 h-4 text-gray-900" />
          </button>

          {/* Period Dropdown */}
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-900">{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4 text-gray-900" />
          </button>

          {/* Settings Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Settings className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeSubTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-900 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table - Exact styling from TopGainersLosersTable */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-2 py-2 text-left font-semibold text-gray-900 uppercase tracking-wide">
                #
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-900 uppercase tracking-wide">
                Company
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-900 uppercase tracking-wide">
                Sector
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-900 uppercase tracking-wide">
                Industry
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-900 uppercase tracking-wide">
                Group
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-900 uppercase tracking-wide">
                Face Value
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-900 uppercase tracking-wide">
                Price Band
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-900 uppercase tracking-wide">
                Mkt Cap
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-900 uppercase tracking-wide">
                Pre Close
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-900 uppercase tracking-wide">
                LTP
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-900 uppercase tracking-wide">
                Net Change
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-900 uppercase tracking-wide">
                % Change
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-900 uppercase tracking-wide">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((stock, index) => (
              <tr
                key={stock.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-2 py-3 text-gray-900">{index + 1}</td>
                <td className="px-2 py-3">
                  <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {stock.stockName}
                  </Link>
                </td>
                <td className="px-2 py-3 text-gray-900">{stock.sector || 'IT Services'}</td>
                <td className="px-2 py-3 text-gray-900">{stock.industry || 'Software Services'}</td>
                <td className="px-2 py-3 text-center text-gray-900">{stock.group || 'A'}</td>
                <td className="px-2 py-3 text-center text-gray-900">₹{stock.faceValue || 1}</td>
                <td className="px-2 py-3 text-center text-gray-900">{stock.priceBand || 5}</td>
                <td className="px-2 py-3 text-right text-gray-900">{stock.mktCap || '₹1,20,000 Cr'}</td>
                <td className="px-2 py-3 text-right text-gray-900">₹{stock.preClose?.toFixed(2) || stock.price.toFixed(2)}</td>
                <td className="px-2 py-3 text-right font-bold text-gray-900">₹{stock.price.toFixed(2)}</td>
                <td className={`px-2 py-3 text-right font-semibold ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                </td>
                <td className={`px-2 py-3 text-right font-semibold ${
                  stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </td>
                <td className="px-2 py-3 text-center">
                  <SparklineChart data={stock.sparklineData} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
