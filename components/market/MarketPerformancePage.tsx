'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, RefreshCw, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarDays } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';
import FilterPanel, {
  type AddColumnGroupOption,
  type AddColumnSelection,
  type FilterState,
  type FilterOptions,
  emptyFilters,
  emptyFilterOptions,
} from '@/components/FilterPanel';

// Time period tabs
type TimePeriod = 'intraday' | 'days' | 'weeks' | 'months' | 'years' | 'customize';
type SubTab = 'custom' | 'seasonality' | 'ytd' | '52weeks' | 'all_time';
type Exchange = 'NSE' | 'BSE' | 'Both' | 'Only NSE' | 'Only BSE';
type ViewType = 'all' | 'gainers' | 'losers' | 'unchanged';

const PAGE_SIZE = 200;

// Column definitions for each type
const columnsByPeriod: Record<TimePeriod | SubTab, string[]> = {
  intraday: ['% 5Min Chag', '% 15Min Chag', '% 30Min Chag', '% 1Hour Chag', '% 2Hours Chag', '% Cust Date Chag'],
  days: ['% Chag', '% 2D Chag', '% 3D Chag', '% 4D Chag', '% 5D Chag', '% 1W Chag', '% Cust Date Chag'],
  weeks: ['% 1W Chag', '% 2W Chag', '% 3W Chag', '% 4W Chag', '% 5W Chag', '% 1M Chag', '% Cust Date Chag'],
  months: ['% 1M Chag', '% 2M Chag', '% 3M Chag', '% 4M Chag', '% 5M Chag', '% 6M Chag', '% 7M Chag', '% 8M Chag', '% 9M Chag', '% 10M Chag', '% 11M Chag', '% 1Y Chag'],
  years: ['% 1Y Chag', '% 2Y Chag', '% 3Y Chag', '% 4Y Chag', '% 5Y Chag', '% 10Y Chag', '% Max Chag'],
  customize: [],
  custom: ['% Cust Date Chag', '% Chag'],
  seasonality: ['% Chag', '% Cust Date Chag'],
  ytd: ['% YTD Chag', '% 2YTD Chag', '% 3YTD Chag', '% 4YTD Chag', '% 5YTD Chag', '% 10 YTD Chag', '% Cust Date Chag'],
  '52weeks': ['% 52W Chag', '% Cust Date Chag'],
  all_time: ['% ATH&L Chag', '% Cust Date Chag'],
};

const baseColumns = ['S No', 'Company Name', 'Sector', 'Industry', 'Group', 'F V', 'P Band', 'M Cap', 'Pre Close', 'CMP', 'Net Chag'];
const TOGGLEABLE_COLUMNS = ['Sector', 'Industry', 'Group', 'F V', 'P Band', 'M Cap', 'Pre Close'];

const ADD_TIMEFRAMES = [
  { id: 'tf-1sec', label: '1 Second', changeLabel: 'Change' },
  { id: 'tf-5sec', label: '5 Seconds', changeLabel: 'Change' },
  { id: 'tf-10sec', label: '10 Seconds', changeLabel: 'Change' },
  { id: 'tf-15sec', label: '15 Seconds', changeLabel: 'Change' },
  { id: 'tf-30sec', label: '30 Seconds', changeLabel: 'Change' },
  { id: 'tf-1min', label: 'TF 1min', changeLabel: 'Change' },
  { id: 'tf-2min', label: 'TF 2min', changeLabel: 'Change' },
  { id: 'tf-3min', label: 'TF 3min', changeLabel: 'Change' },
  { id: 'tf-5min', label: 'TF 5min', changeLabel: 'Change' },
  { id: 'tf-8min', label: 'TF 8min', changeLabel: 'Change' },
  { id: 'tf-10min', label: 'TF 10min', changeLabel: 'Change' },
  { id: 'tf-15min', label: 'TF 15min', changeLabel: 'Change' },
  { id: 'tf-20min', label: 'TF 20min', changeLabel: 'Change' },
  { id: 'tf-30min', label: 'TF 30min', changeLabel: 'Change' },
  { id: 'tf-45min', label: 'TF 45min', changeLabel: 'Change' },
  { id: 'tf-1hour', label: 'TF 1hour', changeLabel: 'Change' },
  { id: 'tf-90min', label: 'TF 90min', changeLabel: 'Change' },
  { id: 'tf-2hour', label: 'TF 2hour', changeLabel: 'Change' },
  { id: 'tf-3hour', label: 'TF 3hour', changeLabel: 'Change' },
  { id: 'tf-4hour', label: 'TF 4hour', changeLabel: 'Change' },
  { id: 'tf-6hour', label: 'TF 6hour', changeLabel: 'Change' },
  { id: 'tf-8hour', label: 'TF 8hour', changeLabel: 'Change' },
  { id: 'tf-12hour', label: 'TF 12hour', changeLabel: 'Change' },
  { id: 'tf-1day', label: 'TF 1day', changeLabel: 'Change' },
  { id: 'tf-2day', label: 'TF 2day', changeLabel: 'Change' },
  { id: 'tf-3day', label: 'TF 3day', changeLabel: 'Change' },
  { id: 'tf-5day', label: 'TF 5day', changeLabel: 'Change' },
  { id: 'tf-1week', label: 'TF 1week', changeLabel: 'Change' },
  { id: 'tf-2week', label: 'TF 2week', changeLabel: 'Change' },
  { id: 'tf-3week', label: 'TF 3week', changeLabel: 'Change' },
  { id: 'tf-1month', label: 'TF 1month', changeLabel: 'Change' },
  { id: 'tf-2month', label: 'TF 2month', changeLabel: 'Change' },
  { id: 'tf-3month', label: 'TF 3month', changeLabel: 'Change' },
  { id: 'tf-6month', label: 'TF 6month', changeLabel: 'Change' },
  { id: 'tf-ytd', label: 'Year to Date', changeLabel: 'Change' },
  { id: 'tf-1year', label: 'TF 1year', changeLabel: 'Change' },
  { id: 'tf-2year', label: 'TF 2year', changeLabel: 'Change' },
  { id: 'tf-5year', label: 'TF 5year', changeLabel: 'Change' },
  { id: 'tf-max', label: 'Maximum', changeLabel: 'Change' },
] as const;

