'use client';

import React, { useState } from 'react';

export interface IndexData {
  name: string;
  current: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  indicativeClose: number | null;
  prevClose: number;
  prevDay: number;
  oneWeekAgo: number;
  oneMonthAgo: number;
  oneYearAgo: number;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
}

interface IndicesDataTableProps {
  title: string;
  data: IndexData[];
}

const formatNumber = (num: number | null): string => {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getDateLabel = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function IndicesDataTable({ title, data }: IndicesDataTableProps) {
  const [streaming, setStreaming] = useState(false);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="px-3 py-2.5 text-left font-semibold text-gray-900 uppercase tracking-wide min-w-[160px]">Index</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">Current</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[70px]">%Chng</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">Open</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">High</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">Low</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">
              <div>Indicative</div>
              <div>Close</div>
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">
              <div>Prev.</div>
              <div>Close</div>
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[110px]">
              <div>Prev. Day</div>
              <div className="text-[10px] font-normal text-gray-500">{getDateLabel(1)}</div>
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[110px]">
              <div>1W Ago</div>
              <div className="text-[10px] font-normal text-gray-500">{getDateLabel(7)}</div>
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[110px]">
              <div>1M Ago</div>
              <div className="text-[10px] font-normal text-gray-500">{getDateLabel(30)}</div>
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[110px]">
              <div>1Y Ago</div>
              <div className="text-[10px] font-normal text-gray-500">{getDateLabel(365)}</div>
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">52W H</th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-900 uppercase tracking-wide min-w-[100px]">52W L</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {/* Category Title Row */}
          <tr className="border-b border-gray-200 bg-gray-50/70">
            <td colSpan={11} className="px-3 py-2">
              <span className="text-gray-900 font-bold text-xs uppercase tracking-wide">{title}</span>
            </td>
            <td colSpan={3} className="px-3 py-2 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-gray-500 font-medium">Streaming</span>
                <button
                  onClick={() => setStreaming(!streaming)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    streaming ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      streaming ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-xs font-medium ${streaming ? 'text-gray-900' : 'text-gray-400'}`}>
                  {streaming ? 'On' : 'Off'}
                </span>
              </div>
            </td>
          </tr>

          {/* Data Rows */}
          {data.map((index, i) => (
            <tr
              key={index.name}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-3 text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline whitespace-nowrap">
                {index.name}
              </td>
              <td className="px-3 py-3 text-right text-gray-900 font-bold">
                {formatNumber(index.current)}
              </td>
              <td className={`px-3 py-3 text-right font-semibold ${
                index.changePercent > 0
                  ? 'text-green-600'
                  : index.changePercent < 0
                  ? 'text-red-600'
                  : 'text-gray-700'
              }`}>
                {index.changePercent.toFixed(2)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.open)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.high)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.low)}
              </td>
              <td className="px-3 py-3 text-right text-gray-400">
                {index.indicativeClose !== null ? formatNumber(index.indicativeClose) : '-'}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.prevClose)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.prevDay)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.oneWeekAgo)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.oneMonthAgo)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.oneYearAgo)}
              </td>
              <td className="px-3 py-3 text-right text-gray-900">
                {formatNumber(index.fiftyTwoWeekHigh)}
              </td>
              <td className="px-3 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-gray-900">{formatNumber(index.fiftyTwoWeekLow)}</span>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
