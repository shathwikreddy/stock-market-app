// ETF (Exchange Traded Funds) Data

export interface ETF {
    id: string;
    name: string;
    fullName: string;
    exchange: string;
    lastUpdated: string;
    price: number;
    changePercent: number;
    volume: string;
    returns: {
        oneYear: number | null;
        threeYear: number | null;
        fiveYear: number | null;
    };
    trackingError: number;
    expenseRatio: number;
    aum: number;
    category: ETFCategory;
}

export type ETFCategory = 'All' | 'Index' | 'Sector' | 'Factor' | 'Global' | 'Debt' | 'Bullion' | 'Most Traded' | 'Top Performer';

export interface ETFFAQ {
    id: string;
    question: string;
    answer: string;
}

// Category tabs configuration
export const etfCategories: { label: ETFCategory; icon: string }[] = [
    { label: 'All', icon: 'all' },
    { label: 'Index', icon: 'index' },
    { label: 'Sector', icon: 'sector' },
    { label: 'Factor', icon: 'factor' },
    { label: 'Global', icon: 'global' },
    { label: 'Debt', icon: 'debt' },
    { label: 'Bullion', icon: 'bullion' },
    { label: 'Most Traded', icon: 'traded' },
    { label: 'Top Performer', icon: 'performer' },
];

// Index ETFs Data
export const indexETFs: ETF[] = [
    {
        id: 'nipp-nifty50',
        name: 'Nipp Nifty 50',
        fullName: 'Nippon India Nifty 50 BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 290.66,
        changePercent: -0.16,
        volume: '5.38M',
        returns: { oneYear: 12.07, threeYear: 13.87, fiveYear: 13.22 },
        trackingError: 0.03,
        expenseRatio: 0.04,
        aum: 56570.55,
        category: 'Index',
    },
    {
        id: 'nipp-niftynext',
        name: 'Nipp NiftyNext',
        fullName: 'Nippon India Nifty Next 50 Junior BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 741.31,
        changePercent: 0.58,
        volume: '465.97k',
        returns: { oneYear: 9.82, threeYear: 18.35, fiveYear: 15.58 },
        trackingError: 0.08,
        expenseRatio: 0.17,
        aum: 7051.03,
        category: 'Index',
    },
    {
        id: 'ipru-nifty50',
        name: 'Ipru Nifty 50',
        fullName: 'ICICI Prudential Nifty 50 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:57',
        price: 289.11,
        changePercent: -0.19,
        volume: '946.31k',
        returns: { oneYear: 12.09, threeYear: 13.89, fiveYear: 13.23 },
        trackingError: 0.00,
        expenseRatio: 0.08,
        aum: 37424.97,
        category: 'Index',
    },
    {
        id: 'sbi-nifty50et',
        name: 'SBI Nifty50 ET',
        fullName: 'SBI Nifty 50 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:54',
        price: 274.69,
        changePercent: -0.20,
        volume: '591.58k',
        returns: { oneYear: 12.06, threeYear: 13.85, fiveYear: 13.20 },
        trackingError: 0.03,
        expenseRatio: 0.04,
        aum: 218214.80,
        category: 'Index',
    },
    {
        id: 'hdfc-nifty250',
        name: 'HDFC Nifty 250',
        fullName: 'HDFC Nifty 250 Quality 50 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 163.97,
        changePercent: 0.60,
        volume: '976.16k',
        returns: { oneYear: -0.61, threeYear: null, fiveYear: null },
        trackingError: 0.00,
        expenseRatio: 0.25,
        aum: 1590.54,
        category: 'Index',
    },
    {
        id: 'nipp-niftymid',
        name: 'Nipp Nifty Mid',
        fullName: 'Nippon India Nifty Midcap 150 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:56',
        price: 226.63,
        changePercent: 0.33,
        volume: '589.24k',
        returns: { oneYear: 10.87, threeYear: 23.30, fiveYear: 21.92 },
        trackingError: 0.06,
        expenseRatio: 0.21,
        aum: 2812.08,
        category: 'Index',
    },
];