const ADD_COLUMN_GROUPS: AddColumnGroupOption[] = [
  {
    id: 'candlesticks',
    label: 'Candlesticks',
    items: [
      { id: 'abandoned-baby-bearish', label: 'Abandoned Baby Bearish' },
      { id: 'abandoned-baby-bullish', label: 'Abandoned Baby Bullish' },
      { id: 'advance-block', label: 'Advance Block' },
      { id: 'bearish-belt-hold', label: 'Bearish Belt Hold' },
      { id: 'bearish-breakaway', label: 'Bearish Breakaway' },
      { id: 'bearish-counterattack', label: 'Bearish Counterattack' },
      { id: 'bullish-engulfing', label: 'Bullish Engulfing' },
      { id: 'bearish-engulfing', label: 'Bearish Engulfing' },
      { id: 'bearish-harami', label: 'Bearish Harami' },
      { id: 'bearish-harami-cross', label: 'Bearish Harami Cross' },
      { id: 'bearish-kicking', label: 'Bearish Kicking' },
      { id: 'bearish-long-line', label: 'Bearish Long Line' },
      { id: 'bearish-marubozu', label: 'Bearish Marubozu' },
      { id: 'bearish-meeting-lines', label: 'Bearish Meeting Lines' },
      { id: 'bearish-separating-lines', label: 'Bearish Separating Lines' },
      { id: 'bearish-short-line', label: 'Bearish Short Line' },
      { id: 'bullish-belt-hold', label: 'Bullish Belt Hold' },
      { id: 'bullish-breakaway', label: 'Bullish Breakaway' },
      { id: 'bullish-counterattack', label: 'Bullish Counterattack' },
      { id: 'bullish-harami', label: 'Bullish Harami' },
      { id: 'bullish-harami-cross', label: 'Bullish Harami Cross' },
      { id: 'bullish-kicking', label: 'Bullish Kicking' },
      { id: 'bullish-long-line', label: 'Bullish Long Line' },
      { id: 'bullish-marubozu', label: 'Bullish Marubozu' },
      { id: 'bullish-meeting-lines', label: 'Bullish Meeting Lines' },
      { id: 'bullish-separating-lines', label: 'Bullish Separating Lines' },
      { id: 'bullish-short-line', label: 'Bullish Short Line' },
      { id: 'closing-marubozu-bearish', label: 'Closing Marubozu Bearish' },
      { id: 'closing-marubozu-bullish', label: 'Closing Marubozu Bullish' },
      { id: 'concealing-baby-swallow', label: 'Concealing Baby Swallow' },
      { id: 'dark-cloud-cover', label: 'Dark Cloud Cover' },
      { id: 'doji', label: 'Doji' },
      { id: 'doji-star-bearish', label: 'Doji Star Bearish' },
      { id: 'doji-star-bullish', label: 'Doji Star Bullish' },
      { id: 'downside-gap-three-methods', label: 'Downside Gap Three Methods' },
      { id: 'downside-tasuki-gap', label: 'Downside Tasuki Gap' },
      { id: 'dragonfly-doji', label: 'Dragonfly Doji' },
      { id: 'engulfing-bearish', label: 'Engulfing Bearish' },
      { id: 'engulfing-bullish', label: 'Engulfing Bullish' },
      { id: 'evening-doji-star', label: 'Evening Doji Star' },
      { id: 'evening-star', label: 'Evening Star' },
      { id: 'falling-three-methods', label: 'Falling Three Methods' },
      { id: 'four-price-doji', label: 'Four Price Doji' },
      { id: 'gravestone-doji', label: 'Gravestone Doji' },
      { id: 'hammer', label: 'Hammer' },
      { id: 'hanging-man', label: 'Hanging Man' },
      { id: 'high-wave', label: 'High Wave' },
      { id: 'hikkake-bearish', label: 'Hikkake Bearish' },
      { id: 'hikkake-bullish', label: 'Hikkake Bullish' },
      { id: 'homing-pigeon', label: 'Homing Pigeon' },
      { id: 'identical-three-crows', label: 'Identical Three Crows' },
      { id: 'in-neck', label: 'In-Neck' },
      { id: 'inverted-hammer', label: 'Inverted Hammer' },
      { id: 'ladder-bottom', label: 'Ladder Bottom' },
      { id: 'long-legged-doji', label: 'Long-Legged Doji' },
      { id: 'marubozu', label: 'Marubozu' },
      { id: 'matching-low', label: 'Matching Low' },
      { id: 'mat-hold', label: 'Mat Hold' },
      { id: 'morning-star', label: 'Morning Star' },
      { id: 'morning-doji-star', label: 'Morning Doji Star' },
      { id: 'on-neck', label: 'On-Neck' },
      { id: 'piercing-line', label: 'Piercing Line' },
      { id: 'rickshaw-man', label: 'Rickshaw Man' },
      { id: 'rising-three-methods', label: 'Rising Three Methods' },
      { id: 'shooting-star', label: 'Shooting Star' },
      { id: 'spinning-top', label: 'Spinning Top' },
      { id: 'stalled-pattern', label: 'Stalled Pattern' },
      { id: 'stick-sandwich', label: 'Stick Sandwich' },
      { id: 'takuri', label: 'Takuri' },
      { id: 'tasuki-gap-bearish', label: 'Tasuki Gap Bearish' },
      { id: 'tasuki-gap-bullish', label: 'Tasuki Gap Bullish' },
      { id: 'three-black-crows', label: 'Three Black Crows' },
      { id: 'three-inside-down', label: 'Three Inside Down' },
      { id: 'three-inside-up', label: 'Three Inside Up' },
      { id: 'three-line-strike-bearish', label: 'Three Line Strike Bearish' },
      { id: 'three-line-strike-bullish', label: 'Three Line Strike Bullish' },
      { id: 'three-outside-down', label: 'Three Outside Down' },
      { id: 'three-outside-up', label: 'Three Outside Up' },
      { id: 'three-stars-in-the-south', label: 'Three Stars in the South' },
      { id: 'three-white-soldiers', label: 'Three White Soldiers' },
      { id: 'thrusting', label: 'Thrusting' },
      { id: 'tri-star-bearish', label: 'Tri-Star Bearish' },
      { id: 'tri-star-bullish', label: 'Tri-Star Bullish' },
      { id: 'tweezer-bottom', label: 'Tweezer Bottom' },
      { id: 'tweezer-top', label: 'Tweezer Top' },
      { id: 'unique-three-river-bottom', label: 'Unique Three River Bottom' },
      { id: 'upside-gap-three-methods', label: 'Upside Gap Three Methods' },
      { id: 'upside-gap-two-crows', label: 'Upside Gap Two Crows' },
      { id: 'upside-tasuki-gap', label: 'Upside Tasuki Gap' },
    ],
  },
  {
    id: 'indicators',
    label: 'Indicators',
    items: [
      { id: 'sma-5', label: 'SMA 5' },
      { id: 'sma-10', label: 'SMA 10' },
      { id: 'sma-20', label: 'SMA 20' },
      { id: 'sma-50', label: 'SMA 50' },
      { id: 'sma-100', label: 'SMA 100' },
      { id: 'sma-200', label: 'SMA 200' },
      { id: 'ema-5', label: 'EMA 5' },
      { id: 'ema-9', label: 'EMA 9' },
      { id: 'ema-10', label: 'EMA 10' },
      { id: 'ema-20', label: 'EMA 20' },
      { id: 'ema-50', label: 'EMA 50' },
      { id: 'ema-100', label: 'EMA 100' },
      { id: 'ema-200', label: 'EMA 200' },
      { id: 'wma', label: 'WMA' },
      { id: 'hma', label: 'HMA' },
      { id: 'vwma', label: 'VWMA' },
      { id: 'dema', label: 'DEMA' },
      { id: 'tema', label: 'TEMA' },
      { id: 'kama', label: 'KAMA' },
      { id: 'alma', label: 'ALMA' },
      { id: 't3-ma', label: 'T3 Moving Average' },
      { id: 'lsma', label: 'Least Squares MA' },
      { id: 'moving-average-ribbon', label: 'Moving Average Ribbon' },
      { id: 'golden-cross', label: 'Golden Cross' },
      { id: 'death-cross', label: 'Death Cross' },
      { id: 'rsi', label: 'RSI' },
      { id: 'rsi-7', label: 'RSI 7' },
      { id: 'rsi-14', label: 'RSI 14' },
      { id: 'rsi-21', label: 'RSI 21' },
      { id: 'connors-rsi', label: 'Connors RSI' },
      { id: 'stochastic-rsi', label: 'Stochastic RSI' },
      { id: 'macd', label: 'MACD' },
      { id: 'macd-crossover', label: 'MACD Crossover' },
      { id: 'macd-histogram', label: 'MACD Histogram' },
      { id: 'ppo', label: 'PPO' },
      { id: 'apo', label: 'APO' },
      { id: 'stochastic', label: 'Stochastic' },
      { id: 'stochastic-fast', label: 'Stochastic Fast' },
      { id: 'stochastic-slow', label: 'Stochastic Slow' },
      { id: 'cci', label: 'CCI' },
      { id: 'williams-r', label: 'Williams %R' },
      { id: 'roc', label: 'ROC' },
      { id: 'momentum', label: 'Momentum' },
      { id: 'awesome-oscillator', label: 'Awesome Oscillator' },
      { id: 'tsi', label: 'True Strength Index' },
      { id: 'trix', label: 'TRIX' },
      { id: 'ultimate-oscillator', label: 'Ultimate Oscillator' },
      { id: 'coppock-curve', label: 'Coppock Curve' },
      { id: 'dpo', label: 'Detrended Price Oscillator' },
      { id: 'kst', label: 'Know Sure Thing' },
      { id: 'fisher-transform', label: 'Fisher Transform' },
      { id: 'chande-momentum-oscillator', label: 'Chande Momentum Oscillator' },
      { id: 'supertrend', label: 'Supertrend' },
      { id: 'supertrend-buy-sell', label: 'Supertrend Buy/Sell' },
      { id: 'adx', label: 'ADX' },
      { id: 'di-plus', label: 'DI+' },
      { id: 'di-minus', label: 'DI-' },
      { id: 'aroon', label: 'Aroon' },
      { id: 'aroon-oscillator', label: 'Aroon Oscillator' },
      { id: 'parabolic-sar', label: 'Parabolic SAR' },
      { id: 'ichimoku-cloud', label: 'Ichimoku Cloud' },
      { id: 'vortex-indicator', label: 'Vortex Indicator' },
      { id: 'mass-index', label: 'Mass Index' },
      { id: 'choppiness-index', label: 'Choppiness Index' },
      { id: 'trend-intensity-index', label: 'Trend Intensity Index' },
      { id: 'zig-zag', label: 'Zig Zag' },
      { id: 'atr', label: 'ATR' },
      { id: 'atr-trailing-stop', label: 'ATR Trailing Stop' },
      { id: 'bollinger-bands', label: 'Bollinger Bands' },
      { id: 'bollinger-bandwidth', label: 'Bollinger Bandwidth' },
      { id: 'bollinger-percent-b', label: 'Bollinger %B' },
      { id: 'bollinger-squeeze', label: 'Bollinger Squeeze' },
      { id: 'keltner-channel', label: 'Keltner Channel' },
      { id: 'donchian-channel', label: 'Donchian Channel' },
      { id: 'price-channel', label: 'Price Channel' },
      { id: 'standard-deviation', label: 'Standard Deviation' },
      { id: 'historical-volatility', label: 'Historical Volatility' },
      { id: 'chaikin-volatility', label: 'Chaikin Volatility' },
      { id: 'ulcer-index', label: 'Ulcer Index' },
      { id: 'vwap', label: 'VWAP' },
      { id: 'anchored-vwap', label: 'Anchored VWAP' },
      { id: 'vwap-cross', label: 'VWAP Cross' },
      { id: 'volume', label: 'Volume' },
      { id: 'volume-ma', label: 'Volume MA' },
      { id: 'volume-spike', label: 'Volume Spike' },
      { id: 'relative-volume', label: 'Relative Volume' },
      { id: 'obv', label: 'OBV' },
      { id: 'mfi', label: 'MFI' },
      { id: 'chaikin-money-flow', label: 'Chaikin Money Flow' },
      { id: 'accumulation-distribution', label: 'Accumulation/Distribution' },
      { id: 'force-index', label: 'Force Index' },
      { id: 'ease-of-movement', label: 'Ease of Movement' },
      { id: 'negative-volume-index', label: 'Negative Volume Index' },
      { id: 'positive-volume-index', label: 'Positive Volume Index' },
      { id: 'price-volume-trend', label: 'Price Volume Trend' },
      { id: 'volume-oscillator', label: 'Volume Oscillator' },
      { id: 'delivery-volume', label: 'Delivery Volume' },
      { id: 'pivot-points', label: 'Pivot Points' },
      { id: 'standard-pivots', label: 'Standard Pivots' },
      { id: 'fibonacci-pivots', label: 'Fibonacci Pivots' },
      { id: 'camarilla-pivots', label: 'Camarilla Pivots' },
      { id: 'woodie-pivots', label: 'Woodie Pivots' },
      { id: 'demark-pivots', label: 'DeMark Pivots' },
      { id: 'central-pivot-range', label: 'Central Pivot Range' },
      { id: 'support-resistance', label: 'Support/Resistance' },
      { id: 'fibonacci-retracement', label: 'Fibonacci Retracement' },
      { id: 'fibonacci-extension', label: 'Fibonacci Extension' },
      { id: 'gann-fan', label: 'Gann Fan' },
      { id: 'linear-regression-channel', label: 'Linear Regression Channel' },
      { id: 'envelopes', label: 'Envelopes' },
      { id: 'advance-decline-line', label: 'Advance/Decline Line' },
      { id: 'advance-decline-ratio', label: 'Advance/Decline Ratio' },
      { id: 'mcclellan-oscillator', label: 'McClellan Oscillator' },
      { id: 'mcclellan-summation-index', label: 'McClellan Summation Index' },
      { id: 'trin', label: 'TRIN' },
      { id: 'put-call-ratio', label: 'Put/Call Ratio' },
      { id: 'rsi-overbought', label: 'RSI Overbought' },
      { id: 'rsi-oversold', label: 'RSI Oversold' },
      { id: 'ma-crossover', label: 'MA Crossover' },
      { id: 'ema-crossover', label: 'EMA Crossover' },
      { id: 'price-above-sma-50', label: 'Price Above SMA 50' },
      { id: 'price-below-sma-50', label: 'Price Below SMA 50' },
      { id: 'price-above-sma-200', label: 'Price Above SMA 200' },
      { id: 'price-below-sma-200', label: 'Price Below SMA 200' },
      { id: 'high-low-index', label: 'High Low Index' },
      { id: 'new-high-new-low', label: 'New High/New Low' },
    ],
  },
  {
    id: 'chart-patterns',
    label: 'Chart Patterns',
    items: [
      { id: 'breakout', label: 'Breakout' },
      { id: 'breakdown', label: 'Breakdown' },
      { id: 'double-top', label: 'Double Top' },
      { id: 'double-bottom', label: 'Double Bottom' },
      { id: 'head-shoulders', label: 'Head & Shoulders' },
      { id: 'inverse-head-shoulders', label: 'Inverse H&S' },
      { id: 'triangle', label: 'Triangle' },
      { id: 'flag', label: 'Flag' },
      { id: 'ascending-triangle', label: 'Ascending Triangle' },
      { id: 'descending-triangle', label: 'Descending Triangle' },
      { id: 'symmetrical-triangle', label: 'Symmetrical Triangle' },
      { id: 'bull-flag', label: 'Bull Flag' },
      { id: 'bear-flag', label: 'Bear Flag' },
      { id: 'bull-pennant', label: 'Bull Pennant' },
      { id: 'bear-pennant', label: 'Bear Pennant' },
      { id: 'rising-wedge', label: 'Rising Wedge' },
      { id: 'falling-wedge', label: 'Falling Wedge' },
      { id: 'rectangle', label: 'Rectangle' },
      { id: 'bullish-rectangle', label: 'Bullish Rectangle' },
      { id: 'bearish-rectangle', label: 'Bearish Rectangle' },
      { id: 'triple-top', label: 'Triple Top' },
      { id: 'triple-bottom', label: 'Triple Bottom' },
      { id: 'rounding-top', label: 'Rounding Top' },
      { id: 'rounding-bottom', label: 'Rounding Bottom' },
      { id: 'cup-handle', label: 'Cup and Handle' },
      { id: 'inverse-cup-handle', label: 'Inverse Cup and Handle' },
      { id: 'diamond-top', label: 'Diamond Top' },
      { id: 'diamond-bottom', label: 'Diamond Bottom' },
      { id: 'broadening-formation', label: 'Broadening Formation' },
      { id: 'megaphone', label: 'Megaphone' },
      { id: 'v-top', label: 'V Top' },
      { id: 'v-bottom', label: 'V Bottom' },
      { id: 'island-reversal-bullish', label: 'Bullish Island Reversal' },
      { id: 'island-reversal-bearish', label: 'Bearish Island Reversal' },
      { id: 'gap-up', label: 'Gap Up' },
      { id: 'gap-down', label: 'Gap Down' },
      { id: 'runaway-gap', label: 'Runaway Gap' },
      { id: 'exhaustion-gap', label: 'Exhaustion Gap' },
      { id: 'support-breakout', label: 'Support Breakout' },
      { id: 'resistance-breakout', label: 'Resistance Breakout' },
      { id: 'channel-breakout', label: 'Channel Breakout' },
      { id: 'range-breakout', label: 'Range Breakout' },
      { id: 'trend-reversal', label: 'Trend Reversal' },
      { id: 'trend-continuation', label: 'Trend Continuation' },
      { id: 'higher-high-higher-low', label: 'Higher High / Higher Low' },
      { id: 'lower-high-lower-low', label: 'Lower High / Lower Low' },
    ],
  },
  {
    id: 'drawing-tools',
    label: 'Drawing Tools',
    items: [
      { id: 'trendline', label: 'Trendline' },
      { id: 'support', label: 'Support' },
      { id: 'resistance', label: 'Resistance' },
      { id: 'channel', label: 'Channel' },
      { id: 'fibonacci', label: 'Fibonacci' },
      { id: 'pivot-zone', label: 'Pivot Zone' },
      { id: 'horizontal-line', label: 'Horizontal Line' },
      { id: 'vertical-line', label: 'Vertical Line' },
      { id: 'ray', label: 'Ray' },
      { id: 'extended-line', label: 'Extended Line' },
      { id: 'trend-angle', label: 'Trend Angle' },
      { id: 'parallel-channel', label: 'Parallel Channel' },
      { id: 'regression-channel', label: 'Regression Channel' },
      { id: 'flat-top-bottom', label: 'Flat Top / Bottom' },
      { id: 'pitchfork', label: 'Andrews Pitchfork' },
      { id: 'schiff-pitchfork', label: 'Schiff Pitchfork' },
      { id: 'modified-schiff-pitchfork', label: 'Modified Schiff Pitchfork' },
      { id: 'fibonacci-retracement', label: 'Fibonacci Retracement' },
      { id: 'fibonacci-extension', label: 'Fibonacci Extension' },
      { id: 'fibonacci-fan', label: 'Fibonacci Fan' },
      { id: 'fibonacci-channel', label: 'Fibonacci Channel' },
      { id: 'fibonacci-time-zone', label: 'Fibonacci Time Zone' },
      { id: 'fibonacci-spiral', label: 'Fibonacci Spiral' },
      { id: 'gann-box', label: 'Gann Box' },
      { id: 'gann-fan', label: 'Gann Fan' },
      { id: 'gann-square', label: 'Gann Square' },
      { id: 'elliott-impulse-wave', label: 'Elliott Impulse Wave' },
      { id: 'elliott-correction-wave', label: 'Elliott Correction Wave' },
      { id: 'xabcd-pattern', label: 'XABCD Pattern' },
      { id: 'cypher-pattern', label: 'Cypher Pattern' },
      { id: 'head-shoulders-drawing', label: 'Head and Shoulders' },
      { id: 'triangle-drawing', label: 'Triangle' },
      { id: 'rectangle-drawing', label: 'Rectangle' },
      { id: 'ellipse', label: 'Ellipse' },
      { id: 'arc', label: 'Arc' },
      { id: 'curve', label: 'Curve' },
      { id: 'path', label: 'Path' },
      { id: 'brush', label: 'Brush' },
      { id: 'text-note', label: 'Text Note' },
      { id: 'price-label', label: 'Price Label' },
      { id: 'date-range', label: 'Date Range' },
      { id: 'price-range', label: 'Price Range' },
      { id: 'long-position', label: 'Long Position' },
      { id: 'short-position', label: 'Short Position' },
      { id: 'risk-reward', label: 'Risk / Reward' },
      { id: 'forecast', label: 'Forecast' },
    ],
  },
  {
    id: 'strategies-builder',
    label: 'Strategies Builder',
    items: [
      { id: 'momentum', label: 'Momentum' },
      { id: 'mean-reversion', label: 'Mean Reversion' },
      { id: 'breakout-setup', label: 'Breakout Setup' },
      { id: 'trend-following', label: 'Trend Following' },
      { id: 'volume-confirmation', label: 'Volume Confirmation' },
      { id: 'price-action', label: 'Price Action' },
      { id: 'multi-timeframe-confirmation', label: 'Multi-Timeframe Confirmation' },
      { id: 'trend-pullback', label: 'Trend Pullback' },
      { id: 'trend-continuation', label: 'Trend Continuation' },
      { id: 'trend-reversal', label: 'Trend Reversal' },
      { id: 'early-trend-entry', label: 'Early Trend Entry' },
      { id: 'late-trend-entry', label: 'Late Trend Entry' },
      { id: 'higher-high-higher-low', label: 'Higher High / Higher Low' },
      { id: 'lower-high-lower-low', label: 'Lower High / Lower Low' },
      { id: 'moving-average-crossover', label: 'Moving Average Crossover' },
      { id: 'golden-cross-strategy', label: 'Golden Cross' },
      { id: 'death-cross-strategy', label: 'Death Cross' },
      { id: 'ema-ribbon', label: 'EMA Ribbon' },
      { id: 'triple-moving-average', label: 'Triple Moving Average' },
      { id: 'supertrend-following', label: 'Supertrend Following' },
      { id: 'ichimoku-trend', label: 'Ichimoku Trend' },
      { id: 'parabolic-sar-trend', label: 'Parabolic SAR Trend' },
      { id: 'adx-trend-strength', label: 'ADX Trend Strength' },
      { id: 'donchian-trend', label: 'Donchian Trend' },
      { id: 'turtle-trading', label: 'Turtle Trading' },
      { id: 'channel-trading', label: 'Channel Trading' },
      { id: 'range-trading', label: 'Range Trading' },
      { id: 'support-resistance-bounce', label: 'Support / Resistance Bounce' },
      { id: 'support-breakdown', label: 'Support Breakdown' },
      { id: 'resistance-breakout', label: 'Resistance Breakout' },
      { id: 'range-breakout', label: 'Range Breakout' },
      { id: 'opening-range-breakout', label: 'Opening Range Breakout' },
      { id: 'initial-balance-breakout', label: 'Initial Balance Breakout' },
      { id: 'previous-day-breakout', label: 'Previous Day High / Low Breakout' },
      { id: '52-week-breakout', label: '52 Week Breakout' },
      { id: 'all-time-high-breakout', label: 'All-Time High Breakout' },
      { id: 'volatility-breakout', label: 'Volatility Breakout' },
      { id: 'atr-breakout', label: 'ATR Breakout' },
      { id: 'bollinger-breakout', label: 'Bollinger Band Breakout' },
      { id: 'bollinger-squeeze', label: 'Bollinger Squeeze' },
      { id: 'keltner-squeeze', label: 'Keltner Squeeze' },
      { id: 'ttm-squeeze', label: 'TTM Squeeze' },
      { id: 'gap-and-go', label: 'Gap and Go' },
      { id: 'gap-fill', label: 'Gap Fill' },
      { id: 'breakaway-gap', label: 'Breakaway Gap' },
      { id: 'inside-bar-breakout', label: 'Inside Bar Breakout' },
      { id: 'outside-bar-reversal', label: 'Outside Bar Reversal' },
      { id: 'nr4-breakout', label: 'NR4 Breakout' },
      { id: 'nr7-breakout', label: 'NR7 Breakout' },
      { id: 'pivot-breakout', label: 'Pivot Breakout' },
      { id: 'cpr-breakout', label: 'CPR Breakout' },
      { id: 'vwap-breakout', label: 'VWAP Breakout' },
      { id: 'anchored-vwap', label: 'Anchored VWAP Strategy' },
      { id: 'vwap-mean-reversion', label: 'VWAP Mean Reversion' },
      { id: 'bollinger-mean-reversion', label: 'Bollinger Mean Reversion' },
      { id: 'rsi-mean-reversion', label: 'RSI Mean Reversion' },
      { id: 'z-score-reversion', label: 'Z-Score Mean Reversion' },
      { id: 'pairs-trading', label: 'Pairs Trading' },
      { id: 'statistical-arbitrage', label: 'Statistical Arbitrage' },
      { id: 'relative-strength', label: 'Relative Strength' },
      { id: 'cross-sectional-momentum', label: 'Cross-Sectional Momentum' },
      { id: 'time-series-momentum', label: 'Time-Series Momentum' },
      { id: 'dual-momentum', label: 'Dual Momentum' },
      { id: 'rsi-momentum', label: 'RSI Momentum' },
      { id: 'macd-crossover', label: 'MACD Crossover' },
      { id: 'macd-histogram-reversal', label: 'MACD Histogram Reversal' },
      { id: 'stochastic-crossover', label: 'Stochastic Crossover' },
      { id: 'cci-momentum', label: 'CCI Momentum' },
      { id: 'roc-momentum', label: 'Rate of Change Momentum' },
      { id: 'awesome-oscillator', label: 'Awesome Oscillator' },
      { id: 'momentum-divergence', label: 'Momentum Divergence' },
      { id: 'rsi-divergence', label: 'RSI Divergence' },
      { id: 'macd-divergence', label: 'MACD Divergence' },
      { id: 'volume-divergence', label: 'Volume Divergence' },
      { id: 'bullish-divergence', label: 'Bullish Divergence' },
      { id: 'bearish-divergence', label: 'Bearish Divergence' },
      { id: 'oversold-bounce', label: 'Oversold Bounce' },
      { id: 'overbought-reversal', label: 'Overbought Reversal' },
      { id: 'candlestick-reversal', label: 'Candlestick Reversal' },
      { id: 'chart-pattern-breakout', label: 'Chart Pattern Breakout' },
      { id: 'harmonic-pattern', label: 'Harmonic Pattern' },
      { id: 'elliott-wave', label: 'Elliott Wave' },
      { id: 'fibonacci-retracement-entry', label: 'Fibonacci Retracement Entry' },
      { id: 'fibonacci-extension-target', label: 'Fibonacci Extension Target' },
      { id: 'pivot-point-reversal', label: 'Pivot Point Reversal' },
      { id: 'camarilla-reversal', label: 'Camarilla Reversal' },
      { id: 'volume-breakout', label: 'Volume Breakout' },
      { id: 'relative-volume-breakout', label: 'Relative Volume Breakout' },
      { id: 'volume-price-confirmation', label: 'Volume Price Confirmation' },
      { id: 'obv-confirmation', label: 'OBV Confirmation' },
      { id: 'money-flow-confirmation', label: 'Money Flow Confirmation' },
      { id: 'accumulation', label: 'Accumulation Setup' },
      { id: 'distribution', label: 'Distribution Setup' },
      { id: 'delivery-volume', label: 'Delivery Volume Setup' },
      { id: 'institutional-activity', label: 'Institutional Activity' },
      { id: 'smart-money', label: 'Smart Money Concept' },
      { id: 'order-block', label: 'Order Block' },
      { id: 'fair-value-gap', label: 'Fair Value Gap' },
      { id: 'liquidity-sweep', label: 'Liquidity Sweep' },
      { id: 'market-structure-shift', label: 'Market Structure Shift' },
      { id: 'intraday-scalping', label: 'Intraday Scalping' },
      { id: 'vwap-scalping', label: 'VWAP Scalping' },
      { id: 'momentum-scalping', label: 'Momentum Scalping' },
      { id: 'opening-drive', label: 'Opening Drive' },
      { id: 'first-hour', label: 'First Hour Strategy' },
      { id: 'power-hour', label: 'Power Hour Strategy' },
      { id: 'swing-trading', label: 'Swing Trading' },
      { id: 'positional-trading', label: 'Positional Trading' },
      { id: 'buy-the-dip', label: 'Buy the Dip' },
      { id: 'sell-the-rally', label: 'Sell the Rally' },
      { id: 'earnings-momentum', label: 'Earnings Momentum' },
      { id: 'post-earnings-drift', label: 'Post-Earnings Drift' },
      { id: 'event-driven', label: 'Event Driven' },
      { id: 'sector-rotation', label: 'Sector Rotation' },
      { id: 'index-relative-strength', label: 'Index Relative Strength' },
      { id: 'high-beta', label: 'High Beta Strategy' },
      { id: 'low-volatility', label: 'Low Volatility Strategy' },
      { id: 'quality-momentum', label: 'Quality Momentum' },
      { id: 'value-momentum', label: 'Value Momentum' },
      { id: 'growth-at-reasonable-price', label: 'Growth at a Reasonable Price' },
      { id: 'deep-value', label: 'Deep Value' },
      { id: 'dividend-growth', label: 'Dividend Growth' },
      { id: 'magic-formula', label: 'Magic Formula' },
      { id: 'piotroski-f-score', label: 'Piotroski F-Score' },
      { id: 'can-slim', label: 'CAN SLIM' },
      { id: 'coffee-can', label: 'Coffee Can Investing' },
      { id: 'small-cap-growth', label: 'Small Cap Growth' },
      { id: 'large-cap-quality', label: 'Large Cap Quality' },
      { id: 'long-only', label: 'Long Only' },
      { id: 'short-selling', label: 'Short Selling' },
      { id: 'long-short', label: 'Long / Short' },
      { id: 'market-neutral', label: 'Market Neutral' },
      { id: 'hedged-equity', label: 'Hedged Equity' },
      { id: 'risk-parity', label: 'Risk Parity' },
      { id: 'equal-weight', label: 'Equal Weight Portfolio' },
      { id: 'volatility-weighted', label: 'Volatility Weighted Portfolio' },
      { id: 'risk-reward-1-2', label: 'Risk / Reward 1:2' },
      { id: 'risk-reward-1-3', label: 'Risk / Reward 1:3' },
      { id: 'atr-stop-loss', label: 'ATR Stop Loss' },
      { id: 'trailing-stop', label: 'Trailing Stop' },
      { id: 'time-based-exit', label: 'Time-Based Exit' },
      { id: 'partial-profit-booking', label: 'Partial Profit Booking' },
      { id: 'pyramiding', label: 'Pyramiding' },
      { id: 'scale-in', label: 'Scale In' },
      { id: 'scale-out', label: 'Scale Out' },
      { id: 'fixed-position-sizing', label: 'Fixed Position Sizing' },
      { id: 'percent-risk-sizing', label: 'Percent Risk Position Sizing' },
      { id: 'kelly-criterion', label: 'Kelly Criterion' },
      { id: 'futures-trend', label: 'Futures Trend Following' },
      { id: 'futures-basis', label: 'Futures Basis Strategy' },
      { id: 'options-long-call', label: 'Options Long Call' },
      { id: 'options-long-put', label: 'Options Long Put' },
      { id: 'covered-call', label: 'Covered Call' },
      { id: 'protective-put', label: 'Protective Put' },
      { id: 'bull-call-spread', label: 'Bull Call Spread' },
      { id: 'bear-put-spread', label: 'Bear Put Spread' },
      { id: 'short-straddle', label: 'Short Straddle' },
      { id: 'long-straddle', label: 'Long Straddle' },
      { id: 'short-strangle', label: 'Short Strangle' },
      { id: 'long-strangle', label: 'Long Strangle' },
      { id: 'iron-condor', label: 'Iron Condor' },
      { id: 'iron-butterfly', label: 'Iron Butterfly' },
      { id: 'calendar-spread', label: 'Calendar Spread' },
      { id: 'ratio-spread', label: 'Ratio Spread' },
      { id: 'options-gamma-scalping', label: 'Options Gamma Scalping' },
      { id: 'options-volatility-crush', label: 'Options Volatility Crush' },
    ],
  },
  {
    id: 'filterings',
    label: 'Filterings',
    items: [
      { id: 'price-range', label: 'Price Range' },
      { id: 'volume-range', label: 'Volume Range' },
      { id: 'market-cap-range', label: 'Market Cap Range' },
      { id: 'sector-filter', label: 'Sector Filter' },
      { id: 'volatility-filter', label: 'Volatility Filter' },
      { id: 'exchange', label: 'Exchange' },
      { id: 'index-membership', label: 'Index Membership' },
      { id: 'industry', label: 'Industry' },
      { id: 'sub-industry', label: 'Sub-Industry' },
      { id: 'stock-series', label: 'Stock Series' },
      { id: 'face-value', label: 'Face Value' },
      { id: 'price-band', label: 'Price Band' },
      { id: 'current-price', label: 'Current Price' },
      { id: 'previous-close', label: 'Previous Close' },
      { id: 'open-price', label: 'Open Price' },
      { id: 'day-high', label: 'Day High' },
      { id: 'day-low', label: 'Day Low' },
      { id: 'price-change', label: 'Price Change' },
      { id: 'percentage-change', label: 'Percentage Change' },
      { id: 'gap-up-filter', label: 'Gap Up' },
      { id: 'gap-down-filter', label: 'Gap Down' },
      { id: 'near-day-high', label: 'Near Day High' },
      { id: 'near-day-low', label: 'Near Day Low' },
      { id: 'near-52-week-high', label: 'Near 52 Week High' },
      { id: 'near-52-week-low', label: 'Near 52 Week Low' },
      { id: 'new-52-week-high', label: 'New 52 Week High' },
      { id: 'new-52-week-low', label: 'New 52 Week Low' },
      { id: 'near-all-time-high', label: 'Near All-Time High' },
      { id: 'near-all-time-low', label: 'Near All-Time Low' },
      { id: 'new-all-time-high', label: 'New All-Time High' },
      { id: 'new-all-time-low', label: 'New All-Time Low' },
      { id: 'distance-from-high', label: 'Distance from High' },
      { id: 'distance-from-low', label: 'Distance from Low' },
      { id: 'daily-return', label: 'Daily Return' },
      { id: 'weekly-return', label: 'Weekly Return' },
      { id: 'monthly-return', label: 'Monthly Return' },
      { id: 'quarterly-return', label: 'Quarterly Return' },
      { id: 'yearly-return', label: 'Yearly Return' },
      { id: 'ytd-return', label: 'Year-to-Date Return' },
      { id: 'one-year-return', label: '1 Year Return' },
      { id: 'three-year-return', label: '3 Year Return' },
      { id: 'five-year-return', label: '5 Year Return' },
      { id: 'ten-year-return', label: '10 Year Return' },
      { id: 'absolute-return', label: 'Absolute Return' },
      { id: 'cagr', label: 'CAGR' },
      { id: 'volume', label: 'Volume' },
      { id: 'average-volume', label: 'Average Volume' },
      { id: 'relative-volume', label: 'Relative Volume' },
      { id: 'volume-change', label: 'Volume Change' },
      { id: 'volume-spike', label: 'Volume Spike' },
      { id: 'delivery-volume', label: 'Delivery Volume' },
      { id: 'delivery-percentage', label: 'Delivery Percentage' },
      { id: 'turnover', label: 'Turnover' },
      { id: 'traded-value', label: 'Traded Value' },
      { id: 'number-of-trades', label: 'Number of Trades' },
      { id: 'average-trade-size', label: 'Average Trade Size' },
      { id: 'bid-ask-spread', label: 'Bid / Ask Spread' },
      { id: 'market-depth', label: 'Market Depth' },
      { id: 'liquidity', label: 'Liquidity' },
      { id: 'free-float-market-cap', label: 'Free Float Market Cap' },
      { id: 'enterprise-value', label: 'Enterprise Value' },
      { id: 'pe-ratio', label: 'P/E Ratio' },
      { id: 'forward-pe', label: 'Forward P/E' },
      { id: 'peg-ratio', label: 'PEG Ratio' },
      { id: 'pb-ratio', label: 'P/B Ratio' },
      { id: 'ps-ratio', label: 'P/S Ratio' },
      { id: 'ev-ebitda', label: 'EV / EBITDA' },
      { id: 'ev-sales', label: 'EV / Sales' },
      { id: 'price-cash-flow', label: 'Price / Cash Flow' },
      { id: 'price-free-cash-flow', label: 'Price / Free Cash Flow' },
      { id: 'earnings-yield', label: 'Earnings Yield' },
      { id: 'book-value', label: 'Book Value' },
      { id: 'intrinsic-value', label: 'Intrinsic Value' },
      { id: 'margin-of-safety', label: 'Margin of Safety' },
      { id: 'dividend-yield', label: 'Dividend Yield' },
      { id: 'dividend-payout', label: 'Dividend Payout Ratio' },
      { id: 'dividend-growth', label: 'Dividend Growth' },
      { id: 'sales', label: 'Sales / Revenue' },
      { id: 'sales-growth', label: 'Sales Growth' },
      { id: 'quarterly-sales-growth', label: 'Quarterly Sales Growth' },
      { id: 'annual-sales-growth', label: 'Annual Sales Growth' },
      { id: 'profit', label: 'Net Profit' },
      { id: 'profit-growth', label: 'Profit Growth' },
      { id: 'quarterly-profit-growth', label: 'Quarterly Profit Growth' },
      { id: 'annual-profit-growth', label: 'Annual Profit Growth' },
      { id: 'eps', label: 'EPS' },
      { id: 'eps-growth', label: 'EPS Growth' },
      { id: 'ebitda', label: 'EBITDA' },
      { id: 'ebitda-growth', label: 'EBITDA Growth' },
      { id: 'gross-margin', label: 'Gross Margin' },
      { id: 'operating-margin', label: 'Operating Margin' },
      { id: 'net-profit-margin', label: 'Net Profit Margin' },
      { id: 'margin-expansion', label: 'Margin Expansion' },
      { id: 'roe', label: 'Return on Equity' },
      { id: 'roce', label: 'Return on Capital Employed' },
      { id: 'roa', label: 'Return on Assets' },
      { id: 'roic', label: 'Return on Invested Capital' },
      { id: 'asset-turnover', label: 'Asset Turnover' },
      { id: 'inventory-turnover', label: 'Inventory Turnover' },
      { id: 'receivables-days', label: 'Receivables Days' },
      { id: 'working-capital-days', label: 'Working Capital Days' },
      { id: 'cash-conversion-cycle', label: 'Cash Conversion Cycle' },
      { id: 'debt', label: 'Total Debt' },
      { id: 'debt-equity', label: 'Debt / Equity' },
      { id: 'net-debt', label: 'Net Debt' },
      { id: 'interest-coverage', label: 'Interest Coverage' },
      { id: 'current-ratio', label: 'Current Ratio' },
      { id: 'quick-ratio', label: 'Quick Ratio' },
      { id: 'cash-flow-operations', label: 'Cash Flow from Operations' },
      { id: 'free-cash-flow', label: 'Free Cash Flow' },
      { id: 'cash-flow-growth', label: 'Cash Flow Growth' },
      { id: 'capex', label: 'Capital Expenditure' },
      { id: 'promoter-holding', label: 'Promoter Holding' },
      { id: 'promoter-pledge', label: 'Promoter Pledge' },
      { id: 'promoter-holding-change', label: 'Promoter Holding Change' },
      { id: 'fii-holding', label: 'FII Holding' },
      { id: 'fii-holding-change', label: 'FII Holding Change' },
      { id: 'dii-holding', label: 'DII Holding' },
      { id: 'dii-holding-change', label: 'DII Holding Change' },
      { id: 'mutual-fund-holding', label: 'Mutual Fund Holding' },
      { id: 'institutional-holding', label: 'Institutional Holding' },
      { id: 'public-holding', label: 'Public Holding' },
      { id: 'shareholder-count', label: 'Shareholder Count' },
      { id: 'sma-position', label: 'Price vs SMA' },
      { id: 'ema-position', label: 'Price vs EMA' },
      { id: 'moving-average-alignment', label: 'Moving Average Alignment' },
      { id: 'moving-average-crossover', label: 'Moving Average Crossover' },
      { id: 'rsi-range', label: 'RSI Range' },
      { id: 'rsi-overbought', label: 'RSI Overbought' },
      { id: 'rsi-oversold', label: 'RSI Oversold' },
      { id: 'macd-signal', label: 'MACD Signal' },
      { id: 'macd-histogram', label: 'MACD Histogram' },
      { id: 'stochastic-range', label: 'Stochastic Range' },
      { id: 'adx-range', label: 'ADX Range' },
      { id: 'cci-range', label: 'CCI Range' },
      { id: 'mfi-range', label: 'MFI Range' },
      { id: 'williams-r-range', label: 'Williams %R Range' },
      { id: 'supertrend-signal', label: 'Supertrend Signal' },
      { id: 'parabolic-sar-signal', label: 'Parabolic SAR Signal' },
      { id: 'ichimoku-position', label: 'Ichimoku Cloud Position' },
      { id: 'bollinger-position', label: 'Bollinger Band Position' },
      { id: 'bollinger-bandwidth', label: 'Bollinger Bandwidth' },
      { id: 'vwap-position', label: 'Price vs VWAP' },
      { id: 'pivot-position', label: 'Pivot Position' },
      { id: 'cpr-width', label: 'CPR Width' },
      { id: 'atr-range', label: 'ATR Range' },
      { id: 'historical-volatility', label: 'Historical Volatility' },
      { id: 'beta', label: 'Beta' },
      { id: 'alpha', label: 'Alpha' },
      { id: 'sharpe-ratio', label: 'Sharpe Ratio' },
      { id: 'sortino-ratio', label: 'Sortino Ratio' },
      { id: 'maximum-drawdown', label: 'Maximum Drawdown' },
      { id: 'standard-deviation', label: 'Standard Deviation' },
      { id: 'correlation-index', label: 'Correlation to Index' },
      { id: 'relative-strength-index', label: 'Relative Strength vs Index' },
      { id: 'futures-oi', label: 'Futures Open Interest' },
      { id: 'futures-oi-change', label: 'Futures OI Change' },
      { id: 'futures-basis', label: 'Futures Basis' },
      { id: 'rollover-percentage', label: 'Rollover Percentage' },
      { id: 'long-buildup', label: 'Long Buildup' },
      { id: 'short-buildup', label: 'Short Buildup' },
      { id: 'long-unwinding', label: 'Long Unwinding' },
      { id: 'short-covering', label: 'Short Covering' },
      { id: 'options-open-interest', label: 'Options Open Interest' },
      { id: 'put-call-ratio', label: 'Put / Call Ratio' },
      { id: 'max-pain', label: 'Max Pain' },
      { id: 'implied-volatility', label: 'Implied Volatility' },
      { id: 'iv-percentile', label: 'IV Percentile' },
      { id: 'iv-rank', label: 'IV Rank' },
      { id: 'option-delta', label: 'Option Delta' },
      { id: 'option-gamma', label: 'Option Gamma' },
      { id: 'option-theta', label: 'Option Theta' },
      { id: 'option-vega', label: 'Option Vega' },
      { id: 'earnings-date', label: 'Earnings Date' },
      { id: 'results-announcement', label: 'Results Announcement' },
      { id: 'dividend-date', label: 'Dividend Date' },
      { id: 'ex-dividend-date', label: 'Ex-Dividend Date' },
      { id: 'bonus-date', label: 'Bonus Date' },
      { id: 'split-date', label: 'Stock Split Date' },
      { id: 'rights-issue-date', label: 'Rights Issue Date' },
      { id: 'board-meeting-date', label: 'Board Meeting Date' },
      { id: 'bulk-deal', label: 'Bulk Deal' },
      { id: 'block-deal', label: 'Block Deal' },
      { id: 'insider-trading', label: 'Insider Trading Activity' },
      { id: 'credit-rating-change', label: 'Credit Rating Change' },
      { id: 'analyst-rating', label: 'Analyst Rating' },
      { id: 'target-price-upside', label: 'Target Price Upside' },
      { id: 'piotroski-score', label: 'Piotroski Score' },
      { id: 'altman-z-score', label: 'Altman Z-Score' },
      { id: 'beneish-m-score', label: 'Beneish M-Score' },
      { id: 'quality-score', label: 'Quality Score' },
      { id: 'value-score', label: 'Value Score' },
      { id: 'momentum-score', label: 'Momentum Score' },
      { id: 'growth-score', label: 'Growth Score' },
      { id: 'financial-strength', label: 'Financial Strength' },
      { id: 'earnings-quality', label: 'Earnings Quality' },
      { id: 'accounting-risk', label: 'Accounting Risk' },
    ],
  },
];

