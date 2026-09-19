"use client";

import Link from "next/link";
import { Coffee, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090b] text-zinc-400 text-xs mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-base font-semibold text-white tracking-tight">
                Coffeel
              </span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Discover and vote on coffee shops, quiet workspaces, and study hubs with community reviews.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Places & Reviews Live
              </span>
            </div>
          </div>

          {/* Column 1: Places */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase">
              Places
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/places" className="hover:text-white transition-colors">
                  All Places
                </Link>
              </li>
              <li>
                <Link href="/places?tab=top-voted" className="hover:text-white transition-colors">
                  Top Voted Coffee
                </Link>
              </li>
              <li>
                <Link href="/places?tab=highest-rated" className="hover:text-white transition-colors">
                  Most Reviewed
                </Link>
              </li>
              <li>
                <Link href="/places" className="hover:text-white transition-colors">
                  Fast Wi-Fi & Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog & Stories
                </Link>
              </li>
              <li>
                <Link href="/profile/posts/new" className="hover:text-white transition-colors">
                  Submit Place
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/the-coffeel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Coffeel. Coffee reviews, voting, and workspaces.</p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">
              Curated for coffee & code
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