// Sector ETFs Data
export const sectorETFs: ETF[] = [
    {
        id: 'ipru-niftyfmcg',
        name: 'Ipru NiftyFMCG',
        fullName: 'ICICI Prudential Nifty FMCG ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:53',
        price: 55.77,
        changePercent: -0.94,
        volume: '12.4M',
        returns: { oneYear: -4.43, threeYear: 7.53, fiveYear: null },
        trackingError: 0.00,
        expenseRatio: 0.36,
        aum: 689.55,
        category: 'Sector',
    },
    {
        id: 'nipp-niftypsu',
        name: 'Nipp Nifty PSU',
        fullName: 'Nippon India Nifty PSU Bank BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 99.63,
        changePercent: 2.71,
        volume: '5.84M',
        returns: { oneYear: 45.12, threeYear: 27.83, fiveYear: 35.53 },
        trackingError: 0.12,
        expenseRatio: 0.49,
        aum: 3935.24,
        category: 'Sector',
    },
    {
        id: 'ipru-niftymeta',
        name: 'Ipru Nifty Meta',
        fullName: 'ICICI Prudential Nifty Metal ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 11.72,
        changePercent: 2.72,
        volume: '41.43M',
        returns: { oneYear: null, threeYear: 41.32, fiveYear: null },
        trackingError: 0.00,
        expenseRatio: 0.69,
        aum: 640.63,
        category: 'Sector',
    },
];

// Factor ETFs Data
export const factorETFs: ETF[] = [
    {
        id: 'nipp-nifty-alpha',
        name: 'Nipp Alpha LV',
        fullName: 'Nippon India Nifty Alpha Low Volatility 30 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:55',
        price: 45.82,
        changePercent: 0.45,
        volume: '1.2M',
        returns: { oneYear: 18.45, threeYear: 22.10, fiveYear: 19.85 },
        trackingError: 0.05,
        expenseRatio: 0.25,
        aum: 892.45,
        category: 'Factor',
    },
    {
        id: 'hdfc-nifty-value',
        name: 'HDFC Nifty Value',
        fullName: 'HDFC Nifty 100 Quality 30 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:57',
        price: 38.95,
        changePercent: -0.32,
        volume: '856.2k',
        returns: { oneYear: 14.22, threeYear: 16.50, fiveYear: 15.20 },
        trackingError: 0.03,
        expenseRatio: 0.20,
        aum: 1245.80,
        category: 'Factor',
    },
    {
        id: 'ipru-nifty-momentum',
        name: 'Ipru Momentum',
        fullName: 'ICICI Prudential Nifty 200 Momentum 30 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 52.30,
        changePercent: 1.15,
        volume: '2.1M',
        returns: { oneYear: 25.80, threeYear: 28.45, fiveYear: null },
        trackingError: 0.08,
        expenseRatio: 0.30,
        aum: 1567.90,
        category: 'Factor',
    },
];

// Global ETFs Data
export const globalETFs: ETF[] = [
    {
        id: 'mot-nasdaq100',
        name: 'MOSt NASDAQ',
        fullName: 'Motilal Oswal NASDAQ 100 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 185.42,
        changePercent: 1.25,
        volume: '3.5M',
        returns: { oneYear: 32.15, threeYear: 18.90, fiveYear: 22.45 },
        trackingError: 0.15,
        expenseRatio: 0.50,
        aum: 8956.32,
        category: 'Global',
    },
    {
        id: 'nipp-hangseng',
        name: 'Nipp HangSeng',
        fullName: 'Nippon India Hang Seng BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:56',
        price: 312.75,
        changePercent: -0.85,
        volume: '425.6k',
        returns: { oneYear: -8.50, threeYear: -12.30, fiveYear: -5.20 },
        trackingError: 0.22,
        expenseRatio: 0.85,
        aum: 245.80,
        category: 'Global',
    },
    {
        id: 'mira-sp500',
        name: 'Mira S&P 500',
        fullName: 'Mirae Asset S&P 500 Top 50 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 28.65,
        changePercent: 0.95,
        volume: '1.8M',
        returns: { oneYear: 28.40, threeYear: 15.60, fiveYear: null },
        trackingError: 0.10,
        expenseRatio: 0.45,
        aum: 2340.55,
        category: 'Global',
    },
];

