'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, Download, Search, X } from 'lucide-react';
import Link from 'next/link';
import {
  circuitChangesNSE,
  circuitChangesBSE,
  CircuitChangeNSE,
  CircuitChangeBSE,
} from '@/lib/mockData';

type ExchangeTab = 'nse' | 'bse';
type TimePeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'Custom';

// NSE Tab Component
function NSECircuitChanges() {
  const [symbolFilter, setSymbolFilter] = useState('');
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('3M');

  const periods: TimePeriod[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'Custom'];

  const filteredData = useMemo(() => {
    if (!symbolFilter.trim()) return circuitChangesNSE;
    const q = symbolFilter.toLowerCase();
    return circuitChangesNSE.filter(
      r => r.symbol.toLowerCase().includes(q) || r.securityName.toLowerCase().includes(q)
    );
  }, [symbolFilter]);

  return (
    <div>
      {/* Note section */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 border-b-2 border-indigo-700 inline-block pb-2 mb-4">Note</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 mt-3">
          <li>By default shows last 3 months data</li>
          <li>To see the next day&apos;s applicable price bands – select date range greater than current day.</li>
        </ul>
      </div>

      {/* Filter & Period Controls */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter By :</span>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <span className="bg-gray-100 text-sm text-gray-600 px-3 py-2 border-r border-gray-300">Symbol</span>
              <div className="relative">
                <input
                  type="text"
                  value={symbolFilter}
                  onChange={e => setSymbolFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm w-48 focus:outline-none"
                  placeholder=""
                />
                {symbolFilter && (
                  <button onClick={() => setSymbolFilter('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800">
            <Download className="w-4 h-4" />
            <span className="underline">Download (.csv)</span>
          </button>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center gap-2 mt-4">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activePeriod === p
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => { setSymbolFilter(''); setActivePeriod('3M'); }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>
        </div>
      </div>

      {/* NSE Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#1a237e] text-white">
              <th className="px-4 py-3 text-left font-semibold">SR. NO</th>
              <th className="px-4 py-3 text-left font-semibold">EFFECTIVE DATE</th>
              <th className="px-4 py-3 text-left font-semibold">
                SYMBOL <ArrowUpDown className="w-3 h-3 inline-block ml-1 text-teal-300" />
              </th>
              <th className="px-4 py-3 text-left font-semibold">SECURITY NAME</th>
              <th className="px-4 py-3 text-right font-semibold">FROM</th>
              <th className="px-4 py-3 text-right font-semibold">TO</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No records found</td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.srNo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{row.srNo}</td>
                  <td className="px-4 py-3 text-gray-700">{row.effectiveDate}</td>
                  <td className="px-4 py-3">
                    <Link href="#" className="text-blue-700 hover:underline font-medium">{row.symbol}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.securityName}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">{row.from}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">{row.to}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// BSE Tab Component
function BSECircuitChanges() {
  const [startDate, setStartDate] = useState('2026-02-12');
  const [endDate, setEndDate] = useState('2026-02-12');
  const [segmentName, setSegmentName] = useState('All');
  const [categoryName, setCategoryName] = useState('All');
  const [department, setDepartment] = useState('All');
  const [noticeNo, setNoticeNo] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [subject, setSubject] = useState('');
  const [containingText, setContainingText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(true);

  const segments = ['All', 'Equity', 'Debt', 'Mutual Fund', 'General'];
  const categories = ['All', 'Trading', 'Company related', 'Membership', 'Listing Operations'];
  const departments = ['All', 'DOSS', 'Trading Operations', 'Listing Operations', 'Membership'];

  const filteredData = useMemo(() => {
    if (!hasSubmitted) return [];
    return circuitChangesBSE.filter(row => {
      if (segmentName !== 'All' && row.segmentName !== segmentName) return false;
      if (categoryName !== 'All' && row.categoryName !== categoryName) return false;
      if (department !== 'All' && row.department !== department) return false;
      if (noticeNo && !row.noticeNo.includes(noticeNo)) return false;
      if (subject && !row.subject.toLowerCase().includes(subject.toLowerCase())) return false;
      if (containingText && !row.subject.toLowerCase().includes(containingText.toLowerCase())) return false;
      if (securityCode && !row.subject.toLowerCase().includes(securityCode.toLowerCase())) return false;
      return true;
    });
  }, [hasSubmitted, segmentName, categoryName, department, noticeNo, subject, containingText, securityCode]);

  const selectClass = "px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white";
  const inputClass = "px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-400";

  return (
    <div>
      {/* Filter Form */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-blue-700 mb-5">Notices & Circulars</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          {/* Row 1 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Start Date:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">End Date:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Notice No:</label>
            <input type="text" value={noticeNo} onChange={e => setNoticeNo(e.target.value)} className={inputClass} />
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Segment Name:</label>
            <select value={segmentName} onChange={e => setSegmentName(e.target.value)} className={selectClass}>
              {segments.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Category Name:</label>
            <select value={categoryName} onChange={e => setCategoryName(e.target.value)} className={selectClass}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Department:</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} className={selectClass}>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Security Code/Name:</label>
            <input type="text" value={securityCode} onChange={e => setSecurityCode(e.target.value)} placeholder="Enter Security Name / Code" className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Subject:</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Containing Text:</label>
            <input type="text" value={containingText} onChange={e => setContainingText(e.target.value)} className={inputClass} />
          </div>
        </div>

        <button
          onClick={() => setHasSubmitted(true)}
          className="mt-5 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>

      {/* Results heading */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium">Previous Day</span>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* BSE Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="px-4 py-3 text-left font-semibold">Notice No</th>
              <th className="px-4 py-3 text-left font-semibold">Subject</th>
              <th className="px-4 py-3 text-left font-semibold">Segment Name</th>
              <th className="px-4 py-3 text-left font-semibold">Category Name</th>
              <th className="px-4 py-3 text-left font-semibold">Department</th>
              <th className="px-4 py-3 text-center font-semibold">PDF</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No records found. Click Submit to search.</td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.noticeNo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700 font-medium">{row.noticeNo}</td>
                  <td className="px-4 py-3">
                    <Link href="#" className="text-blue-700 hover:underline">{row.subject}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.segmentName}</td>
                  <td className="px-4 py-3 text-gray-700">{row.categoryName}</td>
                  <td className="px-4 py-3 text-gray-700">{row.department}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-red-600 text-lg cursor-pointer" title="Download PDF">📄</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CircuitChangesView() {
  const [activeTab, setActiveTab] = useState<ExchangeTab>('nse');

  const now = new Date();
  const dateStr = `As on ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} IST`;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Circuit Changes</h1>
        <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
      </div>

      {/* Exchange Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('nse')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'nse'
                ? 'border-indigo-700 text-indigo-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            NSE
          </button>
          <button
            onClick={() => setActiveTab('bse')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'bse'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            BSE
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'nse' ? <NSECircuitChanges /> : <BSECircuitChanges />}
    </div>
  );
}
