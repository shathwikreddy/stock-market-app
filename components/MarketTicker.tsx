'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react';

interface TickerItem {
    symbol: string;
    name: string;
    value: string;
    change: number;
    changePercent: number;
    icon?: React.ReactNode;
}

// Mock data - In production, you'd fetch this from an API
const mockTickerData: TickerItem[] = [
    {
        symbol: 'DXY',
        name: 'Dollar Index',
        value: '106.15',
        change: 0.32,
        changePercent: 0.30,
    },
    {
        symbol: 'USD/INR',
        name: 'USD / INR',
        value: '84.42',
        change: -0.08,
        changePercent: -0.09,
    },
    {
        symbol: 'GOLD',
        name: 'Gold',
        value: '₹76,850',
        change: 280,
        changePercent: 0.37,
    },
    {
        symbol: 'SILVER',
        name: 'Silver',
        value: '₹91,200',
        change: -150,
        changePercent: -0.16,
    },
    {
        symbol: 'CRUDE',
        name: 'Crude Oil',
        value: '$68.72',
        change: 0.85,
        changePercent: 1.25,
    },
];

export default function MarketTicker() {
    const [tickerData, setTickerData] = useState<TickerItem[]>(mockTickerData);
    const [isVisible, setIsVisible] = useState(true);

    // Duplicate the data for seamless infinite scroll
    const duplicatedData = [...tickerData, ...tickerData, ...tickerData];

    return (
        <div className="market-ticker-wrapper">
            <div className="market-ticker">
                <div className="ticker-track">
                    {duplicatedData.map((item, index) => (
                        <div key={`${item.symbol}-${index}`} className="ticker-item">
                            <span className="ticker-name">{item.name}</span>
                            <span className="ticker-value">{item.value}</span>
                            <span className={`ticker-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                {item.change >= 0 ? (
                                    <TrendingUp className="ticker-icon" />
                                ) : (
                                    <TrendingDown className="ticker-icon" />
                                )}
                                {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </span>
                            <span className="ticker-divider">|</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .market-ticker-wrapper {
          width: 100%;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .market-ticker {
          position: relative;
          width: 100%;
          height: 36px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .ticker-track {
          display: flex;
          align-items: center;
          animation: scroll 40s linear infinite;
          white-space: nowrap;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          font-size: 13px;
          font-weight: 500;
        }

        .ticker-name {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }

        .ticker-value {
          color: #ffffff;
          font-weight: 600;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 'Liberation Mono', 'Courier New', monospace;
        }

        .ticker-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          font-size: 12px;
        }

        .ticker-change.positive {
          color: #22c55e;
        }

        .ticker-change.negative {
          color: #ef4444;
        }

        .ticker-change :global(.ticker-icon) {
          width: 12px;
          height: 12px;
        }

        .ticker-divider {
          color: rgba(255, 255, 255, 0.2);
          margin-left: 16px;
        }
      `}</style>
        </div>
    );
}
