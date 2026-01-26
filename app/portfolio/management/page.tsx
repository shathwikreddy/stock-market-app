'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PortfolioManagementPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-8 md:px-6 md:py-12">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center">
              <PieChart className="w-7 h-7 text-violet-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Portfolio Management
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Analyze allocations and manage risk
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center h-[50vh] border border-dashed border-border rounded-3xl bg-muted/5">
            <div className="text-center">
                <PieChart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold text-foreground">coming soon</h2>
                <p className="text-muted-foreground mt-2">This feature is currently under development.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
