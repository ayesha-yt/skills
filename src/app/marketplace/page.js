'use client';

import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Search, Filter, Star, X, Code, Palette, BookOpen, Camera, TrendingUp, Megaphone } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

export default function MarketplacePage() {
  const categories = [
    { icon: Code,       label: "Development" },
    { icon: Palette,    label: "Design" },
    { icon: BookOpen,   label: "Tutoring" },
    { icon: Camera,     label: "Photography" },
    { icon: TrendingUp, label: "Business" },
    { icon: Megaphone,  label: "Marketing" },
  ];

  const [services, setServices]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchInput, setSearchInput]     = useState('');
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showFilters, setShowFilters]     = useState(false);
  const [priceRange, setPriceRange]       = useState(100);

  // Debounce search: only fire API call 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch whenever search query or category changes
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery)    params.append('q', searchQuery);
        if (activeCategory) params.append('category', activeCategory);

        const res  = await fetch(`/api/services?${params.toString()}`);
        const data = await res.json();

        // Client-side price filter
        const filtered = Array.isArray(data)
          ? data.filter(s => s.price <= priceRange)
          : [];

        setServices(filtered);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [searchQuery, activeCategory, priceRange]);

  const handleCategoryClick = (label) => {
    setActiveCategory(prev => prev === label ? '' : label);
  };

  const clearAll = () => {
    setSearchInput('');
    setSearchQuery('');
    setActiveCategory('');
    setPriceRange(100);
  };

  const hasFilters = searchInput || activeCategory || priceRange < 100;

  const cardGradients = [
    "from-blue-900/60 to-purple-900/60",
    "from-rose-900/60 to-orange-900/60",
    "from-emerald-900/60 to-teal-900/60",
    "from-indigo-900/60 to-blue-900/60",
    "from-amber-900/60 to-red-900/60",
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent mb-3">
              Service Marketplace
            </h1>
            <p className="text-muted-foreground text-lg">Discover talented students offering amazing services</p>
          </div>

          {/* Search Bar */}
          <div className="bg-card/30 backdrop-blur-sm rounded-[2rem] p-6 shadow-2xl border border-white/5 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title, description..."
                  className="w-full pl-14 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-lg placeholder:text-muted-foreground"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
                  showFilters || priceRange < 100
                    ? 'bg-primary text-white shadow-xl shadow-primary/30'
                    : 'bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white hover:shadow-2xl'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters {priceRange < 100 && <span className="ml-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">1</span>}
              </button>
            </div>

            {/* Expandable price filter */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                    Max Price: <span className="text-primary">${priceRange}/hr</span>
                  </label>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-bold mt-1">
                  <span>$5/hr</span>
                  <span>$100/hr</span>
                </div>
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.label;
              return (
                <button
                  key={category.label}
                  onClick={() => handleCategoryClick(category.label)}
                  className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-105 group text-center ${
                    isActive
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary shadow-xl shadow-primary/20 scale-105'
                      : 'bg-card/30 border-white/5 hover:border-primary/30 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-primary/20' : 'bg-gradient-to-br from-primary/10 to-secondary/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-primary'}`} />
                  </div>
                  <div className={`text-xs font-black ${isActive ? 'text-primary' : 'text-foreground'}`}>{category.label}</div>
                </button>
              );
            })}
          </div>

          {/* Active filters indicator */}
          {hasFilters && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-sm text-muted-foreground font-bold">Active filters:</span>
              {activeCategory && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20">
                  {activeCategory}
                  <button onClick={() => setActiveCategory('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchInput && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20">
                  &ldquo;{searchInput}&rdquo;
                  <button onClick={() => setSearchInput('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange < 100 && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20">
                  Max ${priceRange}/hr
                  <button onClick={() => setPriceRange(100)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-white font-bold underline transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* Service Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Skeleton loaders
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-card/30 rounded-[2rem] overflow-hidden border border-white/5 animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-white/5 rounded-full w-1/3" />
                    <div className="h-6 bg-white/5 rounded-full w-3/4" />
                    <div className="h-4 bg-white/5 rounded-full w-1/2" />
                  </div>
                </div>
              ))
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl font-black text-foreground mb-2">No services found</div>
                <div className="text-muted-foreground font-medium mb-6">
                  {hasFilters ? 'Try adjusting your search or filters.' : 'No services available yet.'}
                </div>
                {hasFilters && (
                  <button onClick={clearAll} className="px-6 py-3 bg-primary/10 text-primary font-bold rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              services.map((service) => {
                const gradient = cardGradients[service.id % cardGradients.length];
                return (
                  <Link
                    key={service.id}
                    href={`/service/${service.id}`}
                    className="group bg-card/30 rounded-[2rem] overflow-hidden shadow-xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
                  >
                    <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-3xl font-black opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {service.title.split(' ')[0]}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                          {service.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight truncate">
                        {service.title}
                      </h3>

                      <div className="flex items-center gap-4 mb-6">
                        {service.seller_avatar ? (
                          <img src={service.seller_avatar} alt={service.seller_name} className="w-12 h-12 rounded-full border border-white/10 shadow-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-black shadow-lg">
                            {service.seller_name?.substring(0, 2).toUpperCase() || 'SB'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-foreground truncate">{service.seller_name}</div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">5.0</span>
                            <span className="text-muted-foreground">(New)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        <div className="flex items-baseline gap-1 text-foreground">
                          <span className="text-2xl font-black text-primary">Rs. {service.price}</span>
                          <span className="text-xs text-muted-foreground font-bold">/ session</span>
                        </div>
                        <div className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-xl shadow-lg group-hover:shadow-primary/30 group-hover:scale-105 transition-all">
                          View
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Results count */}
          {!loading && services.length > 0 && (
            <div className="mt-10 text-center text-muted-foreground font-bold text-sm pb-8">
              Showing {services.length} service{services.length !== 1 ? 's' : ''}
              {activeCategory ? ` in ${activeCategory}` : ''}
              {searchInput ? ` matching "${searchInput}"` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
