'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  User,
  Settings,
  Bell,
  Shield,
  GraduationCap,
  Menu,
  X
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const authenticated = status === "authenticated";
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: Calendar, label: "Bookings", path: "/booking/1" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <>
      {/* Mobile Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-50 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
            SkillBridge
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-foreground/70 hover:text-foreground rounded-lg hover:bg-foreground/5 transition-all"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`w-64 bg-card border-r border-border h-screen fixed top-0 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0 left-0' : '-translate-x-full md:translate-x-0 md:left-0'
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-foreground/70 hover:text-foreground rounded-lg hover:bg-foreground/5 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white shadow-xl scale-105"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/admin')
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white shadow-xl scale-105"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-6 border-t border-border bg-foreground/5 mt-auto">
          {loading ? (
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-20 bg-foreground/10 rounded animate-pulse" />
                <div className="h-3 w-24 bg-foreground/5 rounded animate-pulse" />
              </div>
            </div>
          ) : authenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold truncate">{session?.user?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{session?.user?.email}</div>
              </div>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-bold transition-all">
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
