'use client';

interface EarningsEvent {
    id: string;
    date: string;
    time: string;
    company: string;
    eps: string;
    epsForecast: string;
    revenue: string;
    revenueForecast: string;
    marketCap: string;
}

interface EarningsTableProps {
    events: EarningsEvent[];
}

export default function EarningsTable({ events }: EarningsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2">Company</th>
                        <th className="py-2 text-right">EPS / Forecast</th>
                        <th className="py-2 text-right">Revenue / Forecast</th>
                        <th className="py-2 text-right">Market Cap</th>
                        <th className="py-2 text-right pr-4">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr><td colSpan={5} className="py-4 text-center text-gray-400">No events found.</td></tr>
                    ) : (
                        events.map((item) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-gray-50 border-b border-gray-100 transition-colors h-[40px]"
                            >
                                <td className="pl-2 font-semibold text-[#1256A0]">{item.company}</td>
                                <td className="text-right text-gray-900">
                                    <span className="font-bold">{item.eps}</span> / <span className="text-gray-500">{item.epsForecast}</span>
                                </td>
                                <td className="text-right text-gray-900">
                                    <span className="font-bold">{item.revenue}</span> / <span className="text-gray-500">{item.revenueForecast}</span>
                                </td>
                                <td className="text-right text-gray-900">{item.marketCap}</td>
                                <td className="text-right pr-4 text-gray-500 text-xs">{item.time}</td>
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
