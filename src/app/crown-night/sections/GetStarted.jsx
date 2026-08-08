// src/app/crown-night/sections/GetStarted.jsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { staggerContainer, fadeIn, planetVariants } from '../utils/motion'
import { StartSteps, TitleText, TypingText } from '../components'
import { startingFeatures } from '../constants'

const GetStarted = () => (
    <section className="py-20 px-4 relative z-10">
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="max-w-7xl mx-auto flex lg:flex-row flex-col gap-8"
        >
            <motion.div
                variants={planetVariants('left')}
                className="flex items-center justify-center flex-1"
            >
                <div className="relative w-[90%] h-[90%] aspect-square rounded-3xl glass-card overflow-hidden flex items-center justify-center">
                    <div className="relative w-[80%] h-[80%]">
                        <Image
                            src="/img/hito4.webp"
                            alt="Hito SEDIPRO"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 80vw, 40vw"
                            priority={false}
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={fadeIn('left', 'tween', 0.2, 1)}
                className="flex-[0.75] flex justify-center flex-col"
            >
                <TypingText title="| Objetivos de Crown Night" />
                <TitleText title={<>Objetivos</>} />
                <div className="mt-[31px] flex flex-col max-w-[370px] gap-[24px]">
                    {startingFeatures.map((feature, index) => (
                        <StartSteps
                            key={feature}
                            number={index + 1}
                            text={feature}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    </section>
)

export default GetStarted;