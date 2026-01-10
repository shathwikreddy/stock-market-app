'use client';

import { ArrowUpDown } from 'lucide-react';
import { ClosedIPOData } from '@/lib/results-calendar-data';

interface ClosedIPOTableProps {
    data: ClosedIPOData[];
}

export default function ClosedIPOTable({ data }: ClosedIPOTableProps) {
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
                                Issue Price <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                QIB <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                NII <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Retail <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Total Subs <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Allotment Date <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Refund Date <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium whitespace-nowrap">
                                Demat Account Credit Date <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 font-medium">
                                Listing Date <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-center text-gray-600 font-medium">
                            Allotment Status
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
                            <td className="py-4 px-4 text-center text-gray-700">{item.issuePrice}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.qib}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.nii}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.retail}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.totalSubs}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.allotmentDate}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.refundDate}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.dematCreditDate}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.listingDate}</td>
                            <td className="py-4 px-4 text-center">
                                <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                    Check
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
