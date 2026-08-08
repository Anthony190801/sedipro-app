// src/app/crown-night/sections/Feedback.jsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { fadeIn, staggerContainer, zoomIn } from '../utils/motion'

const Feedback = () => (
    <section className="py-20 px-4 relative z-10">
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="max-w-7xl mx-auto flex lg:flex-row flex-col gap-8"
        >
            {/* Card 1 - Testimonio */}
            <motion.div
                variants={fadeIn('right', 'tween', 0.2, 1)}
                className="lg:w-1/2 w-full flex flex-col glass-card p-8 rounded-[32px] border border-border/10 relative group hover:border-primary/30 transition-all duration-300"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[32px] group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />
                <div className="relative flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                        {/* Foto de perfil */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-primary/20 flex-shrink-0 border-2 border-primary/30">
                            <Image
                                src="/crown-night/dp_marycielo.webp"
                                alt="Eleanor Marycielo Roca Mendoza"
                                fill
                                className="object-cover"
                                sizes="56px"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl sm:text-2xl md:text-3xl text-foreground">
                                Marycielo Roca Mendoza
                            </h4>
                            <p className="font-normal text-sm sm:text-base text-foreground/60">
                                Directora de Proyecto
                            </p>
                        </div>
                    </div>
                    <p className="font-normal text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 leading-relaxed flex-1">
                        "Crown Night nace para celebrar el talento, el liderazgo y la unión que caracterizan a SEDIPRO UNT. Invitamos a toda nuestra comunidad a vivir esta experiencia con entusiasmo."
                    </p>
                </div>
            </motion.div>

            {/* Card 2 - Imagen Hito */}
            <motion.div
                variants={fadeIn('left', 'tween', 0.2, 1)}
                className="lg:w-1/2 w-full flex items-center justify-center"
            >
                <div className="w-full h-full min-h-[280px] lg:min-h-[320px] rounded-[32px] glass-card flex items-center justify-center p-4 md:p-6 border border-border/10 relative group hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[32px] group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />
                    <div className="relative w-full h-full min-h-[200px] md:min-h-[250px] lg:min-h-[280px]">
                        <Image
                            src="/img/hito2.webp"
                            alt="Hito SEDIPRO - Crown Night 2026"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 90vw, 40vw"
                            priority
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </section>
)

export default Feedback