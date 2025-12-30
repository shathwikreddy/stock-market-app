'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import TopGainersLosersTable from '@/components/TopGainersLosersTable';
import { topLosersNSE, TopGainerLoserStock } from '@/lib/mockData';

export default function LosersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [stocks, setStocks] = useState<TopGainerLoserStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Using the new mock data directly for now
    setStocks(topLosersNSE);
    setLoading(false);
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading top losers...</p>
        </div>
      </div>
    );
  }

  // Get current date in the format: Dec 30, 16:09
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <TopGainersLosersTable
      data={stocks}
      type="losers"
      exchange="NSE"
      index="NIFTY 500"
      date={dateStr}
    />
  );
}
