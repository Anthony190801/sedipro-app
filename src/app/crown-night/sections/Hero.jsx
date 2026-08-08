// src/app/crown-night/sections/Hero.jsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { textVariant } from '../utils/motion'

const Hero = () => {
    return (
        <section className="relative min-h-[calc(100vh-104px)] w-full flex flex-col items-center justify-center px-4 pt-0 py-12">
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.3,
                        },
                    },
                }}
                className="text-center max-w-5xl mx-auto flex flex-col items-center"
            >
                <motion.div
                    variants={textVariant(0.5)}
                    className="relative w-[220px] sm:w-[300px] md:w-[380px] lg:w-[400px] aspect-[773/1080] mb-6"
                >
                    <Image
                        src="/crown-night/logo.webp"
                        alt="Crown Night Logo"
                        fill
                        priority
                        className="object-contain drop-shadow-[0_0_60px_rgba(103,37,119,0.3)]"
                        sizes="(max-width: 640px) 220px, (max-width: 768px) 300px, (max-width: 1024px) 380px, 440px"
                    />
                </motion.div>

                {/* Scroll Indicator - Más arriba */}
                <motion.div
                    variants={textVariant(1.4)}
                    className="flex flex-col items-center gap-2 mt-12"
                >
                    <svg
                        className="w-5 h-5 text-foreground font-bold animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero