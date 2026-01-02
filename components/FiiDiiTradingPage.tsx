'use client';

import { useState, useMemo } from 'react';
import {
    currentMonthData,
    previousMonthsData,
    foData,
    mfSebiData,
    fiiSebiData,
    FiiDiiDailyData,
    FiiDiiMonthlyData,
} from '@/lib/fiiDiiMockData';

const segmentTabs = ['Cash', 'F&O', 'MF SEBI', 'FII SEBI'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['2024', '2025', '2026'];

function formatNumber(num: number): string {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function NetValueCell({ value }: { value: number }) {
    const isPositive = value >= 0;
    return (
        <span className={isPositive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {formatNumber(value)}
        </span>
    );
}

export default function FiiDiiTradingPage() {
    const [activeSegment, setActiveSegment] = useState('Cash');
    const [fromMonth, setFromMonth] = useState('January');
    const [fromYear, setFromYear] = useState('2025');
    const [toMonth, setToMonth] = useState('December');
    const [toYear, setToYear] = useState('2025');
    const [activeGraph, setActiveGraph] = useState<'Sensex' | 'Nifty'>('Sensex');
    const [intradayExchange, setIntradayExchange] = useState('BSE');

    const currentDate = new Date();
    const currentMonthName = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear().toString().slice(-2);

    const getDataForSegment = (): FiiDiiDailyData[] => {
        switch (activeSegment) {
            case 'F&O':
                return foData;
            case 'MF SEBI':
                return mfSebiData;
            case 'FII SEBI':
                return fiiSebiData;
            default:
                return currentMonthData;
        }
    };

    const filteredPreviousData = useMemo(() => {
        const fromYearNum = parseInt(fromYear);
        const toYearNum = parseInt(toYear);
        const fromMonthIdx = months.indexOf(fromMonth);
        const toMonthIdx = months.indexOf(toMonth);

        return previousMonthsData.filter((item) => {
            const itemMonthIdx = months.indexOf(item.month);
            const itemYear = item.year;

            if (itemYear < fromYearNum || itemYear > toYearNum) return false;
            if (itemYear === fromYearNum && itemMonthIdx < fromMonthIdx) return false;
            if (itemYear === toYearNum && itemMonthIdx > toMonthIdx) return false;
            return true;
        });
    }, [fromMonth, fromYear, toMonth, toYear]);

    const handleReset = () => {
        setFromMonth('January');
        setFromYear('2025');
        setToMonth('December');
        setToYear('2025');
    };

    const segmentData = getDataForSegment();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
                    FII & DII TRADING ACTIVITY DURING {currentMonthName.toUpperCase().slice(0, 3)} '{currentYear}
                </h1>
                <div className="w-16 h-1 bg-orange-500 mx-auto mb-6"></div>

                <div className="flex gap-6">
                    <div className="flex-1">
                        <div className="flex border-b border-gray-200 mb-4">
                            {segmentTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveSegment(tab)}
                                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSegment === tab
                                            ? 'text-blue-700 border-b-2 border-blue-700'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"></th>
                                        <th colSpan={3} className="py-2 px-4 text-center text-sm font-bold text-blue-800 border-b border-gray-200">
                                            FII Rs Crores
                                        </th>
                                        <th colSpan={3} className="py-2 px-4 text-center text-sm font-bold text-blue-800 border-b border-gray-200">
                                            DII Rs Crores
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">Date</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Purchase</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Sales</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Net Purchase / Sales</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Purchase</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Sales</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Net Purchase / Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {segmentData.map((row, idx) => (
                                        <tr key={idx} className={`hover:bg-gray-50 ${row.date === 'Month till date' ? 'bg-gray-100 font-semibold' : ''}`}>
                                            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-100">{row.date}</td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.fiiGrossPurchase)}</td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.fiiGrossSales)}</td>
                                            <td className="py-3 px-4 text-sm text-right border-b border-gray-100">
                                                <NetValueCell value={row.fiiNetPurchaseSales} />
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.diiGrossPurchase)}</td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.diiGrossSales)}</td>
                                            <td className="py-3 px-4 text-sm text-right border-b border-gray-100">
                                                <NetValueCell value={row.diiNetPurchaseSales} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-blue-50 py-4 mb-6">
                            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                                PREVIOUS FII & DII TRADING ACTIVITIES
                            </h2>

                            <div className="flex items-center justify-center gap-4 mb-6">
                                <select
                                    value={fromMonth}
                                    onChange={(e) => setFromMonth(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={fromYear}
                                    onChange={(e) => setFromYear(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <span className="text-gray-500 text-sm">To</span>
                                <select
                                    value={toMonth}
                                    onChange={(e) => setToMonth(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={toYear}
                                    onChange={(e) => setToYear(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => { }}
                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                                >
                                    Go
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="flex border-b border-gray-200 mb-4 bg-white mx-4 rounded-t">
                                {segmentTabs.map((tab) => (
                                    <button
                                        key={`prev-${tab}`}
                                        onClick={() => setActiveSegment(tab)}
                                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSegment === tab
                                                ? 'text-blue-700 border-b-2 border-blue-700'
                                                : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"></th>
                                        <th colSpan={3} className="py-2 px-4 text-center text-sm font-bold text-blue-800 border-b border-gray-200">
                                            FII Rs Crores
                                        </th>
                                        <th colSpan={3} className="py-2 px-4 text-center text-sm font-bold text-blue-800 border-b border-gray-200">
                                            DII Rs Crores
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">Date</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Purchase</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Sales</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Net Purchase / Sales</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Purchase</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Gross Sales</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">Net Purchase / Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPreviousData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-blue-600 border-b border-gray-100 cursor-pointer hover:underline">
                                                {row.month} {row.year}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.fiiGrossPurchase)}</td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.fiiGrossSales)}</td>
                                            <td className="py-3 px-4 text-sm text-right border-b border-gray-100">
                                                <NetValueCell value={row.fiiNetPurchaseSales} />
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.diiGrossPurchase)}</td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 border-b border-gray-100">{formatNumber(row.diiGrossSales)}</td>
                                            <td className="py-3 px-4 text-sm text-right border-b border-gray-100">
                                                <NetValueCell value={row.diiNetPurchaseSales} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <h3 className="text-sm font-bold text-red-700 mb-3">INDICES GRAPH</h3>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setActiveGraph('Sensex')}
                                    className={`px-4 py-1 text-sm rounded transition-colors ${activeGraph === 'Sensex'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Sensex
                                </button>
                                <button
                                    onClick={() => setActiveGraph('Nifty')}
                                    className={`px-4 py-1 text-sm rounded transition-colors ${activeGraph === 'Nifty'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Nifty
                                </button>
                            </div>
                            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
                                {activeGraph} Chart Placeholder
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-red-700">INTRADAY</h3>
                                <select
                                    value={intradayExchange}
                                    onChange={(e) => setIntradayExchange(e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                                >
                                    <option value="BSE">BSE</option>
                                    <option value="NSE">NSE</option>
                                </select>
                            </div>
                            <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
                                Intraday Data Placeholder
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
