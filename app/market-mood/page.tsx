'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, TrendingDown, Activity, AlertTriangle, Zap } from 'lucide-react';
import MarketMoodGauge from '@/components/MarketMoodGauge';

interface ZoneInfo {
  name: string;
  range: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

const zones: ZoneInfo[] = [
  {
    name: 'Extreme Fear',
    range: '0 - 25',
    description: 'Investors are extremely fearful. This could indicate a potential buying opportunity as assets may be undervalued.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: AlertTriangle,
  },
  {
    name: 'Fear',
    range: '25 - 45',
    description: 'Investors are acting fearfully. Market sentiment is negative, suggesting caution.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    icon: TrendingDown,
  },
  {
    name: 'Neutral',
    range: '45 - 55',
    description: 'Market sentiment is balanced. Neither fear nor greed is dominating.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: Activity,
  },
  {
    name: 'Greed',
    range: '55 - 75',
    description: 'Investors are acting greedy. The market may be getting overheated.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    icon: TrendingUp,
  },
  {
    name: 'Extreme Greed',
    range: '75 - 100',
    description: 'Investors are extremely greedy. This could signal a potential market correction.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: Zap,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function MarketMoodPage() {
  const [mmiValue, setMmiValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate fetching MMI data
    // In production, this would be an API call
    const fetchMMI = async () => {
      setLoading(true);
      // Simulated value - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMmiValue(65.11); // Example value in Greed zone
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchMMI();
  }, []);

  const getCurrentZone = (value: number): ZoneInfo => {
    if (value <= 25) return zones[0];
    if (value <= 45) return zones[1];
    if (value <= 55) return zones[2];
    if (value <= 75) return zones[3];
    return zones[4];
  };

  const currentZone = getCurrentZone(mmiValue);

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `Updated ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Updated just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Market Mood Index...</p>
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
          className="text-center mb-8"
        >
          <p className="text-muted-foreground mb-2">Know what&apos;s the sentiment on the street today</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Market Mood Index (MMI)
          </h1>
        </motion.div>

        {/* Gauge Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-8"
        >
          <MarketMoodGauge value={mmiValue} size={450} />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-muted-foreground text-sm mt-4"
          >
            {formatLastUpdated(lastUpdated)}
          </motion.p>
        </motion.div>

        {/* Current Zone Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="text-lg text-foreground">
            MMI is in <span className={`font-semibold ${currentZone.color}`}>the {currentZone.name.toLowerCase()} zone</span>.{' '}
            {currentZone.description}
          </p>
        </motion.div>

        {/* All Zones */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-6">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-display font-semibold text-foreground">All Zones</h2>
          </div>

          <div className="grid gap-4">
            {zones.map((zone) => (
              <motion.div
                key={zone.name}
                variants={itemVariants}
                className={`border border-border rounded-xl p-6 hover:shadow-luxury transition-all ${
                  currentZone.name === zone.name ? 'ring-2 ring-offset-2 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${zone.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <zone.icon className={`h-6 w-6 ${zone.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${zone.color}`}>{zone.name}</h3>
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {zone.range}
                      </span>
                      {currentZone.name === zone.name && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{zone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What is MMI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-muted/30 border border-border rounded-xl p-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">What is Market Mood Index?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Market Mood Index (MMI) is a sentiment indicator that measures the emotional state of the market.
                It ranges from 0 to 100, where lower values indicate fear and higher values indicate greed.
              </p>
              <p>
                The MMI is calculated using multiple factors including market momentum, stock price strength,
                put/call ratio, volatility, and safe haven demand. It helps investors understand whether the market
                is being driven by fear or greed at any given time.
              </p>
              <p>
                <strong className="text-foreground">How to use:</strong> When the MMI is in the extreme fear zone,
                it may indicate a buying opportunity as stocks could be undervalued. Conversely, when the MMI is
                in the extreme greed zone, it may signal that the market is due for a correction.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
