import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AnnouncementBanner() {
  return (
    <aside className="relative z-50 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200/90 py-2 px-4 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Discover top-rated cafes & tech workspaces vetted by developers.</span>
        </span>
        <Link
          href="/places"
          className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-100 transition-colors underline-offset-4 hover:underline"
        >
          Explore spots <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
