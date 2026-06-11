'use client';

import { ExternalLink } from 'lucide-react';
import { OpenIPOData, UpcomingIPOData } from '@/lib/results-calendar-data';

interface IPOCardProps {
    data: OpenIPOData | UpcomingIPOData;
}

export default function IPOCard({ data }: IPOCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            {/* Header with tags */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded ${data.type === 'Mainline'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                        {data.type}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded ${data.status === 'Open'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-600 text-white'
                        }`}>
                        {data.status}
                    </span>
                </div>
                {data.rhpLink && (
                    <a
                        href={data.rhpLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                        RHP <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Company Name */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">{data.companyName}</h2>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">{data.description}</p>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Details Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Open Date</span>
                            <span className="font-medium text-gray-900">{data.openDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Close Date</span>
                            <span className="font-medium text-gray-900">{data.closeDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Issue Price</span>
                            <span className="font-medium text-gray-900">{data.issuePrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Lot Size</span>
                            <span className="font-medium text-gray-900">{data.lotSize}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Issue Size</span>
                            <span className="font-medium text-blue-600">{data.issueSize}</span>
                        </div>
                    </div>
                </div>

                {/* Subscription Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Subscription</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Category</span>
                            <span className="text-gray-500">Subscription Times</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Qualified Institutional Buyers</span>
                            <span className="font-medium text-gray-900">{data.subscription.qib}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Retail Individual Investor</span>
                            <span className="font-medium text-gray-900">{data.subscription.rii}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Non-Institutional Investor</span>
                            <span className="font-medium text-gray-900">{data.subscription.nii}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Others</span>
                            <span className="font-medium text-gray-900">{data.subscription.others}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-semibold text-gray-900">{data.subscription.total}</span>
                        </div>
                    </div>
                </div>

                {/* IPO Dates Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">IPO Dates</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{data.ipoDates.basisOfAllotment}</span>
                            <span className="font-medium text-gray-900">Basis Of Allotment</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{data.ipoDates.initiationOfRefunds}</span>
                            <span className="font-medium text-gray-900">Initiation Of Refunds</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{data.ipoDates.creditOfShares}</span>
                            <span className="font-medium text-gray-900">Credit Of Shares</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{data.ipoDates.listingDate}</span>
                            <span className="font-medium text-gray-900">Listing Date</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
