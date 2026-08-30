"use client";

import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOptions } from "@/lib/motion";

export default function CTASection() {
  return (
    <section id="join" className="border-b border-[#6f4e37]/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full border-x border-[#6f4e37]/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Radial glow */}
        <motion.div
          className="relative max-w-2xl mx-auto text-center space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 100%, #6f4e3720, transparent)",
            }}
          />

          <motion.p
            className="font-mono text-xs uppercase tracking-widest text-amber-500"
            variants={fadeUp}
            custom={0}
          >
            {"// Visit → Review → Recommend → Meet"}
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl font-bold text-[#f5f0e8] leading-tight"
            variants={fadeUp}
            custom={1}
          >
            Ready to brew your{" "}
            <span className="text-amber-400">next big project?</span>
          </motion.h2>

          <motion.p
            className="text-[#a89880] text-lg max-w-md mx-auto leading-relaxed"
            variants={fadeUp}
            custom={2}
          >
            Whether you&apos;re a developer looking for your tribe, or a business needing top-tier web and SEO services, we&apos;ve got you covered.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
            variants={fadeUp}
            custom={3}
          >
            <motion.a
              href="#"
              className="px-8 py-3.5 bg-amber-500 text-[#0d0d0d] font-bold text-sm"
              whileHover={{ scale: 1.05, backgroundColor: "#fbbf24" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Join the Community
            </motion.a>
            <motion.a
              href="#services"
              className="px-8 py-3.5 border border-[#6f4e37]/60 text-[#c4b49a] font-medium text-sm"
              whileHover={{ borderColor: "#d97706", color: "#fbbf24", scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Request a Project Quote →
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
