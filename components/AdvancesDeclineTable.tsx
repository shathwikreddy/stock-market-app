'use client';

import React, { useState, useMemo } from 'react';
import { Download, RefreshCw, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

// Types
interface Stock {
  id: string;
  symbol: string;
  series: string;
  ltp: number;
  changePercent: number;
  mktCap: number;
  volume: number;
  value: number;
}

type TabType = 'advance' | 'decline' | 'unchanged';
type SortField = 'symbol' | 'series' | 'ltp' | 'changePercent' | 'mktCap' | 'volume' | 'value';
type SortOrder = 'asc' | 'desc' | null;

// Generate dummy data
const generateAdvanceData = (): Stock[] => {
  const symbols = ['POLICYBZR', 'TRENT', 'FORCEMOT', 'SBIN', 'DEVYANI', 'PFC', 'EIHOTEL', 'BLS', 'CUMMINSIND', 'HDFCAMC', 'TATASTEEL', 'POKARNA', 'IOC', 'BAJFINANCE', 'QPOWER', 'JSWCEMENT', 'AVANTIFEED', 'WESTLIFE', 'RECLTD', 'SUNPHARMA', 'TMPV', 'M&M', 'JIOFIN', 'IFCI'];

  return symbols.map((symbol, index) => ({
    id: `adv-${index}`,
    symbol,
    series: 'EQ',
    ltp: Math.random() * 20000 + 100,
    changePercent: Math.random() * 15 + 0.1,
    mktCap: Math.random() * 200000 + 1000,
    volume: Math.random() * 1000 + 10,
    value: Math.random() * 3000 + 100,
  }));
};

const generateDeclineData = (): Stock[] => {
  const symbols = ['SILVERBEES', 'HDFCBANK', 'HAL', 'HINDCOPPER', 'RELIANCE', 'INFY', 'TATSILV', 'GOLDBEES', 'BHARTIARTL', 'MCX', 'ICICIBANK', 'VEDL', 'DIXON', 'TCS', 'SILVERIETF', 'HINDZINC', 'KOTAKBANK', 'KAYNES', 'ETERNAL', 'BSE', 'PERSISTENT', 'CARTRADE', 'TIINDIA', 'NTPC'];

  return symbols.map((symbol, index) => ({
    id: `dec-${index}`,
    symbol,
    series: 'EQ',
    ltp: Math.random() * 5000 + 50,
    changePercent: -(Math.random() * 15 + 0.1),
    mktCap: Math.random() * 300000 + 1000,
    volume: Math.random() * 1500 + 10,
    value: Math.random() * 6000 + 100,
  }));
};

const generateUnchangedData = (): Stock[] => {
  const symbols = ['LIQUIDBEES', 'LIQUIDIETF', 'LIQUID', 'GMRINFRA', 'GOCOLORS', 'LIQUIDETF', 'SEPC', 'NSIL', 'LIQUIDSBI', 'DHARAN', 'NV20IETF', 'HEALTHY', 'EXCEL', 'RANASUG', 'ASHWINI', '718GS2037', 'RAPPID', 'INVENTURE', 'TUNWAL', 'FLEXIADD', 'INDBANK', 'ABSLLIQUID', '736GS2052', '915GCL26'];

  return symbols.map((symbol, index) => ({
    id: `unc-${index}`,
    symbol,
    series: index === 9 ? 'BZ' : index === 15 ? 'GS' : index === 19 ? 'SM' : index === 22 ? 'GS' : index === 23 ? 'N0' : 'EQ',
    ltp: Math.random() * 2000 + 0.18,
    changePercent: 0,
    mktCap: Math.random() * 200000 + 50,
    volume: Math.random() * 500 + 0.01,
    value: Math.random() * 500 + 0.09,
  }));
};

export default function AdvancesDeclineTable() {
  const [activeTab, setActiveTab] = useState<TabType>('advance');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const recordsPerPage = 50;

  // Generate data
  const advanceData = useMemo(() => generateAdvanceData(), []);
  const declineData = useMemo(() => generateDeclineData(), []);
  const unchangedData = useMemo(() => generateUnchangedData(), []);

  // Counts
  const advanceCount = 1113;
  const declineCount = 2033;
  const unchangedCount = 95;

  // Get current data based on active tab
  const getCurrentData = (): Stock[] => {
    switch (activeTab) {
      case 'advance':
        return advanceData;
      case 'decline':
        return declineData;
      case 'unchanged':
        return unchangedData;
    }
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    const data = getCurrentData();
    if (!searchQuery.trim()) return data;

    return data.filter(stock =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeTab, advanceData, declineData, unchangedData]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField || !sortOrder) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  const totalRecords = activeTab === 'advance' ? advanceCount : activeTab === 'decline' ? declineCount : unchangedCount;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const paginatedData = sortedData.slice(0, recordsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDownloadCSV = () => {
    // CSV download logic would go here
    alert('CSV download functionality');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    if (sortOrder === 'asc') {
      return <ChevronUp className="w-4 h-4 ml-1 text-purple-700" />;
    }
    return <ChevronDown className="w-4 h-4 ml-1 text-purple-700" />;
  };

  return (
    <div className="bg-white">
      <div className="w-full">
        {/* Summary */}
        <div className="border border-gray-300 rounded-lg mb-6 p-4 bg-white">
          <div className="flex items-center gap-6 text-base">
            <span className="text-green-600 font-semibold">Advance - {advanceCount}</span>
            <span className="text-red-600 font-semibold">Decline - {declineCount}</span>
            <span className="text-gray-700 font-semibold">Unchanged - {unchangedCount}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('advance');
              setCurrentPage(1);
            }}
            className={`pb-3 px-1 text-base font-medium transition-colors relative ${
              activeTab === 'advance'
                ? 'text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Advance
            {activeTab === 'advance' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('decline');
              setCurrentPage(1);
            }}
            className={`pb-3 px-1 text-base font-medium transition-colors relative ${
              activeTab === 'decline'
                ? 'text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Decline
            {activeTab === 'decline' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('unchanged');
              setCurrentPage(1);
            }}
            className={`pb-3 px-1 text-base font-medium transition-colors relative ${
              activeTab === 'unchanged'
                ? 'text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unchanged
            {activeTab === 'unchanged' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Company</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Company Name or Symbol"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
            <button
              onClick={handleClear}
              className="px-6 py-2 border border-orange-600 text-orange-600 rounded hover:bg-orange-50 text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download (.csv)</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Pagination Info and Controls */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Displaying {startRecord}-{endRecord} of {totalRecords} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600 px-3">
              Page <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
                className="w-12 text-center border border-gray-300 rounded mx-1"
              /> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === totalPages
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === totalPages
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              Last
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-indigo-900 text-white">
                <tr>
                  <th
                    onClick={() => handleSort('symbol')}
                    className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-indigo-800 transition-colors"
                  >
                    <div className="flex items-center">
                      SYMBOL
                      <SortIcon field="symbol" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    <div className="flex items-center">
                      SERIES
                      <SortIcon field="series" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('ltp')}
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-indigo-800 transition-colors"
                  >
                    <div className="flex items-center justify-end">
                      LTP
                      <SortIcon field="ltp" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('changePercent')}
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-indigo-800 transition-colors"
                  >
                    <div className="flex items-center justify-end">
                      %CHNG
                      <SortIcon field="changePercent" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('mktCap')}
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-indigo-800 transition-colors"
                  >
                    <div className="flex items-center justify-end">
                      MKT CAP
                      <div className="text-xs ml-1">(₹ Crores)</div>
                      <SortIcon field="mktCap" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('volume')}
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-indigo-800 transition-colors"
                  >
                    <div className="flex items-center justify-end">
                      VOLUME
                      <div className="text-xs ml-1">(Lakhs)</div>
                      <SortIcon field="volume" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('value')}
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-indigo-800 transition-colors"
                  >
                    <div className="flex items-center justify-end">
                      VALUE
                      <div className="text-xs ml-1">(₹ Crores)</div>
                      <SortIcon field="value" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((stock, index) => (
                  <tr
                    key={stock.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors border-b border-gray-200`}
                  >
                    <td className="px-4 py-3 text-blue-600 font-medium hover:underline cursor-pointer">
                      {stock.symbol}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{stock.series}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      {stock.ltp.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      stock.changePercent > 0
                        ? 'text-green-600'
                        : stock.changePercent < 0
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}>
                      {stock.changePercent.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {stock.mktCap.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {stock.volume.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {stock.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-end mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600 px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === totalPages
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === totalPages
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
