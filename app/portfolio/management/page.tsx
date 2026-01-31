'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { PieChart, Save, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import toast from 'react-hot-toast';
import axios from 'axios';

const MARKET_CONDITIONS = [
  'Bull Market',
  'Bullish to Bearish',
  'Side Ways Market',
  'Bear Market',
  'Bearish to Bullish',
];

const DEFAULT_STRATEGIES = [
  'Intraday Trading',
  'F&O Trading',
  'Swing Trading',
  'Positional Trading',
  'Multi Bagger Stocks',
  'Index Funds (ETFs)',
  'Gold ETFs',
  'Emergency Fund (6M - 1Y)',
  'Free Cash',
];

interface Strategy {
  name: string;
  allocationPercent: number;
  allocationRupees: number;
  usedFunds: number;
  unusedFunds: number;
}

export default function PortfolioManagementPage() {
  const router = useRouter();
  const { isAuthenticated, accessToken: token } = useAuthStore();
  const [activeTab, setActiveTab] = useState(MARKET_CONDITIONS[0]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [totalCapital, setTotalCapital] = useState<number>(100000); // Default 1 Lakh
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchPortfolioData();
    }
  }, [isAuthenticated, token, activeTab]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/portfolio?marketCondition=${encodeURIComponent(activeTab)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.portfolio && response.data.portfolio.strategies.length > 0) {
        setStrategies(response.data.portfolio.strategies);
        const total = response.data.portfolio.strategies.reduce(
          (sum: number, s: Strategy) => sum + s.allocationRupees,
          0
        );
        if (total > 0) setTotalCapital(total);
      } else {
        initializeDefaults(totalCapital);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
      toast.error('Failed to load portfolio data');
      initializeDefaults(totalCapital);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaults = (capital: number) => {
    const initialStrategies = DEFAULT_STRATEGIES.map((name) => ({
      name,
      allocationPercent: 0,
      allocationRupees: 0,
      usedFunds: 0,
      unusedFunds: 0,
    }));
    setStrategies(initialStrategies);
  };

  const handleTotalCapitalChange = (value: string) => {
    const newTotal = parseFloat(value) || 0;
    setTotalCapital(newTotal);
    const updatedStrategies = strategies.map((s) => ({
      ...s,
      allocationRupees: (newTotal * s.allocationPercent) / 100,
      unusedFunds: (newTotal * s.allocationPercent) / 100 - s.usedFunds,
    }));
    setStrategies(updatedStrategies);
  };

  const handleStrategyChange = (index: number, field: keyof Strategy, value: string) => {
    const newStrategies = [...strategies];
    const strategy = { ...newStrategies[index] };
    const numValue = parseFloat(value) || 0;

    if (field === 'allocationPercent') {
      strategy.allocationPercent = numValue;
      strategy.allocationRupees = (totalCapital * numValue) / 100;
      strategy.unusedFunds = strategy.allocationRupees - strategy.usedFunds;
    } else if (field === 'allocationRupees') {
      strategy.allocationRupees = numValue;
      strategy.allocationPercent = totalCapital > 0 ? (numValue / totalCapital) * 100 : 0;
      strategy.unusedFunds = numValue - strategy.usedFunds;
    } else if (field === 'usedFunds') {
      strategy.usedFunds = numValue;
      strategy.unusedFunds = strategy.allocationRupees - numValue;
    } else if (field === 'name') {
       // @ts-ignore
      strategy.name = value;
    }

    newStrategies[index] = strategy;
    setStrategies(newStrategies);
  };

  const handleAddStrategy = () => {
      setStrategies([...strategies, {
          name: '',
          allocationPercent: 0,
          allocationRupees: 0,
          usedFunds: 0,
          unusedFunds: 0
      }]);
  };

  const handleDeleteStrategy = (index: number) => {
      const newStrategies = strategies.filter((_, i) => i !== index);
      setStrategies(newStrategies);
  };

  const calculateTotals = () => {
    return strategies.reduce(
      (acc, s) => ({
        percent: acc.percent + (s.allocationPercent || 0),
        rupees: acc.rupees + (s.allocationRupees || 0),
        used: acc.used + (s.usedFunds || 0),
        unused: acc.unused + (s.unusedFunds || 0),
      }),
      { percent: 0, rupees: 0, used: 0, unused: 0 }
    );
  };

  const totals = calculateTotals();

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        '/api/portfolio',
        {
          marketCondition: activeTab,
          strategies,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Portfolio saved successfully');
    } catch (error) {
      console.error('Failed to save portfolio', error);
      toast.error('Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="w-full px-4 py-8 md:px-6 md:py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center">
                <PieChart className="w-7 h-7 text-violet-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Portfolio Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Keep Rebalancing Your Portfolio Actively
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <label className="text-sm text-muted-foreground mb-1">Total Funds (Rs)</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={totalCapital}
                    onChange={(e) => handleTotalCapitalChange(e.target.value)}
                    className="pl-9 pr-4 py-2 w-40 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Customized Tabs */}
        <div className="w-full mb-8 overflow-x-auto pb-2">
           <div className="flex w-full border border-border/50 divide-x divide-border">
            {MARKET_CONDITIONS.map((tab) => {
               const isActive = activeTab === tab;
               
               // Specific colors based on the image provided
               // Bull Market: Green Text
               // Bullish to Bearish: Magenta/Pink Text
               // Side Ways Market: Yellow/Orange
               // Bear Market: Red
               // Bearish to Bullish: Blue

               let textColorClass = "text-muted-foreground";
               let activeClass = "";
               
               if (tab === 'Bull Market') {
                   textColorClass = isActive ? "text-[#00FF00] font-bold" : "text-[#00FF00]/70";
                   activeClass = isActive ? "bg-[#00FF00]/10" : "bg-gray-50";
               } else if (tab === 'Bullish to Bearish') {
                   textColorClass = isActive ? "text-[#FF00FF] font-bold" : "text-[#FF00FF]/70";
                   activeClass = isActive ? "bg-[#FF00FF]/10" : "bg-gray-50";
               } else if (tab === 'Side Ways Market') {
                   textColorClass = isActive ? "text-[#FFA500] font-bold" : "text-[#FFA500]/70"; // Orange/Gold
                   activeClass = isActive ? "bg-[#FFA500]/10" : "bg-gray-50";
               } else if (tab === 'Bear Market') {
                   textColorClass = isActive ? "text-[#FF0000] font-bold" : "text-[#FF0000]/70";
                   activeClass = isActive ? "bg-[#FF0000]/10" : "bg-gray-50";
               } else if (tab === 'Bearish to Bullish') {
                   textColorClass = isActive ? "text-[#0000FF] font-bold" : "text-[#0000FF]/70";
                   activeClass = isActive ? "bg-[#0000FF]/10" : "bg-gray-50";
               }

               return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 px-4 py-3 text-sm transition-all duration-200 border-b-2
                    ${activeClass}
                    ${textColorClass}
                    ${isActive ? 'border-primary shadow-sm' : 'border-transparent hover:bg-gray-100'}
                  `}
                >
                  {tab}
                </button>
               );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
             <h2 className="text-xl font-bold text-center w-full">Total Funds Rs {totalCapital.toLocaleString('en-IN')}</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-white hover:bg-white border-b-2 border-black">
                <TableHead className="w-[30%] text-black font-bold border-r border-black">Following Strategies</TableHead>
                <TableHead className="text-left text-black font-bold border-r border-black" colSpan={2}>
                    <div className="text-center border-b border-black w-full pb-1 mb-1">Allocation of Funds</div>
                    <div className="flex justify-between px-2">
                        <span>In %</span>
                        <span>In Rupees</span>
                    </div>
                </TableHead>
                <TableHead className="text-right text-black font-bold border-r border-black">Used Funds Rs</TableHead>
                <TableHead className="text-right text-black font-bold text-nowrap">Un Used Funds Rs</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                   <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                     Loading strategies...
                   </TableCell>
                 </TableRow>
              ) : (
                strategies.map((strategy, index) => (
                  <TableRow key={index} className="border-b border-gray-300 hover:bg-muted/5">
                    <TableCell className="font-medium border-r border-gray-300 py-1">
                      <div className="flex items-center">
                          <span className="mr-2 text-muted-foreground font-normal">{index + 1}.</span>
                          <input 
                            type="text" 
                            value={strategy.name}
                            onChange={(e) => handleStrategyChange(index, 'name', e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-medium"
                            placeholder="Strategy Name"
                          />
                      </div>
                    </TableCell>
                    <TableCell className="text-right border-r border-gray-300 py-1 w-[10%]">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={strategy.allocationPercent}
                        onChange={(e) =>
                          handleStrategyChange(index, 'allocationPercent', e.target.value)
                        }
                        className="w-full text-right bg-transparent focus:bg-background focus:ring-1 focus:ring-violet-500 rounded px-1"
                      />
                    </TableCell>
                    <TableCell className="text-right border-r border-gray-300 py-1 w-[15%]">
                      <input
                        type="number"
                        min="0"
                        value={strategy.allocationRupees}
                        onChange={(e) =>
                          handleStrategyChange(index, 'allocationRupees', e.target.value)
                        }
                        className="w-full text-right bg-transparent focus:bg-background focus:ring-1 focus:ring-violet-500 rounded px-1"
                      />
                    </TableCell>
                    <TableCell className="text-right border-r border-gray-300 py-1 w-[15%]">
                      <input
                        type="number"
                        min="0"
                        value={strategy.usedFunds}
                        onChange={(e) =>
                          handleStrategyChange(index, 'usedFunds', e.target.value)
                        }
                        className="w-full text-right bg-transparent focus:bg-background focus:ring-1 focus:ring-violet-500 rounded px-1"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium text-muted-foreground py-1 w-[15%]">
                      {Math.round(strategy.unusedFunds)}
                    </TableCell>
                     <TableCell className="py-1">
                         <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteStrategy(index)}
                         >
                             <span className="sr-only">Delete</span>
                             &times;
                         </Button>
                     </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="bg-white font-bold border-t-2 border-black">
              <TableRow>
                <TableCell className="border-r border-black">Total</TableCell>
                <TableCell className="text-right border-r border-black" colSpan={1}>{Math.round(totals.percent)}%</TableCell>
                <TableCell className="text-right border-r border-black">{Math.round(totals.rupees)}</TableCell>
                <TableCell className="text-right border-r border-black">{Math.round(totals.used)}</TableCell>
                <TableCell className="text-right">{Math.round(totals.unused)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          
          <div className="p-4 border-t border-border flex justify-center">
              <Button onClick={handleAddStrategy} variant="outline" className="border-dashed">
                  + Add Strategy
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
