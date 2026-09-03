"use client";

import { motion } from "motion/react";
import { fadeUp, slideInLeft, slideInRight } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative border-b border-border overflow-hidden">
      {/* Grid border lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full border-x border-border" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left: Text content — slides in from left */}
          <motion.div
            className="space-y-6"
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.p
              className="font-mono font-medium tracking-widest text-accent"
              variants={fadeUp}
              custom={0}
            >
              // community & agency
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-foreground text-balance"
              variants={fadeUp}
              custom={1}
            >
              The Developer Community & Digital Agency Powered by{" "}
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Coffee & Code.
              </motion.span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed"
              variants={fadeUp}
              custom={2}
            >
              Grow your skills with passionate developers, or partner with our elite team for top-tier website development and SEO services.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3 pt-2"
              variants={fadeUp}
              custom={3}
            >
              <motion.a
                href="#join"
                className="px-6 py-3 bg-primary text-primary-foreground font-medium text-sm"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Join the Community
              </motion.a>
              <motion.a
                href="#services"
                className="flex items-center gap-1 px-6 py-3 border border-accent text-primary-foreground hover:bg-accent font-medium text-sm ease-out duration-300 transition-colors"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Find Fit Coffee Shops
                <ArrowRight size={18} />
              </motion.a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-3 pt-2"
              variants={fadeUp}
              custom={4}
            >
              <div className="flex -space-x-2">
                {["SK", "TK", "PK"].map((char, i) => (
                  <motion.div
                    key={char}
                    className="w-8 h-8 rounded-full border-2 border-[#0d0d0d] flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: ["#6f4e37", "#c08040", "#8b5e3c", "#a07040"][i],
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.07, duration: 0.35 }}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-[#a89880]">
                <strong className="text-[#f5f0e8]">3+</strong> developers already joined.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Code editor mockup — slides in from right */}
          <motion.figure
            className="relative md:order-last overflow-hidden border border-[#6f4e37]/40 bg-[#1a1512] shadow-2xl shadow-black/50"
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            whileHover={{
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(111,78,55,0.5)",
              borderColor: "rgba(111,78,55,0.7)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            {/* Editor chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#130f0c] border-b border-[#6f4e37]/30">
              <motion.span
                className="w-3 h-3 rounded-full bg-red-500/80"
                whileHover={{ scale: 1.4, backgroundColor: "#ef4444" }}
              />
              <motion.span
                className="w-3 h-3 rounded-full bg-yellow-500/80"
                whileHover={{ scale: 1.4, backgroundColor: "#eab308" }}
              />
              <motion.span
                className="w-3 h-3 rounded-full bg-green-500/80"
                whileHover={{ scale: 1.4, backgroundColor: "#22c55e" }}
              />
              <span className="ml-4 font-mono text-xs text-[#6f4e37]">
                services.ts — Coffeel Coder
              </span>
            </div>

            {/* Code content — lines appear one by one */}
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div className="space-y-1">
                {[
                  <p key="l1">
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-[#f5f0e8]">{"{ Agency, Community }"}</span>{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-amber-400">&apos;@coffeel/core&apos;</span>
                  </p>,
                  <br key="br" />,
                  <p key="l3">
                    <span className="text-blue-400">export default</span>{" "}
                    <span className="text-yellow-300">function</span>{" "}
                    <span className="text-green-400">CoffeelCoder</span>
                    <span className="text-[#f5f0e8]">{"() {"}</span>
                  </p>,
                  <p key="l4" className="pl-6">
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-[#f5f0e8]">{"("}</span>
                  </p>,
                  <p key="l5" className="pl-12">
                    <span className="text-[#6f9f6f]">{"<Agency"}</span>
                  </p>,
                  <p key="l6" className="pl-16">
                    <span className="text-blue-300">services</span>
                    <span className="text-[#f5f0e8]">{"={["}</span>
                    <span className="text-amber-400">&quot;Web Dev&quot;</span>
                    <span className="text-[#f5f0e8]">{", "}</span>
                    <span className="text-amber-400">&quot;SEO&quot;</span>
                    <span className="text-[#f5f0e8]">{"]}"}</span>
                  </p>,
                  <p key="l7" className="pl-16">
                    <span className="text-blue-300">quality</span>
                    <span className="text-[#f5f0e8]">{"="}</span>
                    <span className="text-amber-400">&quot;top-tier&quot;</span>
                  </p>,
                  <p key="l8" className="pl-16">
                    <span className="text-blue-300">fuel</span>
                    <span className="text-[#f5f0e8]">{"="}</span>
                    <span className="text-amber-400">&quot;endless coffee&quot;</span>
                  </p>,
                  <p key="l9" className="pl-12">
                    <span className="text-[#6f9f6f]">{"/>"}</span>
                  </p>,
                  <p key="l10" className="pl-6">
                    <span className="text-[#f5f0e8]">{")"}</span>
                  </p>,
                  <p key="l11">
                    <span className="text-[#f5f0e8]">{"}"}</span>
                  </p>,
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>

              {/* Blinking cursor */}
              <motion.div
                className="mt-3 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <motion.span
                  className="w-2 h-4 bg-amber-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                />
              </motion.div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-amber-800/30 border-t border-[#6f4e37]/30 font-mono text-[10px] text-amber-700/80">
              <span>TypeScript</span>
              <span>Ln 12, Col 1</span>
              <span>UTF-8</span>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
