'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CustomEconomicEvent {
    id: string;
    date: string;
    time: string;
    currency: string;
    event: string;
    importance: number;
    actual: string;
    forecast: string;
    previous: string;
}

export interface CustomHoliday {
    id: string;
    date: string;
    country: string;
    exchange: string;
    holiday: string;
}

export interface CustomEarning {
    id: string;
    date: string;
    time: string;
    company: string;
    eps: string;
    epsForecast: string;
    revenue: string;
    revenueForecast: string;
    marketCap: string;
}

export interface CustomDividend {
    id: string;
    date: string;
    company: string;
    exDivDate: string;
    dividend: string;
    type: string;
    paymentDate: string;
    yield: string;
}

export interface CustomSplit {
    id: string;
    date: string;
    company: string;
    ratio: string;
    exDate?: string;
}

export interface CustomIPO {
    id: string;
    date: string;
    company: string;
    exchange: string;
    ipoValue: string;
    price: string;
    last: string;
}

export interface CustomExpiration {
    id: string;
    instrument: string;
    contract: string;
    month: string;
    settlement: string;
    rollover: string;
}

export interface CustomCalendarData {
    economic: CustomEconomicEvent[];
    holidays: CustomHoliday[];
    earnings: CustomEarning[];
    dividends: CustomDividend[];
    splits: CustomSplit[];
    ipo: CustomIPO[];
    expiration: CustomExpiration[];
}

const STORAGE_KEY = 'custom-calendar-data';

const initialData: CustomCalendarData = {
    economic: [],
    holidays: [],
    earnings: [],
    dividends: [],
    splits: [],
    ipo: [],
    expiration: [],
};

export function useCalendarData() {
    const [customData, setCustomData] = useState<CustomCalendarData>(initialData);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setCustomData(JSON.parse(stored));
            } catch {
                setCustomData(initialData);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));
        }
    }, [customData, isLoaded]);

    const addEconomicEvent = useCallback((event: Omit<CustomEconomicEvent, 'id'>) => {
        const newEvent = { ...event, id: `custom-eco-${Date.now()}` };
        setCustomData(prev => ({ ...prev, economic: [...prev.economic, newEvent] }));
    }, []);

    const deleteEconomicEvent = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, economic: prev.economic.filter(e => e.id !== id) }));
    }, []);

    const addHoliday = useCallback((holiday: Omit<CustomHoliday, 'id'>) => {
        const newHoliday = { ...holiday, id: `custom-hol-${Date.now()}` };
        setCustomData(prev => ({ ...prev, holidays: [...prev.holidays, newHoliday] }));
    }, []);

    const deleteHoliday = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, holidays: prev.holidays.filter(h => h.id !== id) }));
    }, []);

    const addEarning = useCallback((earning: Omit<CustomEarning, 'id'>) => {
        const newEarning = { ...earning, id: `custom-ear-${Date.now()}` };
        setCustomData(prev => ({ ...prev, earnings: [...prev.earnings, newEarning] }));
    }, []);

    const deleteEarning = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, earnings: prev.earnings.filter(e => e.id !== id) }));
    }, []);

    const addDividend = useCallback((dividend: Omit<CustomDividend, 'id'>) => {
        const newDividend = { ...dividend, id: `custom-div-${Date.now()}` };
        setCustomData(prev => ({ ...prev, dividends: [...prev.dividends, newDividend] }));
    }, []);

    const deleteDividend = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, dividends: prev.dividends.filter(d => d.id !== id) }));
    }, []);

    const addSplit = useCallback((split: Omit<CustomSplit, 'id'>) => {
        const newSplit = { ...split, id: `custom-spl-${Date.now()}` };
        setCustomData(prev => ({ ...prev, splits: [...prev.splits, newSplit] }));
    }, []);

    const deleteSplit = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, splits: prev.splits.filter(s => s.id !== id) }));
    }, []);

    const addIPO = useCallback((ipo: Omit<CustomIPO, 'id'>) => {
        const newIPO = { ...ipo, id: `custom-ipo-${Date.now()}` };
        setCustomData(prev => ({ ...prev, ipo: [...prev.ipo, newIPO] }));
    }, []);

    const deleteIPO = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, ipo: prev.ipo.filter(i => i.id !== id) }));
    }, []);

    const addExpiration = useCallback((expiration: Omit<CustomExpiration, 'id'>) => {
        const newExpiration = { ...expiration, id: `custom-exp-${Date.now()}` };
        setCustomData(prev => ({ ...prev, expiration: [...prev.expiration, newExpiration] }));
    }, []);

    const deleteExpiration = useCallback((id: string) => {
        setCustomData(prev => ({ ...prev, expiration: prev.expiration.filter(e => e.id !== id) }));
    }, []);

    return {
        customData,
        isLoaded,
        addEconomicEvent,
        deleteEconomicEvent,
        addHoliday,
        deleteHoliday,
        addEarning,
        deleteEarning,
        addDividend,
        deleteDividend,
        addSplit,
        deleteSplit,
        addIPO,
        deleteIPO,
        addExpiration,
        deleteExpiration,
    };
}
