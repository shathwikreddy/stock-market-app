'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

// Types
interface GlobalIndex {
  id: string;
  name: string;
  flag: string;
  country: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  high52W: number;
  low52W: number;
  ytd: number;
  technicalRating: 'Very Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Very Bearish';
  timestamp: string;
}

interface Commodity {
  id: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  high52W: number;
  low52W: number;
  ytd: number;
  technicalRating: 'Very Bullish' | 'Bullish' | 'Neutral';
  timestamp: string;
}

interface Currency {
  id: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  timestamp: string;
}

interface Bond {
  id: string;
  name: string;
  flag: string;
  yield: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  high52W: number;
  low52W: number;
  ytd: number;
  timestamp: string;
}

interface IndianADR {
  id: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  timestamp: string;
}

// Dummy Data
const usMarkets: GlobalIndex[] = [
  { id: '1', name: 'Dow Jones Futures', flag: '🇺🇸', country: 'USA', ltp: 49302.47, change: -197.83, changePercent: -0.40, high: 49649.86, low: 49112.43, open: 49323.59, prevClose: 49501.30, high52W: 49653.13, low52W: 36611.78, ytd: 2.58, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '2', name: 'S&P 500', flag: '🇺🇸', country: 'USA', ltp: 6885.99, change: -31.82, changePercent: -0.46, high: 6936.09, low: 6838.80, open: 6931.54, prevClose: 6917.81, high52W: 7002.28, low52W: 4835.04, ytd: 0.59, technicalRating: 'Neutral', timestamp: '05 Feb, 2026 | 02:29 IST' },
  { id: '3', name: 'Nasdaq', flag: '🇺🇸', country: 'USA', ltp: 22911.53, change: -343.66, changePercent: -1.48, high: 23270.07, low: 22684.51, open: 23190.06, prevClose: 23255.19, high52W: 24019.99, low52W: 14784.03, ytd: -1.47, technicalRating: 'Bearish', timestamp: '05 Feb, 2026 | 02:29 IST' },
];

