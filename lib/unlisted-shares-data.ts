// Unlisted Shares Data

export interface UnlistedShare {
    id: string;
    symbol: string;
    name: string;
    logo?: string;
    logoColor?: string;
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
    weekHigh52?: number;
    weekLow52?: number;
}

export interface Partner {
    id: string;
    name: string;
    logo?: string;
    isPreferred?: boolean;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

// Top Unlisted Share Companies
export const topUnlistedShareCompanies: UnlistedShare[] = [
    { id: '1', symbol: 'PPFAS', name: 'Parag Parikh Fi', logoColor: '#8B4513', price: 17344.00, change: -156.00, changePercent: -0.89, previousClose: 17500.00 },
    { id: '2', symbol: 'ORBIS', name: 'Orbis Financial', logoColor: '#1E90FF', price: 426.00, change: -4.00, changePercent: -0.93, previousClose: 430.00 },
    { id: '3', symbol: 'CAREHI', name: 'Care Health Ins', logoColor: '#FF6B6B', price: 148.50, change: -1.50, changePercent: -1.00, previousClose: 150.00 },
    { id: '4', symbol: 'NSE', name: 'National Stock', logoColor: '#4A90D9', price: 2020.00, change: -25.00, changePercent: -1.22, previousClose: 2045.00 },
    { id: '5', symbol: 'SBIFM', name: 'SBI Funds Manag', logoColor: '#2E7D32', price: 760.00, change: -10.00, changePercent: -1.30, previousClose: 770.00 },
    { id: '6', symbol: 'CSK', name: 'Chennai Super K', logoColor: '#FFD700', price: 212.00, change: -3.00, changePercent: -1.40, previousClose: 215.00 },
    { id: '7', symbol: 'PHARM', name: 'PharmEasy (API)', logoColor: '#26A69A', price: 6.50, change: -0.10, changePercent: -1.52, previousClose: 6.60 },
    { id: '8', symbol: 'NCDEX', name: 'NCDEX Ltd', logoColor: '#FF5722', price: 470.00, change: -10.00, changePercent: -2.08, previousClose: 480.00 },
    { id: '9', symbol: 'SIGNIF', name: 'Signify Innovat', logoColor: '#9C27B0', price: 1150.00, change: 0.00, changePercent: 0.00, previousClose: 1150.00 },
    { id: '10', symbol: 'METRO', name: 'Metropolitan St', logoColor: '#E91E63', price: 4.50, change: 0.00, changePercent: 0.00, previousClose: 4.50 },
    { id: '11', symbol: 'JUPITER', name: 'Jupiter Interna', logoColor: '#673AB7', price: 315.00, change: 0.00, changePercent: 0.00, previousClose: 315.00 },
    { id: '12', symbol: 'MERINO', name: 'Merino Industri', logoColor: '#3F51B5', price: 3180.00, change: 0.00, changePercent: 0.00, previousClose: 3180.00 },
    { id: '13', symbol: 'HOK', name: 'House of Kieray', logoColor: '#00BCD4', price: 185.00, change: 0.00, changePercent: 0.00, previousClose: 185.00 },
    { id: '14', symbol: 'ASKINV', name: 'ASK Investment', logoColor: '#607D8B', price: 1075.00, change: 0.00, changePercent: 0.00, previousClose: 1075.00 },
];

// Top Gainers
export const topGainersShares: UnlistedShare[] = [
    { id: '1', symbol: 'METRO', name: 'Metropolitan St', logoColor: '#E91E63', price: 3.96, change: 0.28, changePercent: 7.68, previousClose: 3.68 },
    { id: '2', symbol: 'IKFFI', name: 'IKF Finance Ltd', logoColor: '#2196F3', price: 466.00, change: 3.33, changePercent: 0.72, previousClose: 462.67 },
    { id: '3', symbol: 'PARRY', name: 'Parry Agro Indu', logoColor: '#4CAF50', price: 1277.00, change: 77.00, changePercent: 6.42, previousClose: 1200.00 },
    { id: '4', symbol: 'SBIFM', name: 'SBI Fund Manage', logoColor: '#F44336', price: 709.75, change: 20.00, changePercent: 2.90, previousClose: 689.75 },
    { id: '5', symbol: 'MOHAN', name: 'Mohan Meakin Lt', logoColor: '#FF9800', price: 2203.50, change: 94.25, changePercent: 4.47, previousClose: 2109.25 },
    { id: '6', symbol: 'GARUDA', name: 'Garuda Aerospac', logoColor: '#9C27B0', price: 182940.00, change: 4182.00, changePercent: 2.34, previousClose: 178758.00 },
    { id: '7', symbol: 'INKEL', name: 'Inkel Ltd.', logoColor: '#00BCD4', price: 19.50, change: 0.60, changePercent: 3.17, previousClose: 18.90 },
    { id: '8', symbol: 'SUNDAY', name: 'Sunday Proptech', logoColor: '#607D8B', price: 21.35, change: 0.10, changePercent: 0.47, previousClose: 21.25 },
    { id: '9', symbol: 'AONE', name: 'AOne Steels Ind', logoColor: '#FF5722', price: 246.00, change: 1.00, changePercent: 0.41, previousClose: 245.00 },
    { id: '10', symbol: 'BINANI', name: 'Binani Industri', logoColor: '#795548', price: 1.43, change: 0.01, changePercent: 0.35, previousClose: 1.42 },
];

// Top Losers
export const topLosersShares: UnlistedShare[] = [
    { id: '1', symbol: 'RDC', name: 'RDC Concrete (I', logoColor: '#4CAF50', price: 184.00, change: -62.50, changePercent: -25.35, previousClose: 246.50 },
    { id: '2', symbol: 'BOOTES', name: 'Bootes Impex Te', logoColor: '#2196F3', price: 1192.00, change: -13.00, changePercent: -1.08, previousClose: 1205.00 },
    { id: '3', symbol: 'ONIX', name: 'ONIX Renewable', logoColor: '#4CAF50', price: 59.63, change: -0.12, changePercent: -0.21, previousClose: 59.75 },
    { id: '4', symbol: 'BIRA91', name: 'Bira91 (B9 Beve', logoColor: '#FF9800', price: 155.00, change: -0.75, changePercent: -0.48, previousClose: 155.75 },
    { id: '5', symbol: 'SNAMILK', name: 'SNA Milk and Mi', logoColor: '#9C27B0', price: 45999.00, change: -667.00, changePercent: -1.43, previousClose: 46666.00 },
    { id: '6', symbol: 'INDIAN', name: 'Indian Commodit', logoColor: '#607D8B', price: 3.51, change: -0.05, changePercent: -1.33, previousClose: 3.56 },
    { id: '7', symbol: 'APOLLO', name: 'Apollo Green En', logoColor: '#00BCD4', price: 86.88, change: -1.12, changePercent: -1.28, previousClose: 88.00 },
    { id: '8', symbol: 'MATRIX', name: 'Matrix Gas And', logoColor: '#FF5722', price: 24.98, change: -0.25, changePercent: -1.01, previousClose: 25.23 },
    { id: '9', symbol: 'HELLA', name: 'Hella Infra Mar', logoColor: '#E91E63', price: 129000.00, change: -31000.00, changePercent: -19.37, previousClose: 160000.00 },
    { id: '10', symbol: 'MAVERICK', name: 'Maverick Simula', logoColor: '#3F51B5', price: 1875.00, change: -40.00, changePercent: -2.09, previousClose: 1915.00 },
];

// 52 Week High - Empty for now as per screenshot
export const weekHigh52Shares: UnlistedShare[] = [];

// 52 Week Low - Empty for now as per screenshot
export const weekLow52Shares: UnlistedShare[] = [];

// Partners
export const preferredPartner: Partner = {
    id: '1',
    name: 'Incred Money',
    logo: '/partners/incred-money.png',
    isPreferred: true
};

export const partners: Partner[] = [
    { id: '1', name: 'Altius Investech', logo: '/partners/altius.png' },
    { id: '2', name: 'Wealth Wisdom', logo: '/partners/wealth-wisdom.png' },
    { id: '3', name: 'Planify', logo: '/partners/planify.png' },
    { id: '4', name: 'Unlisted Zone', logo: '/partners/unlisted-zone.png' },
];

// FAQs
export const unlistedSharesFAQs: FAQ[] = [
    {
        id: '1',
        question: 'What are unlisted equity shares?',
        answer: 'Unlisted shares are equity shares of companies that are not listed on any recognized stock exchange (like the NSE or BSE). These companies operate privately and their shares are not traded publicly.'
    },
    {
        id: '2',
        question: 'How can I buy unlisted shares?',
        answer: 'Unlisted shares can be purchased through intermediaries, specialized platforms, or directly from existing shareholders. The transaction typically involves legal agreements and proper documentation.'
    },
    {
        id: '3',
        question: 'What are the risks of investing in unlisted shares?',
        answer: 'The main risks include liquidity risk (difficulty in selling), valuation uncertainty, limited information availability, and regulatory risks. Always conduct thorough due diligence before investing.'
    },
    {
        id: '4',
        question: 'How are unlisted shares valued?',
        answer: 'Unlisted shares are typically valued based on the company\'s financials, previous funding rounds, peer comparison, and discounted cash flow analysis. Prices are derived from private market transactions.'
    },
    {
        id: '5',
        question: 'What happens when an unlisted company gets listed?',
        answer: 'When an unlisted company goes public through an IPO, shareholders can sell their shares on the stock exchange. This often results in better liquidity and potentially higher valuations.'
    },
];

// Tabs
export const unlistedSharesTabs = [
    'Top Unlisted Share Companies',
    'Top Gainers',
    'Top Losers',
    '52 Week High',
    '52 Week Low'
] as const;

export type UnlistedSharesTabType = typeof unlistedSharesTabs[number];

// Time period options
export const timePeriods = ['1W', '1M', '3M', '6M', '1Y'] as const;
export type TimePeriodType = typeof timePeriods[number];
