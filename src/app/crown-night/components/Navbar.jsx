// src/app/crown-night/components/Navbar.jsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { navVariants } from '../utils/motion'

const Navbar = () => {
    return (
        <motion.nav
            variants={navVariants}
            initial="hidden"
            whileInView="show"
            className="px-4 sm:px-6 md:px-8 py-4 relative z-50"
        >
            {/* Gradiente de fondo */}
            <div className="absolute w-[50%] inset-0 bg-gradient-to-r from-primary/20 to-transparent blur-3xl" />

            <div className="max-w-7xl mx-auto flex justify-between items-center gap-8 relative">
                {/* Logo SEDIPRO UNT */}
                <Link 
                    href="https://sediprount.org" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
                >
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                        <Image
                            src="/logos/isotipo.webp"
                            alt="Logo SEDIPRO UNT"
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 32px, 40px"
                        />
                    </div>
                    {/* Texto - solo visible en pantallas grandes */}
                    <span className="hidden sm:inline font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                        SEDIPRO UNT
                    </span>
                </Link>

                {/* Título Crown Night - centrado */}
                <Link href="/crown-night" className="absolute left-1/2 -translate-x-1/2">
                    <h2 className="font-extrabold text-lg sm:text-xl md:text-2xl text-foreground tracking-wider whitespace-nowrap">
                        <span className="text-primary">CROWN</span> NIGHT
                    </h2>
                </Link>

                {/* Botón de descarga - Reemplaza el ícono de menú */}
                <a
                    href="https://drive.google.com/file/d/1XOW3qTDqFG8zE90xupWA90I3sb9CB6ng/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 hover:bg-primary/30 rounded-full transition-all duration-300 group"
                    aria-label="Descargar bases del concurso"
                >
                    {/* Ícono de descarga */}
                    <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-foreground group-hover:scale-110 transition-transform"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                        />
                    </svg>
                </a>
            </div>
        </motion.nav>
    )
}

export default Navbar