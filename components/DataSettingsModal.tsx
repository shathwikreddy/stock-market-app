'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface DataSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedColumns: Record<string, string[]>;
    onSave: (columns: Record<string, string[]>) => void;
}

// Column options for each tab
const columnOptions = {
    overview: [
        { id: 'name', label: 'Name', default: true },
        { id: 'ltp', label: 'LTP', default: true },
        { id: 'pctChg', label: '%Chg', default: true },
        { id: 'chg', label: 'Chg', default: true },
        { id: 'volume', label: 'Volume', default: true },
        { id: 'buyPrice', label: 'Buy Price', default: true },
        { id: 'sellPrice', label: 'Sell Price', default: true },
        { id: 'buyQty', label: 'Buy Qty', default: true },
        { id: 'sellQty', label: 'Sell Qty', default: true },
        { id: 'open', label: 'Open', default: false },
        { id: 'analysis', label: 'Analysis', default: true },
        { id: 'prevClose', label: 'Prev. Close', default: false },
        { id: 'high', label: 'High', default: false },
        { id: 'low', label: 'Low', default: false },
        { id: '52WeekHigh', label: '52 Week High', default: false },
        { id: '52WeekLow', label: '52 Week Low', default: false },
        { id: 'technicalRating', label: 'Technical Rating', default: true },
        { id: 'avgDelivery', label: '20D Avg Delivery(%)', default: false },
        { id: 'avgVolume', label: '20D Avg Volume', default: false },
        { id: 'sector', label: 'Sector', default: false },
        { id: 'oiAnalysis', label: 'OI Analysis', default: false },
        { id: 'vwap', label: 'VWAP', default: false },
    ],
    technical: [
        { id: 'name', label: 'Name', default: true },
        { id: 'ltp', label: 'LTP', default: true },
        { id: 'sma5', label: 'SMA5', default: false },
        { id: 'sma10', label: 'SMA10', default: false },
        { id: 'sma20', label: 'SMA20', default: false },
        { id: 'sma50', label: 'SMA50', default: true },
        { id: 'sma100', label: 'SMA100', default: false },
        { id: 'sma200', label: 'SMA200', default: true },
        { id: 'ema5', label: 'EMA5', default: false },
        { id: 'ema10', label: 'EMA10', default: false },
        { id: 'ema20', label: 'EMA20', default: false },
        { id: 'ema50', label: 'EMA50', default: false },
        { id: 'ema100', label: 'EMA100', default: false },
        { id: 'ema200', label: 'EMA200', default: false },
        { id: 'rsi14', label: 'RSI(14)', default: true },
        { id: 'macd', label: 'MACD(12,26,9)', default: true },
        { id: 'stochastic', label: 'Stochastic(20,3)', default: true },
        { id: 'roc20', label: 'ROC(20)', default: false },
        { id: 'cci20', label: 'CCI(20)', default: false },
        { id: 'williamsR', label: 'Williamson%R(14)', default: false },
        { id: 'mfi14', label: 'MFI(14)', default: true },
        { id: 'atr14', label: 'ATR(14)', default: false },
        { id: 'adx14', label: 'ADX(14)', default: true },
        { id: 'rsc6m', label: 'RSC(6 months)', default: false },
        { id: 'beta', label: 'Beta', default: false },
        { id: 'technicalRating', label: 'Technical Rating', default: true },
    ],
    fundamental: [
        { id: 'name', label: 'Name', default: true },
        { id: 'ltp', label: 'LTP', default: true },
        { id: 'pe', label: 'P/E', default: true },
        { id: 'debtToEquity', label: 'Debt to Equity', default: true },
        { id: 'eps', label: 'EPS(Rs.)', default: true },
        { id: 'bvps', label: 'BVPS(Rs.)', default: true },
        { id: 'netProfit', label: 'Net Profit(Rs. Cr)', default: true },
        { id: 'sales', label: 'Sales(Rs. Cr)', default: true },
        { id: 'dps', label: 'DPS(Rs.)', default: false },
        { id: 'faceValue', label: 'Face Value', default: false },
        { id: 'npm', label: 'NPM%', default: true },
        { id: 'roe', label: 'ROE%', default: true },
        { id: 'roa', label: 'ROA%', default: false },
        { id: 'pb', label: 'P/B', default: false },
    ],
    performance: [
        { id: 'name', label: 'Name', default: true },
        { id: 'ltp', label: 'LTP', default: true },
        { id: 'ytd', label: 'YTD(%)', default: true },
        { id: '1week', label: '1 Week(%)', default: true },
        { id: '1month', label: '1 Month(%)', default: true },
        { id: '3months', label: '3 Months(%)', default: true },
        { id: '6months', label: '6 Months(%)', default: true },
        { id: '1year', label: '1 Year(%)', default: true },
        { id: '2years', label: '2 Years(%)', default: false },
        { id: '3years', label: '3 Years(%)', default: false },
    ],
    pivotLevel: [
        { id: 'name', label: 'Name', default: true },
        { id: 'ltp', label: 'LTP', default: true },
        { id: 'pivotPoint', label: 'Pivot Point', default: true },
        { id: 'r1', label: 'R1', default: true },
        { id: 'r2', label: 'R2', default: true },
        { id: 'r3', label: 'R3', default: true },
        { id: 's1', label: 'S1', default: true },
        { id: 's2', label: 'S2', default: true },
        { id: 's3', label: 'S3', default: true },
    ],
};

