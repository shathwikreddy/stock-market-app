'use client';

export interface FiiDiiDailyData {
    date: string;
    fiiGrossPurchase: number;
    fiiGrossSales: number;
    fiiNetPurchaseSales: number;
    diiGrossPurchase: number;
    diiGrossSales: number;
    diiNetPurchaseSales: number;
}

export interface FiiDiiMonthlyData {
    month: string;
    year: number;
    fiiGrossPurchase: number;
    fiiGrossSales: number;
    fiiNetPurchaseSales: number;
    diiGrossPurchase: number;
    diiGrossSales: number;
    diiNetPurchaseSales: number;
}

export const currentMonthData: FiiDiiDailyData[] = [
    {
        date: 'Month till date',
        fiiGrossPurchase: 8918.09,
        fiiGrossSales: 11896.89,
        fiiNetPurchaseSales: -2978.80,
        diiGrossPurchase: 28394.87,
        diiGrossSales: 26191.60,
        diiNetPurchaseSales: 2203.27,
    },
    {
        date: '02-Jan-2026',
        fiiGrossPurchase: 7850.45,
        fiiGrossSales: 7560.65,
        fiiNetPurchaseSales: 289.80,
        diiGrossPurchase: 15349.56,
        diiGrossSales: 14672.18,
        diiNetPurchaseSales: 677.38,
    },
    {
        date: '01-Jan-2026',
        fiiGrossPurchase: 1067.64,
        fiiGrossSales: 4336.24,
        fiiNetPurchaseSales: -3268.60,
        diiGrossPurchase: 13045.31,
        diiGrossSales: 11519.42,
        diiNetPurchaseSales: 1525.89,
    },
];

export const previousMonthsData: FiiDiiMonthlyData[] = [
    {
        month: 'December',
        year: 2025,
        fiiGrossPurchase: 249054.90,
        fiiGrossSales: 283404.52,
        fiiNetPurchaseSales: -34349.62,
        diiGrossPurchase: 356905.61,
        diiGrossSales: 277285.70,
        diiNetPurchaseSales: 79619.91,
    },
    {
        month: 'November',
        year: 2025,
        fiiGrossPurchase: 307573.59,
        fiiGrossSales: 325073.90,
        fiiNetPurchaseSales: -17500.31,
        diiGrossPurchase: 318136.71,
        diiGrossSales: 241052.93,
        diiNetPurchaseSales: 77083.78,
    },
    {
        month: 'October',
        year: 2025,
        fiiGrossPurchase: 261117.36,
        fiiGrossSales: 263464.25,
        fiiNetPurchaseSales: -2346.89,
        diiGrossPurchase: 314238.53,
        diiGrossSales: 261444.51,
        diiNetPurchaseSales: 52794.02,
    },
    {
        month: 'September',
        year: 2025,
        fiiGrossPurchase: 278843.46,
        fiiGrossSales: 314144.82,
        fiiNetPurchaseSales: -35301.36,
        diiGrossPurchase: 326751.09,
        diiGrossSales: 261407.50,
        diiNetPurchaseSales: 65343.59,
    },
    {
        month: 'August',
        year: 2025,
        fiiGrossPurchase: 268077.36,
        fiiGrossSales: 314980.28,
        fiiNetPurchaseSales: -46902.92,
        diiGrossPurchase: 293563.09,
        diiGrossSales: 198734.54,
        diiNetPurchaseSales: 94828.55,
    },
    {
        month: 'July',
        year: 2025,
        fiiGrossPurchase: 284138.54,
        fiiGrossSales: 331805.22,
        fiiNetPurchaseSales: -47666.68,
        diiGrossPurchase: 321827.75,
        diiGrossSales: 260888.59,
        diiNetPurchaseSales: 60939.16,
    },
    {
        month: 'June',
        year: 2025,
        fiiGrossPurchase: 349580.23,
        fiiGrossSales: 342091.25,
        fiiNetPurchaseSales: 7488.98,
        diiGrossPurchase: 350402.34,
        diiGrossSales: 277728.43,
        diiNetPurchaseSales: 72673.91,
    },
    {
        month: 'May',
        year: 2025,
        fiiGrossPurchase: 312456.78,
        fiiGrossSales: 298123.45,
        fiiNetPurchaseSales: 14333.33,
        diiGrossPurchase: 298765.43,
        diiGrossSales: 245678.90,
        diiNetPurchaseSales: 53086.53,
    },
    {
        month: 'April',
        year: 2025,
        fiiGrossPurchase: 289345.67,
        fiiGrossSales: 312456.78,
        fiiNetPurchaseSales: -23111.11,
        diiGrossPurchase: 312345.67,
        diiGrossSales: 267890.12,
        diiNetPurchaseSales: 44455.55,
    },
    {
        month: 'March',
        year: 2025,
        fiiGrossPurchase: 278901.23,
        fiiGrossSales: 289012.34,
        fiiNetPurchaseSales: -10111.11,
        diiGrossPurchase: 289012.34,
        diiGrossSales: 234567.89,
        diiNetPurchaseSales: 54444.45,
    },
    {
        month: 'February',
        year: 2025,
        fiiGrossPurchase: 256789.01,
        fiiGrossSales: 278901.23,
        fiiNetPurchaseSales: -22112.22,
        diiGrossPurchase: 267890.12,
        diiGrossSales: 223456.78,
        diiNetPurchaseSales: 44433.34,
    },
    {
        month: 'January',
        year: 2025,
        fiiGrossPurchase: 234567.89,
        fiiGrossSales: 256789.01,
        fiiNetPurchaseSales: -22221.12,
        diiGrossPurchase: 256789.01,
        diiGrossSales: 212345.67,
        diiNetPurchaseSales: 44443.34,
    },
];

