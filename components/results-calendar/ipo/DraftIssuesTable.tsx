'use client';

import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { DraftIssueData } from '@/lib/results-calendar-data';

interface DraftIssuesTableProps {
    data: DraftIssueData[];
}

export default function DraftIssuesTable({ data }: DraftIssuesTableProps) {
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
                                DRHP Filing Date <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="py-3 px-4 text-right text-gray-600 font-medium">
                            IPO Doc
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                                <span className="font-semibold text-gray-900">{item.companyName}</span>
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">{item.drhpFilingDate}</td>
                            <td className="py-4 px-4 text-right">
                                {item.drhpLink ? (
                                    <a
                                        href={item.drhpLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        DRHP <ExternalLink className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
