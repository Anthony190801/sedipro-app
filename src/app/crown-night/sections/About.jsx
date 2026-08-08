// src/app/crown-night/sections/About.jsx
'use client'

import { motion } from 'framer-motion'
import { TypingText } from '../components/UI/CustomTexts'
import { fadeIn, staggerContainer } from '../utils/motion'

const About = () => (
    <section className="py-20 px-4 relative z-10">
        <div className="absolute inset-0" />

        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="max-w-7xl mx-auto flex flex-col items-center"
        >
            <TypingText
                title="| Sobre Crown Night"
                textStyles="text-center"
            />

            <motion.p
                variants={fadeIn('up', 'tween', 0.2, 1)}
                className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-foreground/70 max-w-4xl"
            >
                <span className="font-extrabold text-primary">Crown Night</span> es el certamen oficial que reúne el
                <span className="font-extrabold"> talento, </span>
                <span className="font-extrabold"> liderazgo </span> e
                <span className="font-extrabold"> identidad </span>
                de las áreas funcionales de <span className="font-extrabold text-primary">SEDIPRO UNT</span>,
                en una noche inolvidable. Este 29 de agosto, los candidatos representativos competirán en una pasarela de gala 
                y una ronda de conocimientos, promoviendo la integración, el desarrollo de habilidades blandas, el trabajo en equipo 
                y el verdadero espíritu sediprano.
            </motion.p>

            <motion.div
                variants={fadeIn('up', 'tween', 0.3, 1)}
                className="mt-[28px]"
            >
                <svg className="w-[18px] h-[28px] text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </motion.div>
    </section>
)

export default About;