'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  BarChart3,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Eye,
  Briefcase,
  LayoutDashboard,
  LineChart,
  ChevronDown,
  Activity,
  PieChart
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketDataOpen, setMarketDataOpen] = useState(false);
  const [mobileMarketDataOpen, setMobileMarketDataOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/watchlist', label: 'Watchlist', icon: Eye },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  ];

  const marketDataLinks = {
    globalMarkets: {
      indices: [
        { href: '/market-data/indices/nse', label: 'NSE Indices' },
        { href: '/market-data/indices/bse', label: 'BSE Indices' },
      ],
      sectors: [
        { href: '/market-data/sectors/nse', label: 'NSE Sectors' },
        { href: '/market-data/sectors/bse', label: 'BSE Sectors' },
      ],
    },
    equity: [
      { href: '/market-data/equity/stocks', label: 'Stocks' },
      { href: '/gainers', label: 'Gainers' },
      { href: '/losers', label: 'Losers' },
      { href: '/market-data/equity/sectors', label: 'Sectors' },
      { href: '/market-data/equity/industry', label: 'Industry' },
      { href: '/market-data/equity/ipos', label: "IPO's" },
      { href: '/market-data/equity/fno-stocks', label: 'F&O Stocks' },
    ],
    others: {
      general: [
        { href: '/market-data/others/results-calendar', label: 'Results Calendar' },
        { href: '/market-data/others/fii-dii', label: 'FII & DII' },
      ],
      promotersActivity: [
        { href: '/market-data/others/promoters-activity/buy', label: 'Buy' },
        { href: '/market-data/others/promoters-activity/sell', label: 'Sell' },
      ],
      mutualFunds: [
        { href: '/market-data/others/mutual-funds/buy', label: 'Buy' },
        { href: '/market-data/others/mutual-funds/sell', label: 'Sell' },
      ],
    },
  };

  const isMarketDataActive = pathname.startsWith('/market-data');

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <BarChart3 className="h-7 w-7 text-foreground transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-primary/30 transition-all" />
            </div>
            <span className="text-xl font-display font-semibold text-foreground tracking-tight">
              StockMarket Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? 'text-foreground bg-secondary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-secondary rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Market Data Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setMarketDataOpen(true)}
                onMouseLeave={() => setMarketDataOpen(false)}
              >
                <button
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isMarketDataActive
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }
                  `}
                >
                  <LineChart className="h-4 w-4" />
                  <span>Market Data</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${marketDataOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {marketDataOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 border border-border rounded-xl shadow-xl overflow-hidden z-50"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="flex p-4 gap-6">
                        {/* Global Markets Column */}
                        <div className="min-w-[160px]">
                          <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">
                            Global Markets
                          </div>

                          {/* Indices */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              <Activity className="h-3 w-3" />
                              Indices
                            </div>
                            {marketDataLinks.globalMarkets.indices.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                  block px-2 py-1.5 text-sm rounded-lg transition-all
                                  ${pathname === link.href
                                    ? 'text-foreground bg-secondary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                  }
                                `}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>

                          {/* Sectors */}
                          <div>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              <PieChart className="h-3 w-3" />
                              Sectors
                            </div>
                            {marketDataLinks.globalMarkets.sectors.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                  block px-2 py-1.5 text-sm rounded-lg transition-all
                                  ${pathname === link.href
                                    ? 'text-foreground bg-secondary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                  }
                                `}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Equity Column */}
                        <div className="min-w-[140px] border-l border-border pl-6">
                          <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">
                            Equity
                          </div>
                          {marketDataLinks.equity.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`
                                block px-2 py-1.5 text-sm rounded-lg transition-all
                                ${pathname === link.href
                                  ? 'text-foreground bg-secondary'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }
                              `}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>

                        {/* Others Column */}
                        <div className="min-w-[160px] border-l border-border pl-6">
                          <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">
                            Others
                          </div>

                          {/* General Others */}
                          {marketDataLinks.others.general.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`
                                block px-2 py-1.5 text-sm rounded-lg transition-all
                                ${pathname === link.href
                                  ? 'text-foreground bg-secondary'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }
                              `}
                            >
                              {link.label}
                            </Link>
                          ))}

                          {/* Promoters Activity */}
                          <div className="mt-3">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Promoters Activity
                            </div>
                            {marketDataLinks.others.promotersActivity.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                  block px-2 py-1.5 text-sm rounded-lg transition-all
                                  ${pathname === link.href
                                    ? 'text-foreground bg-secondary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                  }
                                `}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>

                          {/* Mutual Funds */}
                          <div className="mt-3">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Mutual Funds
                            </div>
                            {marketDataLinks.others.mutualFunds.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                  block px-2 py-1.5 text-sm rounded-lg transition-all
                                  ${pathname === link.href
                                    ? 'text-foreground bg-secondary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                  }
                                `}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user?.firstName || user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {isAuthenticated ? (
                  <>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                            ${isActive
                              ? 'text-foreground bg-secondary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }
                          `}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}

                    {/* Mobile Market Data Section */}
                    <div className="px-4 py-3">
                      <button
                        onClick={() => setMobileMarketDataOpen(!mobileMarketDataOpen)}
                        className={`
                          w-full flex items-center justify-between text-sm font-medium transition-colors
                          ${isMarketDataActive
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <LineChart className="h-4 w-4" />
                          <span>Market Data</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileMarketDataOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {mobileMarketDataOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 ml-7 space-y-3 overflow-hidden"
                          >
                            {/* Global Markets */}
                            <div>
                              <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 pb-1 border-b border-border">
                                Global Markets
                              </div>

                              {/* Indices */}
                              <div className="mb-2">
                                <div className="flex items-center gap-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  <Activity className="h-3 w-3" />
                                  Indices
                                </div>
                                {marketDataLinks.globalMarkets.indices.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      setMobileMarketDataOpen(false);
                                    }}
                                    className={`
                                      block py-2 pl-5 text-sm rounded-lg transition-colors
                                      ${pathname === link.href
                                        ? 'text-foreground bg-secondary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                      }
                                    `}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>

                              {/* Sectors */}
                              <div>
                                <div className="flex items-center gap-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  <PieChart className="h-3 w-3" />
                                  Sectors
                                </div>
                                {marketDataLinks.globalMarkets.sectors.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      setMobileMarketDataOpen(false);
                                    }}
                                    className={`
                                      block py-2 pl-5 text-sm rounded-lg transition-colors
                                      ${pathname === link.href
                                        ? 'text-foreground bg-secondary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                      }
                                    `}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Equity */}
                            <div>
                              <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 pb-1 border-b border-border">
                                Equity
                              </div>
                              {marketDataLinks.equity.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileMarketDataOpen(false);
                                  }}
                                  className={`
                                    block py-2 pl-2 text-sm rounded-lg transition-colors
                                    ${pathname === link.href
                                      ? 'text-foreground bg-secondary'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }
                                  `}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>

                            {/* Others */}
                            <div>
                              <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 pb-1 border-b border-border">
                                Others
                              </div>

                              {/* General */}
                              {marketDataLinks.others.general.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileMarketDataOpen(false);
                                  }}
                                  className={`
                                    block py-2 pl-2 text-sm rounded-lg transition-colors
                                    ${pathname === link.href
                                      ? 'text-foreground bg-secondary'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }
                                  `}
                                >
                                  {link.label}
                                </Link>
                              ))}

                              {/* Promoters Activity */}
                              <div className="mt-2">
                                <div className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Promoters Activity
                                </div>
                                {marketDataLinks.others.promotersActivity.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      setMobileMarketDataOpen(false);
                                    }}
                                    className={`
                                      block py-2 pl-5 text-sm rounded-lg transition-colors
                                      ${pathname === link.href
                                        ? 'text-foreground bg-secondary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                      }
                                    `}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>

                              {/* Mutual Funds */}
                              <div className="mt-2">
                                <div className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Mutual Funds
                                </div>
                                {marketDataLinks.others.mutualFunds.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      setMobileMarketDataOpen(false);
                                    }}
                                    className={`
                                      block py-2 pl-5 text-sm rounded-lg transition-colors
                                      ${pathname === link.href
                                        ? 'text-foreground bg-secondary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                      }
                                    `}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>


                    <div className="pt-4 mt-4 border-t border-border">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-foreground">
                          {user?.firstName || user?.username}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors mt-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-2 text-sm font-medium text-center text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
