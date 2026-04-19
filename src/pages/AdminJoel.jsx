import { useState, useEffect } from 'react'
import { getClavesActuales } from '../utils/claveHoraria'

export default function AdminJoel() {
  const [claves, setClaves] = useState(getClavesActuales())
  const [restante, setRestante] = useState('')

  useEffect(() => {
    const tick = () => {
      const c = getClavesActuales()
      setClaves(c)
      const diff = c.expira - Date.now()
      if (diff <= 0) { setRestante('00m 00s'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRestante(`${m}m ${String(s).padStart(2, '0')}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const hora12 = (h) => {
    const suffix = h >= 12 ? 'pm' : 'am'
    const h12 = h % 12 || 12
    return `${h12}:00 ${suffix}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '2rem',
      gap: '2rem',
    }}>
      <p style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        ContratoFácil · Panel Admin
      </p>

      {/* Clave actual */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 20,
        padding: '2.5rem 3rem',
        textAlign: 'center',
        minWidth: 320,
      }}>
        <p style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.25em', marginBottom: '1rem' }}>
          CLAVE ACTUAL — {hora12(claves.hora)} a {hora12((claves.hora + 1) % 24)}
        </p>

        <div style={{
          fontSize: '5rem',
          fontWeight: 900,
          letterSpacing: '0.3em',
          color: '#7c3aed',
          lineHeight: 1,
          marginBottom: '1.5rem',
          textShadow: '0 0 40px rgba(124,58,237,0.4)',
        }}>
          {claves.actual}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            animation: 'pulse 2s infinite',
          }} />
          <p style={{ color: '#22c55e', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            Expira en {restante}
          </p>
        </div>
      </div>

      {/* Próxima clave */}
      <div style={{
        background: '#141414',
        border: '1px solid #222',
        borderRadius: 16,
        padding: '1.5rem 2.5rem',
        textAlign: 'center',
        minWidth: 320,
      }}>
        <p style={{ color: '#444', fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
          SIGUIENTE — desde {hora12((claves.hora + 1) % 24)}
        </p>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: '0.35em',
          color: '#444',
          lineHeight: 1,
        }}>
          {claves.siguiente}
        </div>
      </div>

      {/* Info */}
      <div style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', textAlign: 'center', lineHeight: 2 }}>
        <p>La clave cambia en punto cada hora.</p>
        <p>La clave anterior también es válida (gracia de 1h).</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
