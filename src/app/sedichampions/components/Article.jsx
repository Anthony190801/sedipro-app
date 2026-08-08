'use client'

import Image from 'next/image'
import { useEffect } from 'react'

const articles = [
  {
    id: 'futbol',
    title: 'FÚTBOL',
    poster: '/sedichampions/futbol-voley.webp',
    description: 'Llegó el momento de demostrar el talento de tu equipo! Participa en el campeonato de fútbol de SEDICHAMPIONS LEAGUE 2026.',
    basesUrl: 'https://drive.google.com/file/d/1pLlSspDzFNA063J1trgRxyBC1gGP8AOn/view?usp=sharing',
    inscripcionUrl: 'https://forms.gle/KJbv9nJeLPDLbaWQ7',
  },
  {
    id: 'voley',
    title: 'VOLEY MIXTO',
    poster: '/sedichampions/futbol-voley.webp',
    description: 'Llegó el momento de demostrar el talento de tu equipo! Participa en el campeonato de voley mixto de SEDICHAMPIONS LEAGUE 2026.',
    basesUrl: 'https://drive.google.com/file/d/1pLlSspDzFNA063J1trgRxyBC1gGP8AOn/view?usp=sharing',
    inscripcionUrl: 'https://forms.gle/KJbv9nJeLPDLbaWQ7',
  },
  {
    id: 'gymkana',
    title: 'GYMKANA',
    poster: '/sedichampions/gymkana.webp',
    description: 'Gymkana con pruebas divertidas para todas los estudiantes.',
    basesUrl: 'https://drive.google.com/file/d/1pLlSspDzFNA063J1trgRxyBC1gGP8AOn/view?usp=sharing',
    inscripcionUrl: 'https://goo.su/Am0wQ',
  },
  {
    id: 'lugar',
    title: 'LUGAR',
    poster: null,
    description: null,
    basesUrl: null,
    inscripcionUrl: null,
  },
]

function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-10 h-10 rounded-full
        flex items-center justify-center
        hover:bg-white/10 active:bg-white/20
        transition-colors duration-200
        text-white text-2xl font-light
        cursor-pointer border-0 bg-transparent
        flex-shrink-0
        max-sm:w-8 max-sm:h-8 max-sm:text-xl
      "
      aria-label="Cerrar"
    >
      ✕
    </button>
  )
}

// Componente para artículos con póster (Fútbol, Voley, Gymkana)
function PosterArticle({ title, poster, description, basesUrl, inscripcionUrl }) {
  return (
    <div className="flex flex-col items-center">
      {/* Póster - 1080x1350 responsivo */}
      <div className="w-full max-w-[600px] mx-auto mb-8">
        <div className="relative w-full" style={{ paddingBottom: '125%' }}>
          <Image
            src={poster}
            alt={title}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 600px) 100vw, 600px"
            priority
          />
        </div>
      </div>

      {/* Descripción */}
      {description && (
        <p className="text-white/80 text-center mb-8 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}

      {/* Botones */}
      <div className="flex flex-wrap gap-4 justify-center pb-4">
        <a
          href={inscripcionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            bg-white text-[#1b1f22] font-semibold
            h-12 px-8 rounded cursor-pointer
            uppercase tracking-[0.2rem] text-[0.8rem]
            hover:bg-white/90 active:bg-white/80
            transition-colors duration-200
            flex items-center justify-center
          "
        >
          INSCRIBIRSE
        </a>
        <a
          href={basesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            bg-transparent text-white
            h-12 px-8 rounded cursor-pointer
            uppercase tracking-[0.2rem] text-[0.8rem]
            border-2 border-white
            hover:bg-white/10 active:bg-white/20
            transition-colors duration-200
            flex items-center justify-center
          "
        >
          DESCARGAR BASES
        </a>
      </div>
    </div>
  )
}

// Componente para el artículo "Lugar"
function LugarArticle() {
  const fotos = [
    '/sedichampions/lugar1.jpg',
    '/sedichampions/lugar2.webp',
    '/sedichampions/lugar3.webp',
  ]

  return (
    <div className="flex flex-col gap-8 pb-4">
      {/* Descripción del lugar */}
      <div className="text-white/80 text-center">
        <p className="mb-4 leading-relaxed">
          El evento se realizará el <strong>sábado 8 de agosto de 2026</strong> en el <strong>Club Campestre Golden Club</strong>, un espacio ideal para compartir, disfrutar de un ambiente agradable y vivir una jornada llena de deporte, integración y sana competencia. <strong>Hora de apertura:</strong> 8:00 a.m.
        </p>
        <p className="leading-relaxed">
          📍 Av. Metropolitana I, Trujillo
        </p>
      </div>

      {/* Google Maps Iframe - CORREGIDO */}
      <div className="w-full">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.2417317756112!2d-79.0578396!3d-8.0903378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d006dd80a57%3A0xa17423b43b14dcab!2sClub%20Campestre%20Golden%20Club!5e1!3m2!1ses-419!2spe!4v1785145764049!5m2!1ses-419!2spe"
            className="absolute inset-0 w-full h-full rounded-lg border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

      {/* Galería de fotos */}
      <div>
        <h3 className="text-white text-center text-[1rem] tracking-[0.2rem] uppercase mb-4">
          Galería del Lugar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fotos.map((foto, index) => (
            <div key={index} className="relative w-full" style={{ paddingBottom: '75%' }}>
              <Image
                src={foto}
                alt={`Lugar del evento ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Article({ article, articleTimeout, onCloseArticle, isOpen }) {
  const getArticleState = (id) => {
    if (article !== id) return { wrapper: 'hidden', content: 'opacity-0 translate-y-1' }
    if (!articleTimeout) return { wrapper: 'block', content: 'opacity-0 translate-y-1' }
    return { wrapper: 'block', content: 'opacity-100 translate-y-0' }
  }

  return (
    <div
      id="main"
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        p-6 max-sm:p-4
        ${isOpen ? '' : 'pointer-events-none'}
      `}
    >
      {articles.map((art) => {
        const state = getArticleState(art.id)
        const isLugar = art.id === 'lugar'

        return (
          <article
            key={art.id}
            id={art.id}
            className={`
              relative z-10
              w-full max-w-4xl
              max-h-[90vh] overflow-y-auto
              transition-all duration-[0.325s] ease-in-out
              ${state.wrapper}
              ${state.content}
              p-12 max-sm:p-8 max-[500px]:p-6
              scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/30
              hover:scrollbar-thumb-white/50
            `}
          >
            {/* Título con botón de cerrar alineado */}
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-white/25">
              <h2 className="text-white text-[1.5rem] leading-[1.4] tracking-[0.5rem] uppercase font-semibold m-0 max-sm:text-[1.2rem] max-[500px]:text-[1rem]">
                {art.title}
              </h2>
              <CloseButton onClick={onCloseArticle} />
            </div>

            {/* Contenido según el tipo de artículo */}
            {isLugar ? (
              <LugarArticle />
            ) : (
              <PosterArticle
                title={art.title}
                poster={art.poster}
                description={art.description}
                basesUrl={art.basesUrl}
                inscripcionUrl={art.inscripcionUrl}
              />
            )}
          </article>
        )
      })}
    </div>
  )
}