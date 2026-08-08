// src/app/crown-night/sections/Miss.jsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TypingText, ExploreCard, TitleText } from '../components'
import { staggerContainer } from '../utils/motion'
import { missWorlds } from '../constants/missData'

const Miss = () => {
    const [active, setActive] = useState('miss-5')

    return (
        <section className="py-20 px-4" id="miss">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                className="max-w-7xl mx-auto flex flex-col"
            >
                <TypingText title="| Miss Crown Night" textStyles="text-center" />
                <TitleText
                    title={<>Conoce a las candidatas <br className="md:block hidden" />de Miss Crown Night</>}
                    textStyles="text-center"
                />

                <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
                    {missWorlds.map((world, index) => (
                        <ExploreCard
                            key={world.id}
                            {...world}
                            index={index}
                            active={active}
                            handleClick={setActive}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default Miss