export interface HistoricalBoardMeeting {
    date: string;
    remarks: string;
}

export interface CorporateAction {
    id: string;
    companyName: string;
    symbol: string;
    badge: 'AGM-EGM' | 'Board Meetings' | 'Bonus' | 'Dividends' | 'Splits' | 'Rights' | 'Announcements';
    ltp: number;
    percentChange: number;
    dividendAmount?: number;
    announcementDate: string;
    exDate: string;
    purpose?: string;
    historicalData: HistoricalBoardMeeting[];
}

export const corporateActionsData: CorporateAction[] = [
    {
        id: '1',
        companyName: 'JSW Energy',
        symbol: 'JSWENERGY',
        badge: 'AGM-EGM',
        ltp: 510.65,
        percentChange: 1.72,
        dividendAmount: undefined,
        announcementDate: '15/12/2025',
        exDate: '03/01/2026',
        purpose: 'Annual General Meeting',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Others' },
            { date: '14 Nov, 2025', remarks: 'Quarterly Results' },
            { date: '23 Oct, 2025', remarks: 'Increase in Authorised Capital & Others' },
            { date: '17 Sep, 2025', remarks: 'Others' },
            { date: '28 Aug, 2025', remarks: 'A.G.M.' },
        ],
    },
    {
        id: '2',
        companyName: 'Enviro Infra',
        symbol: 'ENVIROINFRA',
        badge: 'AGM-EGM',
        ltp: 206.75,
        percentChange: 1.61,
        dividendAmount: undefined,
        announcementDate: '02/12/2025',
        exDate: '03/01/2026',
        purpose: 'Extra-Ordinary General Meeting',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Others' },
            { date: '20 Nov, 2025', remarks: 'Quarterly Results' },
            { date: '15 Oct, 2025', remarks: 'Others' },
        ],
    },
    {
        id: '3',
        companyName: 'AGI Infra',
        symbol: 'AGIINFRA',
        badge: 'Board Meetings',
        ltp: 273.35,
        percentChange: 4.03,
        announcementDate: '03/01/2026',
        exDate: '',
        purpose: 'Others',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Others' },
            { date: '12 Dec, 2025', remarks: 'Quarterly Results' },
            { date: '05 Nov, 2025', remarks: 'Others' },
            { date: '28 Sep, 2025', remarks: 'A.G.M.' },
        ],
    },
    {
        id: '4',
        companyName: 'Saraswati Saree',
        symbol: 'SARASWATI',
        badge: 'AGM-EGM',
        ltp: 78.16,
        percentChange: 0.18,
        dividendAmount: undefined,
        announcementDate: '26/11/2025',
        exDate: '03/01/2026',
        purpose: 'Annual General Meeting',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'A.G.M.' },
            { date: '15 Nov, 2025', remarks: 'Quarterly Results' },
            { date: '10 Oct, 2025', remarks: 'Others' },
        ],
    },
    {
        id: '5',
        companyName: 'Cupid Breweries',
        symbol: 'CUPID',
        badge: 'Board Meetings',
        ltp: 45.94,
        percentChange: 4.98,
        announcementDate: '03/01/2026',
        exDate: '',
        purpose: 'Preferential issue of shares',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Preferential issue of shares' },
            { date: '18 Dec, 2025', remarks: 'Quarterly Results' },
            { date: '25 Nov, 2025', remarks: 'Others' },
            { date: '10 Oct, 2025', remarks: 'A.G.M.' },
        ],
    },
    {
        id: '6',
        companyName: 'MRC Agrotech',
        symbol: 'MRCAGRO',
        badge: 'Board Meetings',
        ltp: 48.99,
        percentChange: 2.00,
        announcementDate: '03/01/2026',
        exDate: '',
        purpose: 'Others',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Others' },
            { date: '22 Dec, 2025', remarks: 'Quarterly Results' },
        ],
    },
    {
        id: '7',
        companyName: 'Ramchandra Leas',
        symbol: 'RAMCHANDRALEAS',
        badge: 'Board Meetings',
        ltp: 9.88,
        percentChange: 4.99,
        announcementDate: '03/01/2026',
        exDate: '',
        purpose: 'Others',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Others' },
            { date: '15 Dec, 2025', remarks: 'Quarterly Results' },
            { date: '01 Nov, 2025', remarks: 'Others' },
        ],
    },
    {
        id: '8',
        companyName: 'Bodhtree Cons',
        symbol: 'BODHTREE',
        badge: 'Board Meetings',
        ltp: 29.01,
        percentChange: 3.50,
        announcementDate: '03/01/2026',
        exDate: '',
        purpose: 'Others',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Others' },
            { date: '28 Nov, 2025', remarks: 'Quarterly Results' },
            { date: '15 Oct, 2025', remarks: 'Others' },
            { date: '22 Sep, 2025', remarks: 'A.G.M.' },
        ],
    },
    {
        id: '9',
        companyName: 'LCC Infotech',
        symbol: 'LCCINFOTECH',
        badge: 'Board Meetings',
        ltp: 4.63,
        percentChange: 1.31,
        announcementDate: '03/01/2026',
        exDate: '',
        purpose: 'Preferential issue of shares',
        historicalData: [
            { date: '03 Jan, 2026', remarks: 'Preferential issue of shares' },
            { date: '10 Dec, 2025', remarks: 'Quarterly Results' },
            { date: '18 Nov, 2025', remarks: 'Others' },
        ],
    },
    {
        id: '10',
        companyName: 'Tata Steel',
        symbol: 'TATASTEEL',
        badge: 'Dividends',
        ltp: 142.50,
        percentChange: 2.15,
        dividendAmount: 3.50,
        announcementDate: '20/12/2025',
        exDate: '10/01/2026',
        purpose: 'Interim Dividend',
        historicalData: [
            { date: '10 Jan, 2026', remarks: 'Interim Dividend - Rs 3.50' },
            { date: '15 Nov, 2025', remarks: 'Quarterly Results' },
            { date: '20 Aug, 2025', remarks: 'Final Dividend' },
        ],
    },
    {
        id: '11',
        companyName: 'Infosys',
        symbol: 'INFY',
        badge: 'Bonus',
        ltp: 1850.25,
        percentChange: -0.45,
        announcementDate: '18/12/2025',
        exDate: '15/01/2026',
        purpose: 'Bonus Issue 1:1',
        historicalData: [
            { date: '15 Jan, 2026', remarks: 'Bonus Issue 1:1' },
            { date: '10 Nov, 2025', remarks: 'Quarterly Results' },
            { date: '25 Sep, 2025', remarks: 'A.G.M.' },
        ],
    },
    {
        id: '12',
        companyName: 'HDFC Bank',
        symbol: 'HDFCBANK',
        badge: 'Splits',
        ltp: 1720.80,
        percentChange: 1.85,
        announcementDate: '22/12/2025',
        exDate: '20/01/2026',
        purpose: 'Stock Split 1:2',
        historicalData: [
            { date: '20 Jan, 2026', remarks: 'Stock Split 1:2' },
            { date: '05 Dec, 2025', remarks: 'Quarterly Results' },
            { date: '10 Oct, 2025', remarks: 'Others' },
        ],
    },
];

export const filterTabs = [
    'All',
    'Announcements',
    'Board Meetings',
    'Bonus',
    'Dividends',
    'Splits',
    'AGM/EGM',
    'Rights',
];

export const purposeOptions = [
    'All Purposes',
    'Quarterly Results',
    'Dividend',
    'Bonus',
    'Stock Split',
    'Rights Issue',
    'AGM',
    'EGM',
    'Others',
];
