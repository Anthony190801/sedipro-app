// src/app/crown-night/sections/Mister.jsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TypingText, ExploreCard, TitleText } from '../components'
import { staggerContainer } from '../utils/motion'
import { misterWorlds } from '../constants/misterData'

const Mister = () => {
    const [active, setActive] = useState('mister-5')

    return (
        <section className="py-20 px-4" id="mister">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                className="max-w-7xl mx-auto flex flex-col"
            >
                <TypingText title="| Mister Crown Night" textStyles="text-center" />
                <TitleText
                    title={<>Conoce a los candidatos <br className="md:block hidden" />de Mister Crown Night</>}
                    textStyles="text-center"
                />

                <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
                    {misterWorlds.map((world, index) => (
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

export default Mister