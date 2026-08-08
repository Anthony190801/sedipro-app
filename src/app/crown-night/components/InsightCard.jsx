// src/app/crown-night/components/InsightCard.jsx
'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '../utils/motion'

const InsightCard = ({ index, date, activity, evaluation }) => (
    <motion.div
        variants={fadeIn('up', 'spring', index * 0.5, 1)}
        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 glass-card rounded-2xl p-4 md:p-5 hover:border-primary/30 transition-all duration-300 items-start"
    >
        {/* Fecha - Columna 1 */}
        <div className="md:col-span-2 flex items-start">
            <span className={`
                text-lg md:text-xl font-bold 
                ${date === 'Transversal' ? 'text-orange-400' : 'text-primary'}
                ${date.includes('Post') ? 'text-secondary' : ''}
            `}>
                {date}
            </span>
        </div>

        {/* Actividad - Columna 2 */}
        <div className="md:col-span-5 flex items-start">
            <p className="text-base md:text-lg text-foreground font-medium leading-relaxed">
                {activity}
            </p>
        </div>

        {/* Evaluación - Columna 3 */}
        <div className="md:col-span-5 flex items-start">
            <div className="flex items-start gap-2">
                <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                    {evaluation}
                </p>
            </div>
        </div>
    </motion.div>
)

export default InsightCard