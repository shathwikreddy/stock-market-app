'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import StockTable from '@/components/StockTable';
import { Stock } from '@/lib/mockData';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GainersPage() {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchGainers();
  }, [isAuthenticated, router]);

  const fetchGainers = async () => {
    try {
      const response = await axios.get('/api/stocks/gainers', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStocks(response.data.data);
    } catch {
      toast.error('Failed to load gainers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-success border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading top gainers...</p>
        </div>
      </div>
    );
  }

  const topGain = stocks[0];

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
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-success" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Top Gainers
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Stocks with the highest gains today
              </p>
            </div>
          </div>

          {/* Stats Banner */}
          {topGain && (
            <div className="bg-background border border-success/20 rounded-2xl p-6 flex items-center justify-between shadow-luxury">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Market Leader</p>
                <p className="text-xl font-display font-bold text-foreground">
                  {topGain.company}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{topGain.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Today&apos;s Gain</p>
                <div className="flex items-center justify-end space-x-2">
                  <ArrowUpRight className="w-5 h-5 text-success" />
                  <p className="text-3xl font-display font-bold text-success">
                    +{topGain.percentInChange.toFixed(2)}%
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
          <StockTable stocks={stocks} type="gainers" />
        </motion.div>
      </div>
    </div>
  );
}
