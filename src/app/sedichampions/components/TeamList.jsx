'use client'

import '../styles/TeamList.css'

export default function TeamList({ teams, title }) {
  if (!teams || teams.length === 0) {
    return (
      <section className="teamlist-section">
        <h2 className="teamlist-title">{title || 'Equipos Inscritos'}</h2>
        <p className="teamlist-empty">
          Aún no hay equipos inscritos. ¡Anímate a participar!
        </p>
      </section>
    )
  }

  return (
    <section className="teamlist-section">
      <h2 className="teamlist-title">
        {title || 'Equipos Inscritos'}
        <span className="teamlist-count">{teams.length}</span>
      </h2>

      <div className="teamlist-grid">
        {teams.map((team, index) => (
          <article key={team.id} className="team-card">
            <div
              className="team-card__color"
              style={{ backgroundColor: team.color || 'var(--color-primary)' }}
            />

            <div className="team-card__body">
              <span className="team-card__number">#{index + 1}</span>
              <h3 className="team-card__name">{team.name}</h3>
            </div>

            {team.bye && (
              <span className="team-card__bye" title="Pase directo a la siguiente ronda">
                PASE
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
