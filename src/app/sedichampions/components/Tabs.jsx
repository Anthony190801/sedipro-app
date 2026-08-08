'use client'

import '../styles/Tabs.css'

/**
 * Tabs — Selector de disciplina con reglas rápidas.
 *
 * Props:
 *   activeTab   : "futbol7" | "voleyMixto"
 *   onTabChange : callback(newTab)
 *   quickRules  : objeto { futbol7: string[], voleyMixto: string[] }
 *   disciplines : objeto con datos de cada disciplina (name, prize, etc.)
 */
export default function Tabs({ activeTab, onTabChange, quickRules, disciplines }) {
  if (!disciplines) return null

  const tabs = [
    { key: 'futbol7', label: '⚽ Fútbol 7' },
    { key: 'voleyMixto', label: '🏐 Vóley Mixto' },
  ]

  const active = disciplines[activeTab]
  const rules = quickRules?.[activeTab] || []

  return (
    <section className="tabs-section" aria-label="Selector de disciplina">
      {/* Botones de pestaña */}
      <div className="tabs-bar" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'tab-btn--active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel de información de la disciplina activa */}
      <div className="tab-panel" role="tabpanel">
        {/* Premio destacado */}
        <div className="tab-prize">
          <span className="tab-prize__icon">🏆</span>
          <span className="tab-prize__label">Premio</span>
          <span className="tab-prize__value">{active?.prize || '—'}</span>
        </div>

        {/* Reglas rápidas */}
        {rules.length > 0 && (
          <ul className="tab-rules">
            {rules.map((rule, i) => (
              <li key={i} className="tab-rules__item">
                <span className="tab-rules__dot" />
                {rule}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
