'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Header from './components/Header'
import Article from './components/Article'
import Footer from './components/Footer'
import TeamList from './components/TeamList'
import Bracket from './components/Bracket'

import { assignByes } from './utils/bracketLogic'

// Datos por defecto mientras se carga desde la API
const DEFAULT_EVENT = { name: '', date: '', time: '', venue: '', address: '', drawCompleted: false, drawSeed: null }
const DEFAULT_DISCIPLINES = {}
const DEFAULT_SCHEDULES = {}

const BG_IMAGES = {
  futbol:  "url('/sedichampions/bg.webp')",
  voley:   "url('/sedichampions/bg.webp')",
  gymkana: "url('/sedichampions/bg.webp')",
  lugar:   "url('/sedichampions/bg.webp')",
  home:    "url('/sedichampions/bg.webp')",
}

function navbarToDiscipline(navKey) {
  if (navKey === 'futbol') return 'futbol7'
  if (navKey === 'voley')  return 'voleyMixto'
  return 'futbol7'
}

export default function SedichampionsPage() {
  const [activeTab, setActiveTab] = useState(null)

  const [article, setArticle] = useState('')
  const [timeout, setTimeoutState] = useState(false)
  const [articleTimeout, setArticleTimeout] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Datos del torneo desde la API
  const [eventInfo, setEventInfo] = useState(DEFAULT_EVENT)
  const [disciplines, setDisciplines] = useState(DEFAULT_DISCIPLINES)
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES)
  const [dataLoading, setDataLoading] = useState(true)

  const isTournamentMode = activeTab === 'futbol' || activeTab === 'voley'
  const isModalTab = activeTab === 'gymkana' || activeTab === 'lugar'

  const activeDisciplineKey = isTournamentMode
    ? navbarToDiscipline(activeTab)
    : 'futbol7'

  const activeDiscipline = disciplines[activeDisciplineKey]
  const activeSchedule = schedules[activeDisciplineKey] || []

  const backgroundImage = activeTab
    ? (BG_IMAGES[activeTab] || BG_IMAGES.home)
    : BG_IMAGES.home

  const drawCompleted = eventInfo.drawCompleted || false

  const teamsWithByes = useMemo(() => {
    if (!isTournamentMode || !activeDiscipline?.teams) return []
    // Si ya se realizó el sorteo, usar los bye flags de la API directamente
    if (drawCompleted) return activeDiscipline.teams
    // Si no, calcular BYEs client-side con semilla fija
    return assignByes(activeDiscipline.teams, 2026)
  }, [isTournamentMode, activeDiscipline, drawCompleted])

  const isArticleVisible = article !== ''

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Obtener datos del torneo desde la API (con polling cada 30s)
  useEffect(() => {
    let mounted = true
    let interval

    async function fetchTournamentData() {
      try {
        const res = await fetch('/api/sedichampions/tournament')
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        if (!mounted) return
        setEventInfo(data.event || DEFAULT_EVENT)
        setDisciplines(data.disciplines || DEFAULT_DISCIPLINES)
        setSchedules(data.schedules || DEFAULT_SCHEDULES)
        setDataLoading(false)
      } catch (err) {
        console.warn('[SEDICHAMPIONS] Falló fetch del torneo, usando datos locales:', err.message)
        // Fallback: cargar datos hardcodeados si la API no responde
        import('./data/tournamentData').then((mod) => {
          if (!mounted) return
          setEventInfo(mod.eventInfo)
          setDisciplines(mod.disciplines)
          setSchedules(mod.schedules)
          setDataLoading(false)
        }).catch(() => {
          if (mounted) setDataLoading(false)
        })
      }
    }

    fetchTournamentData()
    interval = setInterval(fetchTournamentData, 30000) // Polling cada 30s

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }
  }, [isModalOpen])

  useEffect(() => {
    if (isModalTab && article !== activeTab) {
      setIsModalOpen(true)
      setArticle(activeTab)
      setTimeout(() => setTimeoutState(true), 325)
      setTimeout(() => setArticleTimeout(true), 350)
    }
  }, [activeTab, isModalTab])

  const handleTabChange = useCallback((tabKey) => {
    if (isModalOpen) {
      handleCloseArticle()
      setTimeout(() => setActiveTab(tabKey), 350)
    } else {
      setActiveTab(tabKey)
    }
  }, [isModalOpen])

  const handleOpenArticle = (id) => {
    if (article === id) {
      handleCloseArticle()
      return
    }
    setIsModalOpen(true)
    setArticle(id)
    if (id === 'gymkana' || id === 'lugar') {
      setActiveTab(id)
    }
    setTimeout(() => setTimeoutState(true), 325)
    setTimeout(() => setArticleTimeout(true), 350)
  }

  const handleCloseArticle = () => {
    if (article === 'gymkana' || article === 'lugar') {
      setActiveTab(null)
    }
    setIsModalOpen(false)
    setArticleTimeout(false)
    setTimeout(() => setTimeoutState(false), 325)
    setTimeout(() => { setArticle('') }, 350)
  }

  return (
    <div
      className={`
        min-h-screen min-h-[100dvh] w-full
        ${isTournamentMode ? '' : 'overflow-x-hidden'}
      `}
      style={{ background: '#1b1f22' }}
    >
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute inset-0 transition-all duration-500 ease-in-out"
          style={{
            backgroundImage,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            transform: isArticleVisible ? 'scale(1.0825)' : 'scale(1.125)',
            filter: isArticleVisible ? 'blur(0.2rem)' : 'none',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(19,21,25,0.5), rgba(19,21,25,0.5)), url('/sedichampions/overlay.png')",
            backgroundSize: 'auto, 256px 256px',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, repeat',
          }}
        />
      </div>

      <div
        className={`
          relative flex flex-col items-center
          min-h-screen min-h-[100dvh] w-full
          px-4 sm:px-8 lg:px-16
          py-6 sm:py-8
          transition-opacity duration-500
          ${loading ? 'opacity-0' : 'opacity-100'}
        `}
        style={{ zIndex: 2 }}
      >
        <Header
          onOpenArticle={handleOpenArticle}
          onTabChange={handleTabChange}
          activeTab={activeTab}
          timeout={timeout}
          isArticleVisible={isArticleVisible}
        />

        {/* HOME */}
        {activeTab === null && (
          <div
            className={`
              w-full max-w-3xl mt-10 sm:mt-16 text-center
              transition-all duration-[0.325s] ease-in-out
              ${timeout ? 'opacity-0' : 'opacity-100'}
            `}
          >
            <div
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-5
                         px-4 sm:px-6 py-3 sm:py-4
                         bg-white/5 backdrop-blur-sm
                         rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">📍</span>
                <span className="font-semibold text-white/90">{eventInfo.venue}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">📅</span>
                <span className="font-semibold text-white/90">{eventInfo.date}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">🕗</span>
                <span className="font-semibold text-white/90">{eventInfo.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* FÚTBOL / VOLEY */}
        {isTournamentMode && (
          <>
            <section className="w-full mt-4 sm:mt-6 animate-fadeInUp">
              <Bracket
                teams={teamsWithByes}
                schedule={activeSchedule}
                title={`Cuadro del Torneo — ${activeDiscipline?.name || ''}`}
                seed={2026}
                skipAssignByes={drawCompleted}
              />
            </section>

            <section
              className="w-full mt-8 sm:mt-10 mb-8 animate-fadeInUp"
              style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
            >
              <TeamList
                teams={teamsWithByes}
                title={`Equipos Inscritos — ${activeDiscipline?.name || ''}`}
              />
            </section>
          </>
        )}

        {/* GYMKANA / LUGAR */}
        {isModalTab && (
          <div
            className={`
              w-full max-w-2xl mt-12 text-center
              transition-all duration-[0.325s] ease-in-out
              ${timeout ? 'opacity-0' : 'opacity-100'}
            `}
          >
            <p className="text-white/40 text-sm font-medium tracking-wider uppercase">
              {activeTab === 'gymkana' ? 'Gymkana' : 'Ubicación del evento'}
            </p>
          </div>
        )}

        <Footer timeout={timeout} isArticleVisible={isArticleVisible} />
      </div>

      <Article
        article={article}
        articleTimeout={articleTimeout}
        onCloseArticle={handleCloseArticle}
        isOpen={isModalOpen}
      />
    </div>
  )
}
