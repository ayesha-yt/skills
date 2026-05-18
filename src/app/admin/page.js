'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Loader2,
  Clock
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth & Admin Guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, servicesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/services')
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const servicesData = await servicesRes.json();

      if (statsData.stats) {
        // Localize stats currency
        const localizedStats = statsData.stats.map(s => {
          if (s.label === "Revenue") return { ...s, value: s.value.replace('$', 'Rs. ') };
          return s;
        });
        setStats(localizedStats);
      }
      
      if (Array.isArray(statsData.categories)) {
        const colors = ["#7c3aed", "#3b82f6", "#8b5cf6", "#06b6d4", "#a855f7", "#6366f1"];
        setCategoryData(statsData.categories.map((c, i) => ({ ...c, color: colors[i % colors.length] })));
      } else {
        setCategoryData([]);
      }
      setRecentUsers(Array.isArray(usersData) ? usersData : []);
      setPendingServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setRecentUsers([]);
      setPendingServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchAdminData();
    }
  }, [status, session]);

  const handleApproval = async (id, status) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setPendingServices(prev => prev.filter(s => s.id !== id));
        fetchAdminData(); // Refresh stats
      }
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const revenueData = [
    { month: "Jan", revenue: 65000, users: 8500 },
    { month: "Feb", revenue: 72000, users: 8900 },
    { month: "Mar", revenue: 85000, users: 9400 },
    { month: "Apr", revenue: 98000, users: 9800 },
    { month: "May", revenue: 124500, users: 10247 }
  ];

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Control Panel
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Monitor and manage SkillBridge platform</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold hover:scale-105">
                <Download className="w-5 h-5" />
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {(stats.length > 0 ? stats : [
              { icon: Users, label: "Total Users", value: "0" },
              { icon: ShoppingBag, label: "Active Services", value: "0" },
              { icon: DollarSign, label: "Revenue", value: "Rs. 0" },
              { icon: Clock, label: "Bookings", value: "0" }
            ]).map((stat, index) => {
              const Icon = stat.icon || (index === 0 ? Users : index === 1 ? ShoppingBag : index === 2 ? DollarSign : Clock);
              return (
                <div
                  key={index}
                  className="bg-card/30 backdrop-blur-sm rounded-[2rem] p-8 border border-white/5 hover:border-primary/30 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    {stat.change && (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-black text-foreground mb-2 leading-none">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden relative">
              <h2 className="text-2xl font-bold mb-8">Revenue & Growth</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15,15,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      itemStyle={{ color: '#f8f9ff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={4} dot={{ r: 4, fill: '#7c3aed', strokeWidth: 2, stroke: '#fff' }} name="Revenue (Rs.)" />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} name="Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden relative">
              <h2 className="text-2xl font-bold mb-8">Categories</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData.length > 0 ? categoryData : [{ name: 'None', value: 1, color: '#333' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15,15,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Search className="w-5 h-5 text-primary" />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Filter className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
                        <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Email</th>
                        <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Role</th>
                        <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                        <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="py-5 px-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-lg">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-sm text-muted-foreground font-medium">{user.email}</td>
                          <td className="py-5 px-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              user.role === "admin" ? "bg-primary/10 text-primary border border-primary/20" : "bg-green-400/10 text-green-400 border border-green-400/20"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-5 px-4 text-sm text-muted-foreground font-medium">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="py-5 px-4">
                            <button className="text-primary hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl mb-8">
                <h2 className="text-2xl font-bold mb-8">Pending Approvals</h2>
                <div className="space-y-4">
                  {pendingServices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground font-bold">No pending services</div>
                  ) : pendingServices.map((service) => (
                    <div key={service.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{service.title}</div>
                      <div className="text-xs text-muted-foreground mb-6 font-medium">
                        by {service.seller_name} • {service.category}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleApproval(service.id, 'approved')}
                          className="flex-1 py-2.5 bg-green-500/10 text-green-400 rounded-xl text-xs font-black border border-green-400/20 hover:bg-green-500 hover:text-white transition-all active:scale-95"
                        >
                          APPROVE
                        </button>
                        <button 
                          onClick={() => handleApproval(service.id, 'rejected')}
                          className="flex-1 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-black border border-red-400/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          REJECT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[2.5rem] p-8 shadow-2xl text-white border border-white/10 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                  </div>
                  <div>
                    <div className="font-black text-lg">System Health</div>
                    <div className="text-xs opacity-60 font-bold uppercase tracking-widest">All Systems Operational</div>
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="opacity-60">Database</span>
                    <span className="text-green-400">HEALTHY</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="opacity-60">API Load</span>
                    <span className="text-primary">OPTIMAL (12%)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="opacity-60">Response</span>
                    <span>32ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
