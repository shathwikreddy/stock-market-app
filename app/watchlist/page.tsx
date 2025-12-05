'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface WatchlistStock {
  company: string;
  sector: string;
  ltp: number;
  netChange: number;
  percentInChange: number;
  mktCapital: string;
}

export default function WatchlistPage() {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchWatchlist();
  }, [isAuthenticated, router]);

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get('/api/watchlist', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStocks(response.data.watchlist.stocks || []);
    } catch {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (company: string) => {
    try {
      await axios.delete('/api/watchlist', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { company },
      });
      toast.success(`${company} removed`);
      fetchWatchlist();
    } catch {
      toast.error('Failed to remove from watchlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  My Watchlist
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Track your favorite stocks
                </p>
              </div>
            </div>

            {stocks.length > 0 && (
              <div className="hidden md:block">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground text-2xl">{stocks.length}</span>
                  <span className="ml-2">stocks tracked</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Watchlist */}
        {stocks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-2xl p-12 text-center shadow-luxury"
          >
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding stocks from the gainers or losers page to track their performance
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/gainers"
                className="inline-flex items-center px-6 py-3 bg-success text-white rounded-xl font-semibold hover:bg-success/90 transition-all shadow-sm hover:shadow-md"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                View Gainers
              </Link>
              <Link
                href="/losers"
                className="inline-flex items-center px-6 py-3 bg-error text-white rounded-xl font-semibold hover:bg-error/90 transition-all shadow-sm hover:shadow-md"
              >
                <TrendingDown className="h-5 w-5 mr-2" />
                View Losers
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {stocks.map((stock, index) => (
                <motion.div
                  key={stock.company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background border border-border rounded-2xl p-6 hover:shadow-luxury transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                            {stock.company}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{stock.sector}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(stock.company)}
                          className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                          <p className="text-2xl font-display font-bold text-foreground">
                            ₹{stock.ltp.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Change</p>
                          <p className={`text-xl font-display font-bold ${stock.netChange >= 0 ? 'text-success' : 'text-error'}`}>
                            {stock.netChange >= 0 ? '+' : ''}₹{stock.netChange.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">% Change</p>
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-base font-bold font-mono ${stock.percentInChange >= 0
                                ? 'bg-success/10 text-success'
                                : 'bg-error/10 text-error'
                              }`}
                          >
                            {stock.percentInChange >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {stock.percentInChange >= 0 ? '+' : ''}
                            {stock.percentInChange.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                          <p className="text-lg font-semibold text-foreground">{stock.mktCapital}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