const emptyAddColumnSelection: AddColumnSelection = {
  timeframes: [],
  groups: {},
};

interface AddedColumnDef {
  id: string;
  timeframeId: string;
  timeframeLabel: string;
  label: string;
  groupLabel: string;
}

const buildAddedColumns = (selection: AddColumnSelection): AddedColumnDef[] => {
  if (selection.timeframes.length === 0) return [];

  const selectedItems = ADD_COLUMN_GROUPS.flatMap((group) =>
    (selection.groups[group.id] || [])
      .map(itemId => group.items.find(item => item.id === itemId))
      .filter((item): item is { id: string; label: string } => Boolean(item))
      .map(item => ({ groupId: group.id, groupLabel: group.label, item }))
  );

  return ADD_TIMEFRAMES.filter(timeframe => selection.timeframes.includes(timeframe.id)).flatMap((timeframe) => {
    const baseColumn: AddedColumnDef[] = [{
          id: `${timeframe.id}:change`,
          timeframeId: timeframe.id,
          timeframeLabel: timeframe.label,
          label: timeframe.changeLabel,
          groupLabel: 'Timeframe',
        }];

    const childColumns = selectedItems.map(({ groupId, groupLabel, item }) => ({
      id: `${timeframe.id}:${groupId}:${item.id}`,
      timeframeId: timeframe.id,
      timeframeLabel: timeframe.label,
      label: item.label,
      groupLabel,
    }));

    return [...baseColumn, ...childColumns];
  });
};

