"use client";

import { motion } from "motion/react";
import { fadeUp, staggerContainer, viewportOptions } from "@/lib/motion";

const TechStack = () => {
    return (
        <section className="border-b border-[#6f4e37]/30 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
                    <div className="h-full border-x border-[#6f4e37]/20" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        {"// Built with tools developers already trust"}
                      </motion.p>
                    
                    </motion.div>

                </div>


        </section>
    )
}

export default TechStack