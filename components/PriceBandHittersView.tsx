'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, RefreshCw, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  upperBandHitters,
  lowerBandHitters,
  bothBandHitters,
  PriceBandHitterStock,
} from '@/lib/mockData';

type BandTab = 'upper' | 'lower' | 'both';
type SortField = 'symbol' | 'series' | 'ltp' | 'percentChange' | 'priceBandPercent' | 'volumeLakhs' | 'valueCrores';
type SortDirection = 'asc' | 'desc';

const ROWS_PER_PAGE = 50;

export default function PriceBandHittersView() {
  const [activeTab, setActiveTab] = useState<BandTab>('upper');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('valueCrores');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const upperCount = upperBandHitters.length;
  const lowerCount = lowerBandHitters.length;
  const bothCount = bothBandHitters.length;
  const totalCount = upperCount + lowerCount + bothCount;

  const rawData = useMemo(() => {
    switch (activeTab) {
      case 'upper': return upperBandHitters;
      case 'lower': return lowerBandHitters;
      case 'both': return bothBandHitters;
    }
  }, [activeTab]);

  const filteredData = useMemo(() => {
    let data = [...rawData];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(s => s.symbol.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return data;
  }, [rawData, searchQuery, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const paginatedData = filteredData.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleTabChange = (tab: BandTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const now = new Date();
  const dateStr = `As on ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} IST`;

  const tabs: { id: BandTab; label: string }[] = [
    { id: 'upper', label: 'Upper Band' },
    { id: 'lower', label: 'Lower Band' },
    { id: 'both', label: 'Both Band' },
  ];

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown className={`w-3 h-3 inline-block ml-1 ${sortField === field ? 'text-teal-600' : 'text-gray-400'}`} />
  );

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Price Band Hitters</h1>
        <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
      </div>

      {/* Summary Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-sm font-semibold text-gray-700">Securities Hitting the</span>
          <span className="text-sm font-bold text-green-600">Upper Band - {upperCount}</span>
          <span className="text-sm font-bold text-red-600">Lower Band - {lowerCount}</span>
          <span className="text-sm font-bold text-orange-500">Both Band - {bothCount}</span>
          <span className="text-sm font-semibold text-gray-700">Total Securities- {totalCount}</span>
        </div>
      </div>

      {/* Band Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? tab.id === 'upper' ? 'border-green-600 text-green-600'
                    : tab.id === 'lower' ? 'border-red-600 text-red-600'
                    : 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Controls */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-l-md border border-gray-300">Company</span>
          <div className="relative">
            <input
              type="text"
              placeholder="Company Name or Symbol"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm w-56 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
            className="px-4 py-2 border border-orange-400 text-orange-500 rounded-full text-sm hover:bg-orange-50"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Pagination info */}
          <span className="text-sm text-gray-600">
            Displaying {filteredData.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}-{Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)} of {filteredData.length} records
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">First</button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-600 px-2">Page <strong>{currentPage}</strong> of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">Last</button>
          </div>
          <button
            onClick={() => { setCurrentPage(1); setSearchQuery(''); }}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#1a237e] text-white">
              <th className="px-4 py-3 text-left font-semibold cursor-pointer select-none" onClick={() => handleSort('symbol')}>
                SYMBOL <SortIcon field="symbol" />
              </th>
              <th className="px-4 py-3 text-left font-semibold cursor-pointer select-none" onClick={() => handleSort('series')}>
                SERIES <SortIcon field="series" />
              </th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => handleSort('ltp')}>
                LTP <SortIcon field="ltp" />
              </th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => handleSort('percentChange')}>
                %CHNG <SortIcon field="percentChange" />
              </th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => handleSort('priceBandPercent')}>
                PRICE BAND % <SortIcon field="priceBandPercent" />
              </th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => handleSort('volumeLakhs')}>
                <div>VOLUME</div>
                <div className="text-xs font-normal">(Lakhs)</div>
                <SortIcon field="volumeLakhs" />
              </th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => handleSort('valueCrores')}>
                <div>VALUE</div>
                <div className="text-xs font-normal">(₹ Crores)</div>
                <SortIcon field="valueCrores" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No records found</td>
              </tr>
            ) : (
              paginatedData.map((stock, idx) => (
                <tr
                  key={stock.symbol + idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href="#" className="text-blue-700 hover:underline font-medium">
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{stock.series}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${stock.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.percentChange >= 0 ? '' : ''}{stock.percentChange.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-orange-600 font-medium">{stock.priceBandPercent.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{stock.volumeLakhs.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{stock.valueCrores.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Displaying {filteredData.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}-{Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)} of {filteredData.length} records
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">First</button>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">Prev</button>
          <span className="text-sm text-gray-600 px-2">Page <strong>{currentPage}</strong> of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">Next</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 text-xs border border-orange-400 text-orange-500 rounded disabled:opacity-40">Last</button>
        </div>
      </div>
    </div>
  );
}
