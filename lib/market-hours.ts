/**
 * IST market-hours helpers for the NSE/BSE equity segment.
 * Window: Mon–Fri, 09:00 — 15:40 IST.
 * Intentionally ignores holidays: Dhan just returns stale data on closed days.
 */

const OPEN_HHMM = 900;
const CLOSE_HHMM = 1540;

export interface MarketTime {
  open: boolean;
  istDay: number;   // 0=Sun ... 6=Sat
  istHHMM: number;  // 0..2359
}

export function getIstMarketTime(now: Date = new Date()): MarketTime {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istDay = ist.getUTCDay();
  const istHHMM = ist.getUTCHours() * 100 + ist.getUTCMinutes();
  const weekday = istDay !== 0 && istDay !== 6;
  const open = weekday && istHHMM >= OPEN_HHMM && istHHMM <= CLOSE_HHMM;
  return { open, istDay, istHHMM };
}

export function isMarketOpen(now?: Date): boolean {
  return getIstMarketTime(now).open;
}