// Calendar input helper for the Customize Date picker.
const toDisplayDate = (d: Date): string => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

interface StockData {
  id: string;
  companyName: string;
  tradingSymbol?: string;
  sector: string;
  industry: string;
  group: string;
  faceValue: number;
  priceBand: string;
  marketCap: string;
  preClose: number;
  cmp: number;
  netChange: number;
  customNetChange?: number | null;
  percentChange?: number;
  percentChanges: Record<string, number | null>;
  volume?: number;
  week52High?: number;
  week52Low?: number;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalStocks: number;
  totalPages: number;
}

interface Stats {
  totalGainers: number;
  totalLosers: number;
  totalUnchanged: number;
  avgGain: number;
  avgLoss: number;
}

interface SyncStatus {
  isRunning: boolean;
  historicalPopulating: boolean;
  historicalProgress: { completed: number; total: number };
  cachedCount: number;
}

// ── Pagination Controls ──
const PaginationControls = ({
  pagination,
  onPageChange,
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}) => {
  const { page, totalPages, totalStocks, pageSize } = pagination;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalStocks);

  // Generate visible page numbers (show max 7 pages around current)
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...', totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1, '...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, '...');
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push('...', totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between py-3 px-2 border-t border-gray-300 bg-gray-50">
      <span className="text-xs text-gray-600">
        Showing {start}–{end} of {totalStocks} stocks
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-xs text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 text-xs rounded font-medium ${
                p === page
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <span className="text-xs text-gray-600">
        Page {page} of {totalPages}
      </span>
    </div>
  );
};

