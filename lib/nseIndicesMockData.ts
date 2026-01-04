export interface IndexStock {
    id: string;
    name: string;
    ltp: number;
    pctChg: number;
    chg: number;
    volume: number;
    buyPrice: number;
    sellPrice: number;
    buyQty: number;
    sellQty: number;
}

export const nifty50Stocks: IndexStock[] = [
    { id: '1', name: 'Adani Enterpris', ltp: 2279.80, pctChg: 0.88, chg: 19.80, volume: 715242, buyPrice: 2279.80, sellPrice: 0.00, buyQty: 0, sellQty: 383 },
    { id: '2', name: 'Adani Ports', ltp: 1489.50, pctChg: 0.57, chg: 8.40, volume: 1251176, buyPrice: 1489.50, sellPrice: 0.00, buyQty: 20, sellQty: 0 },
    { id: '3', name: 'Apollo Hospital', ltp: 7129.50, pctChg: 0.25, chg: 18.00, volume: 353245, buyPrice: 7129.50, sellPrice: 0.00, buyQty: 1, sellQty: 0 },
    { id: '4', name: 'Asian Paints', ltp: 2772.60, pctChg: 0.75, chg: 20.60, volume: 508884, buyPrice: 2772.60, sellPrice: 0.00, buyQty: 100, sellQty: 0 },
    { id: '5', name: 'Axis Bank', ltp: 1266.90, pctChg: -0.59, chg: -7.50, volume: 5860547, buyPrice: 1266.90, sellPrice: 0.00, buyQty: 6, sellQty: 0 },
    { id: '6', name: 'Bajaj Auto', ltp: 9502.50, pctChg: -0.58, chg: -55.50, volume: 733651, buyPrice: 0.00, sellPrice: 9502.50, buyQty: 0, sellQty: 1 },
    { id: '7', name: 'Bajaj Finance', ltp: 990.45, pctChg: 1.78, chg: 17.35, volume: 6206869, buyPrice: 990.45, sellPrice: 0.00, buyQty: 928, sellQty: 0 },
    { id: '8', name: 'Bajaj Finserv', ltp: 2038.40, pctChg: 0.07, chg: 1.40, volume: 893818, buyPrice: 2038.40, sellPrice: 0.00, buyQty: 25, sellQty: 0 },
    { id: '9', name: 'Bharat Elec', ltp: 403.15, pctChg: 1.37, chg: 5.45, volume: 10950368, buyPrice: 403.15, sellPrice: 0.00, buyQty: 5031, sellQty: 0 },
    { id: '10', name: 'Bharti Airtel', ltp: 2106.30, pctChg: -0.19, chg: -4.10, volume: 2927138, buyPrice: 2106.30, sellPrice: 0.00, buyQty: 92, sellQty: 0 },
    { id: '11', name: 'Cipla', ltp: 1511.60, pctChg: 0.71, chg: 10.70, volume: 964611, buyPrice: 0.00, sellPrice: 1511.60, buyQty: 0, sellQty: 61 },
    { id: '12', name: 'Coal India', ltp: 427.90, pctChg: 6.85, chg: 27.45, volume: 35090129, buyPrice: 427.90, sellPrice: 0.00, buyQty: 54656, sellQty: 0 },
    { id: '13', name: 'Dr Reddys Labs', ltp: 1256.10, pctChg: 0.22, chg: 2.70, volume: 1591218, buyPrice: 1256.10, sellPrice: 0.00, buyQty: 5, sellQty: 0 },
    { id: '14', name: 'Eicher Motors', ltp: 7334.50, pctChg: -0.18, chg: -13.50, volume: 227469, buyPrice: 7334.50, sellPrice: 0.00, buyQty: 19, sellQty: 0 },
    { id: '15', name: 'Grasim Ind', ltp: 2680.30, pctChg: 0.95, chg: 25.30, volume: 487562, buyPrice: 2680.30, sellPrice: 0.00, buyQty: 42, sellQty: 0 },
    { id: '16', name: 'HCL Tech', ltp: 1856.25, pctChg: 1.12, chg: 20.55, volume: 2345678, buyPrice: 1856.25, sellPrice: 0.00, buyQty: 156, sellQty: 0 },
    { id: '17', name: 'HDFC Bank', ltp: 1798.40, pctChg: 0.65, chg: 11.60, volume: 8765432, buyPrice: 1798.40, sellPrice: 0.00, buyQty: 890, sellQty: 0 },
    { id: '18', name: 'HDFC Life', ltp: 645.80, pctChg: -0.42, chg: -2.75, volume: 1234567, buyPrice: 645.80, sellPrice: 0.00, buyQty: 34, sellQty: 0 },
    { id: '19', name: 'Hero MotoCorp', ltp: 4521.90, pctChg: 0.88, chg: 39.50, volume: 567890, buyPrice: 4521.90, sellPrice: 0.00, buyQty: 67, sellQty: 0 },
    { id: '20', name: 'Hindalco', ltp: 612.45, pctChg: 1.45, chg: 8.75, volume: 4567890, buyPrice: 612.45, sellPrice: 0.00, buyQty: 234, sellQty: 0 },
    { id: '21', name: 'HUL', ltp: 2456.30, pctChg: 0.32, chg: 7.80, volume: 2345678, buyPrice: 2456.30, sellPrice: 0.00, buyQty: 45, sellQty: 0 },
    { id: '22', name: 'ICICI Bank', ltp: 1298.75, pctChg: 0.72, chg: 9.25, volume: 7654321, buyPrice: 1298.75, sellPrice: 0.00, buyQty: 567, sellQty: 0 },
    { id: '23', name: 'IndusInd Bank', ltp: 1567.80, pctChg: -0.85, chg: -13.45, volume: 2345678, buyPrice: 1567.80, sellPrice: 0.00, buyQty: 12, sellQty: 0 },
    { id: '24', name: 'Infosys', ltp: 1892.40, pctChg: 1.25, chg: 23.40, volume: 5678901, buyPrice: 1892.40, sellPrice: 0.00, buyQty: 678, sellQty: 0 },
    { id: '25', name: 'ITC', ltp: 467.25, pctChg: 0.45, chg: 2.10, volume: 12345678, buyPrice: 467.25, sellPrice: 0.00, buyQty: 2345, sellQty: 0 },
    { id: '26', name: 'JSW Steel', ltp: 912.80, pctChg: 1.68, chg: 15.10, volume: 3456789, buyPrice: 912.80, sellPrice: 0.00, buyQty: 456, sellQty: 0 },
    { id: '27', name: 'Kotak Mahindra', ltp: 1789.50, pctChg: 0.38, chg: 6.75, volume: 1987654, buyPrice: 1789.50, sellPrice: 0.00, buyQty: 89, sellQty: 0 },
    { id: '28', name: 'L&T', ltp: 3567.80, pctChg: 0.92, chg: 32.50, volume: 1876543, buyPrice: 3567.80, sellPrice: 0.00, buyQty: 123, sellQty: 0 },
    { id: '29', name: 'M&M', ltp: 2987.60, pctChg: 1.15, chg: 34.00, volume: 2345678, buyPrice: 2987.60, sellPrice: 0.00, buyQty: 234, sellQty: 0 },
    { id: '30', name: 'Maruti Suzuki', ltp: 11234.50, pctChg: 0.48, chg: 53.60, volume: 456789, buyPrice: 11234.50, sellPrice: 0.00, buyQty: 34, sellQty: 0 },
    { id: '31', name: 'Nestle', ltp: 2345.80, pctChg: 0.22, chg: 5.15, volume: 234567, buyPrice: 2345.80, sellPrice: 0.00, buyQty: 23, sellQty: 0 },
    { id: '32', name: 'NTPC', ltp: 378.45, pctChg: 0.85, chg: 3.20, volume: 8765432, buyPrice: 378.45, sellPrice: 0.00, buyQty: 567, sellQty: 0 },
    { id: '33', name: 'ONGC', ltp: 267.90, pctChg: 1.42, chg: 3.75, volume: 9876543, buyPrice: 267.90, sellPrice: 0.00, buyQty: 890, sellQty: 0 },
    { id: '34', name: 'Power Grid', ltp: 312.55, pctChg: 0.65, chg: 2.02, volume: 6543210, buyPrice: 312.55, sellPrice: 0.00, buyQty: 345, sellQty: 0 },
    { id: '35', name: 'Reliance', ltp: 2567.80, pctChg: 0.78, chg: 19.85, volume: 7654321, buyPrice: 2567.80, sellPrice: 0.00, buyQty: 456, sellQty: 0 },
    { id: '36', name: 'SBI', ltp: 812.40, pctChg: 1.15, chg: 9.25, volume: 12345678, buyPrice: 812.40, sellPrice: 0.00, buyQty: 1234, sellQty: 0 },
    { id: '37', name: 'SBI Life', ltp: 1567.30, pctChg: 0.42, chg: 6.55, volume: 987654, buyPrice: 1567.30, sellPrice: 0.00, buyQty: 78, sellQty: 0 },
    { id: '38', name: 'Shriram Finance', ltp: 2890.45, pctChg: 0.68, chg: 19.50, volume: 543210, buyPrice: 2890.45, sellPrice: 0.00, buyQty: 45, sellQty: 0 },
    { id: '39', name: 'Sun Pharma', ltp: 1789.60, pctChg: 0.35, chg: 6.25, volume: 2345678, buyPrice: 1789.60, sellPrice: 0.00, buyQty: 123, sellQty: 0 },
    { id: '40', name: 'Tata Consumer', ltp: 978.45, pctChg: 0.52, chg: 5.05, volume: 1234567, buyPrice: 978.45, sellPrice: 0.00, buyQty: 89, sellQty: 0 },
    { id: '41', name: 'Tata Motors', ltp: 789.30, pctChg: 1.45, chg: 11.30, volume: 8765432, buyPrice: 789.30, sellPrice: 0.00, buyQty: 678, sellQty: 0 },
    { id: '42', name: 'Tata Steel', ltp: 145.80, pctChg: 1.85, chg: 2.65, volume: 23456789, buyPrice: 145.80, sellPrice: 0.00, buyQty: 2345, sellQty: 0 },
    { id: '43', name: 'TCS', ltp: 4234.50, pctChg: 0.92, chg: 38.70, volume: 3456789, buyPrice: 4234.50, sellPrice: 0.00, buyQty: 234, sellQty: 0 },
    { id: '44', name: 'Tech Mahindra', ltp: 1678.90, pctChg: 1.08, chg: 17.95, volume: 2345678, buyPrice: 1678.90, sellPrice: 0.00, buyQty: 156, sellQty: 0 },
    { id: '45', name: 'Titan', ltp: 3456.70, pctChg: 0.62, chg: 21.30, volume: 987654, buyPrice: 3456.70, sellPrice: 0.00, buyQty: 67, sellQty: 0 },
    { id: '46', name: 'Trent', ltp: 6789.40, pctChg: 0.85, chg: 57.30, volume: 456789, buyPrice: 6789.40, sellPrice: 0.00, buyQty: 34, sellQty: 0 },
    { id: '47', name: 'UltraTech', ltp: 11456.80, pctChg: 0.48, chg: 54.70, volume: 234567, buyPrice: 11456.80, sellPrice: 0.00, buyQty: 23, sellQty: 0 },
    { id: '48', name: 'Wipro', ltp: 567.45, pctChg: 0.95, chg: 5.35, volume: 5678901, buyPrice: 567.45, sellPrice: 0.00, buyQty: 456, sellQty: 0 },
];

