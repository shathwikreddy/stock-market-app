// Results Calendar Mock Data

export interface EarningsData {
  id: string;
  date: string;
  stockName: string;
  resultType: string;
  ltp: number;
  change: number;
  tentativeTime: string;
}

export interface CorporateActionData {
  id: string;
  stockName: string;
  eventType: 'AGM-EGM' | 'Board Meeting' | 'Announcement' | 'Dividends' | 'Bonus' | 'Rights' | 'Splits';
  announcedDate: string;
  exDate: string;
  dividend: string | null;
  ratio: string | null;
}

export interface IPOData {
  id: string;
  equity: string;
  category: 'upcoming' | 'recently-listed' | 'nfos' | 'draft-issues';
  dateOfFiling: string;
  issueSize?: string;
  priceRange?: string;
  status?: string;
}

export const earningsData: EarningsData[] = [
  { id: 'e1', date: '7 Jan', stockName: 'Premier Energy and Infrastructure', resultType: 'Q3-2025', ltp: 12.10, change: 4.76, tentativeTime: 'Time Not Available' },
  { id: 'e2', date: '7 Jan', stockName: 'Galaxy Agrico Exports', resultType: 'Q3-2025', ltp: 55.89, change: -0.29, tentativeTime: 'Time Not Available' },
  { id: 'e3', date: '7 Jan', stockName: 'Reliance Industries', resultType: 'Q3-2025', ltp: 2456.50, change: 1.25, tentativeTime: '4:00 PM' },
  { id: 'e4', date: '7 Jan', stockName: 'Tata Consultancy Services', resultType: 'Q3-2025', ltp: 3850.75, change: 0.85, tentativeTime: '5:30 PM' },
  { id: 'e5', date: '8 Jan', stockName: 'HDFC Bank', resultType: 'Q3-2025', ltp: 1678.30, change: -0.45, tentativeTime: '3:00 PM' },
  { id: 'e6', date: '8 Jan', stockName: 'Infosys', resultType: 'Q3-2025', ltp: 1542.60, change: 2.10, tentativeTime: '4:30 PM' },
  { id: 'e7', date: '9 Jan', stockName: 'ICICI Bank', resultType: 'Q3-2025', ltp: 1089.25, change: 0.32, tentativeTime: 'Time Not Available' },
  { id: 'e8', date: '9 Jan', stockName: 'Bharti Airtel', resultType: 'Q3-2025', ltp: 1245.80, change: -1.15, tentativeTime: '6:00 PM' },
  { id: 'e9', date: '6 Jan', stockName: 'Wipro', resultType: 'Q3-2025', ltp: 456.30, change: 0.75, tentativeTime: '5:00 PM' },
  { id: 'e10', date: '6 Jan', stockName: 'HCL Technologies', resultType: 'Q3-2025', ltp: 1678.45, change: 1.85, tentativeTime: '4:00 PM' },
];

