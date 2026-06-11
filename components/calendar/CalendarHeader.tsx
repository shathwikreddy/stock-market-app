'use client';

import { motion } from 'framer-motion';

interface CalendarHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CalendarHeader({ activeTab, onTabChange }: CalendarHeaderProps) {
  const tabs = ['Economic Calendar', 'Holidays', 'Earnings', 'Dividends', 'Splits', 'IPO', 'Expiration'];

  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Ready to Act on Market Events?</span>
          <a href="#" className="text-blue-500 hover:underline">Compare Brokers</a>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-[15px] font-bold transition-colors relative ${activeTab === tab ? 'text-[#1256A0]' : 'text-[#333333] hover:text-[#1256A0]'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1256A0]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
