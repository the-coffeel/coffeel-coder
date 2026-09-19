"use client";

import {
  Coffee,
  Code2,
  Zap,
  VolumeX,
  BookOpen,
  UtensilsCrossed,
  Wifi,
  Moon,
  Trees,
  Award,
  Heart,
  Tag,
} from "lucide-react";

export interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  postCounts?: Record<string, number>;
}

const CATEGORIES = [
  {
    id: "specialty-coffee",
    title: "Specialty Coffee",
    icon: Coffee,
    color: "text-amber-400",
    defaultCount: "12 Places",
  },
  {
    id: "tech-code",
    title: "Tech & Code",
    icon: Code2,
    color: "text-cyan-400",
    defaultCount: "18 Places",
  },
  {
    id: "power-outlets",
    title: "Power Outlets",
    icon: Zap,
    color: "text-yellow-400",
    defaultCount: "15 Places",
  },
  {
    id: "quiet-focus",
    title: "Quiet Focus",
    icon: VolumeX,
    color: "text-teal-400",
    defaultCount: "10 Places",
  },
  {
    id: "books-study",
    title: "Books & Study",
    icon: BookOpen,
    color: "text-orange-400",
    defaultCount: "8 Places",
  },
  {
    id: "food-bakery",
    title: "Food & Drink",
    icon: UtensilsCrossed,
    color: "text-amber-300",
    defaultCount: "14 Places",
  },
  {
    id: "fast-wi-fi",
    title: "High-Speed Wi-Fi",
    icon: Wifi,
    color: "text-blue-400",
    defaultCount: "16 Places",
  },
  {
    id: "open-late",
    title: "Late Night",
    icon: Moon,
    color: "text-indigo-400",
    defaultCount: "6 Places",
  },
  {
    id: "outdoor",
    title: "Outdoor & Patio",
    icon: Trees,
    color: "text-emerald-400",
    defaultCount: "9 Places",
  },
  {
    id: "coffee-vote",
    title: "Top Voted Coffee",
    icon: Award,
    color: "text-yellow-300",
    defaultCount: "24 Reviews",
  },
  {
    id: "cozy-vibe",
    title: "Cozy & Welcoming",
    icon: Heart,
    color: "text-pink-400",
    defaultCount: "11 Places",
  },
  {
    id: "budget",
    title: "Budget Friendly",
    icon: Tag,
    color: "text-green-400",
    defaultCount: "7 Places",
  },
];

export default function CategoryGrid({
  selectedCategory,
  onSelectCategory,
  postCounts,
}: CategoryGridProps) {
  return (
    <section className="pt-8 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Browse by Category
        </h2>
        {selectedCategory !== "all" && (
          <button
            onClick={() => onSelectCategory("all")}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Show All Categories
          </button>
        )}
      </div>

      {/* 3-column grid matching Luma screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          const countText =
            postCounts && postCounts[cat.id] !== undefined
              ? `${postCounts[cat.id]} Places`
              : cat.defaultCount;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? "all" : cat.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                isSelected
                  ? "bg-[#25252a] border-white/30 shadow-lg ring-1 ring-white/20"
                  : "bg-[#18181b]/90 hover:bg-[#202024] border-white/[0.06] hover:border-white/[0.14]"
              }`}
            >
              {/* SVG Icon */}
              <div className={`${cat.color} flex-shrink-0`}>
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>

              {/* Title and Count */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white tracking-tight truncate">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                  {countText}
                </p>
              </div>

              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
