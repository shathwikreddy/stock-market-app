// F&O Market Data Types and Mock Data

export interface IndexFuturesData {
    symbol: string;
    expiry: string;
    ltp: number;
    change: number;
    changePercent: number;
    open: number;
    high: number;
    low: number;
    prevClose: number;
    spotPrice: number;
    avgPrice: number;
    contractsTraded: number;
    turnover: number;
    marketLot: number;
    openInterest: number;
    openIntChange: number;
    openIntPCR: number;
    prevOIPCR: number;
    oiChangePercent: number;
    bidPrice: number;
    bidQty: number;
    offerPrice: number;
    offerQty: number;
    rolloverPercent: number;
}

export interface OptionChainRow {
    callPremium: string;
    callVolume: string;
    callOpenInt: string;
    strikePrice: number;
    putOpenInt: string;
    putVolume: string;
    putPremium: string;
}

export interface FOStatsRow {
    symbol: string;
    expiry: string;
    cmp: number;
    change: number;
    changePercent: number;
}

export interface SectorOIRow {
    symbol: string;
    cmp: number;
    cmpChange: number;
    openInterest: number;
    oiChange: number;
}

export interface GlobalIndexRow {
    name: string;
    cmp: number;
    change: number;
    changePercent: number;
    category: 'US Markets' | 'European Markets' | 'Asian Markets';
}

export interface OpenInterestRow {
    symbol: string;
    expiry: string;
    totalOI: number;
    change: number;
    changePercent: number;
}

export interface ArbitrageRow {
    company: string;
    future: number;
    cash: number;
    basis: number;
}

export interface CorporateActionRow {
    stock: string;
    exDate: string;
    purpose: string;
}

export interface AdvanceDeclineRow {
    category: string;
    future: number;
    futurePercent: number;
    calls: number;
    callsPercent: number;
    puts: number;
    putsPercent: number;
}

export interface AnnouncementRow {
    date: string;
    time: string;
    title: string;
    link: string;
}

// Mock Data
export const indexFuturesData: IndexFuturesData = {
    symbol: 'NIFTY',
    expiry: '27-Jan-26',
    ltp: 26011.60,
    change: 26.00,
    changePercent: 0.10,
    open: 25966.00,
    high: 26031.60,
    low: 25962.00,
    prevClose: 25985.60,
    spotPrice: 25683.30,
    avgPrice: 26011.54,
    contractsTraded: 4449,
    turnover: 75221.47,
    marketLot: 65,
    openInterest: 16876470,
    openIntChange: 614250,
    openIntPCR: 0.64,
    prevOIPCR: 0.68,
    oiChangePercent: 3.78,
    bidPrice: 26014.00,
    bidQty: 130,
    offerPrice: 26015.00,
    offerQty: 650,
    rolloverPercent: 10.97
};

export const optionChainData: OptionChainRow[] = [
    { callPremium: '-', callVolume: '-', callOpenInt: '-', strikePrice: 0.00, putOpenInt: '-', putVolume: '-', putPremium: '-' },
    { callPremium: '-', callVolume: '-', callOpenInt: '-', strikePrice: 0.00, putOpenInt: '-', putVolume: '-', putPremium: '-' },
    { callPremium: '-', callVolume: '-', callOpenInt: '-', strikePrice: 0.00, putOpenInt: '-', putVolume: '-', putPremium: '-' },
    { callPremium: '-', callVolume: '-', callOpenInt: '-', strikePrice: 0.00, putOpenInt: '-', putVolume: '-', putPremium: '-' },
];

export const foStatsGainers: FOStatsRow[] = [
    { symbol: 'IDEA', expiry: '27-Jan-26', cmp: 12.46, change: 0.91, changePercent: 7.88 },
    { symbol: 'INDUSTOWER', expiry: '27-Jan-26', cmp: 450.30, change: 17.30, changePercent: 4.00 },
    { symbol: 'MAZDOCK', expiry: '27-Jan-26', cmp: 2557.20, change: 67.30, changePercent: 2.70 },
    { symbol: 'PETRONET', expiry: '27-Jan-26', cmp: 291.65, change: 7.45, changePercent: 2.62 },
    { symbol: 'BHEL', expiry: '27-Jan-26', cmp: 278.80, change: 5.90, changePercent: 2.16 },
    { symbol: 'HINDZINC', expiry: '27-Jan-26', cmp: 606.00, change: 12.65, changePercent: 2.13 },
    { symbol: 'SIEMENS', expiry: '27-Jan-26', cmp: 3068.70, change: 61.90, changePercent: 2.06 },
];

