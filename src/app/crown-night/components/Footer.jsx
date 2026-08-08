// src/app/crown-night/components/Footer.jsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok
} from 'react-icons/fa'
import { Heart } from 'lucide-react'
import { footerVariants } from '../utils/motion'

const Footer = () => {
    return (
        <motion.footer
            variants={footerVariants}
            initial="hidden"
            whileInView="show"
            className="bg-surface-container-lowest border-t border-outline-variant/30 py-12 px-4 sm:px-6 md:px-8 relative overflow-hidden"
        >
            {/* Gradiente de fondo sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                    {/* Logo y descripción - SEDIPRO UNT */}
                    <motion.a
                        href="https://sediprount.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-2 items-center md:items-start hover:opacity-90 transition-opacity group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-8 h-8 relative"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image
                                    src="/logos/isotipo.webp"
                                    alt="Logo SEDIPRO UNT"
                                    width={32}
                                    height={32}
                                    className="w-auto h-auto object-contain"
                                />
                            </motion.div>
                            <span className="text-label-md font-headline-md font-bold text-on-surface">
                                SEDIPRO UNT
                            </span>
                        </div>

                        <p className="font-body-md text-body-md text-on-surface-variant font-label-sm text-label-sm text-center md:text-left">
                            Sección Estudiantil de Dirección de
                        </p>

                        <p className="font-body-md text-body-md text-on-surface-variant font-label-sm text-label-sm text-center md:text-left">
                            Proyectos de la UNT.
                        </p>
                    </motion.a>

                    {/* Redes Sociales */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-3"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {[
                            { icon: FaFacebookF, href: 'https://www.facebook.com/SediproUNT', label: 'Facebook' },
                            { icon: FaInstagram, href: 'https://www.instagram.com/sedipro.unt/', label: 'Instagram' },
                            { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/sediprount/', label: 'LinkedIn' },
                            { icon: FaYoutube, href: 'https://www.youtube.com/c/SEDIPROUNT', label: 'YouTube' },
                            { icon: FaTiktok, href: 'https://www.tiktok.com/@sediprount', label: 'TikTok' },
                        ].map((social, index) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                whileHover={{
                                    scale: 1.15,
                                    rotate: [0, -10, 10, -10, 0],
                                    transition: { duration: 0.4 }
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                            >
                                <social.icon size={18} />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Hecho por Área de TI */}
                    <motion.div
                        className="flex items-center gap-2 flex-wrap justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <span className="font-label-sm text-body-md text-on-surface-variant text-label-sm">
                            Hecho con
                        </span>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: 'reverse'
                            }}
                        >
                            <Heart size={14} className="text-orange-500 fill-orange-500" />
                        </motion.div>
                        <span className="font-label-sm text-body-md text-on-surface-variant text-label-sm">
                            por
                        </span>
                        <span className="font-label-sm text-label-md font-semibold text-orange-500 text-label-sm">
                            Área de TI
                        </span>
                        <motion.div
                            className="w-6 h-6 relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                alt="Logo Área de TI SEDIPRO"
                                width={24}
                                height={24}
                                className="object-contain"
                                src="/img/area-ti.png"
                            />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Línea divisoria y copyright */}
                <motion.div
                    className="mt-10 pt-6 border-t border-outline-variant/20 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <p className="text-xs text-on-surface-variant/60">
                        © 2026 SEDIPRO UNT. Todos los derechos reservados.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer