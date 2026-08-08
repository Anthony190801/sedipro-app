'use client'

import '../styles/MatchCard.css'

export default function MatchCard({ match, isClickable = false, onSelect }) {
  if (!match) return null

  const { id, teamA, teamB, time, court, winner } = match

  const isByeA = teamA?.bye || teamA?.name === 'PASE DIRECTO' || teamA?.id === 0
  const isByeB = teamB?.bye || teamB?.name === 'PASE DIRECTO' || teamB?.id === 0
  const isPendingA = teamA?.name === 'POR DEFINIR'
  const isPendingB = teamB?.name === 'POR DEFINIR'
  const isWinnerA = winner && teamA?.name && winner === teamA.name
  const isWinnerB = winner && teamB?.name && winner === teamB.name
  const hasWinner = !!winner

  const handleClick = () => {
    if (isClickable && onSelect) onSelect(id)
  }

  // Truncar nombres largos a N caracteres para evitar que desborden la tarjeta
  const formatName = (name) => {
    if (!name || name === 'POR DEFINIR' || name === 'PASE DIRECTO') return name
    const MAX = 15
    return name.length > MAX ? name.substring(0, MAX).trimEnd() + '…' : name
  }

  const displayA = isPendingA ? '???' : formatName(teamA?.name) || 'TBD'
  const displayB = isPendingB ? '???' : formatName(teamB?.name) || 'TBD'

  return (
    <button
      className={`match-card ${isClickable ? 'match-card--clickable' : ''} ${hasWinner ? 'match-card--decided' : ''}`}
      onClick={handleClick}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`${teamA?.name || 'TBD'} vs ${teamB?.name || 'TBD'}${time ? ` — ${time}` : ''}${court ? ` — ${court}` : ''}${winner ? ` — Ganador: ${winner}` : ''}`}
    >
      {/* Cabecera: hora a la izquierda, cancha a la derecha */}
      {(time || court) && (
        <div className="match-card__meta">
          <span className="match-card__time">{time || ''}</span>
          <span className="match-card__court">{court || ''}</span>
        </div>
      )}

      {/* Equipos apilados verticalmente */}
      <div className="match-card__teams">
        {/* Fila: Equipo A */}
        <div className={`match-card__team-row ${isByeA ? 'match-card__team--bye' : ''} ${isPendingA ? 'match-card__team--pending' : ''} ${isWinnerA ? 'match-card__team--winner' : ''} ${hasWinner && !isWinnerA ? 'match-card__team--loser' : ''}`}>
          <div className="match-card__team-info">
            <span
              className="match-card__team-dot"
              style={{
                backgroundColor: isPendingA ? 'transparent' : teamA?.color || 'var(--color-border)',
                border: isPendingA ? '2px dashed var(--color-border)' : 'none',
              }}
            />
            <span className="match-card__team-name">{displayA}</span>
          </div>
          {isWinnerA && <span className="match-card__crown">🏆</span>}
        </div>

        {/* Fila: Equipo B */}
        <div className={`match-card__team-row ${isByeB ? 'match-card__team--bye' : ''} ${isPendingB ? 'match-card__team--pending' : ''} ${isWinnerB ? 'match-card__team--winner' : ''} ${hasWinner && !isWinnerB ? 'match-card__team--loser' : ''}`}>
          <div className="match-card__team-info">
            <span
              className="match-card__team-dot"
              style={{
                backgroundColor: isPendingB ? 'transparent' : teamB?.color || 'var(--color-border)',
                border: isPendingB ? '2px dashed var(--color-border)' : 'none',
              }}
            />
            <span className="match-card__team-name">{displayB}</span>
          </div>
          {isWinnerB && <span className="match-card__crown">🏆</span>}
        </div>
      </div>
    </button>
  )
}
