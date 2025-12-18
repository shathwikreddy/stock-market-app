'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';

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
}

export default function CalendarTable({ events }: CalendarTableProps) {
    // Helper to render importance stars
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

    // Helper to get flag URL (using a placeholder service or local assets if available, but for now using a generic placeholder approach or simple text)
    // Since we don't have country flags, we'll try to use a simple mapping or just text/emoji if strictly needed. 
    // Investing.com uses sprites. Let's use simple logic or just the currency code for now with a flag emoji if possible, 
    // or just the currency text. 
    // Actually, let's try to simulate the flag with a small colored box or similar if we can't get real flags easily without external assets.
    // For now, I'll use a simple placeholder logic for flags based on Currency.
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
                    </tr>
                </thead>
                <tbody>
                    {/* Date Header Row */}
                    <tr className="bg-[#F5F5F5] border-b border-t border-gray-200">
                        <td colSpan={7} className="py-2 text-center font-bold text-[#333333]">
                            Wednesday, 17 December 2025
                        </td>
                    </tr>

                    {events.map((item) => (
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
                            <td className="font-semibold text-[#333333] cursor-pointer hover:underline hover:text-[#1256A0]">
                                {item.event}
                            </td>
                            <td className="text-right font-bold text-black">{item.actual}</td>
                            <td className="text-right text-black">{item.forecast}</td>
                            <td className="text-right pr-2 text-black">{item.previous}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
