'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';
import Footer from './Footer';

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  
  // Load persisted theme accent color on mount
  useEffect(() => {
    const themeId = localStorage.getItem('skillbridge_accent') || 'purple';
    const themes = {
      purple: { primary: '#7c3aed', secondary: '#3b82f6' },
      emerald: { primary: '#10b981', secondary: '#14b8a6' },
      rose: { primary: '#ec4899', secondary: '#f43f5e' },
      amber: { primary: '#f59e0b', secondary: '#ef4444' },
      cyan: { primary: '#06b6d4', secondary: '#3b82f6' },
    };
    const selected = themes[themeId] || themes.purple;
    document.documentElement.style.setProperty('--primary', selected.primary);
    document.documentElement.style.setProperty('--secondary', selected.secondary);
    document.documentElement.style.setProperty('--ring', selected.primary);
  }, []);
  
  // Routes that should NOT have the global NavBar and Footer
  const noNavRoutes = ['/dashboard', '/profile', '/settings', '/bookings', '/booking', '/marketplace', '/admin', '/service'];
  
  const shouldHideNav = noNavRoutes.some(route => pathname?.startsWith(route));

  return (
    <>
      {!shouldHideNav && <NavBar transparent />}
      <main className={shouldHideNav ? "" : "pt-20"}>
        {children}
      </main>
      {!shouldHideNav && <Footer />}
    </>
  );
}
