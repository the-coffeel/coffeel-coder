"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Zap, Coffee, ArrowUpRight, Award, MessageSquare } from "lucide-react";
import { Post } from "@/components/post-card";

export interface FeaturedCarouselProps {
  posts: Post[];
}

export default function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  // Take up to 3 posts with images as featured spotlight
  const featured = posts.filter((p) => p.cover_image_url).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Top Voted & Reviewed</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Featured Spaces
          </h2>
        </div>
        <span className="text-xs text-zinc-500 hidden sm:block">
          Highest community ratings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((post) => {
          const title = post.title || "Specialty Coffee Spot";
          const location =
            post.shop_address || "Phnom Penh, Cambodia";
          const authorName =
            post.profile?.display_name || post.profile?.username || "Reviewer";

          return (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#18181b] hover:border-white/20 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60"
            >
              {/* Media container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#121214] flex items-center justify-center">
                    <Coffee className="w-12 h-12 text-zinc-700" />
                  </div>
                )}

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                  {/* Location & Rating row (Clean & beautiful) */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1 tracking-tight">
                    {title}
                  </h3>

                  {/* Coffee & Workspace Amenities Chips (SVG icons only) */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-300">
                      <Coffee className="w-3 h-3 text-amber-400" />
                      Specialty
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-300">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      Outlets
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-300">
                      <MessageSquare className="w-3 h-3 text-blue-400" />
                      Reviewed
                    </span>
                  </div>
                </div>

                {/* Author footer */}
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                  <span className="truncate">Reviewed by {authorName}</span>
                  <span className="text-amber-400 font-medium text-[11px] group-hover:underline">
                    View Space & Vote →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
