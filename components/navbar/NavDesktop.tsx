'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from './NavLink';
import { MarketDataDropdown } from './MarketDataDropdown';
import { ScreenersDropdown } from './ScreenersDropdown';
import { PortfolioDropdown } from './PortfolioDropdown';
import { navLinks, afterMarketDataLinks } from '@/lib/nav-config';

interface NavDesktopProps {
  user: { firstName?: string; username?: string; email?: string } | null;
  onLogout: () => void;
}

export function NavDesktop({ user, onLogout }: NavDesktopProps) {
  const pathname = usePathname();
  const isMarketDataActive = pathname.startsWith('/market-data');
  const isScreenersActive = pathname.startsWith('/screeners');
  const isPortfolioActive = pathname.startsWith('/portfolio');

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon!}
          isActive={pathname === link.href}
        />
      ))}

      <MarketDataDropdown isActive={isMarketDataActive} />
      <ScreenersDropdown isActive={isScreenersActive} />

      {afterMarketDataLinks.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon!}
          isActive={pathname === link.href}
        />
      ))}

      <PortfolioDropdown isActive={isPortfolioActive} pathname={pathname} />

      {/* Notes */}
      <Link
        href="/notes"
        className={`
          relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${pathname === '/notes'
            ? 'text-foreground bg-secondary'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }
        `}
      >
        <StickyNote className="h-4 w-4" />
        <span>Notes</span>
        {pathname === '/notes' && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute inset-0 bg-secondary rounded-lg -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>

      {/* User Menu */}
      <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {user?.firstName || user?.username}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
