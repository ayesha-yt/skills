'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Calendar, Clock, CreditCard, CheckCircle2, User, MessageSquare, ChevronRight, Loader2 } from "lucide-react";

export default function BookingPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const router = useRouter();

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM"
  ];

  const durations = ["1 hour session", "1.5 hours session", "2 hours session", "3 hours session"];

  const paymentMethods = [
    { id: 'card',      label: 'Debit / Credit Card', desc: 'Secure payment via Visa/MasterCard', icon: CreditCard },
    { id: 'jazzcash',  label: 'JazzCash',           desc: 'Pay via JazzCash Mobile Wallet',     icon: '📱' },
    { id: 'easypaisa', label: 'EasyPaisa',          desc: 'Pay via EasyPaisa Mobile Wallet',    icon: '💸' },
    { id: 'cash',      label: 'Cash on Delivery',    desc: 'Pay in person at the university',    icon: '💵' },
  ];

  // Form state
  const [selectedTime, setSelectedTime]         = useState("2:00 PM");
  const [selectedPayment, setSelectedPayment]   = useState("card");
  const [selectedDuration, setSelectedDuration] = useState("1 hour session");
  const [durationOpen, setDurationOpen]         = useState(false);
  const [selectedDate, setSelectedDate]         = useState(new Date().toISOString().split('T')[0]);
  const [fullName, setFullName]                 = useState('');
  const [email, setEmail]                       = useState('');
  const [requirements, setRequirements]         = useState('');

  // Data & UI state
  const [service, setService]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  // Pricing logic
  const HOURLY_RATE = service?.price || 35;
  const durationHours = { "1 hour session": 1, "1.5 hours session": 1.5, "2 hours session": 2, "3 hours session": 3 };
  const hours       = durationHours[selectedDuration] || 1;
  const serviceFee  = HOURLY_RATE * hours;
  const platformFee = parseFloat((serviceFee * 0.10).toFixed(2));
  const total       = parseFloat((serviceFee + platformFee).toFixed(2));

  // Fetch service data
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${params.id}`);
        if (!res.ok) throw new Error('Service not found');
        const data = await res.json();
        setService(data);
      } catch (err) {
        setError('Could not load service details.');
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.id]);

  // Pre-fill name & email from session
  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleConfirm = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: params.id,
          buyer_id: session.user.id || 1,
          total_amount: total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-12 bg-card/30 rounded-[3rem] border border-white/5 shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-[#10b981] to-primary bg-clip-text text-transparent">Booking Confirmed!</h2>
            <p className="text-muted-foreground text-lg mb-2 font-medium">Your session with <span className="text-white font-bold">{service?.seller_name}</span> has been booked.</p>
            <p className="text-muted-foreground font-medium mb-10">{selectedDate} · {selectedTime} · {selectedDuration}</p>
            <div className="text-3xl font-black text-primary mb-10">Rs. {total.toFixed(2)} total</div>
            <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceInitials = service?.title?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '..';

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Secure Booking
            </h1>
            <p className="text-muted-foreground text-lg">
              {loading ? 'Loading service...' : `Book a session with ${service?.seller_name}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">

              {/* Step 1 — Date & Time */}
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Select Date &amp; Time</h2>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Step 1 of 3</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Pick a Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Duration</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDurationOpen(!durationOpen)}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-bold flex items-center justify-between"
                      >
                        {selectedDuration}
                        <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform" style={{ transform: durationOpen ? 'rotate(270deg)' : 'rotate(90deg)' }} />
                      </button>
                      {durationOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                          {durations.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => { setSelectedDuration(d); setDurationOpen(false); }}
                              className={`w-full px-5 py-4 text-left font-bold transition-all hover:bg-white/5 ${
                                selectedDuration === d ? 'text-primary bg-primary/5' : 'text-foreground'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Available Time Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 ${
                          selectedTime === time
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-xl scale-105"
                            : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2 — Your Information */}
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Your Information</h2>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Step 2 of 3</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">University Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@university.edu"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Specific Requirements</label>
                  <textarea
                    rows={4}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Tell the seller what you need help with..."
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-medium resize-none"
                  />
                </div>
              </div>

              {/* Step 3 — Payment Method */}
              <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Payment Method</h2>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Step 3 of 3</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const isActive = selectedPayment === method.id;
                    return (
                      <label
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex items-center gap-5 p-6 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 ${
                          isActive
                            ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
                            : "bg-white/5 border-white/5 hover:border-primary/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={isActive}
                          onChange={() => setSelectedPayment(method.id)}
                          className="w-6 h-6 accent-primary"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-lg">{method.label}</div>
                          <div className="text-sm text-muted-foreground font-medium">{method.desc}</div>
                        </div>
                        {typeof method.icon === 'string' ? (
                          <span className="text-3xl">{method.icon}</span>
                        ) : (
                          <method.icon className={`w-8 h-8 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl sticky top-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

                <h3 className="text-2xl font-black mb-8 relative z-10">Summary</h3>

                <div className="space-y-6 mb-10 relative z-10">
                  <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl">
                    {service?.seller_avatar ? (
                      <img src={service.seller_avatar} alt={service.seller_name} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-black shadow-lg">
                        {serviceInitials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base text-foreground leading-tight">{service?.title || 'Loading...'}</div>
                      <div className="text-xs text-primary font-black uppercase tracking-widest mt-1">{service?.seller_name || '...'}</div>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-4 text-muted-foreground font-bold">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground font-bold">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{selectedTime}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground font-bold">
                      <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{selectedDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pb-8 mb-8 border-b border-white/5 relative z-10 px-2">
                  <div className="flex justify-between font-bold text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>Rs. {serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm">
                    <span className="text-muted-foreground">Platform Fee <span className="text-xs opacity-60">(10%)</span></span>
                    <span>Rs. {platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black pt-4">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Rs. {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={submitting || loading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 relative z-10 disabled:opacity-60 disabled:scale-100"
                >
                  {submitting ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                  ) : (
                    <><CheckCircle2 className="w-6 h-6" /> Confirm Order</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-6 relative z-10">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span>SkillBridge Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
