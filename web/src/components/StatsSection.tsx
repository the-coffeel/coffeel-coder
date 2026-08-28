"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { fadeUp, staggerContainer, viewportOptions } from "@/lib/motion";

const stats = [
  { value: 5000, display: "5,000+", label: "Members" },
  { value: 1200, display: "1,200+", label: "Projects Shared" },
  { value: 300, display: "300+", label: "Events Hosted" },
  { value: 42, display: "42+", label: "Countries" },
];

function AnimatedNumber({ target, display }: { target: number; display: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  const suffix = display.replace(/[0-9,]/g, ""); // extracts "+" etc.

  return (
    <dt
      ref={ref}
      className="font-mono text-4xl md:text-5xl font-bold text-amber-400 leading-none tabular-nums"
    >
      {isInView ? count.toLocaleString() + suffix : "0"}
    </dt>
  );
}

export default function StatsSection() {
  return (
    <section className="border-b border-[#6f4e37]/30 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full border-x border-[#6f4e37]/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.dl
          className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#6f4e37]/30"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center justify-center py-10 px-6 text-center"
              variants={fadeUp}
              custom={i}
              whileHover={{ backgroundColor: "rgba(111,78,55,0.08)" }}
              transition={{ duration: 0.2 }}
            >
              <AnimatedNumber target={stat.value} display={stat.display} />
              <dd className="mt-2 text-sm text-[#a89880]">{stat.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
