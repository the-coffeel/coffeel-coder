"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  X,
  ChevronDown,
  Check,
  Coffee,
  Code2,
  Zap,
  VolumeX,
  Award,
  Sparkles,
  Wifi,
} from "lucide-react";

export interface DiscoverHeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CITIES = [
  "All Locations",
  "Phnom Penh",
  "BKK1 / Chamkarmon",
  "Toul Kork",
  "Daun Penh",
  "Siem Reap",
  "Remote / Online",
];

const QUICK_FILTERS = [
  { id: "all", label: "All Spots", icon: Sparkles },
  { id: "coffee-vote", label: "Top Voted Coffee", icon: Award },
  { id: "specialty-coffee", label: "Specialty Coffee", icon: Coffee },
  { id: "fast-wi-fi", label: "High-Speed Wi-Fi", icon: Wifi },
  { id: "power-outlets", label: "Power Outlets", icon: Zap },
  { id: "quiet-focus", label: "Quiet Focus", icon: VolumeX },
  { id: "tech-code", label: "Tech & Code", icon: Code2 },
];

export default function DiscoverHero({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedCategory,
  onCategoryChange,
}: DiscoverHeroProps) {
  const [isCityOpen, setIsCityOpen] = useState(false);

  return (
    <section className="relative pt-6 pb-6 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row matching Luma screenshot */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Discover Places
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Explore popular places near you, browse by category, or check out community coffee reviews.
            </p>
          </div>

          {/* Location Selector Pill */}
          <div className="relative inline-block self-start md:self-auto">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b] hover:bg-[#222226] border border-white/10 text-xs sm:text-sm font-medium text-zinc-200 transition-all shadow-sm"
              aria-expanded={isCityOpen}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedCity}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                  isCityOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCityOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#18181b] border border-white/10 shadow-2xl p-1.5 z-50 backdrop-blur-2xl">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onCityChange(city);
                      setIsCityOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCity === city
                        ? "bg-amber-500/15 text-amber-300 font-semibold"
                        : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Luma-style Search Bar */}
        <div className="relative mb-5">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by cafe name, coffee rating, quiet zone, outlets, or address..."
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-[#18181b] border border-white/10 hover:border-white/20 focus:border-amber-400/60 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pills (SVG icons only, NO emojis) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {QUICK_FILTERS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-white text-zinc-950 shadow-md font-semibold"
                    : "bg-[#18181b] hover:bg-[#222226] text-zinc-300 border border-white/[0.06] hover:border-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-zinc-950" : "text-amber-400"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
