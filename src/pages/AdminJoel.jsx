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
      if (diff <= 0) { setRestante('00:00'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRestante(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const ahora = new Date()
  const h = pad(ahora.getHours())
  const m = pad(claves.bloque)
  const m2 = pad((claves.bloque + 10) % 60)
  const hSig = claves.bloque + 10 >= 60
    ? pad((ahora.getHours() + 1) % 24)
    : h

  const rangoActual  = `${h}:${m} — ${hSig}:${m2}`
  const bloqueNext   = (claves.bloque + 10) % 60
  const hNext        = claves.bloque + 10 >= 60 ? pad((ahora.getHours() + 1) % 24) : h
  const rangoSig     = `${hNext}:${pad(bloqueNext)} — ${pad(claves.bloque + 10 >= 60 ? (ahora.getHours() + 1) % 24 : ahora.getHours())}:${pad((bloqueNext + 10) % 60)}`

  // Progreso del período actual (0-100)
  const MS_PERIODO = 10 * 60 * 1000
  const msRestantes = claves.expira - Date.now()
  const progreso = Math.max(0, Math.min(100, 100 - (msRestantes / MS_PERIODO) * 100))

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '2rem',
      gap: '1.5rem',
    }}>
      <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
        ContratoFácil · Panel Admin
      </p>

      {/* Clave actual */}
      <div style={{
        background: '#141414',
        border: '1px solid #222',
        borderTop: '2px solid #7c3aed',
        borderRadius: 20,
        padding: '2.5rem 3rem',
        textAlign: 'center',
        minWidth: 340,
      }}>
        <p style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>
          CLAVE ACTUAL
        </p>
        <p style={{ color: '#444', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
          {rangoActual}
        </p>

        <div style={{
          fontSize: '5.5rem',
          fontWeight: 900,
          letterSpacing: '0.3em',
          color: '#7c3aed',
          lineHeight: 1,
          marginBottom: '1.75rem',
          textShadow: '0 0 50px rgba(124,58,237,0.5)',
        }}>
          {claves.actual}
        </div>

        {/* Barra de progreso del período */}
        <div style={{ background: '#222', borderRadius: 99, height: 4, width: '100%', marginBottom: '1rem', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progreso}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
            borderRadius: 99,
            transition: 'width 1s linear',
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
          <p style={{ color: '#22c55e', fontSize: '0.85rem', letterSpacing: '0.08em', fontWeight: 700 }}>
            Expira en {restante}
          </p>
        </div>
      </div>

      {/* Siguiente clave */}
      <div style={{
        background: '#0f0f0f',
        border: '1px solid #1a1a1a',
        borderRadius: 16,
        padding: '1.5rem 2.5rem',
        textAlign: 'center',
        minWidth: 340,
      }}>
        <p style={{ color: '#333', fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: '0.3rem' }}>
          SIGUIENTE
        </p>
        <p style={{ color: '#2a2a2a', fontSize: '0.55rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          desde las {hNext}:{pad(bloqueNext)}
        </p>
        <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '0.35em', color: '#333', lineHeight: 1 }}>
          {claves.siguiente}
        </div>
      </div>

      {/* Info */}
      <div style={{ color: '#2a2a2a', fontSize: '0.65rem', letterSpacing: '0.08em', textAlign: 'center', lineHeight: 2 }}>
        <p>La clave cambia cada 10 minutos exactos.</p>
        <p>La clave anterior también es válida (gracia de 10 min).</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
