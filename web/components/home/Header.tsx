"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfileMenu } from "../UserProfileMenu";
import { Bell, Plus, MapPin, Coffee, BookOpen } from "lucide-react";

export type UserProfile = {
  id?: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};

export interface UserProfileMenuProps {
  user?: {
    id?: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      display_name?: string;
      name?: string;
      avatar_url?: string;
      picture?: string;
      username?: string;
      user_name?: string;
      preferred_username?: string;
      [key: string]: unknown;
    };
    profile?: UserProfile | null;
    [key: string]: unknown;
  } | null;
}

const navLinks = [
  { label: "Places", href: "/places", icon: MapPin },
  { label: "Coffee Vote", href: "/places?tab=top-rated", icon: Coffee },
  { label: "Blog", href: "/blog", icon: BookOpen },
];

export default function Header({ user }: UserProfileMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }).format(now);
        setTimeStr(formatted);
      } catch {
        setTimeStr("12:00 PM GMT+7");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Star SVG Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group p-1"
              aria-label="Coffeel Home"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white fill-white transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white tracking-tight hidden sm:inline-block">
                Coffeel
              </span>
            </Link>
          </div>

          {/* Center: Nav links exactly like Luma (Events, Calendars, Discover) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/places" && pathname === "/");
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-medium transition-colors flex items-center gap-2 py-1 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Time, Create Event / Place, Bell, Avatar */}
          <div className="flex items-center gap-3">
            {timeStr && (
              <span className="text-xs text-zinc-500 font-normal hidden lg:inline-block">
                {timeStr}
              </span>
            )}

            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm"
                >
                  Join
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile/posts/new"
                  className="text-xs font-medium text-white hover:text-amber-300 transition-colors hidden sm:inline-block"
                >
                  Create Place
                </Link>

                <button
                  type="button"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>

                <UserProfileMenu user={user} showDetailsInTrigger={false} />
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/[0.08] py-3 space-y-2"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {user && (
              <Link
                href="/profile/posts/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Place</span>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