const europeanMarkets: GlobalIndex[] = [
  { id: '4', name: 'FTSE', flag: '🇬🇧', country: 'UK', ltp: 10298.60, change: -103.74, changePercent: -1.00, high: 10404.03, low: 10292.55, open: 10356.40, prevClose: 10402.34, high52W: 10481.54, low52W: 7544.83, ytd: 3.70, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 19:53 IST' },
  { id: '5', name: 'CAC', flag: '🇫🇷', country: 'France', ltp: 8211.30, change: -50.86, changePercent: -0.62, high: 8312.68, low: 8204.00, open: 8269.40, prevClose: 8262.16, high52W: 8396.72, low52W: 6763.76, ytd: 0.76, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 19:53 IST' },
  { id: '6', name: 'DAX', flag: '🇩🇪', country: 'Germany', ltp: 24386.40, change: -216.64, changePercent: -0.88, high: 24663.81, low: 24333.00, open: 24671.00, prevClose: 24603.04, high52W: 25507.79, low52W: 18489.91, ytd: 0.14, technicalRating: 'Bearish', timestamp: '05 Feb, 2026 | 19:53 IST' },
];

const asianMarkets: GlobalIndex[] = [
  { id: '7', name: 'GIFT NIFTY', flag: '🇮🇳', country: 'India', ltp: 25664.00, change: -37.00, changePercent: -0.14, high: 25888.00, low: 25630.50, open: 25869.00, prevClose: 25701.00, high52W: 26694.50, low52W: 21827.00, ytd: -2.38, technicalRating: 'Neutral', timestamp: '05 Feb, 2026 | 19:53 IST' },
  { id: '8', name: 'Nikkei 225', flag: '🇯🇵', country: 'Japan', ltp: 53818.04, change: -475.32, changePercent: -0.88, high: 54459.08, low: 53653.06, open: 54180.00, prevClose: 54293.36, high52W: 54782.83, low52W: 30792.74, ytd: 3.83, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 11:30 IST' },
  { id: '9', name: 'Straits Times', flag: '🇸🇬', country: 'Singapore', ltp: 4975.87, change: 10.37, changePercent: 0.21, high: 4980.57, low: 4944.24, open: 4965.50, prevClose: 4965.50, high52W: 4980.57, low52W: 3393.69, ytd: 6.87, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 15:05 IST' },
  { id: '10', name: 'Hang Seng', flag: '🇭🇰', country: 'Hong Kong', ltp: 26885.24, change: 37.92, changePercent: 0.14, high: 26919.39, low: 26410.77, open: 26593.00, prevClose: 26847.32, high52W: 28056.10, low52W: 19260.21, ytd: 2.08, technicalRating: 'Bullish', timestamp: '05 Feb, 2026 | 13:30 IST' },
  { id: '11', name: 'Taiwan Weighted', flag: '🇹🇼', country: 'Taiwan', ltp: 31801.27, change: -488.54, changePercent: -1.54, high: 32241.64, low: 31769.08, open: 32241.64, prevClose: 32289.81, high52W: 32555.52, low52W: 18418.20, ytd: 8.35, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 11:23 IST' },
  { id: '12', name: 'KOSPI', flag: '🇰🇷', country: 'South Korea', ltp: 5163.57, change: -207.53, changePercent: -4.02, high: 5304.40, low: 5142.20, open: 5251.03, prevClose: 5371.10, high52W: 5321.68, low52W: 2394.25, ytd: 19.81, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 12:01 IST' },
  { id: '13', name: 'SET Composite', flag: '🇹🇭', country: 'Thailand', ltp: 1346.23, change: -0.31, changePercent: -0.02, high: 1351.98, low: 1338.32, open: 1344.20, prevClose: 1346.54, high52W: 1331.62, low52W: 1066.02, ytd: 5.17, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 15:06 IST' },
  { id: '14', name: 'Jakarta Composite', flag: '🇮🇩', country: 'Indonesia', ltp: 8103.88, change: -42.84, changePercent: -0.53, high: 8214.46, low: 8102.79, open: 8154.60, prevClose: 8146.72, high52W: 9174.47, low52W: 5882.61, ytd: -7.36, technicalRating: 'Very Bearish', timestamp: '05 Feb, 2026 | 14:30 IST' },
];

const commoditiesData: Commodity[] = [
  { id: '1', name: 'Brent Crude', ltp: 67.59, change: -1.87, changePercent: -2.69, high: 68.93, low: 67.25, open: 68.65, prevClose: 69.46, high52W: 79.04, low52W: 58.72, ytd: 11.10, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '2', name: 'Gold', ltp: 4826.49, change: -138.75, changePercent: -2.79, high: 5042.25, low: 4795.25, open: 5011.96, prevClose: 4965.24, high52W: 5595.51, low52W: 2832.51, ytd: 11.73, technicalRating: 'Bullish', timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '3', name: 'Crude Oil', ltp: 63.30, change: -1.84, changePercent: -2.83, high: 64.67, low: 63.03, open: 64.39, prevClose: 65.14, high52W: 77.63, low52W: 55.20, ytd: 10.26, technicalRating: 'Very Bullish', timestamp: '05 Feb, 2026 | 19:54 IST' },
];

const currenciesData: Currency[] = [
  { id: '1', name: 'Dollar Index', ltp: 97.6700, change: 0.0500, changePercent: 0.05, high: 97.9200, low: 97.6000, open: 97.6800, prevClose: 97.6200, timestamp: '05 Feb, 2026 | 19:53 IST' },
  { id: '2', name: 'USD/INR', ltp: 90.3400, change: -0.0900, changePercent: -0.10, high: 90.5200, low: 90.0675, open: 90.5100, prevClose: 90.4300, timestamp: '05 Feb, 2026 | 15:31 IST' },
  { id: '3', name: 'GBP/INR', ltp: 122.5875, change: -1.3653, changePercent: -1.10, high: 123.3369, low: 122.4175, open: 123.3358, prevClose: 123.9528, timestamp: '05 Feb, 2026 | 15:33 IST' },
  { id: '4', name: 'EUR/INR', ltp: 106.4413, change: -0.3781, changePercent: -0.35, high: 106.6977, low: 106.2855, open: 106.6945, prevClose: 106.8194, timestamp: '05 Feb, 2026 | 15:33 IST' },
  { id: '5', name: 'JPY/INR', ltp: 0.5743, change: -0.0028, changePercent: -0.49, high: 0.5773, low: 0.5732, open: 0.5766, prevClose: 0.5771, timestamp: '05 Feb, 2026 | 15:33 IST' },
  { id: '6', name: 'CNY/INR', ltp: 13.0161, change: -0.0059, changePercent: -0.05, high: 13.0310, low: 12.9780, open: 13.0200, prevClose: 13.0220, timestamp: '05 Feb, 2026 | 15:33 IST' },
  { id: '7', name: 'USD/JPY', ltp: 156.7220, change: -0.1380, changePercent: -0.09, high: 157.3370, low: 156.5240, open: 156.8600, prevClose: 156.8600, timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '8', name: 'EUR/USD', ltp: 1.1815, change: 0.0008, changePercent: 0.07, high: 1.1822, low: 1.1781, open: 1.1807, prevClose: 1.1807, timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '9', name: 'USD/CNY', ltp: 6.9411, change: -0.0028, changePercent: -0.04, high: 6.9493, low: 6.9391, open: 6.9450, prevClose: 6.9439, timestamp: '05 Feb, 2026 | 15:33 IST' },
];

const bondsData: Bond[] = [
  { id: '1', name: 'India 5Y', flag: '🇮🇳', yield: 6.48, change: -0.04, changePercent: -0.54, high: 6.50, low: 6.46, open: 6.46, prevClose: 6.51, high52W: 6.79, low52W: 5.80, ytd: 2.71, timestamp: '05 Feb, 2026 | 15:08 IST' },
  { id: '2', name: 'India 10Y', flag: '🇮🇳', yield: 6.68, change: -0.03, changePercent: -0.39, high: 6.73, low: 6.68, open: 6.71, prevClose: 6.71, high52W: 6.82, low52W: 6.15, ytd: 1.63, timestamp: '05 Feb, 2026 | 05:30 IST' },
  { id: '3', name: 'India 30Y', flag: '🇮🇳', yield: 7.39, change: -0.02, changePercent: -0.20, high: 7.42, low: 7.38, open: 7.42, prevClose: 7.41, high52W: 7.46, low52W: 6.74, ytd: 1.89, timestamp: '05 Feb, 2026 | 15:28 IST' },
  { id: '4', name: 'United States 10Y', flag: '🇺🇸', yield: 4.24, change: -0.04, changePercent: -0.91, high: 4.29, low: 4.23, open: 4.28, prevClose: 4.28, high52W: 4.66, low52W: 3.87, ytd: 1.65, timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '5', name: 'China 10Y', flag: '🇨🇳', yield: 1.81, change: 0.00, changePercent: -0.17, high: 1.82, low: 1.81, open: 1.81, prevClose: 1.81, high52W: 1.97, low52W: 1.59, ytd: -2.16, timestamp: '05 Feb, 2026 | 12:29 IST' },
  { id: '6', name: 'Japan 10Y', flag: '🇯🇵', yield: 2.23, change: -0.02, changePercent: -1.03, high: 2.26, low: 2.23, open: 2.26, prevClose: 2.25, high52W: 2.36, low52W: 1.06, ytd: 7.48, timestamp: '05 Feb, 2026 | 14:30 IST' },
  { id: '7', name: 'United Kingdom 10Y', flag: '🇬🇧', yield: 4.52, change: -0.04, changePercent: -0.82, high: 4.62, low: 4.50, open: 4.58, prevClose: 4.56, high52W: 4.86, low52W: 4.32, ytd: 0.94, timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '8', name: 'Germany 10Y', flag: '🇩🇪', yield: 2.86, change: 0.00, changePercent: -0.16, high: 2.88, low: 2.84, open: 2.86, prevClose: 2.86, high52W: 2.94, low52W: 2.35, ytd: -0.17, timestamp: '05 Feb, 2026 | 19:55 IST' },
  { id: '9', name: 'France 10Y', flag: '🇫🇷', yield: 3.46, change: 0.01, changePercent: 0.16, high: 3.48, low: 3.45, open: 3.45, prevClose: 3.45, high52W: 3.63, low52W: 3.07, ytd: -2.96, timestamp: '05 Feb, 2026 | 19:55 IST' },
  { id: '10', name: 'Italy 10Y', flag: '🇮🇹', yield: 3.49, change: 0.01, changePercent: 0.29, high: 3.51, low: 3.48, open: 3.49, prevClose: 3.48, high52W: 4.00, low52W: 3.33, ytd: -0.59, timestamp: '05 Feb, 2026 | 19:55 IST' },
  { id: '11', name: 'South Africa 10Y', flag: '🇿🇦', yield: 8.08, change: 0.04, changePercent: 0.44, high: 8.12, low: 7.96, open: 8.08, prevClose: 8.05, high52W: 11.28, low52W: 7.93, ytd: -1.58, timestamp: '05 Feb, 2026 | 19:53 IST' },
  { id: '12', name: 'Canada 10Y', flag: '🇨🇦', yield: 3.42, change: -0.02, changePercent: -0.67, high: 3.45, low: 3.41, open: 3.45, prevClose: 3.45, high52W: 3.63, low52W: 2.80, ytd: -0.38, timestamp: '05 Feb, 2026 | 19:54 IST' },
  { id: '13', name: 'Brazil 10Y', flag: '🇧🇷', yield: 13.57, change: 0.12, changePercent: 0.85, high: 13.59, low: 13.57, open: 13.57, prevClose: 13.46, high52W: 15.33, low52W: 13.18, ytd: -2.06, timestamp: '04 Feb, 2026 | 05:30 IST' },
];

const indianADRData: IndianADR[] = [
  { id: '1', name: 'Axis Bank ADR', ltp: 73.60, change: -0.70, changePercent: -0.94, high: 74.40, low: 73.60, open: 73.80, prevClose: 74.30, timestamp: '05 Feb, 2026 | 19:05 IST' },
  { id: '2', name: 'Azure Power Global', ltp: 1.69, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 1.73, prevClose: 1.69, timestamp: '13 Jul, 2023 | 01:45 IST' },
  { id: '3', name: 'Dr Reddy ADR', ltp: 14.00, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 13.75, prevClose: 14.00, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '4', name: 'Eros STX Global Corporation', ltp: 0.00, change: -0.01, changePercent: -100.00, high: 0.00, low: 0.00, open: 0.00, prevClose: 0.01, timestamp: '06 Aug, 2025 | 20:29 IST' },
  { id: '5', name: 'Genpact Limited', ltp: 38.34, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 38.72, prevClose: 38.34, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '6', name: 'HDFC Bank ADR', ltp: 33.95, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 33.91, prevClose: 33.95, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '7', name: 'ICICI Bank ADR', ltp: 30.92, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 30.90, prevClose: 30.92, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '8', name: 'Infosys ADR', ltp: 16.74, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 16.71, prevClose: 16.74, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '9', name: 'MakeMyTrip', ltp: 55.46, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 55.82, prevClose: 55.46, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '10', name: 'SIFY TECH', ltp: 14.51, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 15.19, prevClose: 14.51, timestamp: '05 Feb, 2026 | 02:45 IST' },
  { id: '11', name: 'Wipro ADR', ltp: 2.56, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 2.53, prevClose: 2.56, timestamp: '05 Feb, 2026 | 02:44 IST' },
  { id: '12', name: 'WNS Holdings', ltp: 76.48, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 76.40, prevClose: 76.48, timestamp: '17 Oct, 2025 | 01:44 IST' },
  { id: '13', name: 'Yatra Online', ltp: 1.55, change: 0.00, changePercent: 0.00, high: 0.00, low: 0.00, open: 1.57, prevClose: 1.55, timestamp: '05 Feb, 2026 | 02:44 IST' },
];

export default function GlobalMarketsTable() {
  const [activeTab, setActiveTab] = useState<'indices' | 'commodities' | 'currencies' | 'bonds' | 'indianADR'>('indices');
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const tabs = [
    { id: 'indices', label: 'Global Indices' },
    { id: 'commodities', label: 'Commodities' },
    { id: 'currencies', label: 'Currencies' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'indianADR', label: 'Indian ADR' },
  ];

  const subTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical' },
    { id: 'performance', label: 'Performance' },
    { id: 'pivotLevel', label: 'Pivot Level' },
  ];

  const getTechnicalRatingColor = (rating: string) => {
    switch (rating) {
      case 'Very Bullish':
        return 'text-green-600';
      case 'Bullish':
        return 'text-green-500';
      case 'Neutral':
        return 'text-gray-600';
      case 'Bearish':
        return 'text-red-500';
      case 'Very Bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderGlobalIndicesTable = () => {
    const allMarkets = [
      { title: 'US MARKETS', data: usMarkets },
      { title: 'EUROPEAN MARKETS', data: europeanMarkets },
      { title: 'ASIAN MARKETS', data: asianMarkets },
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide sticky left-0 bg-gray-50">Name</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">LTP</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Change</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Chg%</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Open</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Prev. Close</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">52 W High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">52 W Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">YTD (%)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Technical Rating</th>
            </tr>
          </thead>
          <tbody>
            {allMarkets.map((market, idx) => (
              <React.Fragment key={idx}>
                <tr className="bg-gray-100">
                  <td colSpan={12} className="px-4 py-2 font-bold text-gray-900">{market.title}</td>
                </tr>
                {market.data.map((index) => (
                  <tr key={index.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 sticky left-0 bg-white hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{index.flag}</span>
                        <div>
                          <div className="font-semibold text-gray-900 whitespace-nowrap">{index.name}</div>
                          <div className="text-xs text-gray-500">{index.timestamp}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900">{index.ltp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`px-4 py-2.5 text-right font-medium ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-medium ${index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{index.high.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{index.low.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{index.open.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{index.prevClose.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{index.high52W.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{index.low52W.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`px-4 py-2.5 text-right font-medium ${index.ytd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {index.ytd >= 0 ? '+' : ''}{index.ytd.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-medium ${getTechnicalRatingColor(index.technicalRating)}`}>
                      <div className="flex items-center justify-end space-x-1">
                        {index.technicalRating.includes('Bullish') && <TrendingUp className="w-4 h-4" />}
                        {index.technicalRating.includes('Bearish') && <ArrowDownRight className="w-4 h-4" />}
                        <span>{index.technicalRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCommoditiesTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide sticky left-0 bg-gray-50">Name</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">LTP($)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Change</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Chg%</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Open</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Prev. Close</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">52 W High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">52 W Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">YTD (%)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Technical Rating</th>
            </tr>
          </thead>
          <tbody>
            {commoditiesData.map((commodity) => (
              <tr key={commodity.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 sticky left-0 bg-white hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-gray-900 whitespace-nowrap">{commodity.name}</div>
                    <div className="text-xs text-gray-500">{commodity.timestamp}</div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-gray-900">{commodity.ltp.toFixed(2)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${commodity.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {commodity.change >= 0 ? '+' : ''}{commodity.change.toFixed(2)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${commodity.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{commodity.high.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{commodity.low.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{commodity.open.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{commodity.prevClose.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{commodity.high52W.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{commodity.low52W.toFixed(2)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${commodity.ytd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {commodity.ytd >= 0 ? '+' : ''}{commodity.ytd.toFixed(2)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${getTechnicalRatingColor(commodity.technicalRating)}`}>
                  <div className="flex items-center justify-end space-x-1">
                    {commodity.technicalRating.includes('Bullish') && <TrendingUp className="w-4 h-4" />}
                    <span>{commodity.technicalRating}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCurrenciesTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide sticky left-0 bg-gray-50">Name</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">LTP</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Change</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Chg%</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Open</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Prev. Close</th>
            </tr>
          </thead>
          <tbody>
            {currenciesData.map((currency) => (
              <tr key={currency.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 sticky left-0 bg-white hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-gray-900 whitespace-nowrap">{currency.name}</div>
                    <div className="text-xs text-gray-500">{currency.timestamp}</div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-gray-900">{currency.ltp.toFixed(4)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(4)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${currency.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currency.changePercent >= 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{currency.high.toFixed(4)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{currency.low.toFixed(4)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{currency.open.toFixed(4)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{currency.prevClose.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBondsTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide sticky left-0 bg-gray-50">Name</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Yield(%)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Change</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Chg%</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Open</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Prev. Close</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">52 W High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">52 W Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">YTD (%)</th>
            </tr>
          </thead>
          <tbody>
            {bondsData.map((bond) => (
              <tr key={bond.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 sticky left-0 bg-white hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{bond.flag}</span>
                    <div>
                      <div className="font-semibold text-gray-900 whitespace-nowrap">{bond.name}</div>
                      <div className="text-xs text-gray-500">{bond.timestamp}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-gray-900">{bond.yield.toFixed(2)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${bond.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {bond.change >= 0 ? '+' : ''}{bond.change.toFixed(2)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${bond.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {bond.changePercent >= 0 ? '+' : ''}{bond.changePercent.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{bond.high.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{bond.low.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{bond.open.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{bond.prevClose.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{bond.high52W.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{bond.low52W.toFixed(2)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${bond.ytd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {bond.ytd >= 0 ? '+' : ''}{bond.ytd.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderIndianADRTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide sticky left-0 bg-gray-50">Name</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">LTP($)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Change</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Chg%</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">High</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Low</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Open</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">Prev. Close</th>
            </tr>
          </thead>
          <tbody>
            {indianADRData.map((adr) => (
              <tr key={adr.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 sticky left-0 bg-white hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-gray-900 whitespace-nowrap">{adr.name}</div>
                    <div className="text-xs text-gray-500">{adr.timestamp}</div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-gray-900">{adr.ltp.toFixed(2)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${adr.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {adr.change >= 0 ? '+' : ''}{adr.change.toFixed(2)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${adr.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {adr.changePercent >= 0 ? '+' : ''}{adr.changePercent.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{adr.high.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{adr.low.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{adr.open.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{adr.prevClose.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Main Tabs */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          {activeTab === 'indices' && 'Global Indices'}
          {activeTab === 'commodities' && 'Commodities'}
          {activeTab === 'currencies' && 'Currencies'}
          {activeTab === 'bonds' && 'Bonds'}
          {activeTab === 'indianADR' && 'Indian ADR'}
        </h1>
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
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="px-6 py-4">
        {activeTab === 'indices' && renderGlobalIndicesTable()}
        {activeTab === 'commodities' && renderCommoditiesTable()}
        {activeTab === 'currencies' && renderCurrenciesTable()}
        {activeTab === 'bonds' && renderBondsTable()}
        {activeTab === 'indianADR' && renderIndianADRTable()}
      </div>
    </div>
  );
}
