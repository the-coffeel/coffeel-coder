"use client";

import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOptions } from "@/lib/motion";

const footerLinks = {
  About: [
    { label: "Our Story", href: "#" },
    { label: "Code of Conduct", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Contact", href: "mailto:coffeelcoder@gmail.com" },
  ],
  Community: [
    { label: "Discord Server", href: "#" },
    { label: "Forum", href: "#" },
    { label: "Showcase", href: "#" },
    { label: "Members", href: "#" },
  ],
  Services: [
    { label: "Web Development", href: "#" },
    { label: "SEO Optimization", href: "#" },
    { label: "Hire Developers", href: "#" },
    { label: "Consulting", href: "#" },
  ],
  Resources: [
    { label: "Blog", href: "blog" },
    { label: "Projects", href: "#projects" },
    { label: "Events", href: "#events" },
    { label: "Newsletter", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#6f4e37]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid md:grid-cols-6 gap-8 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {/* Brand column */}
          <motion.div className="space-y-4 md:col-span-1 lg:col-span-2" variants={fadeUp} custom={0}>
            <a
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-[#f5f0e8]"
            >
              <span className="text-2xl">☕</span>
              <span>Coffeel Coder</span>
            </a>
            <p className="text-sm text-[#a89880] leading-relaxed max-w-xs">
              A community of developers fueled by coffee, and a digital agency delivering exceptional web and SEO services.
            </p>
            {/* Social links */}
            <div className="flex gap-3 pt-2">
              {[
                {
                  label: "GitHub",
                  href: "#",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  label: "Twitter",
                  href: "#",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "Discord",
                  href: "#",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.082.114 18.104.136 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 flex items-center justify-center border border-[#6f4e37]/40 rounded text-[#6f4e37]"
                  whileHover={{
                    color: "#fbbf24",
                    borderColor: "#d97706",
                    scale: 1.1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links], i) => (
            <motion.div key={group} variants={fadeUp} custom={i + 1}>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#6f4e37] mb-4">
                // {group.toLowerCase()}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-sm text-[#a89880] inline-block"
                      whileHover={{ x: 4, color: "#fbbf24" }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="pt-6 border-t border-[#6f4e37]/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOptions}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-wider text-[#6f4e37]/70">
            © 2026 Coffeel Coder
          </p>
          <div className="flex gap-4">
            {[
              { name: "Privacy", href: "/privacy" },
              { name: "Terms", href: "/terms" },
              { name: "Cookies", href: "/privacy" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-xs text-[#6f4e37]/70 hover:text-amber-500 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
