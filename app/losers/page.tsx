'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import StockTable from '@/components/StockTable';
import { Stock } from '@/lib/mockData';
import { TrendingDown, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LosersPage() {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchLosers();
  }, [isAuthenticated, router]);

  const fetchLosers = async () => {
    try {
      const response = await axios.get('/api/stocks/losers', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStocks(response.data.data);
    } catch {
      toast.error('Failed to load losers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-error border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading top losers...</p>
        </div>
      </div>
    );
  }

  const topLoss = stocks[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-error" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Top Losers
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Stocks with the biggest declines today
              </p>
            </div>
          </div>

          {/* Stats Banner */}
          {topLoss && (
            <div className="bg-background border border-error/20 rounded-2xl p-6 flex items-center justify-between shadow-luxury">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Biggest Decline</p>
                <p className="text-xl font-display font-bold text-foreground">
                  {topLoss.company}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{topLoss.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Today&apos;s Loss</p>
                <div className="flex items-center justify-end space-x-2">
                  <ArrowDownRight className="w-5 h-5 text-error" />
                  <p className="text-3xl font-display font-bold text-error">
                    {topLoss.percentInChange.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{stocks.length}</span> stocks
            </p>
          </div>
          <StockTable stocks={stocks} type="losers" />
        </motion.div>
      </div>
    </div>
  );
}
