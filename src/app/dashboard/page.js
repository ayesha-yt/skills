'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Bell,
  Calendar,
  Star,
  MessageCircle,
  ArrowRight,
  Clock,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/user/stats');
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboard();
    }
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 ml-64 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm font-bold animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If we reach here and status is unauthenticated, the useEffect will handle it
  if (status === 'unauthenticated') return null;

  const stats = [
    { icon: DollarSign, label: "Total Earnings", value: `Rs. ${(data?.earnings || 0).toLocaleString()}`, change: "+12.5%", trend: "up" },
    { icon: ShoppingBag, label: "Active Services", value: (data?.serviceCount || 0).toString(), change: "+1", trend: "up" },
    { icon: Users, label: "Total Clients", value: (data?.clientCount || 0).toString(), change: "+0", trend: "up" },
    { icon: Star, label: "Average Rating", value: (data?.rating || 5.0).toFixed(1), change: "+0.0", trend: "up" }
  ];

  const recentBookings = data?.recentBookings || [];

  const notifications = [
    { icon: MessageCircle, text: "Welcome to SkillBridge!", time: "Just now", unread: true },
    { icon: Star, text: "Complete your profile to get more clients", time: "1 day ago", unread: false }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Welcome back, {session?.user?.name || 'Zohaib'}!
              </h1>
              <p className="text-muted-foreground text-lg font-medium">Here's what's happening with your services today</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
              <Bell className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-foreground">Notifications</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card/30 backdrop-blur-sm rounded-[2rem] p-8 border border-white/5 hover:border-primary/30 transition-all duration-500 hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-foreground mb-2 leading-none">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Recent Bookings</h2>
                  <a href="/bookings" className="text-primary hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group">
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="space-y-4">
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                      <p className="text-muted-foreground font-bold">No bookings found yet.</p>
                    </div>
                  ) : recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          {booking.buyer_avatar ? (
                            <img src={booking.buyer_avatar} className="w-14 h-14 rounded-full object-cover shadow-xl" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-xl group-hover:scale-105 transition-transform">
                              {booking.buyer_name?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{booking.service_title}</div>
                            <div className="text-sm text-muted-foreground font-medium">{booking.buyer_name}</div>
                          </div>
                        </div>
                        <div className="hidden md:block text-right">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-bold">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Clock className="w-4 h-4 opacity-50" />
                            {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                              booking.status === "requested"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-green-400/10 text-green-400 border border-green-400/20"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Alerts</h2>
                  <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-black shadow-lg shadow-primary/30">
                    NEW ({notifications.filter(n => n.unread).length})
                  </span>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification, index) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={index}
                        className={`p-5 rounded-2xl border transition-all duration-300 group hover:scale-[1.02] ${
                          notification.unread
                            ? "bg-primary/5 border-primary/20"
                            : "bg-white/5 border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground font-bold leading-tight">{notification.text}</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] p-8 shadow-2xl text-white mt-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-3">Upgrade to Pro</h3>
                  <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
                    Get featured placement and priority support to scale your business.
                  </p>
                  <button className="w-full bg-white text-primary py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95">
                    Explore Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