// ── Stock Table with Pagination ──
const SORT_MAP_UI: Record<string, string> = {
  'Company Name': 'name', 'CMP': 'lastPrice', 'Pre Close': 'prevClose',
  'Net Chag': 'netChange', 'M Cap': 'marketCap',
};

const SORT_ICON_MAP: Record<string, string> = {
  'Company Name': 'name', 'CMP': 'lastPrice', 'Net Chag': 'netChange', 'M Cap': 'marketCap',
};

function renderBaseCell(col: string, stock: StockData, colorClass: string, displayedNetChange: number) {
  const cls = 'border border-gray-300 px-2 py-1';
  switch (col) {
    case 'S No': return <td key={col} className={`${cls} text-center text-black`}>{stock.id}</td>;
    case 'Company Name': return <td key={col} className={`${cls} text-black font-medium whitespace-nowrap`}>{stock.companyName}</td>;
    case 'Sector': return <td key={col} className={`${cls} text-black whitespace-nowrap`}>{stock.sector}</td>;
    case 'Industry': return <td key={col} className={`${cls} text-black whitespace-nowrap`}>{stock.industry}</td>;
    case 'Group': return <td key={col} className={`${cls} text-center text-black`}>{stock.group}</td>;
    case 'F V': return <td key={col} className={`${cls} text-center text-black`}>{stock.faceValue}</td>;
    case 'P Band': return <td key={col} className={`${cls} text-center text-black`}>{stock.priceBand}</td>;
    case 'M Cap': return <td key={col} className={`${cls} text-right text-black whitespace-nowrap`}>{stock.marketCap}</td>;
    case 'Pre Close': return <td key={col} className={`${cls} text-right text-black`}>{stock.preClose.toFixed(2)}</td>;
    case 'CMP': return <td key={col} className={`${cls} text-right text-black font-medium`}>{stock.cmp.toFixed(2)}</td>;
    case 'Net Chag': return <td key={col} className={`${cls} text-right font-medium ${colorClass}`}>{displayedNetChange > 0 ? '+' : ''}{displayedNetChange.toFixed(2)}</td>;
    default: return null;
  }
}

