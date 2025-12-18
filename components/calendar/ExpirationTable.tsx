'use client';

interface ExpirationEvent {
    id: string;
    instrument: string;
    contract: string;
    month: string;
    settlement: string;
    rollover: string;
}

interface ExpirationTableProps {
    events: ExpirationEvent[];
}

export default function ExpirationTable({ events }: ExpirationTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2 w-[300px]">Instrument</th>
                        <th className="py-2">Contract</th>
                        <th className="py-2">Month</th>
                        <th className="py-2">Settlement</th>
                        <th className="py-2 pr-4">Last Rollover</th>
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
                                <td className="pl-2 font-semibold text-[#1256A0] flex items-center gap-2">
                                    <span className="w-4 h-3 bg-gray-200 inline-block rounded-[1px]"></span> {/* Mock Flag */}
                                    {item.instrument}
                                </td>
                                <td className="text-gray-900">{item.contract}</td>
                                <td className="text-gray-900">{item.month}</td>
                                <td className="text-gray-900">{item.settlement}</td>
                                <td className="pr-4 text-gray-900">{item.rollover}</td>
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
