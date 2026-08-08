// src/app/crown-night/sections/Insights.jsx
'use client'

import { motion } from 'framer-motion'
import { InsightCard, TitleText, TypingText } from '../components'
import { staggerContainer } from '../utils/motion'
import { insights } from '../constants'

const Insights = () => (
    <section className="py-20 px-4 relative">
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="max-w-7xl mx-auto flex flex-col"
        >
            <TypingText title="| Cronograma de Actividades" textStyles="text-center" />
            <TitleText 
                title="Calendario de Crown Night" 
                textStyles="text-center" 
            />

            {/* Encabezados de la tabla - Solo desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 mt-[50px] mb-4 px-5">
                <div className="col-span-2">
                    <span className="text-sm font-bold text-foreground/40 uppercase tracking-wider">
                        Fecha
                    </span>
                </div>
                <div className="col-span-5">
                    <span className="text-sm font-bold text-foreground/40 uppercase tracking-wider">
                        Actividad
                    </span>
                </div>
                <div className="col-span-5">
                    <span className="text-sm font-bold text-foreground/40 uppercase tracking-wider">
                        ¿Qué se evalúa?
                    </span>
                </div>
            </div>

            {/* Lista de actividades */}
            <div className="flex flex-col gap-3">
                {insights.map((insight, i) => (
                    <InsightCard
                        key={insight.id}
                        {...insight}
                        index={i + 1}
                    />
                ))}
            </div>
        </motion.div>
    </section>
)

export default Insights