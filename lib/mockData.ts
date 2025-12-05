export interface Stock {
  sNo: number;
  company: string;
  sector: string;
  industry: string;
  group: string;
  priceBand: string;
  mktCapital: string;
  preClose: number;
  ltp: number;
  netChange: number;
  percentInChange: number;
}

export const topGainersData: Stock[] = [
  {
    sNo: 1,
    company: "Tata Consultancy Services",
    sector: "IT Services",
    industry: "Software Services",
    group: "A",
    priceBand: "₹3,100 - ₹3,600",
    mktCapital: "₹12,80,000 Cr",
    preClose: 3450.50,
    ltp: 3482.75,
    netChange: 32.25,
    percentInChange: 0.94
  },
  {
    sNo: 2,
    company: "Infosys Limited",
    sector: "IT Services",
    industry: "Software Services",
    group: "A",
    priceBand: "₹1,450 - ₹1,650",
    mktCapital: "₹6,50,000 Cr",
    preClose: 1560.00,
    ltp: 1575.20,
    netChange: 15.20,
    percentInChange: 0.97
  },
  {
    sNo: 3,
    company: "Reliance Industries Ltd.",
    sector: "Energy",
    industry: "Oil & Gas",
    group: "A",
    priceBand: "₹2,300 - ₹2,500",
    mktCapital: "₹16,50,000 Cr",
    preClose: 2425.00,
    ltp: 2440.00,
    netChange: 15.00,
    percentInChange: 0.62
  },
  {
    sNo: 4,
    company: "HDFC Bank Ltd.",
    sector: "Banking",
    industry: "Private Bank",
    group: "A",
    priceBand: "₹1,500 - ₹1,600",
    mktCapital: "₹9,00,000 Cr",
    preClose: 1565.30,
    ltp: 1578.40,
    netChange: 13.10,
    percentInChange: 0.84
  },
  {
    sNo: 5,
    company: "ITC Limited",
    sector: "FMCG",
    industry: "Tobacco & FMCG",
    group: "B",
    priceBand: "₹420 - ₹470",
    mktCapital: "₹5,60,000 Cr",
    preClose: 450.10,
    ltp: 455.25,
    netChange: 5.15,
    percentInChange: 1.14
  },
  {
    sNo: 6,
    company: "Bharti Airtel Ltd.",
    sector: "Telecom",
    industry: "Telecommunications",
    group: "A",
    priceBand: "₹1,100 - ₹1,200",
    mktCapital: "₹7,80,000 Cr",
    preClose: 1145.75,
    ltp: 1158.90,
    netChange: 13.15,
    percentInChange: 1.15
  },
  {
    sNo: 7,
    company: "Wipro Limited",
    sector: "IT Services",
    industry: "Software Services",
    group: "A",
    priceBand: "₹450 - ₹550",
    mktCapital: "₹2,45,000 Cr",
    preClose: 485.30,
    ltp: 490.75,
    netChange: 5.45,
    percentInChange: 1.12
  },
  {
    sNo: 8,
    company: "Adani Green Energy Ltd.",
    sector: "Power",
    industry: "Renewable Energy",
    group: "B",
    priceBand: "₹1,500 - ₹1,800",
    mktCapital: "₹2,90,000 Cr",
    preClose: 1625.00,
    ltp: 1642.50,
    netChange: 17.50,
    percentInChange: 1.08
  },
  {
    sNo: 9,
    company: "Maruti Suzuki India Ltd.",
    sector: "Automobile",
    industry: "Auto Manufacturers",
    group: "A",
    priceBand: "₹11,500 - ₹12,500",
    mktCapital: "₹3,60,000 Cr",
    preClose: 11875.00,
    ltp: 11998.75,
    netChange: 123.75,
    percentInChange: 1.04
  },
  {
    sNo: 10,
    company: "Tech Mahindra Ltd.",
    sector: "IT Services",
    industry: "Software Services",
    group: "A",
    priceBand: "₹1,200 - ₹1,350",
    mktCapital: "₹1,25,000 Cr",
    preClose: 1265.50,
    ltp: 1278.25,
    netChange: 12.75,
    percentInChange: 1.01
  },
];

export const topLosersData: Stock[] = [
  {
    sNo: 1,
    company: "Ecoboard Industries",
    sector: "Materials",
    industry: "Building Materials",
    group: "X",
    priceBand: "₹20 - ₹30",
    mktCapital: "₹150 Cr",
    preClose: 27.65,
    ltp: 22.12,
    netChange: -5.53,
    percentInChange: -20.00
  },
  {
    sNo: 2,
    company: "EP Biocomposites",
    sector: "Materials",
    industry: "Specialty Chemicals",
    group: "M",
    priceBand: "₹150 - ₹200",
    mktCapital: "₹850 Cr",
    preClose: 187.90,
    ltp: 150.35,
    netChange: -37.55,
    percentInChange: -19.98
  },
  {
    sNo: 3,
    company: "Loyal Textiles Mills",
    sector: "Textiles",
    industry: "Textile Manufacturing",
    group: "B",
    priceBand: "₹350 - ₹450",
    mktCapital: "₹2,100 Cr",
    preClose: 433.20,
    ltp: 360.05,
    netChange: -73.15,
    percentInChange: -16.89
  },
  {
    sNo: 4,
    company: "Paytm (One 97 Comm)",
    sector: "FinTech",
    industry: "Financial Services",
    group: "A",
    priceBand: "₹600 - ₹800",
    mktCapital: "₹45,000 Cr",
    preClose: 765.50,
    ltp: 645.20,
    netChange: -120.30,
    percentInChange: -15.71
  },
  {
    sNo: 5,
    company: "Zomato Limited",
    sector: "Consumer Services",
    industry: "Food Delivery",
    group: "A",
    priceBand: "₹180 - ₹250",
    mktCapital: "₹1,20,000 Cr",
    preClose: 225.80,
    ltp: 195.45,
    netChange: -30.35,
    percentInChange: -13.44
  },
];
