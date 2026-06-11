'use client';

import { Star } from 'lucide-react';

interface CalendarEvent {
    id: string;
    time: string;
    currency: string;
    event: string;
    importance: number;
    actual: string;
    forecast: string;
    previous: string;
}

interface CalendarTableProps {
    events: CalendarEvent[];
    onDeleteEvent?: (id: string) => void;
    customEventIds?: string[];
}

export default function CalendarTable({ events, onDeleteEvent, customEventIds = [] }: CalendarTableProps) {
    const renderStars = (importance: number) => {
        return (
            <div className="flex gap-[1px]">
                {[1, 2, 3].map((i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${i <= importance ? 'fill-gray-600 text-gray-600' : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const getFlag = (currency: string) => {
        const flags: Record<string, string> = {
            USD: '🇺🇸',
            EUR: '🇪🇺',
            GBP: '🇬🇧',
            JPY: '🇯🇵',
            AUD: '🇦🇺',
            NZD: '🇳🇿',
            CAD: '🇨🇦',
            CHF: '🇨🇭',
            CNY: '🇨🇳',
            INR: '🇮🇳',
            BRL: '🇧🇷',
            ZAR: '🇿🇦',
            MXN: '🇲🇽',
            RUB: '🇷🇺',
            KRW: '🇰🇷',
            SGD: '🇸🇬',
            HKD: '🇭🇰',
        };
        return flags[currency] || '🏳️';
    };

    const isCustom = (id: string) => customEventIds.includes(id);
    const hasCustom = customEventIds.length > 0;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                        <th className="py-2 pl-2 w-[80px]">Time</th>
                        <th className="py-2 w-[60px]">Cur.</th>
                        <th className="py-2 w-[80px]">Imp.</th>
                        <th className="py-2 flex-grow">Event</th>
                        <th className="py-2 w-[80px] text-right">Actual</th>
                        <th className="py-2 w-[80px] text-right">Forecast</th>
                        <th className="py-2 w-[80px] text-right pr-2">Previous</th>
                        {hasCustom && <th className="py-2 pr-2 w-12">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-[#F5F5F5] border-b border-t border-gray-200">
                        <td colSpan={hasCustom ? 8 : 7} className="py-2 text-center font-bold text-[#333333]">
                            Wednesday, 17 December 2025
                        </td>
                    </tr>

                    {events.length === 0 ? (
                        <tr><td colSpan={hasCustom ? 8 : 7} className="py-4 text-center text-gray-400">No events found.</td></tr>
                    ) : (
                        events.map((item) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-gray-50 border-b border-gray-100 transition-colors h-[40px]"
                            >
                                <td className="pl-2 text-gray-900 font-medium">{item.time}</td>
                                <td className="text-gray-900 font-medium flex items-center gap-2 h-[40px]">
                                    <span className="text-lg leading-none">{getFlag(item.currency)}</span>
                                    {item.currency}
                                </td>
                                <td className="">
                                    <div title={`Importance: ${item.importance}/3`}>
                                        {renderStars(item.importance)}
                                    </div>
                                </td>
                                <td className={`font-semibold cursor-pointer hover:underline hover:text-[#1256A0] ${isCustom(item.id) ? 'text-blue-600' : 'text-[#333333]'}`}>
                                    {item.event}
                                    {isCustom(item.id) && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                            Custom
                                        </span>
                                    )}
                                </td>
                                <td className="text-right font-bold text-black">{item.actual}</td>
                                <td className="text-right text-black">{item.forecast}</td>
                                <td className="text-right pr-2 text-black">{item.previous}</td>
                                {hasCustom && (
                                    <td className="pr-2">
                                        {isCustom(item.id) && onDeleteEvent && (
                                            <button
                                                onClick={() => onDeleteEvent(item.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete event"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
