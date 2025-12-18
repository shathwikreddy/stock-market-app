'use client';

interface SplitEvent {
    id: string;
    date: string;
    company: string;
    ratio: string;
    exDate?: string;
}

interface SplitsTableProps {
    events: SplitEvent[];
}

export default function SplitsTable({ events }: SplitsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2">Split date</th>
                        <th className="py-2">Company</th>
                        <th className="py-2 text-right pr-4">Split ratio</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr><td colSpan={3} className="py-4 text-center text-gray-400">No events found.</td></tr>
                    ) : (
                        events.map((item) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-gray-50 border-b border-gray-100 transition-colors h-[40px]"
                            >
                                <td className="pl-2 text-gray-900 font-bold">{item.date}</td>
                                <td className="font-semibold text-[#1256A0]">{item.company}</td>
                                <td className="text-right pr-4 text-gray-900">{item.ratio}</td>
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
