'use client'

import { useMemo } from 'react'
import RoundColumn from './RoundColumn'
import BracketConnector from './BracketConnector'
import { assignByes, buildBracket } from '../utils/bracketLogic'
import '../styles/Bracket.css'

/* ============================================================================
   Constantes de layout del bracket
   ============================================================================ */

/** Altura vertical asignada a cada partido de la primera ronda (px) */
const SLOT_HEIGHT = 130

/** Altura mínima estimada de una MatchCard (debe coincidir con el CSS) */
export const MATCH_CARD_H = 80

/** Ancho del conector SVG entre columnas */
const CONNECTOR_WIDTH = 40

/**
 * Calcula la coordenada Y del centro de un partido en el árbol.
 * Fórmula: (matchIdx * 2^roundIdx + 2^(roundIdx-1)) * slotHeight
 */
export function matchCenterY(roundIdx, matchIdx, slotHeight = SLOT_HEIGHT) {
  const span = Math.pow(2, roundIdx)
  return (matchIdx * span + span / 2) * slotHeight
}

export default function Bracket({ teams, schedule, title, seed = 2026, skipAssignByes = false }) {
  const bracket = useMemo(() => {
    if (!teams || teams.length < 2) return null
    // Si ya se realizó el sorteo, usar los equipos con sus bye flags directamente
    const teamsWithByes = skipAssignByes ? teams : assignByes(teams, seed)
    return buildBracket(teamsWithByes, schedule)
  }, [teams, schedule, seed, skipAssignByes])

  if (!bracket || bracket.rounds.length === 0) {
    return (
      <section className="bracket-section">
        <h2 className="bracket-title">{title || 'Cuadro del Torneo'}</h2>
        <p className="bracket-empty">
          Se necesitan al menos 2 equipos para generar el cuadro.
        </p>
      </section>
    )
  }

  const firstRoundCount = bracket.rounds[0]?.matches.length || 0
  const treeHeight = firstRoundCount * SLOT_HEIGHT
  const finalRoundIdx = bracket.rounds.length - 1

  return (
    <section className="bracket-section">
      <div className="bracket-header">
        <h2 className="bracket-title">{title || 'Cuadro del Torneo'}</h2>
        <div className="bracket-stats">
          <span className="bracket-stat">
            <strong>{bracket.totalTeams}</strong> equipos
          </span>
          {bracket.byeCount > 0 && (
            <span className="bracket-stat bracket-stat--bye">
              <strong>{bracket.byeCount}</strong> PASE DIRECTO
            </span>
          )}
          <span className="bracket-stat">
            Cuadro de <strong>{bracket.targetSlots}</strong>
          </span>
        </div>
      </div>

      <div className="bracket-scroll">
        <div
          className="bracket-tree"
          style={{ height: `${treeHeight}px` }}
        >
          {bracket.rounds.map((round, roundIdx) => (
            <div
              key={`round-wrapper-${roundIdx}`}
              className="bracket-round-wrapper"
            >
              <RoundColumn
                round={round}
                roundIdx={roundIdx}
                isFinal={roundIdx === finalRoundIdx}
                treeHeight={treeHeight}
                slotHeight={SLOT_HEIGHT}
              />

              {roundIdx < bracket.rounds.length - 1 && (
                <BracketConnector
                  roundIdx={roundIdx}
                  matchesCount={round.matches.length}
                  nextMatchesCount={bracket.rounds[roundIdx + 1]?.matches.length || 0}
                  treeHeight={treeHeight}
                  slotHeight={SLOT_HEIGHT}
                  width={CONNECTOR_WIDTH}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bracket-legend">
        <span className="bracket-legend__item">
          <span className="bracket-legend__dot bracket-legend__dot--bye" />
          PASE DIRECTO
        </span>
        <span className="bracket-legend__item">
          <span className="bracket-legend__dot bracket-legend__dot--pending" />
          POR DEFINIR
        </span>
      </div>
    </section>
  )
}