export const foStatsLosers: FOStatsRow[] = [
    { symbol: 'FEDERALBNK', expiry: '27-Jan-26', cmp: 198.50, change: -8.25, changePercent: -3.98 },
    { symbol: 'BANDHANBNK', expiry: '27-Jan-26', cmp: 145.84, change: -3.86, changePercent: -2.58 },
    { symbol: 'SBIN', expiry: '27-Jan-26', cmp: 1003.75, change: -18.45, changePercent: -1.81 },
    { symbol: 'KOTAKBANK', expiry: '27-Jan-26', cmp: 2135.40, change: -25.60, changePercent: -1.19 },
    { symbol: 'HDFCBANK', expiry: '27-Jan-26', cmp: 948.50, change: -10.80, changePercent: -1.13 },
];

export const sectorOIData: SectorOIRow[] = [
    { symbol: 'AUBANK', cmp: 1002.90, cmpChange: 0.61, openInterest: 19176000, oiChange: 2.72 },
    { symbol: 'ICICIBANK', cmp: 1426.20, cmpChange: -0.88, openInterest: 112580300, oiChange: 1.73 },
    { symbol: 'AXISBANK', cmp: 1296.50, cmpChange: 0.33, openInterest: 72616875, oiChange: 0.27 },
    { symbol: 'HDFCBANK', cmp: 948.50, cmpChange: -0.23, openInterest: 215035700, oiChange: 0.02 },
    { symbol: 'RBLBANK', cmp: 313.40, cmpChange: 1.05, openInterest: 69478525, oiChange: -0.16 },
    { symbol: 'UNIONBANK', cmp: 163.71, cmpChange: 1.17, openInterest: 65476725, oiChange: -0.20 },
    { symbol: 'PNB', cmp: 123.63, cmpChange: 0.42, openInterest: 224720000, oiChange: -0.55 },
    { symbol: 'KOTAKBANK', cmp: 2135.40, cmpChange: -0.17, openInterest: 37800800, oiChange: -0.74 },
    { symbol: 'YESBANK', cmp: 22.88, cmpChange: 0.48, openInterest: 1051428800, oiChange: -0.89 },
    { symbol: 'SBIN', cmp: 1003.75, cmpChange: 0.30, openInterest: 70144500, oiChange: -0.90 },
];

export const globalIndicesData: GlobalIndexRow[] = [
    { name: 'Nasdaq', cmp: 23671.35, change: 191.33, changePercent: 0.81, category: 'US Markets' },
    { name: 'FTSE 100', cmp: 10124.60, change: 79.91, changePercent: 0.79, category: 'European Markets' },
    { name: 'CAC 40', cmp: 8362.09, change: 118.62, changePercent: 1.42, category: 'European Markets' },
    { name: 'DAX', cmp: 25261.64, change: 134.18, changePercent: 0.53, category: 'European Markets' },
    { name: 'Nikkei 225', cmp: 51939.89, change: 822.63, changePercent: 1.58, category: 'Asian Markets' },
    { name: 'Straits Times', cmp: 4744.66, change: 5.59, changePercent: 0.12, category: 'Asian Markets' },
    { name: 'Hang Seng', cmp: 26231.79, change: 82.48, changePercent: 0.31, category: 'Asian Markets' },
    { name: 'Taiwan Weighted', cmp: 30288.96, change: -71.59, changePercent: -0.24, category: 'Asian Markets' },
    { name: 'KOSPI', cmp: 4586.32, change: 33.95, changePercent: 0.74, category: 'Asian Markets' },
    { name: 'SET Composite', cmp: 1254.09, change: 0.49, changePercent: 0.04, category: 'Asian Markets' },
    { name: 'Jakarta Composite', cmp: 8936.75, change: 11.28, changePercent: 0.13, category: 'Asian Markets' },
];

