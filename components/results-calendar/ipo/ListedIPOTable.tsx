'use client';

import { ArrowUpDown } from 'lucide-react';
import { ListedIPOData } from '@/lib/results-calendar-data';

interface ListedIPOTableProps {
    data: ListedIPOData[];
}

export default function ListedIPOTable({ data }: ListedIPOTableProps) {
    const getGainColor = (gain: string) => {
        if (gain === '-' || gain === '') return 'text-gray-700';
        const numValue = parseFloat(gain.replace('%', ''));
        if (numValue > 0) return 'text-green-600';
        if (numValue < 0) return 'text-red-600';
        return 'text-gray-700';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="py-3 px-4 text-left">
                            <div className="flex items-center gap-1 text-gray-600 font-medium">
                                Company Name <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Listing Date <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Issue Price <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Total Subs <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Listing Open (₹) <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Listing Close (₹) <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Listing Gain <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                LTP (₹) <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium whitespace-nowrap">
                                As of Todays Gain <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1 text-gray-600 font-medium">
                                Issue Size <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{item.companyName}</span>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${item.type === 'SME' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {item.type}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.listingDate}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.issuePrice}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.totalSubs}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.listingOpen}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.listingClose}</td>
                            <td className={`py-4 px-4 text-center font-medium ${getGainColor(item.listingGain)}`}>
                                {item.listingGain}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.ltp}</td>
                            <td className={`py-4 px-4 text-center font-medium ${getGainColor(item.todaysGain)}`}>
                                {item.todaysGain}
                            </td>
                            <td className="py-4 px-4 text-right text-gray-700">{item.issueSize}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
