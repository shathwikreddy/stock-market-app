'use client';

import { useState, useMemo } from 'react';

// Seeded random number generator for consistent values
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Generate PE ratio data for the heatmap with consistent values
const generatePEData = () => {
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const data: { year: number; month: string; monthIndex: number; pe: number; quarter: string }[] = [];
  
  years.forEach((year) => {
    months.forEach((month, monthIndex) => {
      // Use seeded random for consistent PE values
      const seed = year * 100 + monthIndex;
      const randomFactor = (seededRandom(seed) - 0.5) * 6;
      const basePE = 22 + Math.sin(year / 3 + monthIndex / 2) * 8 + randomFactor;
      const pe = Math.round(basePE * 100) / 100;
      
      // Determine quarter
      let quarter = 'Q1';
      if (monthIndex >= 3 && monthIndex <= 5) quarter = 'Q2';
      else if (monthIndex >= 6 && monthIndex <= 8) quarter = 'Q3';
      else if (monthIndex >= 9) quarter = 'Q4';
      
      data.push({
        year,
        month,
        monthIndex,
        pe,
        quarter,
      });
    });
  });
  
  return data;
};

// Get color based on PE value
const getPEColor = (pe: number): string => {
  // PE values typically range from 10 to 40 for Nifty
  // Lower PE (green) = undervalued, Higher PE (red) = overvalued
  if (pe <= 15) return '#1a9850';      // Deep green
  if (pe <= 17) return '#66bd63';      // Light green
  if (pe <= 19) return '#a6d96a';      // Lime
  if (pe <= 21) return '#d9ef8b';      // Yellow-green
  if (pe <= 23) return '#fee08b';      // Yellow
  if (pe <= 25) return '#fdae61';      // Orange
  if (pe <= 28) return '#f46d43';      // Dark orange
  if (pe <= 32) return '#d73027';      // Red
  return '#a50026';                     // Deep red
};

// Get text color based on background
const getTextColor = (pe: number): string => {
  if (pe <= 19 || (pe > 21 && pe <= 25)) return '#000';
  return '#fff';
};

interface TooltipData {
  month: string;
  quarter: string;
  year: number;
  pe: number;
  x: number;
  y: number;
}

export default function PEPage() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  
  // Use useMemo to ensure data is calculated only once
  const peData = useMemo(() => generatePEData(), []);
  
  const years = useMemo(() => [...new Set(peData.map(d => d.year))].sort((a, b) => b - a), [peData]);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get current Nifty PE (most recent data point)
  const currentPE = peData.find(d => d.year === years[0] && d.month === 'Jan')?.pe || 22.40;
  
  // Get last updated time
  const lastUpdated = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const handleMouseEnter = (data: { month: string; quarter: string; year: number; pe: number }, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      ...data,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="bg-white border border-gray-300 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold text-gray-900">Nifty PE Ratio</span>
              <span className="text-2xl font-bold text-green-600">{currentPE.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>

        {/* PE Ratio Heatmap Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-2 text-gray-700 font-semibold text-center sticky left-0 bg-gray-50 z-10">Year</th>
                  {months.map((month) => (
                    <th key={month} className="border border-gray-300 px-2 py-2 text-gray-700 font-semibold text-center min-w-[55px]">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {years.map((year) => (
                  <tr key={year}>
                    <td className="border border-gray-300 px-2 py-1 text-gray-900 font-semibold text-center sticky left-0 bg-gray-50 z-10">
                      {year.toString().slice(-2)}
                    </td>
                    {months.map((month, monthIndex) => {
                      const cellData = peData.find(d => d.year === year && d.monthIndex === monthIndex);
                      const pe = cellData?.pe || 0;
                      const quarter = cellData?.quarter || 'Q1';

                      // Skip future dates
                      const now = new Date();
                      const isValidDate = year < now.getFullYear() ||
                        (year === now.getFullYear() && monthIndex <= now.getMonth());

                      if (!isValidDate) {
                        return (
                          <td key={`${year}-${month}`} className="border border-gray-300 px-2 py-1 text-center bg-gray-100 text-gray-400">
                            -
                          </td>
                        );
                      }

                      return (
                        <td
                          key={`${year}-${month}`}
                          className="border border-gray-300 px-2 py-1 text-center cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-blue-500 hover:z-20 relative"
                          style={{
                            backgroundColor: getPEColor(pe),
                            color: getTextColor(pe),
                          }}
                          onMouseEnter={(e) => handleMouseEnter({ month, quarter, year, pe }, e)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <span className="font-medium">{pe.toFixed(2)}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 mr-2">PE Scale:</span>
            {[
              { label: '≤15', color: '#1a9850' },
              { label: '15-17', color: '#66bd63' },
              { label: '17-19', color: '#a6d96a' },
              { label: '19-21', color: '#d9ef8b' },
              { label: '21-23', color: '#fee08b' },
              { label: '23-25', color: '#fdae61' },
              { label: '25-28', color: '#f46d43' },
              { label: '28-32', color: '#d73027' },
              { label: '≥32', color: '#a50026' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 px-2">
                <div
                  className="w-7 h-5 border border-gray-300 rounded shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-700 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
            <span className="text-green-700 font-semibold">Green</span> = Undervalued
            <span className="mx-2">•</span>
            <span className="text-yellow-600 font-semibold">Yellow</span> = Fair Value
            <span className="mx-2">•</span>
            <span className="text-red-600 font-semibold">Red</span> = Overvalued
          </div>
        </div>

      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-white border border-gray-300 shadow-xl rounded-lg px-4 py-3 min-w-[200px]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Month:</span>
                <span className="font-semibold text-gray-900">{tooltip.month}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quarter:</span>
                <span className="font-semibold text-gray-900">{tooltip.quarter}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Year:</span>
                <span className="font-semibold text-gray-900">{tooltip.year}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-600">P/E Ratio:</span>
                <span className="font-bold text-blue-600 text-base">{tooltip.pe.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