export const openInterestData: OpenInterestRow[] = [
    { symbol: 'ASHOKLEY', expiry: '27-Jan-26', totalOI: 270355000, change: 8415000, changePercent: 2.05 },
    { symbol: 'ABCAPITAL', expiry: '27-Jan-26', totalOI: 114111000, change: 1112900, changePercent: 0.98 },
    { symbol: 'ADANIGREEN', expiry: '27-Jan-26', totalOI: 35540400, change: 717000, changePercent: 2.06 },
    { symbol: 'ADANIENT', expiry: '27-Jan-26', totalOI: 34983435, change: 1547781, changePercent: 4.63 },
    { symbol: 'ANGELONE', expiry: '27-Jan-26', totalOI: 8723000, change: 469000, changePercent: 5.68 },
    { symbol: 'APOLLOHOSP', expiry: '27-Jan-26', totalOI: 5501500, change: 110750, changePercent: -0.86 },
    { symbol: 'ABB', expiry: '27-Jan-26', totalOI: 4269750, change: -37250, changePercent: 1.92 },
    { symbol: 'AMBER', expiry: '27-Jan-26', totalOI: 1728700, change: 32600, changePercent: 3.21 },
];

export const arbitrageData: ArbitrageRow[] = [
    { company: 'BOSCHLTD', future: 38810.00, cash: 37995.00, basis: 815.00 },
    { company: 'PAGEIND', future: 34975.00, cash: 34280.00, basis: 695.00 },
    { company: 'SOLARINDS', future: 13657.00, cash: 13191.00, basis: 466.00 },
    { company: 'BAJAJ-AUTO', future: 9839.00, cash: 9562.50, basis: 276.50 },
    { company: 'BAJAJHLDNG', future: 11289.00, cash: 11043.00, basis: 246.00 },
    { company: 'MARUTI', future: 16746.00, cash: 16501.00, basis: 245.00 },
    { company: 'AMBER', future: 6569.00, cash: 6329.50, basis: 239.50 },
    { company: 'SHREECEM', future: 27150.00, cash: 26950.00, basis: 200.00 },
];

export const corporateActionData: CorporateActionRow[] = [
    { stock: 'Avenue Supermar', exDate: '2026-Jan-10', purpose: 'Board Meeting' },
    { stock: 'Jindal Stainles', exDate: '2026-Jan-10', purpose: 'AGM-EGM' },
    { stock: 'Nippon', exDate: '2026-Jan-10', purpose: 'AGM-EGM' },
    { stock: 'WeWork India', exDate: '2026-Jan-10', purpose: 'AGM-EGM' },
];

export const advanceDeclineData: AdvanceDeclineRow[] = [
    { category: 'Advanced', future: 143, futurePercent: 69, calls: 1732, callsPercent: 20, puts: 1632, putsPercent: 19 },
    { category: 'Declined', future: 64, futurePercent: 31, calls: 4032, callsPercent: 48, puts: 3960, putsPercent: 47 },
    { category: 'Unchanged', future: 1, futurePercent: 0, calls: 2690, callsPercent: 32, puts: 2858, putsPercent: 34 },
];

export const announcementsData: AnnouncementRow[] = [
    { date: '10-Jan', time: '10:24', title: 'Announcement under Regulation 30 (LODR)-Inves...', link: '#' },
    { date: '09-Jan', time: '22:48', title: 'Announcement under Regulation 30 (LODR)-Credi...', link: '#' },
    { date: '09-Jan', time: '21:53', title: 'Clarification On News Item Appearing In Media...', link: '#' },
    { date: '09-Jan', time: '21:48', title: 'Business Update - Intimation Under Regulation...', link: '#' },
    { date: '09-Jan', time: '21:45', title: 'Clarification /Confirmation On News Item - Ma...', link: '#' },
    { date: '09-Jan', time: '21:01', title: 'Audited Consolidated Financial Statements For...', link: '#' },
    { date: '09-Jan', time: '21:01', title: 'Announcement under Regulation 30 (LODR)-Acqui...', link: '#' },
    { date: '09-Jan', time: '20:57', title: 'Audited Standalone Financials For The Period ...', link: '#' },
];

export const glossaryTerms = [
    { term: 'At-the-Money Option', link: '#' },
    { term: 'Basis', link: '#' },
    { term: 'Bear Spread', link: '#' },
    { term: 'Bull Spread', link: '#' },
    { term: 'Call', link: '#' },
    { term: 'European-Style Options', link: '#' },
    { term: 'Expiration Date', link: '#' },
    { term: 'Forward (Cash) Contract', link: '#' },
    { term: 'Futures Contract', link: '#' },
];

export const foExpiryDates = ['Select', '27-Jan-26', '30-Jan-26', '06-Feb-26', '27-Feb-26'];
export const foIndices = ['Select', 'NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'];
export const foSectors = ['Banks', 'IT', 'Auto', 'Pharma', 'FMCG', 'Metal', 'Energy', 'Realty'];
