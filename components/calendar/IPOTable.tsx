'use client';

interface IPOEvent {
    id: string;
    date: string;
    company: string;
    exchange: string;
    ipoValue: string;
    price: string;
    last: string;
}

interface IPOTableProps {
    events: IPOEvent[];
}

export default function IPOTable({ events }: IPOTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2">IPO Listing</th>
                        <th className="py-2">Company</th>
                        <th className="py-2">Exchange</th>
                        <th className="py-2 text-right">IPO Value</th>
                        <th className="py-2 text-right">IPO Price</th>
                        <th className="py-2 text-right pr-4">Last</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr><td colSpan={6} className="py-4 text-center text-gray-400">No events found.</td></tr>
                    ) : (
                        events.map((item) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-gray-50 border-b border-gray-100 transition-colors h-[40px]"
                            >
                                <td className="pl-2 text-gray-900 font-bold">{item.date}</td>
                                <td className="font-semibold text-[#1256A0]">{item.company}</td>
                                <td className="text-gray-500 text-xs uppercase">{item.exchange}</td>
                                <td className="text-right text-gray-900">{item.ipoValue}</td>
                                <td className="text-right text-gray-900">{item.price}</td>
                                <td className="text-right pr-4 text-gray-900">{item.last}</td>
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
