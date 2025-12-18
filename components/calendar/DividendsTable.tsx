'use client';

interface DividendEvent {
    id: string;
    date: string;
    company: string;
    exDivDate: string;
    dividend: string;
    type: string;
    paymentDate: string;
    yield: string;
}

interface DividendsTableProps {
    events: DividendEvent[];
}

export default function DividendsTable({ events }: DividendsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2">Company</th>
                        <th className="py-2">Ex-Div Date</th>
                        <th className="py-2 text-right">Dividend</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Payment Date</th>
                        <th className="py-2 text-right pr-4">Yield</th>
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
                                <td className="pl-2 font-semibold text-[#1256A0]">{item.company}</td>
                                <td className="text-gray-900">{item.exDivDate}</td>
                                <td className="text-right font-bold text-gray-900">{item.dividend}</td>
                                <td className="text-gray-500">{item.type}</td>
                                <td className="text-gray-900">{item.paymentDate}</td>
                                <td className="text-right pr-4 text-gray-900">{item.yield}</td>
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
