"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { UserProfileMenu } from "../UserProfileMenu";
import { Bell, Rocket } from "lucide-react";

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
  { label: "Community", href: "#community" },
  { label: "Places", href: "/places" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "blog" },
];

export default function Header({
  user,
}: UserProfileMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-sm border-b border-[#6f4e37]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[#f5f0e8] hover:text-amber-400 transition-colors"
          >
            <span className="text-2xl">☕</span>
            <span>Coffeel Coder</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-[#c4b49a] hover:text-[#f5f0e8] hover:bg-[#6f4e37]/20 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <motion.a
                href="auth/login"
                className="px-5 py-2 text-sm font-semibold border border-amber-600 text-amber-400 transition-colors"
                whileHover={{ backgroundColor: "#d97706", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                Join Community
              </motion.a>
            ) : (
              <>
                <motion.a
                  href="/profile/posts/new"
                  className="px-5 py-2 text-sm font-semibold border border-amber-600 text-amber-400 transition-colors"
                  whileHover={{ backgroundColor: "#d97706", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="inline-block w-4 h-4 mr-2" />
                  Launch Place
                </motion.a>
                <motion.a
                  href="#join"
                  className="p-2 border flex items-center justify-center border-amber-600 transition-colors rounded-full w-10 h-10"
                  whileHover={{ backgroundColor: "#d97706", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                </motion.a>
                <UserProfileMenu user={user} showDetailsInTrigger={false} />
              </>
            )}

          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#c4b49a] hover:text-[#f5f0e8] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-[#6f4e37]/40 py-4 space-y-1 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm text-[#c4b49a] hover:text-[#f5f0e8] hover:bg-[#6f4e37]/20 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 px-4">
              <Link
                href="#join"
                className="block text-center px-5 py-2 text-sm font-semibold border border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
              >
                Join Community
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
