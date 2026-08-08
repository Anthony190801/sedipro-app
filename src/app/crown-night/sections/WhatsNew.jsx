// src/app/crown-night/sections/WhatsNew.jsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { NewFeatures, TitleText, TypingText } from '../components'
import { planetVariants, staggerContainer, fadeIn } from '../utils/motion'
import { newFeatures } from '../constants'

const WhatsNew = () => (
    <section className="py-20 px-4 relative">
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="max-w-7xl mx-auto flex lg:flex-row flex-col gap-8"
        >
            <motion.div
                variants={fadeIn('right', 'tween', 0.2, 1)}
                className="flex-[0.95] flex justify-center flex-col"
            >
                <TypingText title="| Requisitos de participación" />
                <TitleText title={<>Requisitos<span className="text-primary"></span></>} />
                <div className="mt-[48px] flex flex-wrap justify-between gap-[24px]">
                    {newFeatures.map((feature) => (
                        <NewFeatures key={feature.id} {...feature} />
                    ))}
                </div>
            </motion.div>

            <motion.div
                variants={planetVariants('right')}
                className="flex-1 flex items-center justify-center"
            >
                <div className="w-[90%] h-[90%] aspect-square rounded-3xl glass-card backdrop-blur-sm flex items-center justify-center">
                    <div className="relative w-[80%] h-[80%]">
                        <Image
                            src="/img/hito1.webp"
                            alt="Hito SEDIPRO"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 80vw, 40vw"
                            priority={false}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </section>
)

export default WhatsNew