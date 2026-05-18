'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';
import Footer from './Footer';

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  
  // Load persisted theme accent color and dark/light mode on mount
  useEffect(() => {
    // Accent Theme
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

    // Dark/Light Mode Theme variables
    const isLight = localStorage.getItem('skillbridge_theme') === 'light';
    const root = document.documentElement;
    if (isLight) {
      root.style.setProperty('--background', '#f8fafc');
      root.style.setProperty('--foreground', '#0f172a');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--border', 'rgba(15, 23, 42, 0.08)');
      root.style.setProperty('--input-background', 'rgba(15, 23, 42, 0.03)');
      root.style.setProperty('--muted-foreground', '#64748b');
    } else {
      root.style.setProperty('--background', '#050507');
      root.style.setProperty('--foreground', '#f8f9ff');
      root.style.setProperty('--card', '#0f0f13');
      root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--input-background', 'rgba(255, 255, 255, 0.03)');
      root.style.setProperty('--muted-foreground', '#94a3b8');
    }
  }, []);
  
  // Routes that should NOT have the global NavBar and Footer
  const noNavRoutes = ['/dashboard', '/profile', '/settings', '/bookings', '/booking', '/marketplace', '/admin', '/service', '/notifications'];
  
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
