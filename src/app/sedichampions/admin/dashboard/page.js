'use client'

/**
 * ============================================================================
 * DASHBOARD ADMIN — /sedichampions/admin/dashboard
 * ============================================================================
 *
 * Panel principal con 4 secciones en tabs:
 *   📋 Evento     — editar nombre, fecha, lugar del evento
 *   ⚽ Equipos    — agregar/editar/eliminar equipos por disciplina
 *   🗓️ Horarios  — asignar hora y cancha por partido
 *   🏆 Resultados — ver bracket y marcar ganadores con un click
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'evento', label: '📋 Evento' },
  { key: 'equipos', label: '⚽ Equipos' },
  { key: 'horarios', label: '🗓️ Horarios' },
  { key: 'resultados', label: '🏆 Resultados' },
  { key: 'sorteo', label: '🎲 Sorteo' },
]

const DISCIPLINES = [
  { key: 'futbol7', label: 'Fútbol 7' },
  { key: 'voleyMixto', label: 'Vóley Mixto' },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('evento')
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  // Verificar sesión admin al cargar
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/sedichampions/auth')
        if (res.ok) {
          setAuthorized(true)
        } else {
          router.replace('/sedichampions/admin')
        }
      } catch {
        router.replace('/sedichampions/admin')
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [router])

  async function handleLogout() {
    // Limpiar cookie: establecer con maxAge=0
    document.cookie = 'sedi_admin_token=; path=/; max-age=0'
    router.replace('/sedichampions/admin')
  }

  if (checking) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#dae2fd', textAlign: 'center', padding: 60 }}>
          Verificando sesión…
        </p>
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div style={styles.container}>
      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 640px) {
          .horarios-desktop { display: none !important; }
          .horarios-mobile { display: block !important; }
          .admin-topbar-title { font-size: 20px; }
        }
        @media (min-width: 641px) {
          .horarios-desktop { display: block; }
          .horarios-mobile { display: none !important; }
        }
      `}</style>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>SEDICHAMPIONS</h1>
          <p style={styles.subtitle}>Panel de Administración</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'evento' && <EventoTab />}
        {activeTab === 'equipos' && <EquiposTab />}
        {activeTab === 'horarios' && <HorariosTab />}
        {activeTab === 'resultados' && <ResultadosTab />}
        {activeTab === 'sorteo' && <SorteoTab />}
      </div>
    </div>
  )
}

// ============================================================================
// TAB: EVENTO
// ============================================================================

function EventoTab() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/sedichampions/event')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEvent(d.event)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    try {
      const res = await fetch('/api/sedichampions/event', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
      const data = await res.json()
      if (data.success) {
        setMsg('✅ Información del evento actualizada')
      } else {
        setMsg('❌ Error al guardar')
      }
    } catch {
      setMsg('❌ Error de conexión')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  function updateField(field, value) {
    setEvent((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) return <p style={styles.loadingText}>Cargando evento…</p>
  if (!event) return <p style={styles.loadingText}>No se encontró el evento</p>

  return (
    <form onSubmit={handleSave} style={styles.form}>
      <h2 style={styles.sectionTitle}>Información General del Evento</h2>

      <Field label="Nombre del torneo" value={event.name} onChange={(v) => updateField('name', v)} />
      <Field label="Fecha" value={event.date} onChange={(v) => updateField('date', v)} placeholder="Sábado 08 de Agosto" />
      <Field label="Hora de inicio" value={event.time} onChange={(v) => updateField('time', v)} placeholder="08:00 AM" />
      <Field label="Lugar" value={event.venue} onChange={(v) => updateField('venue', v)} placeholder="Golden Club" />
      <Field label="Dirección (opcional)" value={event.address || ''} onChange={(v) => updateField('address', v)} />

      <div style={{ marginTop: 20 }}>
        <button type="submit" disabled={saving} style={styles.primaryBtn}>
          {saving ? 'Guardando…' : '💾 Guardar Cambios'}
        </button>
        {msg && <span style={{ marginLeft: 12, color: msg.startsWith('✅') ? '#10B981' : '#EF4444', fontSize: 14 }}>{msg}</span>}
      </div>
    </form>
  )
}

// ============================================================================
// TAB: EQUIPOS
// ============================================================================

function EquiposTab() {
  const [discipline, setDiscipline] = useState('futbol7')
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#672577')
  const [msg, setMsg] = useState('')

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sedichampions/teams?discipline=${discipline}`)
      const data = await res.json()
      if (data.success) setTeams(data.teams)
    } finally {
      setLoading(false)
    }
  }, [discipline])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return

    try {
      const res = await fetch('/api/sedichampions/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), discipline, color: newColor }),
      })
      const data = await res.json()
      if (data.success) {
        setNewName('')
        setNewColor('#672577')
        setMsg('✅ Equipo agregado')
        fetchTeams()
      } else {
        setMsg('❌ ' + (data.error || 'Error'))
      }
    } catch {
      setMsg('❌ Error de conexión')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleUpdate(id) {
    if (!editName.trim()) return
    try {
      const res = await fetch(`/api/sedichampions/teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), color: editColor }),
      })
      const data = await res.json()
      if (data.success) {
        setEditingId(null)
        setMsg('✅ Equipo actualizado')
        fetchTeams()
      }
    } catch {
      setMsg('❌ Error')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    try {
      const res = await fetch(`/api/sedichampions/teams/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg('🗑️ Equipo eliminado')
        fetchTeams()
      }
    } catch {
      setMsg('❌ Error')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  function startEdit(team) {
    setEditingId(team._id)
    setEditName(team.name)
    setEditColor(team.color)
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Gestión de Equipos</h2>

      {/* Selector de disciplina */}
      <div style={styles.disciplineSelector}>
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            onClick={() => setDiscipline(d.key)}
            style={{
              ...styles.tab,
              ...(discipline === d.key ? styles.tabActive : {}),
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Form agregar */}
      <form onSubmit={handleAdd} style={{ ...styles.form, marginBottom: 24 }}>
        <h3 style={{ color: '#dae2fd', fontSize: 15, margin: '0 0 12px' }}>Agregar nuevo equipo</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del equipo"
            style={styles.input}
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            style={{ width: 44, height: 44, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }}
          />
          <button type="submit" style={styles.primaryBtn}>+ Agregar</button>
        </div>
      </form>

      {msg && (
        <p style={{ color: msg.startsWith('✅') || msg.startsWith('🗑️') ? '#10B981' : '#EF4444', fontSize: 14, marginBottom: 12 }}>
          {msg}
        </p>
      )}

      {/* Tabla de equipos */}
      {loading ? (
        <p style={styles.loadingText}>Cargando equipos…</p>
      ) : teams.length === 0 ? (
        <p style={styles.loadingText}>No hay equipos en {DISCIPLINES.find((d) => d.key === discipline)?.label}. ¡Agrega el primero!</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={{ flex: '0 0 30px' }}>#</span>
            <span style={{ flex: 1, minWidth: 0, maxWidth: 200 }}>Nombre</span>
            <span style={{ flex: '0 0 70px', textAlign: 'center' }}>Color</span>
            <span style={{ flex: '0 0 80px', textAlign: 'right' }}>Acciones</span>
          </div>
          {teams.map((team) => (
            <div key={team._id} style={styles.tableRow}>
              {editingId === team._id ? (
                <>
                  <span style={{ flex: 0.15, color: '#dae2fd' }}>{team.teamId}</span>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ ...styles.inputSmall, flex: 0.45 }}
                    autoFocus
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', flex: '0 0 auto' }}
                  />
                  <div style={{ flex: 0.25, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => handleUpdate(team._id)} style={styles.smallBtn}>✅</button>
                    <button onClick={() => setEditingId(null)} style={styles.smallBtnDanger}>✕</button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ flex: '0 0 30px', color: '#dae2fd', fontWeight: 600 }}>{team.teamId}</span>
                  <span style={{
                    flex: 1,
                    minWidth: 0,
                    maxWidth: 200,
                    color: '#dae2fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: team.color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</span>
                  </span>
                  <span style={{ flex: '0 0 70px', color: 'rgba(218,226,253,0.5)', fontSize: 12, fontFamily: 'monospace', textAlign: 'center' }}>{team.color}</span>
                  <div style={{ flex: '0 0 80px', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(team)} style={styles.smallBtn}>✏️</button>
                    <button onClick={() => handleDelete(team._id, team.name)} style={styles.smallBtnDanger}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// TAB: HORARIOS
// ============================================================================

function HorariosTab() {
  const [discipline, setDiscipline] = useState('futbol7')
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMatch, setEditingMatch] = useState(null)
  const [editTime, setEditTime] = useState('')
  const [editCourt, setEditCourt] = useState('')
  const [msg, setMsg] = useState('')

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sedichampions/tournament')
      const data = await res.json()
      if (data.schedules && data.schedules[discipline]) {
        setSchedules(data.schedules[discipline])
      }
    } finally {
      setLoading(false)
    }
  }, [discipline])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  async function handleSaveMatch(match) {
    try {
      const res = await fetch(`/api/sedichampions/matches/${match.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: editTime, court: editCourt }),
      })
      const data = await res.json()
      if (data.success) {
        setEditingMatch(null)
        setMsg('✅ Horario actualizado')
        fetchSchedules()
      }
    } catch {
      setMsg('❌ Error')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  function startEdit(match) {
    setEditingMatch(match.id)
    setEditTime(match.time)
    setEditCourt(match.court)
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Horarios y Canchas</h2>

      <div style={styles.disciplineSelector}>
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            onClick={() => setDiscipline(d.key)}
            style={{
              ...styles.tab,
              ...(discipline === d.key ? styles.tabActive : {}),
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {msg && (
        <p style={{ color: '#10B981', fontSize: 14, marginBottom: 12 }}>{msg}</p>
      )}

      {loading ? (
        <p style={styles.loadingText}>Cargando horarios…</p>
      ) : schedules.length === 0 ? (
        <p style={styles.loadingText}>No hay partidos programados. Agrega equipos primero para generar el bracket.</p>
      ) : (
        schedules.map((round) => (
          <div key={round.roundIdx} style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#672577', fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>
              {round.round}
            </h3>
            {/* Wrapper con scroll horizontal para móviles */}
            <div style={styles.tableWrapper}>
              <div style={styles.tableInner}>
                {/* Vista escritorio: tabla flex */}
                <div className="horarios-desktop" style={styles.table}>
                  <div style={styles.tableHeader}>
                    <span style={{ flex: '0 0 28px' }}>#</span>
                    <span style={{ flex: 1, minWidth: 0 }}>Equipo A vs B</span>
                    <span style={{ flex: '0 0 110px' }}>Hora</span>
                    <span style={{ flex: '0 0 130px' }}>Cancha</span>
                    <span style={{ flex: '0 0 56px', textAlign: 'right' }}>Acción</span>
                  </div>
                  {round.matches.map((match, idx) => (
                    <div key={match.id} style={styles.tableRow}>
                      <span style={{ flex: '0 0 28px', color: '#dae2fd', fontWeight: 600 }}>{idx + 1}</span>
                      <span style={styles.teamNameCell}>
                        {match.teamA} <span style={styles.teamNameVs}>vs</span> {match.teamB}
                      </span>
                      {editingMatch === match.id ? (
                        <>
                          <input
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            placeholder="08:00 AM"
                            style={{ ...styles.inputSmall, flex: '0 0 110px', minWidth: 90 }}
                          />
                          <input
                            value={editCourt}
                            onChange={(e) => setEditCourt(e.target.value)}
                            placeholder="Cancha 1"
                            style={{ ...styles.inputSmall, flex: '0 0 130px', minWidth: 100 }}
                          />
                          <div style={{ flex: '0 0 56px', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleSaveMatch(match)} style={styles.smallBtn}>✅</button>
                            <button onClick={() => setEditingMatch(null)} style={styles.smallBtnDanger}>✕</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span style={{ flex: '0 0 110px', color: '#dae2fd', fontSize: 13, whiteSpace: 'nowrap' }}>{match.time || '—'}</span>
                          <span style={{ flex: '0 0 130px', color: '#dae2fd', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.court || '—'}</span>
                          <div style={{ flex: '0 0 56px', textAlign: 'right' }}>
                            <button onClick={() => startEdit(match)} style={styles.smallBtn}>✏️</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vista móvil: tarjetas individuales */}
            <div className="horarios-mobile" style={{ display: 'none' }}>
              {round.matches.map((match, idx) => (
                <div key={match.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#672577', fontWeight: 700, fontSize: 13 }}>#{idx + 1}</span>
                    <span style={{ color: '#dae2fd', fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {match.teamA} <span style={{ color: 'rgba(218,226,253,0.4)', fontWeight: 400 }}>vs</span> {match.teamB}
                    </span>
                  </div>
                  {editingMatch === match.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        placeholder="Hora (08:00 AM)"
                        style={{ ...styles.inputSmall, width: '100%' }}
                      />
                      <input
                        value={editCourt}
                        onChange={(e) => setEditCourt(e.target.value)}
                        placeholder="Cancha (Cancha 1)"
                        style={{ ...styles.inputSmall, width: '100%' }}
                      />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => handleSaveMatch(match)} style={styles.smallBtn}>✅ Guardar</button>
                        <button onClick={() => setEditingMatch(null)} style={styles.smallBtnDanger}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ color: 'rgba(218,226,253,0.5)', fontSize: 12 }}>
                          🕗 {match.time || '—'}
                        </span>
                        <span style={{ color: 'rgba(218,226,253,0.5)', fontSize: 12 }}>
                          📍 {match.court || '—'}
                        </span>
                      </div>
                      <button onClick={() => startEdit(match)} style={styles.smallBtn}>✏️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ============================================================================
// TAB: RESULTADOS
// ============================================================================

function ResultadosTab() {
  const [discipline, setDiscipline] = useState('futbol7')
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sedichampions/tournament')
      const data = await res.json()
      if (data.schedules && data.schedules[discipline]) {
        setSchedules(data.schedules[discipline])
      }
    } finally {
      setLoading(false)
    }
  }, [discipline])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  async function handleMarkWinner(match, teamName) {
    if (!teamName || teamName === 'POR DEFINIR' || teamName === 'PASE DIRECTO') return

    try {
      const res = await fetch(`/api/sedichampions/matches/${match.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner: teamName }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg(`🏆 ¡${teamName} gana! — bracket actualizado`)
        fetchSchedules()
      }
    } catch {
      setMsg('❌ Error al marcar ganador')
    }
    setTimeout(() => setMsg(''), 4000)
  }

  async function handleUnmarkWinner(match) {
    try {
      const res = await fetch(`/api/sedichampions/matches/${match.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner: null }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg('↩️ Ganador desmarcado')
        fetchSchedules()
      }
    } catch {
      setMsg('❌ Error')
    }
    setTimeout(() => setMsg(''), 4000)
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Resultados del Torneo</h2>

      <div style={styles.disciplineSelector}>
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            onClick={() => setDiscipline(d.key)}
            style={{
              ...styles.tab,
              ...(discipline === d.key ? styles.tabActive : {}),
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {msg && (
        <p style={{ color: '#F59E0B', fontSize: 14, fontWeight: 600, marginBottom: 12, padding: '8px 12px', background: 'rgba(245,158,11,0.1)', borderRadius: 8 }}>
          {msg}
        </p>
      )}

      {loading ? (
        <p style={styles.loadingText}>Cargando partidos…</p>
      ) : schedules.length === 0 ? (
        <p style={styles.loadingText}>No hay partidos para mostrar.</p>
      ) : (
        schedules.map((round) => (
          <div key={round.roundIdx} style={{ marginBottom: 28 }}>
            <h3 style={{
              color: round.round === 'Final' ? '#F59E0B' : '#672577',
              fontSize: 16,
              fontWeight: 700,
              margin: '0 0 10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              🏟️ {round.round}
            </h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {round.matches.map((match) => (
                <div
                  key={match.id}
                  style={{
                    ...styles.matchCard,
                    ...(match.winner ? { border: '1.5px solid rgba(245,158,11,0.6)' } : {}),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {/* Equipo A */}
                    <button
                      onClick={() => handleMarkWinner(match, match.teamA)}
                      disabled={match.teamA === 'POR DEFINIR' || match.teamA === 'PASE DIRECTO' || match.winner === match.teamA}
                      title={match.winner === match.teamA ? 'Ganador actual' : `Marcar ${match.teamA} como ganador`}
                      style={{
                        ...styles.teamBtn,
                        flex: 1,
                        minWidth: 140,
                        ...(match.winner === match.teamA ? styles.teamBtnWinner : {}),
                        ...(match.teamA === 'PASE DIRECTO' ? styles.teamBtnBye : {}),
                      }}
                    >
                      {match.winner === match.teamA && <span style={{ marginRight: 4 }}>🏆</span>}
                      {match.teamA}
                    </button>

                    <span style={{ color: 'rgba(218,226,253,0.5)', fontWeight: 700, fontSize: 13 }}>VS</span>

                    {/* Equipo B */}
                    <button
                      onClick={() => handleMarkWinner(match, match.teamB)}
                      disabled={match.teamB === 'POR DEFINIR' || match.teamB === 'PASE DIRECTO' || match.winner === match.teamB}
                      title={match.winner === match.teamB ? 'Ganador actual' : `Marcar ${match.teamB} como ganador`}
                      style={{
                        ...styles.teamBtn,
                        flex: 1,
                        minWidth: 140,
                        ...(match.winner === match.teamB ? styles.teamBtnWinner : {}),
                        ...(match.teamB === 'PASE DIRECTO' ? styles.teamBtnBye : {}),
                      }}
                    >
                      {match.winner === match.teamB && <span style={{ marginRight: 4 }}>🏆</span>}
                      {match.teamB}
                    </button>
                  </div>

                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                    {match.time && (
                      <span style={{ color: 'rgba(218,226,253,0.5)', fontSize: 12 }}>🕗 {match.time}</span>
                    )}
                    {match.court && (
                      <span style={{ color: 'rgba(218,226,253,0.5)', fontSize: 12 }}>📍 {match.court}</span>
                    )}
                    {match.winner && (
                      <button
                        onClick={() => handleUnmarkWinner(match)}
                        style={{ color: '#EF4444', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Desmarcar ganador
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ============================================================================
// TAB: SORTEO
// ============================================================================

function SorteoTab() {
  const [discipline, setDiscipline] = useState('futbol7')
  const [drawResult, setDrawResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [eventInfo, setEventInfo] = useState(null)

  // Obtener info del evento (drawCompleted, drawSeed)
  useEffect(() => {
    fetch('/api/sedichampions/event')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEventInfo(d.event)
      })
  }, [])

  async function handleDraw() {
    if (!window.confirm(`¿Realizar sorteo de ${DISCIPLINES.find((d) => d.key === discipline)?.label}?\n\nEsto barajará aleatoriamente los equipos y asignará PASE DIRECTO. Los emparejamientos de primera ronda se actualizarán.`)) return

    setLoading(true)
    setMsg('')
    setDrawResult(null)

    try {
      const res = await fetch('/api/sedichampions/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discipline }),
      })
      const data = await res.json()
      if (data.success) {
        setDrawResult(data)
        setMsg(`✅ Sorteo realizado. Semilla: ${data.drawSeed}`)
        // Refrescar info del evento
        fetch('/api/sedichampions/event')
          .then((r) => r.json())
          .then((d) => { if (d.success) setEventInfo(d.event) })
      } else {
        setMsg('❌ ' + (data.error || 'Error'))
      }
    } catch {
      setMsg('❌ Error de conexión')
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 6000)
    }
  }

  const drawDone = eventInfo?.drawCompleted || drawResult?.success

  return (
    <div>
      <h2 style={styles.sectionTitle}>Sorteo de Equipos</h2>

      <div style={styles.disciplineSelector}>
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            onClick={() => { setDiscipline(d.key); setDrawResult(null) }}
            style={{
              ...styles.tab,
              ...(discipline === d.key ? styles.tabActive : {}),
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {msg && (
        <p style={{
          color: msg.startsWith('✅') ? '#10B981' : '#EF4444',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 16,
          padding: '10px 14px',
          background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          borderRadius: 8,
        }}>
          {msg}
        </p>
      )}

      {/* Botón de sorteo */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={handleDraw}
          disabled={loading}
          style={{
            ...styles.primaryBtn,
            fontSize: 16,
            padding: '14px 32px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '🔄 Sorteando…' : '🎲 Realizar Sorteo'}
        </button>
        {drawDone && (
          <span style={{ marginLeft: 14, color: 'rgba(218,226,253,0.5)', fontSize: 13 }}>
            Último sorteo: semilla {eventInfo?.drawSeed || drawResult?.drawSeed}
          </span>
        )}
      </div>

      {/* Resultados del sorteo */}
      {drawResult && (
        <div style={{ ...styles.form, marginBottom: 20 }}>
          <h3 style={{ color: '#F59E0B', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>
            🏆 Resultados del Sorteo
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* BYE Teams */}
            <div>
              <h4 style={{ color: '#10B981', fontSize: 14, margin: '0 0 10px' }}>
                🟢 PASE DIRECTO ({drawResult.byeCount} equipos)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {drawResult.byeTeams.map((name, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 6,
                    color: '#dae2fd',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    🎫 {name}
                  </div>
                ))}
              </div>
            </div>

            {/* Pairings */}
            <div>
              <h4 style={{ color: '#F59E0B', fontSize: 14, margin: '0 0 10px' }}>
                ⚔️ Emparejamientos — Ronda Preliminar
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {drawResult.pairings.map((p, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 6,
                    color: '#dae2fd',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, color: 'rgba(218,226,253,0.4)', fontSize: 12 }}>
            Semilla: {drawResult.drawSeed} &nbsp;|&nbsp; Equipos: {drawResult.totalTeams} &nbsp;|&nbsp; Cuadro de {drawResult.targetSlots}
          </div>
        </div>
      )}

      {/* Info si no hay sorteo aún */}
      {!drawDone && !loading && (
        <div style={styles.form}>
          <p style={{ color: 'rgba(218,226,253,0.5)', fontSize: 14, margin: 0, textAlign: 'center', padding: '10px 0' }}>
            Aún no se ha realizado el sorteo para {DISCIPLINES.find((d) => d.key === discipline)?.label}.<br />
            Haz click en <strong>"Realizar Sorteo"</strong> para barajar los equipos y asignar PASE DIRECTO.
          </p>
        </div>
      )}

      {/* Mostrar estado actual si ya se sorteó antes */}
      {drawDone && !drawResult && (
        <div style={styles.form}>
          <p style={{ color: 'rgba(16,185,129,0.7)', fontSize: 14, margin: 0, textAlign: 'center' }}>
            ✅ Ya se realizó el sorteo para esta disciplina (semilla: {eventInfo?.drawSeed}).<br />
            Puedes volver a sortear si lo necesitas.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

function Field({ label, value, onChange, placeholder = '' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  )
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0b1326',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px 24px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottom: '1px solid rgba(103,37,119,0.3)',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#dae2fd',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#672577',
    fontSize: 13,
    margin: '2px 0 0',
    fontWeight: 600,
  },
  logoutBtn: {
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#dae2fd',
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tabBar: {
    display: 'flex',
    gap: 6,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tab: {
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(218,226,253,0.55)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: {
    color: '#dae2fd',
    background: 'rgba(103,37,119,0.25)',
    border: '1px solid rgba(103,37,119,0.5)',
  },
  content: {
    maxWidth: 900,
  },
  sectionTitle: {
    color: '#dae2fd',
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 18px',
  },
  form: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 20,
  },
  label: {
    display: 'block',
    color: 'rgba(218,226,253,0.7)',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(103,37,119,0.3)',
    borderRadius: 8,
    color: '#dae2fd',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputSmall: {
    padding: '8px 10px',
    fontSize: 13,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(103,37,119,0.3)',
    borderRadius: 6,
    color: '#dae2fd',
    outline: 'none',
    boxSizing: 'border-box',
  },
  primaryBtn: {
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #672577, #3454A1)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  smallBtn: {
    padding: '5px 10px',
    fontSize: 13,
    fontWeight: 600,
    color: '#dae2fd',
    background: 'rgba(103,37,119,0.2)',
    border: '1px solid rgba(103,37,119,0.35)',
    borderRadius: 6,
    cursor: 'pointer',
  },
  smallBtnDanger: {
    padding: '5px 10px',
    fontSize: 13,
    fontWeight: 600,
    color: '#EF4444',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 6,
    cursor: 'pointer',
  },
  loadingText: {
    color: 'rgba(218,226,253,0.4)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  table: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 10,
  },
  tableInner: {
    minWidth: 580,
  },
  tableHeader: {
    display: 'flex',
    padding: '10px 16px',
    background: 'rgba(103,37,119,0.15)',
    color: 'rgba(218,226,253,0.7)',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    gap: 8,
    whiteSpace: 'nowrap',
  },
  teamNameCell: {
    flex: 0.3,
    color: '#dae2fd',
    fontSize: 13,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  teamNameVs: {
    color: 'rgba(218,226,253,0.4)',
  },
  disciplineSelector: {
    display: 'flex',
    gap: 6,
    marginBottom: 20,
  },
  matchCard: {
    padding: '14px 16px',
    background: 'rgba(11,19,38,0.55)',
    backdropFilter: 'blur(8px)',
    border: '1.5px solid rgba(103,37,119,0.35)',
    borderRadius: 10,
  },
  teamBtn: {
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: '#dae2fd',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
  },
  teamBtnWinner: {
    background: 'rgba(245,158,11,0.2)',
    border: '1px solid rgba(245,158,11,0.5)',
    color: '#F59E0B',
  },
  teamBtnBye: {
    opacity: 0.4,
    cursor: 'not-allowed',
    fontStyle: 'italic',
  },
}
