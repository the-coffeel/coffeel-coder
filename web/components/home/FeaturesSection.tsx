"use client";

import { motion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer, viewportOptions } from "@/lib/motion";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Open Source Projects",
    description: "Contribute to impactful, real-world projects built by community members. Grow your portfolio with meaningful work.",
    cta: "Check Our github →",
    href: "#projects",
    id: "projects",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Blog & Knowledge",
    description: "Tech talks, live coding sessions, workshops, and coffee chats — every week. Learn, share, and connect.",
    cta: "View Blog →",
    href: "/blog",
    id: "events",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Developer Community",
    description: "Get paired with experienced developers or give back by mentoring rising engineers. Grow together.",
    cta: "Join Community →",
    href: "#community",
    id: "community",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Mentorship",
    description: "Need a modern, fast, and scalable website? Our elite developers build solutions tailored to your business needs.",
    cta: "Mentorship →",
    href: "#services",
    id: "webdev",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Coffeel Places",
    description: "Data-driven SEO strategies to get your business ranking higher, driving more organic traffic and conversions.",
    cta: "Shop Coffeel Places →",
    href: "#services",
    id: "seo",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Meetups & Events",
    description: "Need extra hands? Tap into our community of vetted developers to scale your engineering team quickly.",
    cta: "Check Available Shedules →",
    href: "#services",
    id: "hire",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-b border-[#6f4e37]/30 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full border-x border-[#6f4e37]/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section header */}
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
            {"// what-we-offer"}
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#f5f0e8] max-w-xl leading-tight"
            variants={fadeUp}
            custom={1}
          >
            Everything you need to{" "}
            <span className="text-amber-400">grow or build</span>
          </motion.h2>
          <motion.p
            className="text-[#a89880] max-w-lg leading-relaxed"
            variants={fadeUp}
            custom={2}
          >
            Whether you want to level up your coding skills or need a professional team to build your business website and boost SEO.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#6f4e37]/20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {features.map((feature, i) => (
            <motion.article
              key={feature.id}
              className="group relative bg-[#0d0d0d] p-8 cursor-default"
              variants={scaleIn}
              custom={i}
              whileHover={{
                backgroundColor: "#1a1410",
                y: -2,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
            >
              {/* Icon */}
              <motion.div
                className="mb-5 inline-flex items-center justify-center w-12 h-12 hover:rounded-full bg-[#6f4e37]/20 text-amber-500"
                whileHover={{ scale: 1.15, rotate: 5, backgroundColor: "rgba(245,158,11,0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {feature.icon}
              </motion.div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#f5f0e8] mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#a89880] leading-relaxed mb-5">
                {feature.description}
              </p>

              {/* CTA link */}
              <motion.a
                href={feature.href}
                className="text-sm font-semibold text-amber-500 inline-flex items-center gap-1"
                whileHover={{ x: 4, color: "#fbbf24" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {feature.cta}
              </motion.a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
