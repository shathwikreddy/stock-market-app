'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function NavLink({ href, label, icon: Icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${isActive
          ? 'text-foreground bg-secondary'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }
      `}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-secondary rounded-lg -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}
