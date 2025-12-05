'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Wallet, TrendingUp, PieChart, BarChart3, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
      duration: 0.4,
    },
  },
};

const upcomingFeatures = [
  { icon: TrendingUp, label: 'Add and track stock holdings' },
  { icon: BarChart3, label: 'Real-time profit/loss calculation' },
  { icon: PieChart, label: 'Investment performance analytics' },
  { icon: LineChart, label: 'Portfolio diversification insights' },
];

export default function PortfolioPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                My Portfolio
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Track your investments and returns
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-background border border-border rounded-2xl p-12 text-center shadow-luxury"
        >
          <motion.div variants={itemVariants}>
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Portfolio Management
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Coming Soon! Track your holdings, P&L, and investment performance.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-secondary rounded-2xl p-8 max-w-2xl mx-auto"
          >
            <h4 className="text-lg font-display font-bold text-foreground mb-6">
              Upcoming Features
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3 p-3 bg-background rounded-xl border border-border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-left">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