// Get default columns for a tab
export const getDefaultColumns = (tab: string): string[] => {
    const options = columnOptions[tab as keyof typeof columnOptions] || [];
    return options.filter(opt => opt.default).map(opt => opt.id);
};

// Get all default columns for all tabs
export const getAllDefaultColumns = (): Record<string, string[]> => {
    return {
        overview: getDefaultColumns('overview'),
        technical: getDefaultColumns('technical'),
        fundamental: getDefaultColumns('fundamental'),
        performance: getDefaultColumns('performance'),
        pivotLevel: getDefaultColumns('pivotLevel'),
    };
};

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical' },
    { id: 'fundamental', label: 'Fundamental' },
    { id: 'performance', label: 'Performance' },
    { id: 'pivotLevel', label: 'Pivot Level' },
];

const technicalSubTabs = ['Daily', 'Weekly', 'Monthly'];
const pivotSubTabs = ['Classic', 'Fibonacci', 'Camarilla'];

export default function DataSettingsModal({ isOpen, onClose, selectedColumns, onSave }: DataSettingsModalProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [activeSubTab, setActiveSubTab] = useState<string>('Daily');
    const [tempColumns, setTempColumns] = useState<Record<string, string[]>>(selectedColumns);

    if (!isOpen) return null;

    const currentOptions = columnOptions[activeTab as keyof typeof columnOptions] || [];
    const currentSelected = tempColumns[activeTab] || [];

    const handleCheckboxChange = (columnId: string) => {
        const newSelected = currentSelected.includes(columnId)
            ? currentSelected.filter(id => id !== columnId)
            : [...currentSelected, columnId];

        // Limit to 15 columns
        if (newSelected.length <= 15) {
            setTempColumns({
                ...tempColumns,
                [activeTab]: newSelected,
            });
        }
    };

    const handleReset = () => {
        setTempColumns({
            ...tempColumns,
            [activeTab]: getDefaultColumns(activeTab),
        });
    };

    const handleSave = () => {
        onSave(tempColumns);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Choose Your Choice of Data</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id === 'technical') setActiveSubTab('Daily');
                                if (tab.id === 'pivotLevel') setActiveSubTab('Classic');
                            }}
                            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.id
                                    ? 'text-gray-900 border-gray-900'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sub-tabs for Technical and Pivot Level */}
                {(activeTab === 'technical' || activeTab === 'pivotLevel') && (
                    <div className="flex gap-2 px-6 py-3 border-b border-gray-200">
                        {(activeTab === 'technical' ? technicalSubTabs : pivotSubTabs).map((subTab) => (
                            <button
                                key={subTab}
                                onClick={() => setActiveSubTab(subTab)}
                                className={`px-3 py-1 text-sm rounded border ${activeSubTab === subTab
                                        ? 'bg-white border-gray-900 text-gray-900'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {subTab}
                            </button>
                        ))}
                    </div>
                )}

                {/* Checkbox Grid */}
                <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-4 gap-3">
                        {currentOptions.map((option) => (
                            <label
                                key={option.id}
                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={currentSelected.includes(option.id)}
                                    onChange={() => handleCheckboxChange(option.id)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-red-500">
                            * Login to save the changes | *You can choose max 15 data points of your choice.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-900"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
