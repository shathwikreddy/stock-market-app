'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Icon className={`w-7 h-7 ${iconColor}`} />
            </div>
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>

        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </motion.div>
  );
}

export default PageHeader;