const StockTable = ({
  data, columns, title, pagination, onPageChange, sortCol, sortOrder, onSort, hiddenColumns, customDate, customEndDate, addedColumns,
}: {
  data: StockData[];
  columns: string[];
  title: string;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  sortCol: string;
  sortOrder: 'asc' | 'desc';
  onSort: (col: string) => void;
  hiddenColumns: Set<string>;
  customDate?: string;
  customEndDate?: string;
  addedColumns: AddedColumnDef[];
}) => {
  const visibleBase = baseColumns.filter(c => !hiddenColumns.has(c));
  const visibleColumns = columns.filter(c => !hiddenColumns.has(c));
  const addedColumnGroups = ADD_TIMEFRAMES
    .map((timeframe) => ({
      timeframe,
      columns: addedColumns.filter(col => col.timeframeId === timeframe.id),
    }))
    .filter(group => group.columns.length > 0);
  const hasGroupedAddedColumns = addedColumns.length > 0;

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return null;
    return <span className="ml-1 text-[10px]">{sortOrder === 'asc' ? '\u25B2' : '\u25BC'}</span>;
  };

  return (
    <div className="border border-black">
      <div className="text-center py-2 font-bold text-black border-b border-black bg-gray-50">
        {title} ({pagination.totalStocks})
      </div>

      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-100">
              {visibleBase.map((col) => (
                <th key={col}
                  rowSpan={hasGroupedAddedColumns ? 2 : 1}
                  className="border border-gray-400 px-2 py-1 text-black font-semibold text-center whitespace-nowrap bg-gray-100 cursor-pointer hover:bg-gray-200"
                  onClick={() => { if (SORT_MAP_UI[col]) onSort(SORT_MAP_UI[col]); }}
                >
                  {col}
                  {SORT_ICON_MAP[col] && <SortIcon col={SORT_ICON_MAP[col]} />}
                </th>
              ))}
              {visibleColumns.map((col) => {
                let label = col;
                if (col === '% Cust Date Chag' && customDate) {
                  const fmt = (iso: string) =>
                    new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
                  label = customEndDate
                    ? `% ${fmt(customDate)} → ${fmt(customEndDate)} Chag`
                    : `% ${fmt(customDate)} Chag`;
                }
                return (
                  <th key={col}
                    rowSpan={hasGroupedAddedColumns ? 2 : 1}
                    className="border border-gray-400 px-2 py-1 text-black font-semibold text-center whitespace-nowrap bg-yellow-100 cursor-pointer hover:bg-yellow-200"
                    onClick={() => onSort(col)}
                  >
                    {label}<SortIcon col={col} />
                  </th>
                );
              })}
              {addedColumnGroups.map(({ timeframe, columns: groupColumns }) => (
                <th
                  key={timeframe.id}
                  colSpan={groupColumns.length}
                  className="border border-gray-400 px-2 py-1 text-black font-semibold text-center whitespace-nowrap bg-blue-100"
                >
                  {timeframe.label}
                </th>
              ))}
            </tr>
            {hasGroupedAddedColumns && (
              <tr className="bg-blue-50">
                {addedColumnGroups.flatMap(({ columns: groupColumns }) =>
                  groupColumns.map((col) => (
                    <th
                      key={col.id}
                      className="border border-gray-400 px-2 py-1 text-black font-semibold text-center whitespace-nowrap bg-blue-50"
                    >
                      {col.label}
                    </th>
                  ))
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={visibleBase.length + visibleColumns.length + addedColumns.length} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((stock) => {
                const displayedNetChange = customDate && stock.customNetChange !== null && stock.customNetChange !== undefined
                  ? stock.customNetChange
                  : stock.netChange;
                const colorClass = displayedNetChange > 0 ? 'text-green-600' : displayedNetChange < 0 ? 'text-red-600' : 'text-gray-600';
                return (
                  <tr key={`${stock.id}-${stock.companyName}`} className="hover:bg-gray-50">
                    {visibleBase.map(col => renderBaseCell(col, stock, colorClass, displayedNetChange))}
                    {visibleColumns.map((col) => {
                      const value = stock.percentChanges[col];
                      const isNull = value === null || value === undefined;
                      return (
                        <td key={col}
                          className={`border border-gray-300 px-2 py-1 text-right font-medium ${isNull ? 'text-gray-400' : value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}`}
                        >
                          {isNull ? '-' : `${value > 0 ? '+' : ''}${value.toFixed(2)}%`}
                        </td>
                      );
                    })}
                    {addedColumns.map((col) => (
                      <td key={col.id} className="border border-gray-300 px-2 py-1 text-right text-gray-400">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <PaginationControls pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};

// ── Main Page Content ──
function MarketPageContent({ enableAddColumns = false }: { enableAddColumns?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
  const viewParam = searchParams.get('view') as ViewType | null;
  const currentView: ViewType = viewParam === 'gainers' || viewParam === 'losers' || viewParam === 'unchanged' ? viewParam : 'all';

  const [selectedExchange, setSelectedExchange] = useState<Exchange>('Both');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pageSize: PAGE_SIZE, totalStocks: 0, totalPages: 0 });
  const [stats, setStats] = useState<Stats>({ totalGainers: 0, totalLosers: 0, totalUnchanged: 0, avgGain: 0, avgLoss: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('days');
  const [sortCol, setSortCol] = useState('pctChange');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Advanced filters
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<FilterState>(emptyFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(emptyFilterOptions);
  const [filteredCounts, setFilteredCounts] = useState<{ total: number; gainers: number; losers: number; unchanged: number } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [selectedAddColumnConfig, setSelectedAddColumnConfig] = useState<AddColumnSelection>(emptyAddColumnSelection);
  const [customDate, setCustomDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [dateError, setDateError] = useState('');
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [isCustomDatePopupOpen, setIsCustomDatePopupOpen] = useState(false);
  const customDateTabRef = useRef<HTMLButtonElement>(null);
  const customDatePopupRef = useRef<HTMLDivElement>(null);

  const exchanges: string[] = ['NSE', 'BSE', 'Both', 'Only NSE', 'Only BSE'];

  // DD/MM/YYYY ↔ YYYY-MM-DD helpers (used by the Customize Date picker)
  const isoToDisplay = (iso: string): string => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return '';
    return `${d}/${m}/${y}`;
  };
  const parseDisplayDate = (input: string): { iso: string; valid: boolean } => {
    const trimmed = input.trim();
    if (!trimmed) return { iso: '', valid: true };
    const m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return { iso: '', valid: false };
    const dd = m[1].padStart(2, '0');
    const mm = m[2].padStart(2, '0');
    const yyyy = m[3];
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    if (isNaN(d.getTime()) || d.getFullYear() !== Number(yyyy) || d.getMonth() + 1 !== Number(mm) || d.getDate() !== Number(dd)) {
      return { iso: '', valid: false };
    }
    return { iso: `${yyyy}-${mm}-${dd}`, valid: true };
  };

  const allTabs: { id: string; label: string }[] = [
    { id: 'intraday', label: 'Intraday Wise' },
    { id: 'days', label: 'Days Wise' },
    { id: 'weeks', label: 'Weeks Wise' },
    { id: 'months', label: 'Months Wise' },
    { id: 'years', label: 'Years Wise' },
    { id: 'custom', label: 'Customize Date' },
    { id: 'seasonality', label: 'Seasonality' },
    { id: 'ytd', label: 'Year to Date' },
    { id: '52weeks', label: '52 Weeks Gainers & Losers' },
    { id: 'all_time', label: 'All Time Gainers & Losers' },
  ];

  // Debounce filter changes (handles rapid range input typing)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  // When switching to Customize Date tab, prefill inputs with the currently-applied range
  useEffect(() => {
    if (activeTab === 'custom') {
      setStartDateInput(isoToDisplay(customDate));
      setEndDateInput(isoToDisplay(customEndDate));
      setDateError('');
      // Show the month of the currently-applied start date, or today
      const anchor = customDate ? new Date(customDate + 'T00:00:00') : new Date();
      setCalendarMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Fetch filter options when exchange changes
  useEffect(() => {
    fetch(`/api/market/filters?exchange=${selectedExchange}`)
      .then(r => r.json())
      .then(data => setFilterOptions(data))
      .catch(() => {});
  }, [selectedExchange]);

  const currentColumns = columnsByPeriod[activeTab as TimePeriod | SubTab] || [];
  const toggleableColumnsForTab = [...TOGGLEABLE_COLUMNS, ...currentColumns];
  const periodLabel = allTabs.find(t => t.id === activeTab)?.label;

  // Fetch data from the paginated API
  const fetchMarketData = useCallback(async (page: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const filter = currentView === 'all' ? 'all' : currentView;
      const params = new URLSearchParams({
        exchange: selectedExchange,
        filter,
        page: String(page),
        pageSize: String(PAGE_SIZE),
        sort: sortCol,
        order: sortOrder,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(debouncedFilters.sectors.length ? { sectors: debouncedFilters.sectors.join(',') } : {}),
        ...(debouncedFilters.industries.length ? { industries: debouncedFilters.industries.join(',') } : {}),
        ...(debouncedFilters.marketCaps.length ? { marketCaps: debouncedFilters.marketCaps.join(',') } : {}),
        ...(debouncedFilters.priceBands.length ? { priceBands: debouncedFilters.priceBands.join(',') } : {}),
        ...(debouncedFilters.series.length ? { series: debouncedFilters.series.join(',') } : {}),
        ...(debouncedFilters.marketCapMin ? { marketCapMin: debouncedFilters.marketCapMin } : {}),
        ...(debouncedFilters.marketCapMax ? { marketCapMax: debouncedFilters.marketCapMax } : {}),
        ...(debouncedFilters.priceMin ? { priceMin: debouncedFilters.priceMin } : {}),
        ...(debouncedFilters.priceMax ? { priceMax: debouncedFilters.priceMax } : {}),
        ...(debouncedFilters.changeMin ? { changeMin: debouncedFilters.changeMin } : {}),
        ...(debouncedFilters.changeMax ? { changeMax: debouncedFilters.changeMax } : {}),
        ...(debouncedFilters.volumeMin ? { volumeMin: debouncedFilters.volumeMin } : {}),
        ...(customDate ? { customDate } : {}),
        ...(customEndDate ? { customEndDate } : {}),
      });

      const response = await fetch(`/api/market/live?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch market data');
      }

      const data = await response.json();
      setStockData(data.stocks || []);
      setPagination(data.pagination || { page: 1, pageSize: PAGE_SIZE, totalStocks: 0, totalPages: 0 });
      setStats(data.stats || { totalGainers: 0, totalLosers: 0, totalUnchanged: 0, avgGain: 0, avgLoss: 0 });
      setFilteredCounts(data.filteredCounts || null);
      setLastSyncAt(data.lastSyncAt);
      setSyncStatus(data.syncStatus || null);
      setCurrentPage(data.pagination?.page || 1);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load live market data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedExchange, currentView, sortCol, sortOrder, searchQuery, debouncedFilters, customDate, customEndDate]);

  // Fetch on mount and when deps change
  useEffect(() => {
    setCurrentPage(1);
    fetchMarketData(1);
  }, [fetchMarketData]);

  // Auto-refresh every 30 seconds for near-real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData(currentPage, true);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMarketData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort
  const handleSort = (col: string) => {
    if (col === sortCol) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCol(col);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Handle search with debounce
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle view change
  const handleViewChange = (view: ViewType) => {
    setCurrentPage(1);
    router.push(`/market?view=${view}`);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    // Toggle popup when re-clicking the already-active Customize Date tab
    if (tab === 'custom' && activeTab === 'custom') {
      setIsCustomDatePopupOpen((prev) => !prev);
      return;
    }
    setActiveTab(tab);
    setCurrentPage(1);
    // Reset sort to the tab's primary ranking column when switching tabs.
    setSortCol(tab === 'custom' && customDate ? '% Cust Date Chag' : 'pctChange');
    setSortOrder('desc');
    setIsCustomDatePopupOpen(tab === 'custom');
  };

  // Close popup on outside click
  useEffect(() => {
    if (!isCustomDatePopupOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        customDatePopupRef.current && !customDatePopupRef.current.contains(target) &&
        customDateTabRef.current && !customDateTabRef.current.contains(target)
      ) {
        setIsCustomDatePopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCustomDatePopupOpen]);

  // Close popup on Escape
  useEffect(() => {
    if (!isCustomDatePopupOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCustomDatePopupOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isCustomDatePopupOpen]);

  // Handle exchange change — reset filters since options differ per exchange
  const handleExchangeChange = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setFilters(emptyFilters);
    setDebouncedFilters(emptyFilters);
    setCurrentPage(1);
  };

  const addedColumns = buildAddedColumns(selectedAddColumnConfig);

  // CSV Download (respects column visibility)
  const downloadCSV = () => {
    const visibleBase = baseColumns.filter(c => !hiddenColumns.has(c));
    const visiblePeriodColumns = currentColumns.filter(c => !hiddenColumns.has(c));
    const activeAddedColumns = enableAddColumns ? addedColumns : [];
    const addedColumnLabels = activeAddedColumns.map(col => `${col.timeframeLabel} ${col.label}`);
    const allColumns = [...visibleBase, ...visiblePeriodColumns, ...addedColumnLabels];
    const headers = allColumns.join(',');

    const csvLines: string[] = [];
    csvLines.push(`Market Data - ${periodLabel} - ${selectedExchange} - ${currentView}`);
    csvLines.push(`Generated on: ${new Date().toLocaleString()}`);
    csvLines.push(`Page ${pagination.page} of ${pagination.totalPages} (${pagination.totalStocks} total)`);
    csvLines.push('');
    csvLines.push(headers);

    const getCsvValue = (col: string, stock: StockData): string => {
      switch (col) {
        case 'S No': return stock.id;
        case 'Company Name': return `"${stock.companyName}"`;
        case 'Sector': return `"${stock.sector}"`;
        case 'Industry': return `"${stock.industry}"`;
        case 'Group': return stock.group;
        case 'F V': return String(stock.faceValue);
        case 'P Band': return `"${stock.priceBand}"`;
        case 'M Cap': return `"${stock.marketCap}"`;
        case 'Pre Close': return stock.preClose.toFixed(2);
        case 'CMP': return stock.cmp.toFixed(2);
        case 'Net Chag': {
          const displayedNetChange = customDate && stock.customNetChange !== null && stock.customNetChange !== undefined
            ? stock.customNetChange
            : stock.netChange;
          return displayedNetChange.toFixed(2);
        }
        default: return '';
      }
    };

    stockData.forEach((stock) => {
      const base = visibleBase.map(col => getCsvValue(col, stock));
      const pctData = visiblePeriodColumns.map(col => {
        const value = stock.percentChanges[col];
        return value === null || value === undefined ? '-' : value.toFixed(2);
      });
      const blankAddedColumns = activeAddedColumns.map(() => '');
      csvLines.push([...base, ...pctData, ...blankAddedColumns].join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `market_${activeTab}_${selectedExchange}_${currentView}_p${currentPage}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Use filtered counts for tab labels (respects advanced filters), fallback to global stats
  const displayCounts = filteredCounts || {
    total: stats.totalGainers + stats.totalLosers + stats.totalUnchanged,
    gainers: stats.totalGainers,
    losers: stats.totalLosers,
    unchanged: stats.totalUnchanged,
  };
  const totalStocksCount = displayCounts.total;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-4">
        {/* Tabs */}
        <div className="relative mb-4">
          <div className="flex border-b-2 border-black overflow-x-auto">
            {allTabs.map((tab) => (
              <button
                key={tab.id}
                ref={tab.id === 'custom' ? customDateTabRef : undefined}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-t border-l last:border-r border-black -mb-[2px] whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white border-b-2 border-b-white text-black'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        {/* Custom date picker popup */}
        {isCustomDatePopupOpen && (() => {
          const startIso = parseDisplayDate(startDateInput).iso;
          const endIso = parseDisplayDate(endDateInput).iso;
          const selectedRange: DateRange | undefined = startIso
            ? {
                from: new Date(`${startIso}T00:00:00`),
                to: endIso ? new Date(`${endIso}T00:00:00`) : undefined,
              }
            : undefined;

          const applyDateRange = () => {
            const start = parseDisplayDate(startDateInput);
            const end = parseDisplayDate(endDateInput);
            if (!start.valid) { setDateError('Invalid Start Date. Use DD/MM/YYYY.'); return; }
            if (!end.valid) { setDateError('Invalid End Date. Use DD/MM/YYYY.'); return; }
            if (!start.iso && !end.iso) { setDateError('Enter at least a Start Date.'); return; }
            if (!start.iso) { setDateError('Start Date is required.'); return; }
            if (end.iso && start.iso > end.iso) { setDateError('Start Date must be before End Date.'); return; }
            const today = new Date().toISOString().split('T')[0];
            if (start.iso > today) { setDateError('Start Date cannot be in the future.'); return; }
            if (end.iso && end.iso > today) { setDateError('End Date cannot be in the future.'); return; }
            setDateError('');
            setCustomDate(start.iso);
            setCustomEndDate(end.iso);
            setSortCol('% Cust Date Chag');
            setSortOrder('desc');
            setCurrentPage(1);
            setIsCustomDatePopupOpen(false);
          };

          return (
            <div
              ref={customDatePopupRef}
              className="absolute top-full left-0 z-50 mt-2 w-[min(760px,calc(100vw-2rem))] border border-black bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]"
              style={{ left: customDateTabRef.current?.offsetLeft ?? 0 }}
            >
              <div className="flex items-center justify-between border-b border-black px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center border border-black bg-black text-white">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-black">Customize Date</p>
                    <p className="text-[11px] text-gray-500">Compare market performance between two dates</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomDatePopupOpen(false)}
                  className="h-8 px-3 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-black"
                >
                  Close
                </button>
              </div>

              <div className="grid md:grid-cols-[1fr_250px]">
                <div className="p-4">
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    onSelect={(range) => {
                      if (!range?.from) return;
                      setStartDateInput(toDisplayDate(range.from));
                      setEndDateInput(range.to ? toDisplayDate(range.to) : '');
                      setDateError('');
                    }}
                    numberOfMonths={2}
                    pagedNavigation
                    captionLayout="dropdown"
                    startMonth={new Date(1990, 0)}
                    endMonth={new Date()}
                    disabled={{ after: new Date() }}
                    showOutsideDays
                    classNames={{
                      root: 'w-full',
                      months: 'flex flex-col gap-6 md:flex-row md:gap-8',
                      month: 'space-y-3',
                      month_caption: 'relative flex h-9 items-center justify-center',
                      caption_label: 'text-sm font-semibold text-black',
                      dropdowns: 'flex items-center justify-center gap-2',
                      dropdown_root: 'relative',
                      dropdown: 'h-8 appearance-none border border-gray-300 bg-white px-2 pr-7 text-xs font-semibold text-black outline-none transition-colors hover:border-black focus:border-black focus:ring-1 focus:ring-black',
                      months_dropdown: 'min-w-[92px]',
                      years_dropdown: 'min-w-[76px]',
                      nav: 'absolute inset-x-4 top-[76px] flex items-center justify-between md:inset-x-5',
                      button_previous: 'inline-flex h-8 w-8 items-center justify-center border border-gray-300 bg-white text-gray-700 transition-colors hover:border-black hover:bg-gray-100',
                      button_next: 'inline-flex h-8 w-8 items-center justify-center border border-gray-300 bg-white text-gray-700 transition-colors hover:border-black hover:bg-gray-100',
                      chevron: 'h-4 w-4',
                      month_grid: 'w-full border-collapse',
                      weekdays: 'flex',
                      weekday: 'flex h-8 w-9 items-center justify-center text-[11px] font-medium text-gray-500',
                      week: 'mt-1 flex w-full',
                      day: 'relative h-9 w-9 p-0 text-center text-sm',
                      day_button: 'h-9 w-9 rounded-md text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black',
                      today: 'font-bold text-black after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-black',
                      outside: 'text-gray-300 opacity-60',
                      disabled: 'pointer-events-none text-gray-300 opacity-40',
                      selected: 'bg-black text-white',
                      range_start: 'rounded-l-md bg-black text-white',
                      range_end: 'rounded-r-md bg-black text-white',
                      range_middle: 'rounded-none bg-gray-100 text-black',
                    }}
                  />
                </div>

                <div className="border-t border-gray-200 bg-gray-50 p-4 md:border-l md:border-t-0">
                  <div className="mb-4 border border-gray-200 bg-white px-3 py-2">
                    <p className="text-[11px] font-medium uppercase text-gray-500">Selected range</p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      {startDateInput || 'Start date'} {endDateInput ? `to ${endDateInput}` : 'to today'}
                    </p>
                  </div>

                  <div className="mb-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const t = new Date();
                        setStartDateInput(toDisplayDate(t));
                        setEndDateInput('');
                        setCalendarMonth(new Date(t.getFullYear(), t.getMonth(), 1));
                        setDateError('');
                      }}
                      className="h-8 flex-1 border border-gray-300 bg-white text-xs font-medium text-black hover:border-black hover:bg-gray-100"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStartDateInput('');
                        setEndDateInput('');
                        setDateError('');
                        if (customDate || customEndDate) {
                          setCustomDate('');
                          setCustomEndDate('');
                          setSortCol('pctChange');
                          setSortOrder('desc');
                          setCurrentPage(1);
                        }
                      }}
                      className="h-8 flex-1 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:border-black hover:text-black"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs font-medium text-gray-600">Start Date</label>
                      <input
                        type="text"
                        value={startDateInput}
                        onChange={(e) => { setStartDateInput(e.target.value); setDateError(''); }}
                        placeholder="DD/MM/YYYY"
                        className="h-9 border border-gray-300 bg-white px-3 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs font-medium text-gray-600">End Date</label>
                      <input
                        type="text"
                        value={endDateInput}
                        onChange={(e) => { setEndDateInput(e.target.value); setDateError(''); }}
                        placeholder="DD/MM/YYYY"
                        className="h-9 border border-gray-300 bg-white px-3 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  {dateError && (
                    <p className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{dateError}</p>
                  )}
                  {!dateError && customDate && (
                    <p className="mt-3 text-xs leading-5 text-gray-600">
                      Active: <strong className="text-black">{new Date(customDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      {' '}to{' '}
                      <strong className="text-black">
                        {customEndDate
                          ? new Date(customEndDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'today'}
                      </strong>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={applyDateRange}
                    className="mt-5 h-9 w-full bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-2">
                <p className="text-[11px] text-gray-500">
                  Pick a start date and optional end date. Leaving the end date empty compares the start date with today.
                </p>
              </div>
            </div>
          );
        })()}
        </div>

        {/* Active custom date indicator */}
        {customDate && !isCustomDatePopupOpen && (
          <div className="mb-4 flex items-center gap-3 border border-black bg-gray-50 px-3 py-2 text-xs">
            <span className="text-gray-700">
              Custom date active:{' '}
              <strong className="text-black">{new Date(customDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              {' → '}
              <strong className="text-black">
                {customEndDate
                  ? new Date(customEndDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'today'}
              </strong>
            </span>
            <button onClick={() => { setActiveTab('custom'); setIsCustomDatePopupOpen(true); }} className="font-medium text-black underline underline-offset-2 hover:text-gray-600">Change</button>
            <button onClick={() => { setCustomDate(''); setCustomEndDate(''); setStartDateInput(''); setEndDateInput(''); setSortCol('pctChange'); setSortOrder('desc'); setCurrentPage(1); }} className="font-medium text-red-600 underline underline-offset-2 hover:text-red-800">Clear</button>
          </div>
        )}

        {/* Exchange Tabs & Actions Row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Exchange Selection */}
            <div className="flex items-center gap-4">
              {exchanges.map((exchange) => (
                <label key={exchange} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="exchange"
                    checked={selectedExchange === exchange}
                    onChange={() => handleExchangeChange(exchange as Exchange)}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className={`ml-2 text-sm font-medium ${selectedExchange === exchange ? 'text-black underline' : 'text-gray-600'}`}>
                    {exchange}
                  </span>
                </label>
              ))}
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs text-gray-500">
                Live Data · {totalStocksCount} Stocks
                {lastSyncAt && ` · Synced ${new Date(lastSyncAt).toLocaleTimeString()}`}
              </span>
            </div>

            {/* Sync status */}
            {syncStatus?.historicalPopulating && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                <span className="text-xs text-blue-600">
                  Syncing historical: {syncStatus.historicalProgress.completed}/{syncStatus.historicalProgress.total} ({syncStatus.cachedCount} cached)
                </span>
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search company..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded w-48 focus:outline-none focus:border-black text-black"
              />
            </div>
            <button
              onClick={() => fetchMarketData(currentPage, true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-black font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          options={filterOptions}
          onChange={(f) => { setFilters(f); setCurrentPage(1); }}
          onReset={() => { setFilters(emptyFilters); setDebouncedFilters(emptyFilters); setCurrentPage(1); }}
          hiddenColumns={hiddenColumns}
          onHiddenColumnsChange={setHiddenColumns}
          toggleableColumns={toggleableColumnsForTab}
          addColumnGroups={enableAddColumns ? ADD_COLUMN_GROUPS : undefined}
          timeframeOptions={enableAddColumns ? ADD_TIMEFRAMES : undefined}
          selectedAddColumnConfig={enableAddColumns ? selectedAddColumnConfig : undefined}
          onAddColumnConfigChange={enableAddColumns ? setSelectedAddColumnConfig : undefined}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600 text-sm">Loading market data...</p>
            <p className="text-gray-400 text-xs mt-1">Fetching from database</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="border border-red-300 bg-red-50 rounded p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => fetchMarketData(1)} className="mt-2 text-sm text-red-600 underline hover:text-red-800">
              Try again
            </button>
          </div>
        )}

        {/* Data Tables */}
        {!loading && !error && (
          <>
            {/* View toggle buttons */}
            <div className="flex border-b border-black mb-0">
              <button
                onClick={() => handleViewChange('all')}
                className={`flex-1 text-center py-2 font-bold border-r border-black ${
                  currentView === 'all' ? 'text-black bg-gray-50' : 'text-gray-400 bg-gray-100'
                }`}
              >
                All ({totalStocksCount})
              </button>
              <button
                onClick={() => handleViewChange('gainers')}
                className={`flex-1 text-center py-2 font-bold border-r border-black ${
                  currentView === 'gainers' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'
                }`}
              >
                Gainers ({displayCounts.gainers})
              </button>
              <button
                onClick={() => handleViewChange('losers')}
                className={`flex-1 text-center py-2 font-bold border-r border-black ${
                  currentView === 'losers' ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-100'
                }`}
              >
                Losers ({displayCounts.losers})
              </button>
              <button
                onClick={() => handleViewChange('unchanged')}
                className={`flex-1 text-center py-2 font-bold ${
                  currentView === 'unchanged' ? 'text-gray-700 bg-gray-50' : 'text-gray-400 bg-gray-100'
                }`}
              >
                Unchanged ({displayCounts.unchanged})
              </button>
            </div>

            <div className="text-center py-2 border border-t-0 border-black bg-gray-50 font-semibold text-black mb-4">
              {periodLabel} · Powered by Dhan API · {PAGE_SIZE} stocks per page
            </div>

            {/* Single paginated table */}
            <div className="mb-6">
              <StockTable
                data={stockData}
                columns={currentColumns}
                title={
                  currentView === 'gainers' ? 'Gainers' :
                  currentView === 'losers' ? 'Losers' :
                  currentView === 'unchanged' ? 'Unchanged' :
                  'All Stocks'
                }
                pagination={pagination}
                onPageChange={handlePageChange}
                sortCol={sortCol}
                sortOrder={sortOrder}
                onSort={handleSort}
                hiddenColumns={hiddenColumns}
                customDate={customDate}
                customEndDate={customEndDate}
                addedColumns={enableAddColumns ? addedColumns : []}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MarketPageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}

export function MarketPerformancePage({ enableAddColumns = false }: { enableAddColumns?: boolean }) {
  return (
    <Suspense fallback={<MarketPageLoading />}>
      <MarketPageContent enableAddColumns={enableAddColumns} />
    </Suspense>
  );
}

export default MarketPerformancePage;
