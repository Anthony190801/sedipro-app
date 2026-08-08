'use client'

import MatchCard from './MatchCard'
import { matchCenterY, MATCH_CARD_H } from './Bracket'
import '../styles/RoundColumn.css'

export default function RoundColumn({
  round,
  roundIdx,
  isFinal,
  treeHeight,
  slotHeight,
  onMatchSelect,
}) {
  if (!round || !round.matches || round.matches.length === 0) return null

  return (
    <div
      className={`round-column ${isFinal ? 'round-column--final' : ''}`}
      style={{ height: `${treeHeight}px` }}
    >
      <div className="round-column__header">
        <span className="round-column__line" />
        <h3 className="round-column__name">{round.name}</h3>
        <span className="round-column__line" />
      </div>

      <div className="round-column__body">
        {round.matches.map((match, idx) => {
          const centerY = matchCenterY(roundIdx, idx, slotHeight)
          const top = centerY - MATCH_CARD_H / 2

          return (
            <div
              key={match.id || idx}
              className="round-column__match-item"
              style={{ position: 'absolute', top: `${top}px` }}
            >
              <MatchCard
                match={match}
                isClickable={!!onMatchSelect}
                onSelect={onMatchSelect}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