// Debt ETFs Data
export const debtETFs: ETF[] = [
    {
        id: 'sbi-gilt',
        name: 'SBI ETF 10Y Gilt',
        fullName: 'SBI ETF 10 Year Gilt',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:55',
        price: 25.45,
        changePercent: 0.12,
        volume: '2.3M',
        returns: { oneYear: 8.25, threeYear: 6.80, fiveYear: 7.15 },
        trackingError: 0.02,
        expenseRatio: 0.10,
        aum: 5678.90,
        category: 'Debt',
    },
    {
        id: 'nipp-liquid',
        name: 'Nipp Liquid BeES',
        fullName: 'Nippon India Liquid BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 1050.25,
        changePercent: 0.02,
        volume: '156.3k',
        returns: { oneYear: 6.85, threeYear: 5.90, fiveYear: 5.75 },
        trackingError: 0.00,
        expenseRatio: 0.08,
        aum: 3456.78,
        category: 'Debt',
    },
    {
        id: 'bharat-bond',
        name: 'Bharat Bond Apr31',
        fullName: 'Edelweiss Bharat Bond ETF - April 2031',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:57',
        price: 1285.60,
        changePercent: 0.18,
        volume: '89.5k',
        returns: { oneYear: 9.45, threeYear: 8.20, fiveYear: null },
        trackingError: 0.01,
        expenseRatio: 0.0005,
        aum: 12540.25,
        category: 'Debt',
    },
];

// Bullion ETFs Data
export const bullionETFs: ETF[] = [
    {
        id: 'nipp-goldbees',
        name: 'Nipp Gold BeES',
        fullName: 'Nippon India Gold BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 62.85,
        changePercent: 0.42,
        volume: '8.5M',
        returns: { oneYear: 18.50, threeYear: 14.20, fiveYear: 12.85 },
        trackingError: 0.15,
        expenseRatio: 0.50,
        aum: 7845.60,
        category: 'Bullion',
    },
    {
        id: 'hdfc-gold',
        name: 'HDFC Gold ETF',
        fullName: 'HDFC Gold Exchange Traded Fund',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:56',
        price: 58.42,
        changePercent: 0.38,
        volume: '2.1M',
        returns: { oneYear: 18.35, threeYear: 14.05, fiveYear: 12.70 },
        trackingError: 0.12,
        expenseRatio: 0.45,
        aum: 3560.45,
        category: 'Bullion',
    },
    {
        id: 'nipp-silver',
        name: 'Nipp Silver BeES',
        fullName: 'Nippon India Silver ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 85.25,
        changePercent: 1.25,
        volume: '4.2M',
        returns: { oneYear: 22.80, threeYear: null, fiveYear: null },
        trackingError: 0.20,
        expenseRatio: 0.55,
        aum: 1890.35,
        category: 'Bullion',
    },
];

// Most Traded ETFs Data (high volume ETFs)
export const mostTradedETFs: ETF[] = [
    {
        id: 'nipp-nifty50-mt',
        name: 'Nipp Nifty 50',
        fullName: 'Nippon India Nifty 50 BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 290.66,
        changePercent: -0.16,
        volume: '45.8M',
        returns: { oneYear: 12.07, threeYear: 13.87, fiveYear: 13.22 },
        trackingError: 0.03,
        expenseRatio: 0.04,
        aum: 56570.55,
        category: 'Most Traded',
    },
    {
        id: 'nipp-bankbees-mt',
        name: 'Nipp Bank BeES',
        fullName: 'Nippon India Bank BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 528.45,
        changePercent: 0.85,
        volume: '38.2M',
        returns: { oneYear: 8.45, threeYear: 12.60, fiveYear: 10.25 },
        trackingError: 0.05,
        expenseRatio: 0.20,
        aum: 18450.32,
        category: 'Most Traded',
    },
    {
        id: 'sbi-nifty50-mt',
        name: 'SBI Nifty50 ET',
        fullName: 'SBI Nifty 50 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:54',
        price: 274.69,
        changePercent: -0.20,
        volume: '32.5M',
        returns: { oneYear: 12.06, threeYear: 13.85, fiveYear: 13.20 },
        trackingError: 0.03,
        expenseRatio: 0.04,
        aum: 218214.80,
        category: 'Most Traded',
    },
];

