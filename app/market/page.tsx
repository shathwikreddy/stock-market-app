'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Download, RefreshCw } from 'lucide-react';

// Time period tabs
type TimePeriod = 'intraday' | 'days' | 'weeks' | 'months' | 'years' | 'customize';
type SubTab = 'custom' | 'seasonality' | 'ytd' | '52weeks' | 'all_time';
type Exchange = 'NSE' | 'BSE' | 'Both';
type ViewType = 'all' | 'gainers' | 'losers';

// Column definitions for each type
const columnsByPeriod: Record<TimePeriod | SubTab, string[]> = {
  intraday: ['% 5Min Chag', '% 15Min Chag', '% 30Min Chag', '% 1Hour Chag', '% 2Hours Chag', '% Cust Date Chag'],
  days: ['% Chag', '% 2D Chag', '% 3D Chag', '% 4D Chag', '% 5D Chag', '% 1W Chag', '% Cust Date Chag'],
  weeks: ['% 1W Chag', '% 2W Chag', '% 3W Chag', '% 4W Chag', '% 5W Chag', '% 1M Chag', '% Cust Date Chag'],
  months: ['% 1M Chag', '% 2M Chag', '% 3M Chag', '% 4M Chag', '% 5M Chag', '% 6M Chag', '% 7M Chag', '% 8M Chag', '% 9M Chag', '% 10M Chag', '% 11M Chag', '% 1Y Chag'],
  years: ['% 1Y Chag', '% 2Y Chag', '% 3Y Chag', '% 4Y Chag', '% 5Y Chag', '% 10Y Chag', '% Max Chag'],
  customize: [], // Handled by sub-tabs
  custom: ['% Chag', '% Cust Date Chag'],
  seasonality: ['% Chag', '% Cust Date Chag'],
  ytd: ['% YTD Chag', '% 2YTD Chag', '% 3YTD Chag', '% 4YTD Chag', '% 5YTD Chag', '% 10 YTD Chag', '% Cust Date Chag'],
  '52weeks': ['% 52W Chag', '% Cust Date Chag'],
  all_time: ['% ATH&L Chag', '% Cust Date Chag'],
};

// Base columns that are always shown
const baseColumns = ['S No', 'Company Name', 'Sector', 'Industry', 'Group', 'F V', 'P Band', 'M Cap', 'Pre Close', 'CMP', 'Net Chag'];

interface StockData {
  id: string;
  companyName: string;
  sector: string;
  industry: string;
  group: string;
  faceValue: number;
  priceBand: string;
  marketCap: string;
  preClose: number;
  cmp: number;
  netChange: number;
  percentChanges: Record<string, number>;
}