export const corporateActionsData: CorporateActionData[] = [
  { id: 'c1', stockName: 'Cummins', eventType: 'AGM-EGM', announcedDate: '05/12/2025', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c2', stockName: 'Senores Pharm', eventType: 'Board Meeting', announcedDate: '07/01/2026', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c3', stockName: 'Ravindra Energ', eventType: 'AGM-EGM', announcedDate: '08/12/2025', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c4', stockName: 'KCP', eventType: 'AGM-EGM', announcedDate: '04/12/2025', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c5', stockName: 'Asian Energy', eventType: 'AGM-EGM', announcedDate: '03/12/2025', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c6', stockName: 'ILandFS Engg', eventType: 'AGM-EGM', announcedDate: '02/12/2025', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c7', stockName: 'Sheetal Cool Pr', eventType: 'Board Meeting', announcedDate: '07/01/2026', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c8', stockName: 'Pioneer', eventType: 'AGM-EGM', announcedDate: '01/12/2025', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c9', stockName: 'Kalyan Jeweller', eventType: 'Announcement', announcedDate: '07/01/2026', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c10', stockName: 'Honeywell Autom', eventType: 'Announcement', announcedDate: '07/01/2026', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c11', stockName: 'V2 Retail', eventType: 'Announcement', announcedDate: '07/01/2026', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c12', stockName: 'Welspun Corp', eventType: 'Announcement', announcedDate: '07/01/2026', exDate: '07/01/2026', dividend: null, ratio: null },
  { id: 'c13', stockName: 'Tata Steel', eventType: 'Dividends', announcedDate: '15/12/2025', exDate: '10/01/2026', dividend: '3.50', ratio: null },
  { id: 'c14', stockName: 'Infosys', eventType: 'Dividends', announcedDate: '20/12/2025', exDate: '15/01/2026', dividend: '18.00', ratio: null },
  { id: 'c15', stockName: 'Reliance', eventType: 'Bonus', announcedDate: '01/12/2025', exDate: '20/01/2026', dividend: null, ratio: '1:1' },
  { id: 'c16', stockName: 'HDFC Bank', eventType: 'Rights', announcedDate: '10/12/2025', exDate: '25/01/2026', dividend: null, ratio: '1:5' },
  { id: 'c17', stockName: 'Wipro', eventType: 'Splits', announcedDate: '05/12/2025', exDate: '30/01/2026', dividend: null, ratio: '1:2' },
];

export const ipoData: IPOData[] = [
  // Draft Issues
  { id: 'i1', equity: 'Horizon Industrial Parks Limited(DRHP)', category: 'draft-issues', dateOfFiling: '05-Jan-2026' },
  { id: 'i2', equity: 'Deepa Jewellers Limited(DRHP)', category: 'draft-issues', dateOfFiling: '02-Jan-2026' },
  { id: 'i3', equity: 'Mehta Hitech Industries Limited(DRHP)', category: 'draft-issues', dateOfFiling: '02-Jan-2026' },
  { id: 'i4', equity: 'Travelstack Tech Limited(DRHP)', category: 'draft-issues', dateOfFiling: '02-Jan-2026' },
  { id: 'i5', equity: 'Krishna Buildspace Limited(DRHP)', category: 'draft-issues', dateOfFiling: '02-Jan-2026' },
  { id: 'i6', equity: 'Neolite ZKW lightings Limited(DRHP)', category: 'draft-issues', dateOfFiling: '02-Jan-2026' },
  { id: 'i7', equity: 'Casagrand Premier Builder Limited(DRHP)', category: 'draft-issues', dateOfFiling: '31-Dec-2025' },
  { id: 'i8', equity: 'Tonbo Imaging India Limited(DRHP)', category: 'draft-issues', dateOfFiling: '30-Dec-2025' },
  { id: 'i9', equity: 'WOG Technologies Limited(DRHP)', category: 'draft-issues', dateOfFiling: '29-Dec-2025' },
  { id: 'i10', equity: 'Yatayat Corporation India Limited(DRHP)', category: 'draft-issues', dateOfFiling: '29-Dec-2025' },
  // Upcoming/Ongoing Issues
  { id: 'i11', equity: 'Stallion India Fluorochemicals Ltd', category: 'upcoming', dateOfFiling: '16-Jan-2026', issueSize: '₹199.45 Cr', priceRange: '₹85-90' },
  { id: 'i12', equity: 'Indo Farm Equipment Ltd', category: 'upcoming', dateOfFiling: '15-Jan-2026', issueSize: '₹244.68 Cr', priceRange: '₹204-215' },
  { id: 'i13', equity: 'Standard Glass Lining Tech Ltd', category: 'upcoming', dateOfFiling: '14-Jan-2026', issueSize: '₹410.05 Cr', priceRange: '₹133-140' },
  // Recently Listed
  { id: 'i14', equity: 'Mobikwik Systems Ltd', category: 'recently-listed', dateOfFiling: '18-Dec-2025', status: 'Listed at ₹442.25' },
  { id: 'i15', equity: 'Vishal Mega Mart Ltd', category: 'recently-listed', dateOfFiling: '13-Dec-2025', status: 'Listed at ₹110' },
  { id: 'i16', equity: 'Sai Life Sciences Ltd', category: 'recently-listed', dateOfFiling: '11-Dec-2025', status: 'Listed at ₹755' },
  // NFOs
  { id: 'i17', equity: 'ICICI Pru BSE Infra Index Fund', category: 'nfos', dateOfFiling: '10-Jan-2026' },
  { id: 'i18', equity: 'Nippon India Nifty 500 Equal Weight Index Fund', category: 'nfos', dateOfFiling: '08-Jan-2026' },
  { id: 'i19', equity: 'Aditya Birla SL Multi Sector Rotation Fund', category: 'nfos', dateOfFiling: '06-Jan-2026' },
];

export const dateFilters = ['Yesterday', 'Today', 'Tomorrow', 'This Week', 'Next Week'];
export const eventTypes = ['All', 'Dividends', 'Bonus', 'Rights', 'Splits'];
export const ipoTabs = ['Upcoming/Ongoing Issues', 'Recently Listed', 'NFOs', 'Draft Issues'];
