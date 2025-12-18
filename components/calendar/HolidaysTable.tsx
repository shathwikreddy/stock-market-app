'use client';

interface HolidayEvent {
    id: string;
    date: string;
    country: string;
    exchange: string;
    holiday: string;
}

interface HolidaysTableProps {
    events: HolidayEvent[];
}

export default function HolidaysTable({ events }: HolidaysTableProps) {
    // Helper to get flag (mock)
    const getFlag = (country: string) => {
        // Map country names to emojis or leave generic
        return '🏳️';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2">Date</th>
                        <th className="py-2">Country</th>
                        <th className="py-2">Exchange Name</th>
                        <th className="py-2 pr-4">Holiday</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr><td colSpan={4} className="py-4 text-center text-gray-400">No events found.</td></tr>
                    ) : (
                        events.map((item) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-gray-50 border-b border-gray-100 transition-colors h-[40px]"
                            >
                                <td className="pl-2 font-bold text-gray-900">{item.date}</td>
                                <td className="text-gray-900 flex items-center gap-2 h-[40px] font-semibold text-[#1256A0]">
                                    <span className="text-lg leading-none">{getFlag(item.country)}</span>
                                    {item.country}
                                </td>
                                <td className="text-gray-900">{item.exchange}</td>
                                <td className="pr-4 font-medium text-gray-900">{item.holiday}</td>
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
