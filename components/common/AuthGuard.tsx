'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingSpinner } from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

export function AuthGuard({ children, loadingMessage = 'Loading...' }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to allow hydration
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isChecking || !isAuthenticated) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  return <>{children}</>;
}

export default AuthGuard;
