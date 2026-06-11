'use client';

import Link from 'next/link';

const marketDataRows = [
    ['Indices', 'Indices in F&O', 'Results Calendar'],
    ['NSE Indices', 'Broad Market Indices', 'FII & DII Activity'],
    ['BSE Indices', 'Sectoral Indices', 'Promoters Activity'],
    ['', 'Stocks', 'Mutual Funds Activity'],
    ['Sectors', 'Sectors', 'Super Investors'],
    ['NSE Sectors', 'Industry', 'Corporate Action'],
    ['BSE Sectors', 'F&O Stocks', 'Deals'],
    ['', "IPO's", 'Bulk Deals'],
    ['Total Market', 'All Statistics', 'Block Deals'],
    ['Advances, Decline & Unchanged', 'Top Gainers', 'Intraday Large Deals'],
    ['', 'Top Losers', 'Monthly'],
    ['Market Mood', 'Only Buyers', 'Nifty'],
    ['', 'Only Sellers', 'PE'],
    ['Futures Support & Resistance', '52 Week High', ''],
    ['', '52 Week Low', ''],
    ['Global Markets', 'All Time High (ATH)', ''],
    ['', 'All Time Low (ATL)', ''],
    ['', 'Price Shockers', ''],
    ['', 'Volume Shockers', ''],
    ['', 'Most Active Stocks', ''],
    ['', 'ETFs', ''],
    ['', 'Unlisted Shares', ''],
    ['Filterings', 'Filterings', 'Filterings'],
];

const boldItems = [
    'Indices', 'Sectors', 'Total Market', 'Market Mood', 'Global Markets', 'Filterings', 'Monthly', 'Deals'
];

function isBold(text: string): boolean {
    return boldItems.includes(text);
}

const customHrefs: Record<string, string> = {
    'Indices in F&O': '/market-data/indices-fno',
    'Broad Market Indices': '/market-data/broad-market-indices',
    'Sectoral Indices': '/market-data/sectoral-indices',
};

function getHref(text: string): string {
    if (!text) return '#';
    if (customHrefs[text]) return customHrefs[text];
    const slug = text
        .toLowerCase()
        .replace(/[&',()]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `/market-data/${slug}`;
}

export default function MarketDataPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="border-2 border-black">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th colSpan={3} className="py-3 px-4 text-center text-xl font-bold text-black border-b-2 border-black bg-white">
                                    Market Data
                                </th>
                            </tr>
                            <tr className="border-b-2 border-black">
                                <th className="w-1/3 py-3 px-4 text-left text-base font-bold text-black border-r border-black bg-white">
                                    Market Overview
                                </th>
                                <th className="w-1/3 py-3 px-4 text-left text-base font-bold text-black border-r border-black bg-white">
                                    Equity
                                </th>
                                <th className="w-1/3 py-3 px-4 text-left text-base font-bold text-black bg-white">
                                    Others
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketDataRows.map((row, idx) => (
                                <tr key={idx} className="border-b border-black">
                                    <td className="py-2 px-4 border-r border-black">
                                        {row[0] ? (
                                            <Link href={getHref(row[0])} className={`text-black hover:underline ${isBold(row[0]) ? 'font-bold' : ''}`}>
                                                {row[0]}
                                            </Link>
                                        ) : null}
                                    </td>
                                    <td className="py-2 px-4 border-r border-black">
                                        {row[1] ? (
                                            <Link href={getHref(row[1])} className={`text-black hover:underline ${isBold(row[1]) ? 'font-bold' : ''}`}>
                                                {row[1]}
                                            </Link>
                                        ) : null}
                                    </td>
                                    <td className="py-2 px-4">
                                        {row[2] ? (
                                            <Link href={getHref(row[2])} className={`text-black hover:underline ${isBold(row[2]) ? 'font-bold' : ''}`}>
                                                {row[2]}
                                            </Link>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
