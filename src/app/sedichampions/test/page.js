'use client'

import Bracket from '../components/Bracket'
import { assignByes } from '../utils/bracketLogic'

// Colores de ejemplo
const COLORS = [
  '#672577', '#3454A1', '#10B981', '#F59E0B',
  '#EF4444', '#3B82F6', '#7C4191', '#2B2D67',
  '#4A6BB8', '#1E3A5F',
]

function makeTeams(count) {
  const names = [
    'Los Galácticos', 'Real UNT', 'Atlético Campus', 'Deportivo Ing.',
    'FC Contabilidad', 'Sport Derecho', 'Medicina FC', 'Los Titanes',
    'Agronomía Utd.', 'Económicas FC',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i] || `Equipo ${i + 1}`,
    color: COLORS[i % COLORS.length],
  }))
}

const CASES = [
  { count: 5,  label: '5 equipos  →  cuadro de 8  (3 BYEs)' },
  { count: 7,  label: '7 equipos  →  cuadro de 8  (1 BYE)' },
  { count: 8,  label: '8 equipos  →  cuadro de 8  (0 BYEs — perfecto)' },
  { count: 9,  label: '9 equipos  →  cuadro de 16 (7 BYEs)' },
  { count: 10, label: '10 equipos →  cuadro de 16 (6 BYEs)' },
]

export default function BracketTestPage() {
  return (
    <div style={{ background: '#1b1f22', minHeight: '100vh', padding: '2rem 1rem' }}>
      <h1 style={{
        color: '#fff',
        fontFamily: 'sans-serif',
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
        textAlign: 'center',
      }}>
        🧪 Prueba Visual — Bracket con distintas cantidades de equipos
      </h1>
      <p style={{
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'sans-serif',
        fontSize: '0.85rem',
        textAlign: 'center',
        marginBottom: '3rem',
      }}>
        Esta página es temporal — solo para verificar el comportamiento visual del bracket.
      </p>

      {CASES.map(({ count, label }) => {
        const teams = assignByes(makeTeams(count), 2026)
        return (
          <div
            key={count}
            style={{
              marginBottom: '4rem',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <p style={{
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              background: 'rgba(103,37,119,0.15)',
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(103,37,119,0.3)',
            }}>
              {label}
            </p>
            <Bracket
              teams={teams}
              schedule={[]}
              title={`${count} equipos`}
              seed={2026}
            />
          </div>
        )
      })}
    </div>
  )
}