// Stock Table Component
const StockTable = ({
  data,
  columns,
  title,
  isGainer
}: {
  data: StockData[];
  columns: string[];
  title: string;
  isGainer: boolean;
}) => {
  return (
    <div className="border border-black">
      {/* Section Title */}
      <div className="text-center py-2 font-bold text-black border-b border-black bg-gray-50">
        {title}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {baseColumns.map((col) => (
                <th key={col} className="border border-gray-400 px-2 py-1 text-black font-semibold text-center whitespace-nowrap">
                  {col}
                </th>
              ))}
              {columns.map((col) => (
                <th key={col} className="border border-gray-400 px-2 py-1 text-black font-semibold text-center whitespace-nowrap bg-yellow-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={baseColumns.length + columns.length} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((stock, index) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1 text-center text-black">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1 text-black font-medium whitespace-nowrap">{stock.companyName}</td>
                  <td className="border border-gray-300 px-2 py-1 text-black whitespace-nowrap">{stock.sector}</td>
                  <td className="border border-gray-300 px-2 py-1 text-black whitespace-nowrap">{stock.industry}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-black">{stock.group}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-black">{stock.faceValue}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-black">{stock.priceBand}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right text-black whitespace-nowrap">{stock.marketCap}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right text-black">{stock.preClose.toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right text-black font-medium">{stock.cmp.toFixed(2)}</td>
                  <td className={`border border-gray-300 px-2 py-1 text-right font-medium ${isGainer ? 'text-green-600' : 'text-red-600'}`}>
                    {isGainer ? '+' : ''}{stock.netChange.toFixed(2)}
                  </td>
                  {columns.map((col) => {
                    const value = stock.percentChanges[col] || 0;
                    return (
                      <td
                        key={col}
                        className={`border border-gray-300 px-2 py-1 text-right font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function TopGainersLosersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // Get view from query params (gainers, losers, or all)
  const viewParam = searchParams.get('view') as ViewType | null;
  const currentView: ViewType = viewParam === 'gainers' || viewParam === 'losers' ? viewParam : 'all';

  const [selectedExchange, setSelectedExchange] = useState<Exchange>('NSE');
  const [gainersData, setGainersData] = useState<StockData[]>([]);
  const [losersData, setLosersData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const exchanges: Exchange[] = ['NSE', 'BSE', 'Both'];

  // Fetch live data
  const fetchMarketData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(`/api/market/live?exchange=${selectedExchange}`);

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const data = await response.json();
      setGainersData(data.gainers || []);
      setLosersData(data.losers || []);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load live market data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedExchange]);

  // Fetch data on mount and when exchange changes
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Combined tabs list
  const allTabs: { id: string; label: string }[] = [
    { id: 'intraday', label: 'Intraday Wise' },
    { id: 'days', label: 'Days Wise' },
    { id: 'weeks', label: 'Weeks Wise' },
    { id: 'months', label: 'Months Wise' },
    { id: 'years', label: 'Years Wise' },
    { id: 'custom', label: 'Customize Date' },
    { id: 'seasonality', label: 'Seasonality' },
    { id: 'ytd', label: 'Year to Date' },
    { id: '52weeks', label: '52 Weeks Gainers & Losers' },
    { id: 'all_time', label: 'All Time Gainers & Losers' },
  ];

  const [activeTab, setActiveTab] = useState<string>('intraday');

  const currentColumns = columnsByPeriod[activeTab as TimePeriod | SubTab] || [];

  const periodLabel = allTabs.find(t => t.id === activeTab)?.label;

  // CSV Download function
  const downloadCSV = () => {
    const allColumns = [...baseColumns, ...currentColumns];
    const headers = allColumns.join(',');

    const createRow = (stock: StockData, index: number): string => {
      const baseData = [
        index + 1,
        `"${stock.companyName}"`,
        `"${stock.sector}"`,
        `"${stock.industry}"`,
        stock.group,
        stock.faceValue,
        `"${stock.priceBand}"`,
        `"${stock.marketCap}"`,
        stock.preClose.toFixed(2),
        stock.cmp.toFixed(2),
        stock.netChange.toFixed(2),
      ];

      const percentData = currentColumns.map(col => {
        const value = stock.percentChanges[col] || 0;
        return value.toFixed(2);
      });

      return [...baseData, ...percentData].join(',');
    };

    const csvLines: string[] = [];
    csvLines.push(`Top Gainers and Losers - ${periodLabel} - ${selectedExchange}`);
    csvLines.push(`Generated on: ${new Date().toLocaleString()}`);
    csvLines.push('');

    csvLines.push('GAINERS');
    csvLines.push(headers);
    gainersData.forEach((stock, index) => {
      csvLines.push(createRow(stock, index));
    });

    csvLines.push('');

    csvLines.push('LOSERS');
    csvLines.push(headers);
    losersData.forEach((stock, index) => {
      csvLines.push(createRow(stock, index));
    });

    const csvContent = csvLines.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `top_gainers_losers_${activeTab}_${selectedExchange}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-4">
        {/* All Tabs in Single Line */}
        <div className="flex border-b-2 border-black mb-4 overflow-x-auto">
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-t border-l last:border-r border-black -mb-[2px] whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white border-b-2 border-b-white text-black'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content for 'Customize Date' specifically */}
        {activeTab === 'custom' && (
            <div className="mb-4 border border-black p-4 bg-gray-50">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-sm">Choose Your Choice of Data:</span>
                    <div className="border border-gray-400 px-2 py-1 bg-white w-64 text-sm text-gray-500">
                        Select date range...
                    </div>
                </div>
            </div>
        )}

        {/* Exchange Tabs & Actions Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Exchange Selection */}
            <div className="flex items-center gap-4">
              {exchanges.map((exchange) => (
                <label key={exchange} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="exchange"
                    checked={selectedExchange === exchange}
                    onChange={() => setSelectedExchange(exchange)}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className={`ml-2 text-sm font-medium ${selectedExchange === exchange ? 'text-black underline' : 'text-gray-600'}`}>
                    {exchange}
                  </span>
                </label>
              ))}
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs text-gray-500">
                Live Data
                {lastUpdated && ` · Updated ${new Date(lastUpdated).toLocaleTimeString()}`}
              </span>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchMarketData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-black font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600 text-sm">Loading live market data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="border border-red-300 bg-red-50 rounded p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => fetchMarketData()}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Data Tables */}
        {!loading && !error && (
          <>
            {/* Gainers Section */}
            {(currentView === 'all' || currentView === 'gainers') && (
              <div className="mb-6">
                <div className="flex border-b border-black mb-0">
                  <button
                    onClick={() => router.push('/market?view=gainers')}
                    className="flex-1 text-center py-2 font-bold border-r border-black text-black bg-gray-50"
                  >
                    Gainers ({gainersData.length})
                  </button>
                  <button
                    onClick={() => router.push('/market?view=losers')}
                    className="flex-1 text-center py-2 font-bold text-gray-400 bg-gray-100"
                  >
                    Losers ({losersData.length})
                  </button>
                </div>

                <div className="text-center py-2 border border-t-0 border-black bg-gray-50 font-semibold text-black">
                  Filtering Options for {periodLabel}
                </div>

                <StockTable
                  data={gainersData}
                  columns={currentColumns}
                  title="Gainers"
                  isGainer={true}
                />
              </div>
            )}

            {/* Losers Section */}
            {(currentView === 'all' || currentView === 'losers') && (
              <div className="mb-6">
                <div className="flex border-b border-black mb-0">
                  <button
                    onClick={() => router.push('/market?view=gainers')}
                    className="flex-1 text-center py-2 font-bold border-r border-black text-gray-400 bg-gray-100"
                  >
                    Gainers ({gainersData.length})
                  </button>
                  <button
                    onClick={() => router.push('/market?view=losers')}
                    className="flex-1 text-center py-2 font-bold text-black bg-gray-50"
                  >
                    Losers ({losersData.length})
                  </button>
                </div>

                <div className="text-center py-2 border border-t-0 border-black bg-gray-50 font-semibold text-black">
                  Filtering Options for {periodLabel}
                </div>

                <StockTable
                  data={losersData}
                  columns={currentColumns}
                  title="Losers"
                  isGainer={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function TopGainersLosersLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}

// Default export wraps the content in Suspense boundary
export default function TopGainersLosersPage() {
  return (
    <Suspense fallback={<TopGainersLosersLoading />}>
      <TopGainersLosersContent />
    </Suspense>
  );
}
