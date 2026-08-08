'use client'

/**
 * ============================================================================
 * LOGIN ADMIN — /sedichampions/admin
 * ============================================================================
 *
 * Formulario simple de contraseña.
 * Al autenticarse correctamente, redirige al dashboard.
 * ============================================================================
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/sedichampions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/sedichampions/admin/dashboard')
      } else {
        setError(data.error || 'Contraseña incorrecta')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1326',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '32px',
          background: 'rgba(11,19,38,0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: 16,
          border: '1.5px solid rgba(103,37,119,0.45)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo / Título */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#dae2fd',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            SEDICHAMPIONS
          </h1>
          <p style={{ color: '#672577', fontSize: 14, margin: '4px 0 0', fontWeight: 600 }}>
            Panel de Administración
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              color: '#dae2fd',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Contraseña de administrador
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="••••••••"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 15,
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(103,37,119,0.35)',
              borderRadius: 10,
              color: '#dae2fd',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(103,37,119,0.7)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(103,37,119,0.35)'
            }}
          />

          {error && (
            <p style={{ color: '#EF4444', fontSize: 13, margin: '10px 0 0', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '12px 0',
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              background: loading
                ? 'rgba(103,37,119,0.5)'
                : 'linear-gradient(135deg, #672577, #3454A1)',
              border: 'none',
              borderRadius: 10,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Verificando…' : 'Ingresar al Panel'}
          </button>
        </form>

        <p
          style={{
            color: 'rgba(218,226,253,0.35)',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Solo acceso autorizado para organizadores del evento
        </p>
      </div>
    </div>
  )
}
