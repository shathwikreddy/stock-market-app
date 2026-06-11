'use client';

import Link from 'next/link';
import { LineChart } from 'lucide-react';
import { NavDropdown } from './NavDropdown';
import { marketDataLinks } from '@/lib/nav-config';

const linkClass = "block px-4 py-1 text-sm text-black hover:bg-gray-100 hover:outline hover:outline-1 hover:outline-gray-300 border-b border-gray-200";
const sectionHeader = "px-4 py-1.5 text-sm font-bold text-black border-b border-gray-200";
const columnHeader = "px-4 py-2 text-sm font-bold text-black border-b border-gray-300 bg-gray-50";

interface MarketDataDropdownProps {
  isActive: boolean;
}

export function MarketDataDropdown({ isActive }: MarketDataDropdownProps) {
  return (
    <NavDropdown label="Market Data" icon={LineChart} isActive={isActive}>
      <div className="flex">
        {/* Market Overview Column */}
        <div className="min-w-[200px] border-r border-gray-300">
          <div className={columnHeader}>Market Overview</div>

          {/* Indices */}
          <div className="border-b border-gray-300">
            <div className={sectionHeader}>Indices</div>
            {marketDataLinks.marketOverview.indices.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>{link.label}</Link>
            ))}
          </div>

          {/* Sectors */}
          <div className="border-b border-gray-300">
            <div className={sectionHeader}>Sectors</div>
            {marketDataLinks.marketOverview.sectors.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>{link.label}</Link>
            ))}
          </div>

          {/* Total Market */}
          <div className="border-b border-gray-300">
            <div className="px-4 py-1.5 text-sm font-bold text-black border-b border-gray-200">Total Market</div>
            <Link href="/market-data/advances-decline-unchanged" className={linkClass}>
              Advances, Decline & Unchanged
            </Link>
            <Link href="/market" className={linkClass}>
              Total Market Performance
            </Link>
          </div>

          {/* Market Mood */}
          <div className="border-b border-gray-300">
            <Link href="/market-mood" className="block px-4 py-1.5 text-sm text-black hover:bg-gray-100 hover:outline hover:outline-1 hover:outline-gray-300">
              Market Mood
            </Link>
          </div>

          {/* Futures Support & Resistance */}
          <div className="border-b border-gray-300">
            <Link href="#" className="block px-4 py-1.5 text-sm text-black hover:bg-gray-100 hover:outline hover:outline-1 hover:outline-gray-300">
              Futures Support & Resistance
            </Link>
          </div>

          {/* Global Markets */}
          <div className="border-b border-gray-300">
            <Link href="/market-data/global-markets" className="block px-4 py-1.5 text-sm font-bold text-black hover:bg-gray-100 hover:outline hover:outline-1 hover:outline-gray-300">
              Global Markets
            </Link>
          </div>

          {/* Filterings */}
          <div>
            <div className="px-4 py-1.5 text-sm font-bold text-black">Filterings</div>
          </div>
        </div>

        {/* Equity Column */}
        <div className="min-w-[150px] border-r border-gray-300">
          <div className={columnHeader}>Equity</div>
          {marketDataLinks.equity.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>{link.label}</Link>
          ))}
          <div className="border-b border-gray-300">
            <div className="px-4 py-1.5 text-sm font-bold text-black">Filterings</div>
          </div>
        </div>

        {/* Others Column */}
        <div className="min-w-[180px]">
          <div className={columnHeader}>Others</div>

          <Link href="/market-data/results-calendar" className={linkClass}>Results Calendar</Link>
          <Link href="/market-data/fii-dii" className={linkClass}>FII & DII Activity</Link>
          <Link href="#" className={linkClass}>Promoters Activity</Link>
          <Link href="#" className={linkClass}>Mutual Funds Activity</Link>
          <Link href="#" className={linkClass}>Super Investors</Link>
          <Link href="/market-data/corporate-action" className={linkClass}>Corporate Action</Link>

          {/* Deals */}
          <div className="border-b border-gray-200">
            <div className="px-4 py-1.5 text-sm font-bold text-black border-b border-gray-200">Deals</div>
            <Link href="/market-data/bulk-deals" className={linkClass}>Bulk Deals</Link>
            <Link href="/market-data/block-deals" className={linkClass}>Block Deals</Link>
            <Link href="/market-data/intraday-deals" className={linkClass}>Intraday Large Deals</Link>
            <Link href="/market-data/circuit-changes" className={linkClass}>Circuit Changes</Link>
            <div className="px-4 py-1.5 text-sm font-bold text-black">Monthly Wise</div>
          </div>

          {/* Nifty */}
          <div className="border-b border-gray-200">
            <Link href="#" className={linkClass}>Nifty</Link>
            <Link href="/market-data/pe" className={linkClass}>PE</Link>
          </div>
        </div>
      </div>
    </NavDropdown>
  );
}
