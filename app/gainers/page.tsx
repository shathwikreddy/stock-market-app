'use client';

import { useMemo } from 'react';
import TopGainersLosersTable from '@/components/TopGainersLosersTable';
import { topGainersNSE } from '@/lib/mockData';
import { AuthGuard } from '@/components/common';

function GainersContent() {
  const stocks = useMemo(() => topGainersNSE, []);

  const dateStr = useMemo(() => {
    const now = new Date();
    return (
      now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }) +
      ', ' +
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
  }, []);

  return (
    <TopGainersLosersTable
      data={stocks}
      type="gainers"
      exchange="NSE"
      index="NIFTY 500"
      date={dateStr}
    />
  );
}

export default function GainersPage() {
  return (
    <AuthGuard loadingMessage="Loading top gainers...">
      <GainersContent />
    </AuthGuard>
  );
}
