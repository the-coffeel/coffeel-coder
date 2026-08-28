"use client";

import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOptions } from "@/lib/motion";

const quotes = [
  {
    body: "Coffeel Coder is where I found my coding tribe. The support and opportunities here are unmatched.",
    author: "Sarah J.",
    role: "Frontend Developer",
    avatar: "S",
    color: "#6f4e37",
  },
  {
    body: "I shipped my first open-source project thanks to this community. The mentors here genuinely care.",
    author: "Marcus T.",
    role: "Full-Stack Engineer",
    avatar: "M",
    color: "#8b5e3c",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
  {
    body: "The weekly events keep me motivated and sharp. Nothing beats learning with people who share your passion.",
    author: "Linh N.",
    role: "Backend Developer",
    avatar: "L",
    color: "#c08040",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="community" className="border-b border-[#6f4e37]/30 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full border-x border-[#6f4e37]/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          className="mb-12 space-y-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          <motion.p
            className="font-mono text-xs uppercase tracking-widest text-amber-500"
            variants={fadeUp}
            custom={0}
          >
            // community-voices
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#f5f0e8] leading-tight"
            variants={fadeUp}
            custom={1}
          >
            Developers love{" "}
            <span className="text-amber-400">Coffeel Coder</span>
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-px bg-[#6f4e37]/20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {quotes.map((quote, i) => (
            <motion.blockquote
              key={i}
              className="bg-[#0d0d0d] p-8 space-y-5 cursor-default"
              variants={fadeUp}
              custom={i}
              whileHover={{
                backgroundColor: "#1a1410",
                y: -3,
                transition: { duration: 0.2 },
              }}
            >
              {/* Animated quote mark */}
              <motion.p
                className="text-4xl text-amber-500 font-serif leading-none"
                initial={{ opacity: 0.3 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                &ldquo;
              </motion.p>

              <p className="text-[#c4b49a] leading-relaxed text-sm">
                {quote.body}
              </p>

              <footer className="flex items-center gap-3 pt-2">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: quote.color }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {quote.avatar}
                </motion.div>
                <div>
                  <p className="font-semibold text-[#f5f0e8] text-sm">
                    {quote.author}
                  </p>
                  <p className="font-mono text-[11px] text-[#6f4e37]">
                    {quote.role}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