export const foData: FiiDiiDailyData[] = [
    {
        date: 'Month till date',
        fiiGrossPurchase: 125678.45,
        fiiGrossSales: 138956.78,
        fiiNetPurchaseSales: -13278.33,
        diiGrossPurchase: 45678.90,
        diiGrossSales: 42345.67,
        diiNetPurchaseSales: 3333.23,
    },
    {
        date: '02-Jan-2026',
        fiiGrossPurchase: 78945.23,
        fiiGrossSales: 72345.67,
        fiiNetPurchaseSales: 6599.56,
        diiGrossPurchase: 23456.78,
        diiGrossSales: 21234.56,
        diiNetPurchaseSales: 2222.22,
    },
    {
        date: '01-Jan-2026',
        fiiGrossPurchase: 46733.22,
        fiiGrossSales: 66611.11,
        fiiNetPurchaseSales: -19877.89,
        diiGrossPurchase: 22222.12,
        diiGrossSales: 21111.11,
        diiNetPurchaseSales: 1111.01,
    },
];

export const mfSebiData: FiiDiiDailyData[] = [
    {
        date: 'Month till date',
        fiiGrossPurchase: 45678.90,
        fiiGrossSales: 42345.67,
        fiiNetPurchaseSales: 3333.23,
        diiGrossPurchase: 78945.23,
        diiGrossSales: 72345.67,
        diiNetPurchaseSales: 6599.56,
    },
    {
        date: '02-Jan-2026',
        fiiGrossPurchase: 23456.78,
        fiiGrossSales: 21234.56,
        fiiNetPurchaseSales: 2222.22,
        diiGrossPurchase: 45678.90,
        diiGrossSales: 42345.67,
        diiNetPurchaseSales: 3333.23,
    },
];

export const fiiSebiData: FiiDiiDailyData[] = [
    {
        date: 'Month till date',
        fiiGrossPurchase: 56789.01,
        fiiGrossSales: 62345.67,
        fiiNetPurchaseSales: -5556.66,
        diiGrossPurchase: 34567.89,
        diiGrossSales: 31234.56,
        diiNetPurchaseSales: 3333.33,
    },
    {
        date: '02-Jan-2026',
        fiiGrossPurchase: 34567.89,
        fiiGrossSales: 31234.56,
        fiiNetPurchaseSales: 3333.33,
        diiGrossPurchase: 23456.78,
        diiGrossSales: 21234.56,
        diiNetPurchaseSales: 2222.22,
    },
];
