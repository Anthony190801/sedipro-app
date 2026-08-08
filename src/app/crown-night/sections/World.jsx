// src/app/crown-night/sections/World.jsx - Versión Circular con Colores
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { TitleText, TypingText } from '../components'
import { staggerContainer, fadeIn } from '../utils/motion'

const areas = [
    { 
        id: 'ltk', 
        name: 'LTK & FNZ', 
        fullName: 'Logística y Finanzas', 
        color: 'text-sky-400',
        borderColor: 'border-sky-400/50',
        bgHover: 'hover:bg-sky-500/10',
        shadow: 'shadow-sky-400/20'
    },
    { 
        id: 'gth', 
        name: 'GTH', 
        fullName: 'Gestión de Talento Humano', 
        color: 'text-green-400',
        borderColor: 'border-green-400/50',
        bgHover: 'hover:bg-green-500/10',
        shadow: 'shadow-green-400/20'
    },
    { 
        id: 'mkt', 
        name: 'MKT', 
        fullName: 'Marketing', 
        color: 'text-red-400',
        borderColor: 'border-red-400/50',
        bgHover: 'hover:bg-red-500/10',
        shadow: 'shadow-red-400/20'
    },
    { 
        id: 'pmo', 
        name: 'PMO', 
        fullName: 'Project Management Office', 
        color: 'text-yellow-400',
        borderColor: 'border-yellow-400/50',
        bgHover: 'hover:bg-yellow-500/10',
        shadow: 'shadow-yellow-400/20'
    },
    { 
        id: 'ti', 
        name: 'TI', 
        fullName: 'Tecnologías de la Información', 
        color: 'text-orange-400',
        borderColor: 'border-orange-400/50',
        bgHover: 'hover:bg-orange-500/10',
        shadow: 'shadow-orange-400/20'
    }
]

// Radio del círculo
const RADIUS = 37

const getPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2
    const x = 50 + RADIUS * Math.cos(angle)
    const y = 50 + RADIUS * Math.sin(angle)
    return { top: `${y}%`, left: `${x}%` }
}

const World = () => {
    const positions = areas.map((_, i) => getPosition(i, areas.length))

    return (
        <section className="py-20 px-4 relative z-10">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                className="max-w-7xl mx-auto flex flex-col"
            >
                <TypingText title="| Áreas Participantes" textStyles="text-center" />
                <TitleText
                    title={<>Áreas de <span className="text-primary">SEDIPRO UNT</span></>}
                    textStyles="text-center"
                />

                <motion.div
                    variants={fadeIn('up', 'tween', 0.3, 1)}
                    className="relative mt-[69px] w-full rounded-3xl glass-card/10 backdrop-blur-sm overflow-hidden flex items-center justify-center py-12"
                >
                    {/* Fondo con gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

                    {/* Contenedor CUADRADO */}
                    <div className="relative w-[min(88vw,600px)] aspect-square">

                        {/* Líneas de conexión */}
                        <svg
                            className="absolute inset-0 w-full h-full opacity-20"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            {positions.map((pos, i) => {
                                const nextPos = positions[(i + 1) % positions.length]
                                const x1 = parseFloat(pos.left)
                                const y1 = parseFloat(pos.top)
                                const x2 = parseFloat(nextPos.left)
                                const y2 = parseFloat(nextPos.top)
                                return (
                                    <line
                                        key={i}
                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke="#672577"
                                        strokeWidth="1.5"
                                        strokeDasharray="3,3"
                                        vectorEffect="non-scaling-stroke"
                                        className="opacity-30"
                                    />
                                )
                            })}
                        </svg>

                        {/* Áreas en círculo - CON COLORES */}
                        {areas.map((area, index) => (
                            <motion.div
                                key={area.id}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    scale: 1.2,
                                    transition: { type: 'spring', stiffness: 300 }
                                }}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                                style={{
                                    top: positions[index].top,
                                    left: positions[index].left
                                }}
                            >
                                {/* Círculo con color del área */}
                                <div className={`
                                    w-[60px] h-[60px] 
                                    sm:w-[80px] sm:h-[80px] 
                                    md:w-[100px] md:h-[100px]
                                    rounded-full 
                                    glass-card 
                                    border-2 
                                    ${area.borderColor}
                                    ${area.bgHover}
                                    transition-all duration-300
                                    flex flex-col items-center justify-center
                                    shadow-lg 
                                    ${area.shadow}
                                    hover:shadow-xl 
                                    hover:${area.shadow.replace('/20', '/40')}
                                    mx-auto
                                    group
                                `}>
                                    {/* Siglas con color del área */}
                                    <span className={`
                                        font-bold 
                                        text-sm sm:text-xl md:text-2xl 
                                        ${area.color}
                                        group-hover:scale-110
                                        transition-transform
                                        drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]
                                    `}>
                                        {area.name}
                                    </span>
                                </div>

                                {/* Nombre completo con color del área */}
                                <p className={`
                                    mt-2 
                                    text-[10px] sm:text-xs md:text-sm 
                                    ${area.color}
                                    font-medium
                                    max-w-[80px] sm:max-w-[100px] md:max-w-[120px]
                                    mx-auto
                                    leading-tight
                                    opacity-80
                                `}>
                                    {area.fullName}
                                </p>
                            </motion.div>
                        ))}

                        {/* Centro con Crown Night */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="
                                w-[60px] h-[60px] 
                                sm:w-[80px] sm:h-[80px] 
                                md:w-[100px] md:h-[100px] 
                                rounded-full 
                                glass-card 
                                border-2 border-primary/30 
                                flex items-center justify-center 
                                p-2
                                mx-auto
                                shadow-lg shadow-primary/20
                            ">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/crown-night/logo.webp"
                                        alt="Crown Night"
                                        fill
                                        className="object-contain p-2"
                                        sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, 100px"
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-xs sm:text-sm text-foreground/50 font-medium">
                                Crown Night
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default World