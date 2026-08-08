'use client'

import { matchCenterY } from './Bracket'
import '../styles/BracketConnector.css'

export default function BracketConnector({
  roundIdx,
  matchesCount,
  nextMatchesCount,
  treeHeight,
  slotHeight,
  width = 48,
}) {
  if (!matchesCount || !nextMatchesCount) return null

  const filterId = `glow-${roundIdx}`
  const gradientId = `grad-${roundIdx}`

  const generatePaths = () => {
    const paths = []
    // Punto donde se quiebra la línea horizontalmente (centro del conector)
    const elbowX = width / 2

    for (let k = 0; k < matchesCount; k++) {
      const fromY = matchCenterY(roundIdx, k, slotHeight)
      const targetIdx = Math.floor(k / 2)
      const toY = matchCenterY(roundIdx + 1, targetIdx, slotHeight)

      // Forma: línea recta a la derecha → baja/sube en vertical → línea recta al destino
      const d = [
        `M 0,${fromY}`,
        `L ${elbowX},${fromY}`,
        `L ${elbowX},${toY}`,
        `L ${width},${toY}`,
      ].join(' ')

      paths.push(
        <g key={`conn-${roundIdx}-${k}`}>
          {/* Línea de glow difuminado */}
          <path
            d={d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
            filter={`url(#${filterId})`}
            opacity="0.6"
          />
          {/* Línea principal nítida */}
          <path
            d={d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </g>
      )
    }

    return paths
  }

  return (
    <div
      className="bracket-connector"
      style={{ height: `${treeHeight}px` }}
      aria-hidden="true"
    >
      <svg
        width={width}
        height={treeHeight}
        viewBox={`0 0 ${width} ${treeHeight}`}
        className="bracket-connector__svg"
      >
        <defs>
          {/* Filtro glow */}
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          </filter>
          {/* Gradiente blanco → gris */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(200,210,230,0.45)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(200,210,230,0.45)" />
          </linearGradient>
        </defs>
        {generatePaths()}
      </svg>
    </div>
  )
}
