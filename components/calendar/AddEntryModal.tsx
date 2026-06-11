'use client';

import { useState } from 'react';

type TabType = 'Economic Calendar' | 'Holidays' | 'Earnings' | 'Dividends' | 'Splits' | 'IPO' | 'Expiration';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: TabType;
    onAddEconomic: (data: any) => void;
    onAddHoliday: (data: any) => void;
    onAddEarning: (data: any) => void;
    onAddDividend: (data: any) => void;
    onAddSplit: (data: any) => void;
    onAddIPO: (data: any) => void;
    onAddExpiration: (data: any) => void;
}

const formConfigs: Record<TabType, { title: string; fields: { name: string; label: string; placeholder: string; type?: string }[] }> = {
    'Economic Calendar': {
        title: 'Add Economic Event',
        fields: [
            { name: 'date', label: 'Date', placeholder: 'Today / Tomorrow / Yesterday' },
            { name: 'time', label: 'Time', placeholder: 'e.g., 14:30' },
            { name: 'currency', label: 'Currency', placeholder: 'e.g., USD' },
            { name: 'event', label: 'Event', placeholder: 'e.g., CPI (MoM)' },
            { name: 'importance', label: 'Importance (1-3)', placeholder: '1, 2, or 3', type: 'number' },
            { name: 'actual', label: 'Actual', placeholder: 'e.g., 0.3%' },
            { name: 'forecast', label: 'Forecast', placeholder: 'e.g., 0.2%' },
            { name: 'previous', label: 'Previous', placeholder: 'e.g., 0.1%' },
        ],
    },
    'Holidays': {
        title: 'Add Holiday',
        fields: [
            { name: 'date', label: 'Date', placeholder: 'e.g., Dec 25, 2025' },
            { name: 'country', label: 'Country', placeholder: 'e.g., United States' },
            { name: 'exchange', label: 'Exchange Name', placeholder: 'e.g., NYSE' },
            { name: 'holiday', label: 'Holiday Name', placeholder: 'e.g., Christmas Day' },
        ],
    },
    'Earnings': {
        title: 'Add Earnings',
        fields: [
            { name: 'date', label: 'Date', placeholder: 'Today / Tomorrow' },
            { name: 'time', label: 'Time', placeholder: 'Pre-Market / After Hours' },
            { name: 'company', label: 'Company', placeholder: 'e.g., Apple (AAPL)' },
            { name: 'eps', label: 'EPS', placeholder: 'e.g., 1.52' },
            { name: 'epsForecast', label: 'EPS Forecast', placeholder: 'e.g., 1.48' },
            { name: 'revenue', label: 'Revenue', placeholder: 'e.g., 95.2B' },
            { name: 'revenueForecast', label: 'Revenue Forecast', placeholder: 'e.g., 92.1B' },
            { name: 'marketCap', label: 'Market Cap', placeholder: 'e.g., 2.5T' },
        ],
    },
    'Dividends': {
        title: 'Add Dividend',
        fields: [
            { name: 'date', label: 'Date', placeholder: 'e.g., Dec 17, 2025' },
            { name: 'company', label: 'Company', placeholder: 'e.g., Microsoft (MSFT)' },
            { name: 'exDivDate', label: 'Ex-Dividend Date', placeholder: 'e.g., Dec 17, 2025' },
            { name: 'dividend', label: 'Dividend', placeholder: 'e.g., 0.75' },
            { name: 'type', label: 'Type', placeholder: 'e.g., 3M (Quarterly)' },
            { name: 'paymentDate', label: 'Payment Date', placeholder: 'e.g., Dec 31, 2025' },
            { name: 'yield', label: 'Yield', placeholder: 'e.g., 2.5%' },
        ],
    },
    'Splits': {
        title: 'Add Stock Split',
        fields: [
            { name: 'date', label: 'Split Date', placeholder: 'e.g., Dec 20, 2025' },
            { name: 'company', label: 'Company', placeholder: 'e.g., Tesla (TSLA)' },
            { name: 'ratio', label: 'Split Ratio', placeholder: 'e.g., 3:1' },
            { name: 'exDate', label: 'Ex-Date', placeholder: 'e.g., Today (optional)' },
        ],
    },
    'IPO': {
        title: 'Add IPO',
        fields: [
            { name: 'date', label: 'Listing Date', placeholder: 'e.g., Dec 15, 2025' },
            { name: 'company', label: 'Company', placeholder: 'e.g., NewCorp (NEW)' },
            { name: 'exchange', label: 'Exchange', placeholder: 'e.g., NASDAQ' },
            { name: 'ipoValue', label: 'IPO Value', placeholder: 'e.g., 150.0M' },
            { name: 'price', label: 'IPO Price', placeholder: 'e.g., 25.00' },
            { name: 'last', label: 'Last Price', placeholder: 'e.g., 27.50' },
        ],
    },
    'Expiration': {
        title: 'Add Expiration',
        fields: [
            { name: 'instrument', label: 'Instrument', placeholder: 'e.g., S&P 500 VIX' },
            { name: 'contract', label: 'Contract', placeholder: 'e.g., VXc1' },
            { name: 'month', label: 'Month', placeholder: 'e.g., Dec 25' },
            { name: 'settlement', label: 'Settlement', placeholder: 'e.g., Dec 17, 2025' },
            { name: 'rollover', label: 'Last Rollover', placeholder: 'e.g., Nov 19, 2025' },
        ],
    },
};

export default function AddEntryModal({
    isOpen,
    onClose,
    activeTab,
    onAddEconomic,
    onAddHoliday,
    onAddEarning,
    onAddDividend,
    onAddSplit,
    onAddIPO,
    onAddExpiration,
}: AddEntryModalProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const config = formConfigs[activeTab];

    const handleSubmit = () => {
        const hasEmptyRequired = config.fields.some(
            field => !formData[field.name]?.trim()
        );

        if (hasEmptyRequired) return;

        const data = { ...formData };
        if (data.importance) {
            data.importance = String(Math.min(3, Math.max(1, parseInt(data.importance) || 1)));
        }

        switch (activeTab) {
            case 'Economic Calendar':
                onAddEconomic({ ...data, importance: parseInt(data.importance) || 2 });
                break;
            case 'Holidays':
                onAddHoliday(data);
                break;
            case 'Earnings':
                onAddEarning(data);
                break;
            case 'Dividends':
                onAddDividend(data);
                break;
            case 'Splits':
                onAddSplit(data);
                break;
            case 'IPO':
                onAddIPO(data);
                break;
            case 'Expiration':
                onAddExpiration(data);
                break;
        }

        setFormData({});
        onClose();
    };

    const handleClose = () => {
        setFormData({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                    <button
                        onClick={handleClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {config.fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type || 'text'}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={field.type === 'number' ? 1 : undefined}
                                max={field.type === 'number' ? 3 : undefined}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Entry
                    </button>
                </div>
            </div>
        </div>
    );
}
