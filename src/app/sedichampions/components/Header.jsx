'use client'

import Image from 'next/image'
import Link from 'next/link'
import Shuffle from './Shuffle'
import '../styles/Header.css'

export default function Header({
  onOpenArticle,
  onTabChange,
  activeTab,
  timeout,
  isArticleVisible,
}) {
  const navItems = [
    { key: 'futbol',  label: 'FÚTBOL',  action: 'tab' },
    { key: 'voley',   label: 'VOLEY',   action: 'tab' },
    { key: 'gymkana', label: 'GYMKANA', action: 'modal' },
    { key: 'lugar',   label: 'LUGAR',   action: 'modal' },
  ]

  const handleNavClick = (item) => {
    if (item.action === 'tab' && onTabChange) {
      if (activeTab === item.key) {
        onTabChange(null)
      } else {
        onTabChange(item.key)
      }
    } else if (item.action === 'modal' && onOpenArticle) {
      onOpenArticle(item.key)
    }
  }

  return (
    <header
      id="header"
      className={`
        flex flex-col items-center max-w-full text-center
        transition-all duration-[0.325s] ease-in-out
        ${isArticleVisible ? 'opacity-0 scale-95 blur-[0.1rem]' : ''}
        ${timeout ? 'opacity-0 blur-[0.125rem]' : ''}
      `}
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.25) 25%, rgba(0,0,0,0) 55%)',
      }}
    >
      {/* Logo SEDIPRO UNT */}
      <Link
        href="https://sediprount.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 sm:gap-3 hover:opacity-80 transition-opacity group mt-4 mb-2 max-sm:mt-3 max-[400px]:mt-2 max-[400px]:mb-1.5"
      >
        <div className="relative w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0">
          <Image
            src="/logos/isotipo.webp"
            alt="Logo SEDIPRO UNT"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 24px, 40px"
          />
        </div>
        <span className="inline text-[0.65rem] sm:text-base md:text-lg font-bold text-white whitespace-nowrap transition-colors">
          SEDIPRO UNT
        </span>
      </Link>

      {/* Logo (copa) */}
      <div
        className={`
          flex items-center justify-center flex-shrink-0
          transition-opacity duration-[0.325s] ease-in-out
          w-56 h-56 max-md:w-44 max-md:h-44 max-sm:w-56 max-sm:h-56 max-[400px]:w-28 max-[400px]:h-28
        `}
      >
        <Image
          src="/sedichampions/logo.webp"
          alt="SediChampions League 2016"
          width={200}
          height={200}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Título */}
      <div className="max-w-full w-full flex justify-center mt-2 max-sm:mt-1">
        <div
          className={`
            p-6 max-h-[40rem] overflow-hidden
            transition-all duration-[0.75s] ease delay-[0.25s]
            max-sm:p-6 max-[400px]:p-4
            ${timeout ? 'max-h-0 pt-0 pb-0 opacity-0' : ''}
          `}
        >
          <div className="inline-block border-[3px] border-white px-4 py-2 max-sm:px-3 max-sm:py-1.5 max-[400px]:px-2 max-[400px]:py-1">
            <Shuffle
              text="SEDICHAMPIONS LEAGUE 2026"
              tag="h1"
              className="shuffle-title font-bold m-0 text-white"
              shuffleDirection="right"
              duration={0.45}
              shuffleTimes={2}
              animationMode="evenodd"
              stagger={0.035}
              ease="power3.out"
              scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
              threshold={0.1}
              rootMargin="0px"
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              colorFrom="rgba(255,255,255,0.35)"
              colorTo="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="w-full flex justify-center px-2 sm:px-0">
        <ul className="flex mb-0 list-none p-0 border-2 border-white rounded overflow-hidden w-full max-w-sm sm:max-w-md">
          {navItems.map((item, i) => {
            const isActive = item.action === 'tab' && activeTab === item.key
            return (
              <li
                key={item.key}
                className={`
                  border-l-2 border-white flex-1 min-w-0
                  ${i === 0 ? 'border-l-0' : ''}
                `}
              >
                <button
                  onClick={() => handleNavClick(item)}
                  className={`
                    block w-full px-2 sm:px-5 h-11 leading-11
                    uppercase tracking-[0.1rem] sm:tracking-[0.1rem] text-[0.6rem] sm:text-[0.8rem] font-medium
                    bg-transparent border-0 cursor-pointer
                    transition-colors duration-200
                    max-[400px]:text-[0.55rem] max-[400px]:px-1
                    focus-visible:outline-none focus-visible:bg-white focus-visible:text-[#1b1f22]
                    ${isActive
                      ? 'bg-white text-[#1b1f22]'
                      : 'text-white hover:bg-white hover:text-[#1b1f22] active:bg-white/80 active:text-[#1b1f22]'
                    }
                  `}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Video promocional — solo en home */}
      {!activeTab && (
        <div
          className={`
            w-full max-w-[280px] mx-auto my-14
            transition-all duration-[0.325s] ease-in-out
            ${timeout ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <div className="relative w-full" style={{ paddingBottom: '178%' }}>
            <iframe
              src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1047014287716451%2F&show_text=false&width=267&t=0"
              className="absolute inset-0 w-full h-full rounded-lg border-0"
              scrolling="no"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </header>
  )
}
