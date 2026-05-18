'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Star,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Edit,
  Mail,
  Phone,
  GraduationCap,
  Code,
  Palette,
  Camera,
  TrendingUp,
  Plus,
  Loader2
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth Guard: Redirect to login if not authenticated
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
          <p className="text-muted-foreground text-sm font-bold animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ZB';

  const userSkillsList = user?.skills ? user.skills.split(',').map(s => s.trim()) : [];

  const skills = userSkillsList.length > 0 ? userSkillsList.map(skill => ({
    icon: Code, // Default icon
    name: skill,
    level: "Advanced"
  })) : [
    { icon: Code, name: "Web Development", level: "Expert" },
    { icon: Palette, name: "UI/UX Design", level: "Advanced" },
    { icon: TrendingUp, name: "Digital Marketing", level: "Intermediate" }
  ];

  const services = [
    {
      id: 1,
      title: "Web Development Tutoring",
      category: "Development",
      price: 3500,
      rating: 4.9,
      reviews: 127,
      active: true
    },
    {
      id: 2,
      title: "React.js Consultation",
      category: "Development",
      price: 5000,
      rating: 5.0,
      reviews: 89,
      active: true
    },
    {
      id: 3,
      title: "Portfolio Website Design",
      category: "Design",
      price: 20000,
      rating: 4.8,
      reviews: 56,
      active: false
    }
  ];

  const reviews = [
    {
      service: "Web Development Tutoring",
      reviewer: "Sarah Ahmed",
      avatar: "SA",
      rating: 5,
      date: "May 10, 2026",
      text: "Excellent tutor! Very patient and knowledgeable. Helped me understand complex React concepts."
    },
    {
      service: "React.js Consultation",
      reviewer: "Mohsin Ali",
      avatar: "MA",
      rating: 5,
      date: "May 8, 2026",
      text: "Great experience! Provided valuable insights for my final year project. Highly recommended!"
    },
    {
      service: "Web Development Tutoring",
      reviewer: "Ayesha Khan",
      avatar: "AK",
      rating: 4,
      date: "May 5, 2026",
      text: "Very helpful session. Clear explanations and practical examples. Will book again!"
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground text-lg">Manage your digital identity and professional services</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6">
                  <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mb-10 pt-4">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      {initials}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#10b981] border-4 border-[#050507] flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-foreground mb-2">{user?.name || 'Zohaib Baig'}</h2>
                  <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">University Student</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-black text-lg">4.9</span>
                    <span className="text-muted-foreground font-medium">(272 reviews)</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary shadow-lg shadow-primary/5">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Top Rated Seller</span>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  {[
                    { icon: Mail, value: user?.email || "zohaibbaig144@gmail.com" },
                    { icon: Phone, value: "+92 300 1234567" },
                    { icon: GraduationCap, value: "NUST, Pakistan" },
                    { icon: MapPin, value: "Islamabad, PK" },
                    { icon: Calendar, value: "Joined Jan 2024" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-muted-foreground hover:text-white transition-colors group/item">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-primary/20 transition-all">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-primary rounded-full" />
                   Skills & Expertise
                </h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-foreground">{skill.name}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{skill.level}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-widest opacity-80">Total Revenue</div>
                      <div className="text-3xl font-black">Rs. 124,500</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                    <div>
                      <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">This Month</div>
                      <div className="text-xl font-black">Rs. 12,500</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Completed</div>
                      <div className="text-xl font-black">156</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-secondary rounded-full" />
                    Professional Bio
                  </h2>
                  <button className="text-primary hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Edit Bio</button>
                </div>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                    Hey there! I'm {user?.name || 'Zohaib'}, a university student with a passion for web
                    development and digital services. I've been working on practical projects and love helping fellow students
                    with their assignments and technical challenges.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                    I specialize in building things from scratch and offering consultations. My approach focuses on practical, hands-on learning with real-world applications.
                  </p>
                </div>
              </div>

              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    My Active Services
                  </h2>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    List Service
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                service.active
                                  ? "bg-green-400/10 text-green-400 border-green-400/20"
                                  : "bg-white/5 text-muted-foreground border-white/10"
                              }`}
                            >
                              {service.active ? "Live" : "Draft"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-6 font-medium">{service.category}</p>
                          <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-black">{service.rating}</span>
                              <span className="text-muted-foreground text-xs font-bold">({service.reviews} reviews)</span>
                            </div>
                            <div className="flex items-baseline gap-1 text-primary">
                              <span className="text-2xl font-black">Rs. {service.price}</span>
                              <span className="text-xs text-muted-foreground font-bold">/ session</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary/20 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-secondary rounded-full" />
                  Client Reviews
                </h2>
                <div className="space-y-10">
                  {reviews.map((review, index) => (
                    <div key={index} className="relative group/review">
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-xl flex-shrink-0 group-hover/review:scale-110 transition-transform duration-500">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-bold text-lg text-foreground">{review.reviewer}</div>
                              <div className="text-xs text-primary font-black uppercase tracking-widest">{review.service}</div>
                            </div>
                            <div className="text-xs text-muted-foreground font-bold">{review.date}</div>
                          </div>
                          <div className="flex gap-1.5 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`} />
                            ))}
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-lg font-medium italic">"{review.text}"</p>
                        </div>
                      </div>
                      {index < reviews.length - 1 && <div className="mt-10 border-b border-white/5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
