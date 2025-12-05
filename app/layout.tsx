import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StockMarket Pro - Premium Trading Platform',
  description: 'Institutional-grade stock market data and portfolio management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-foreground">
        <Navbar />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#18181B',
              color: '#FAFAFA',
              border: '1px solid #27272A',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#FAFAFA',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FAFAFA',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
