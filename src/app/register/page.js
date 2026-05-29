'use client';

import Link from "next/link";
import { Mail, Lock, User, GraduationCap, Building2, Code, ArrowRight } from "lucide-react";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const popularSkills = ["Web Development", "Graphic Design", "Tutoring", "Writing", "Photography", "Marketing"];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: selectedSkills
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Automatically sign in the user after successful registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (signInRes.error) {
        throw new Error(signInRes.error);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-primary/20 mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-card/40 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-2xl ring-4 ring-primary/20">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">Join SkillBridge</h1>
            <p className="text-muted-foreground font-medium">Create your account and start connecting</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-foreground font-bold text-sm mb-3 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground font-bold text-sm mb-3 uppercase tracking-widest">University Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@university.edu"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-foreground font-bold text-sm mb-3 uppercase tracking-widest">University</label>
                <div className="relative group">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <select 
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" className="text-slate-900">Select university</option>
                    <option value="iqra" className="text-slate-900">Iqra University</option>
                    <option value="ku" className="text-slate-900">University of Karachi (KU)</option>
                    <option value="nust" className="text-slate-900">NUST</option>
                    <option value="fast" className="text-slate-900">FAST NUCES</option>
                    <option value="ned" className="text-slate-900">NED University</option>
                    <option value="lums" className="text-slate-900">LUMS</option>
                    <option value="other" className="text-slate-900">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-foreground font-bold text-sm mb-3 uppercase tracking-widest">Department</label>
                <div className="relative group">
                  <Code className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" className="text-slate-900">Select department</option>
                    <option value="cs" className="text-slate-900">Computer Science</option>
                    <option value="eng" className="text-slate-900">Engineering</option>
                    <option value="business" className="text-slate-900">Business</option>
                    <option value="design" className="text-slate-900">Design</option>
                    <option value="other" className="text-slate-900">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-foreground font-bold text-sm mb-4 uppercase tracking-widest">Select Your Skills</label>
              <div className="flex flex-wrap gap-3">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-5 py-2.5 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${
                      selectedSkills.includes(skill)
                        ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                        : "bg-white/5 border-white/10 text-foreground hover:bg-primary/20 hover:border-primary/50"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div>
                <label className="block text-foreground font-bold text-sm mb-3 uppercase tracking-widest">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground font-bold text-sm mb-3 uppercase tracking-widest">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group pt-4">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  required
                  className="peer appearance-none w-5 h-5 rounded-lg border-2 border-white/10 checked:border-primary checked:bg-primary transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-bold">I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm mt-8 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-muted-foreground text-sm font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-white transition-colors font-bold uppercase tracking-widest text-xs ml-2">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-muted-foreground hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              ← Back to home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-muted-foreground/50 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          <span>Secure registration • University verified</span>
        </div>
      </div>
    </div>
  );
}