export const indexCategories = [
    { id: 'nifty50', name: 'NIFTY 50', value: 26328.55, change: 182.00, pctChange: 0.70 },
    { id: 'niftyBank', name: 'NIFTY BANK', value: 59234.40, change: 456.80, pctChange: 0.78 },
    { id: 'niftyMidcap100', name: 'NIFTY Midcap 100', value: 56789.25, change: 234.50, pctChange: 0.41 },
    { id: 'niftyNext50', name: 'NIFTY NEXT 50', value: 68709.85, change: 149.05, pctChange: 0.22 },
    { id: 'nifty100', name: 'NIFTY 100', value: 26696.90, change: 139.90, pctChange: 0.53 },
    { id: 'nifty200', name: 'Nifty 200', value: 14541.65, change: 75.25, pctChange: 0.52 },
    { id: 'nifty500', name: 'NIFTY 500', value: 23835.25, change: 94.15, pctChange: 0.40 },
    { id: 'niftySmallcap100', name: 'NIFTY Smallcap 100', value: 18567.30, change: 156.40, pctChange: 0.85 },
    { id: 'niftyMidcap50', name: 'NIFTY MIDCAP 50', value: 17383.00, change: 130.65, pctChange: 0.76 },
    { id: 'niftySmlcap50', name: 'NIFTY SMLCAP 50', value: 7234.50, change: 45.30, pctChange: 0.63 },
    { id: 'indiaVix', name: 'India VIX', value: 10.32, change: -0.50, pctChange: -4.65 },
    { id: 'nifty750Total', name: 'NIFTY 750 TOTAL', value: 34567.80, change: 234.50, pctChange: 0.68 },
    { id: 'mkt', name: 'MKT', value: 45678.90, change: 345.60, pctChange: 0.76 },
];

export const categoryTabs = [
    { id: 'keyIndices', label: 'Key Indices' },
    { id: 'sectoralIndices', label: 'Sectoral Indices' },
    { id: 'otherIndices', label: 'Other Indices' },
    { id: 'largeCap', label: 'Large Cap' },
    { id: 'midCap', label: 'Mid Cap' },
    { id: 'smallCap', label: 'Small Cap' },
    { id: 'allIndices', label: 'All Indices' },
];

export const dataViewTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical' },
    { id: 'fundamental', label: 'Fundamental' },
    { id: 'performance', label: 'Performance' },
    { id: 'pivotLevel', label: 'Pivot Level' },
];

export const heatmapData = [
    { range: '< -5%', count: 0, color: '#991b1b' },
    { range: '-5% to -3%', count: 1, color: '#dc2626' },
    { range: '-3% to 0%', count: 10, color: '#f87171' },
    { range: '0% to 3%', count: 36, color: '#86efac' },
    { range: '3% to 5%', count: 2, color: '#22c55e' },
    { range: '> 5%', count: 1, color: '#15803d' },
];
