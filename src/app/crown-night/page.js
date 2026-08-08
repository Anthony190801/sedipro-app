// src/app/crown-night/page.js
'use client'

import {
    Hero,
    About,
    Miss,        
    Mister,    
    GetStarted,
    WhatsNew,
    World,
    Insights,
    Feedback
} from './sections'
import { Navbar, Footer } from './components'
import PixelSnow from './components/PixelSnow'

export default function CrownNightPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Fondo PixelSnow */}
            <div className="fixed inset-0 w-full h-full -z-10">
                <PixelSnow 
                    color="#ffffff" // color="#E0D534"
                    flakeSize={0.01}
                    minFlakeSize={1.25}
                    pixelResolution={500}
                    speed={0.5}
                    density={0.3}
                    direction={125}
                    brightness={1}
                    depthFade={20}
                    farPlane={12}
                    gamma={0.4545}
                    variant="square"
                />
            </div>

            <div className="fixed inset-0 bg-background/5 pointer-events-none -z-5" />

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <About />
                <Miss />         
                <Mister />        
                <GetStarted />
                <WhatsNew />
                <World />
                <Insights />
                <Feedback />
                <Footer />
            </div>
        </div>
    )
}