// Top Performer ETFs Data (highest returns)
export const topPerformerETFs: ETF[] = [
    {
        id: 'nipp-psu-tp',
        name: 'Nipp Nifty PSU',
        fullName: 'Nippon India Nifty PSU Bank BeES',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:59',
        price: 99.63,
        changePercent: 2.71,
        volume: '5.84M',
        returns: { oneYear: 45.12, threeYear: 27.83, fiveYear: 35.53 },
        trackingError: 0.12,
        expenseRatio: 0.49,
        aum: 3935.24,
        category: 'Top Performer',
    },
    {
        id: 'mot-nasdaq-tp',
        name: 'MOSt NASDAQ',
        fullName: 'Motilal Oswal NASDAQ 100 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 185.42,
        changePercent: 1.25,
        volume: '3.5M',
        returns: { oneYear: 32.15, threeYear: 18.90, fiveYear: 22.45 },
        trackingError: 0.15,
        expenseRatio: 0.50,
        aum: 8956.32,
        category: 'Top Performer',
    },
    {
        id: 'ipru-momentum-tp',
        name: 'Ipru Momentum',
        fullName: 'ICICI Prudential Nifty 200 Momentum 30 ETF',
        exchange: 'NSE',
        lastUpdated: 'Jan 14, 15:58',
        price: 52.30,
        changePercent: 1.15,
        volume: '2.1M',
        returns: { oneYear: 25.80, threeYear: 28.45, fiveYear: null },
        trackingError: 0.08,
        expenseRatio: 0.30,
        aum: 1567.90,
        category: 'Top Performer',
    },
];

// All ETFs combined
export const allETFs: ETF[] = [
    ...indexETFs,
    ...sectorETFs,
    ...factorETFs,
    ...globalETFs,
    ...debtETFs,
    ...bullionETFs,
    ...mostTradedETFs,
    ...topPerformerETFs,
];

// FAQs Data
export const etfFAQs: ETFFAQ[] = [
    {
        id: '1',
        question: 'What are ETFs',
        answer: 'ETFs or Exchange Traded Funds are investment vehicles which trade on the stock exchange like other instruments such as stocks, REITs, InVITs etc. A fund house comes out with an offering in form of a fund of fund that invests into a portfolio of securities and then an ETF linked to this fund of fund is issued for purposes of liquidity. These ETFs are backed by a portfolio of securities such as stocks, bonds and/or commodities that track a specific index or strategy.',
    },
    {
        id: '2',
        question: 'ETFs compared with MFs',
        answer: 'ETFs trade on exchanges like stocks with real-time pricing, while mutual funds are priced once daily. ETFs typically have lower expense ratios and offer more tax efficiency. Mutual funds may have minimum investment requirements, while ETFs can be bought in single shares.',
    },
    {
        id: '3',
        question: 'Price discovery of ETFs',
        answer: 'ETF prices are discovered through real-time trading on stock exchanges. The price closely tracks the Net Asset Value (NAV) of underlying securities. Authorized participants help maintain price efficiency through arbitrage mechanisms.',
    },
    {
        id: '4',
        question: 'Passive Investing vs Active Investing',
        answer: 'Passive investing through ETFs tracks market indices with lower costs and minimal trading. Active investing seeks to outperform the market through stock selection and market timing. ETFs are predominantly passive, offering diversification at lower expense ratios.',
    },
    {
        id: '5',
        question: 'Benefits of ETFs',
        answer: 'ETFs offer diversification, lower expense ratios, tax efficiency, transparency, and intraday trading flexibility. They provide access to various asset classes and strategies in a single instrument.',
    },
];

// Sort options
export const sortOptions = [
    { value: 'selected', label: 'Selected by' },
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'returns', label: 'Returns' },
    { value: 'aum', label: 'AUM' },
];

