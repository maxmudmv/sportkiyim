"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-MB0rIjudaJXgd7N7RvloDURFjMPyekOOd8lmQA3MwMejePpJDRcouBWcS3gI8LYmyH09k50r31EARwSLArag5sg8C4HRa7E2B52QcSH6DvnMLTpyVhF6sZQ5HL0G-UZAJXfrRqE3Ysz8gmLwBtl0w5WIFFnWlEo7SafNjbQvNsibRKuetgnuUGWxOC4t9zZy_D2mMhbCg0sqPnMhOx7f7z_1aL-c1d8s7_Q1UnbUh7BOvWTBic8E8M0haGGmls-0Xs0Xn9AYzH-C";

export default function Hero() {
  return (
    <section className="relative w-full h-[62vh] min-h-[440px] md:h-[840px] flex items-center justify-center px-4 md:px-12 mt-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          aria-hidden
        />
      </div>

      <div className="relative z-20 text-center max-w-3xl flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-display-mobile md:text-display-lg text-primary uppercase tracking-tighter drop-shadow-lg"
        >
          Unleash Your Ultimate Potential
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/shop?sort=newest" className="btn-primary">
            Shop New Arrivals
          </Link>
          <Link href="/shop" className="btn-ghost">
            Explore Gear
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
