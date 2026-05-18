'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  CheckCircle,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  Loader2,
  Trash2
} from "lucide-react";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 md:ml-64 flex flex-col items-center justify-center pt-24 md:pt-8">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm font-bold animate-pulse">Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Pakistan-localized notification demo data using requested names
  const notifications = [
    {
      id: 1,
      type: "booking",
      icon: CheckCircle,
      iconColor: "text-green-400 bg-green-400/10",
      title: "New Booking Received",
      message: "Ayesha booked your 'Web Development Tutoring' service. Session scheduled for tomorrow at 4:00 PM.",
      time: "10 minutes ago",
      unread: true
    },
    {
      id: 2,
      type: "payment",
      icon: DollarSign,
      iconColor: "text-[#10b981] bg-[#10b981]/10",
      title: "Payment Credited via JazzCash",
      message: "Rs. 3,500 successfully transferred from Usman for his coding session.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 3,
      type: "message",
      icon: MessageSquare,
      iconColor: "text-blue-400 bg-blue-400/10",
      title: "New Message from Abeeha",
      message: "\"Hey Zohaib, I had a question about the assignment we discussed. Can you review it?\"",
      time: "5 hours ago",
      unread: false
    },
    {
      id: 4,
      type: "payment",
      icon: DollarSign,
      iconColor: "text-[#10b981] bg-[#10b981]/10",
      title: "Payment Received via EasyPaisa",
      message: "Daniyal sent Rs. 5,000 for ReactJS Consultation support.",
      time: "1 day ago",
      unread: false
    },
    {
      id: 5,
      type: "system",
      icon: AlertTriangle,
      iconColor: "text-yellow-400 bg-yellow-400/10",
      title: "Profile Review Approved",
      message: "Aymen left a 5-star review: \"Best developer! Solved my bugs in no time!\"",
      time: "2 days ago",
      unread: false
    },
    {
      id: 6,
      type: "booking",
      icon: CheckCircle,
      iconColor: "text-green-400 bg-green-400/10",
      title: "Booking Completed",
      message: "Your programming mentorship session with Eman has been successfully completed.",
      time: "3 days ago",
      unread: false
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                Notifications
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">Stay updated with your bookings, transactions, and reviews.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all text-muted-foreground hover:text-white">
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-5 rounded-[1.8rem] border transition-all duration-300 relative overflow-hidden group ${
                    notification.unread
                      ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                      : "bg-card/30 backdrop-blur-sm border-white/5 hover:border-white/10"
                  }`}
                >
                  {notification.unread && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-xl" />
                  )}
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${notification.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                        <h3 className={`font-bold text-base md:text-lg ${notification.unread ? 'text-white' : 'text-foreground'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground font-semibold md:font-bold">{notification.time}</span>
                      </div>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
