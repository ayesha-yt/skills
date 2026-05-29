'use client';

import { useState, useEffect, use } from 'react';
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Star, MessageCircle, Calendar, Clock, CheckCircle2, Award, Users, ArrowLeft } from "lucide-react";

export default function ServiceDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${params.id}`);
        if (!res.ok) throw new Error('Service not found');
        const data = await res.json();
        setService(data);
      } catch (err) {
        setError('Could not load this service.');
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.id]);

  const reviews = [
    { name: "Sarah Johnson", avatar: "SJ", rating: 5, date: "2 days ago", text: "Absolutely amazing! Very knowledgeable and patient. Helped me understand concepts I was struggling with." },
    { name: "Michael Chen",  avatar: "MC", rating: 5, date: "1 week ago", text: "Great session! Very responsive and explains things clearly. Highly recommend." },
    { name: "Emma Williams", avatar: "EW", rating: 4, date: "2 weeks ago", text: "Really helpful. Provided great resources and practical examples. Will definitely book again!" }
  ];

  const gradients = [
    "from-[#1e1b4b] to-[#312e81]",
    "from-[#4a1942] to-[#7e1d6b]",
    "from-[#1a3a2e] to-[#145a3c]",
    "from-[#1a2a4a] to-[#153060]",
    "from-[#3a2010] to-[#6b3a0f]",
  ];
  const gradient = service ? gradients[service.id % gradients.length] : gradients[0];

  const serviceInitials = service?.title?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '..';

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center pt-24 md:pt-8">
          <div className="text-muted-foreground text-lg font-bold animate-pulse">Loading service...</div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center pt-24 md:pt-8">
          <div className="text-center">
            <div className="text-red-400 text-xl font-bold mb-4">{error || 'Service not found'}</div>
            <Link href="/marketplace" className="text-primary font-bold hover:underline">← Back to Marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8">
        <div className="max-w-7xl mx-auto">

          {/* Back link */}
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white font-bold mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">

              {/* Hero Banner */}
              <div className={`bg-gradient-to-br ${gradient} rounded-[3rem] h-80 flex items-center justify-center text-white shadow-2xl relative overflow-hidden border border-white/10`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="text-center relative z-10 px-8">
                  <div className="text-6xl font-black mb-4 tracking-tighter drop-shadow-2xl uppercase">
                    {service.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <div className="text-base font-bold uppercase tracking-[0.3em] opacity-60">{service.category} Service</div>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
                  <div>
                    <h1 className="text-4xl font-black mb-4 leading-tight">{service.title}</h1>
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="px-5 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-black text-lg">5.0</span>
                        <span className="text-muted-foreground font-bold">(New)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none mb-1">
                      Rs. {service.price}
                    </div>
                    <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">per session</div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      About This Service
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-secondary rounded-full" />
                      What&apos;s Included
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {["One-on-one sessions", "Customized learning plan", "Code review & feedback", "Real-world examples", "Follow-up support via chat", "Flexible scheduling"].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-[1.5rem] hover:border-primary/30 transition-all group">
                          <CheckCircle2 className="w-6 h-6 text-[#10b981] flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-foreground font-bold">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  Student Reviews
                </h2>
                <div className="space-y-10">
                  {reviews.map((review, index) => (
                    <div key={index} className="relative group/review">
                      <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-xl flex-shrink-0 group-hover/review:scale-110 transition-transform duration-500">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-bold text-xl text-foreground">{review.name}</div>
                              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{review.date}</div>
                            </div>
                            <div className="flex gap-1.5">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 shadow-xl" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">&ldquo;{review.text}&rdquo;</p>
                        </div>
                      </div>
                      {index < reviews.length - 1 && <div className="mt-10 border-b border-white/5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="lg:col-span-1">
              <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl sticky top-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

                <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/5">
                  {service.seller_avatar ? (
                    <img src={service.seller_avatar} alt={service.seller_name} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-2xl ring-4 ring-primary/20" />
                  ) : (
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black shadow-2xl ring-4 ring-primary/20">
                      {service.seller_name?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-black text-xl text-foreground">{service.seller_name}</div>
                    <div className="text-xs text-primary font-black uppercase tracking-widest mt-1">{service.category} Expert</div>
                    {service.seller_skills && (
                      <div className="text-xs text-muted-foreground mt-2 font-medium">{service.seller_skills}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: Award, label: "Response Time", val: "Within 1 hr" },
                    { icon: Users, label: "Total Students", val: "150+" },
                    { icon: Clock, label: "Duration", val: "1–3 hrs" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.label}</div>
                        <div className="text-base font-black text-foreground">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Link
                    href={`/booking/${service.id}`}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95"
                  >
                    <Calendar className="w-6 h-6" />
                    Book Session
                  </Link>
                  <button className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-foreground rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all group">
                    <MessageCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    Contact {service.seller_name?.split(' ')[0]}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#10b981]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SkillBridge Guaranteed</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center font-bold px-4">
                    Secure payments &amp; student protection on every session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
