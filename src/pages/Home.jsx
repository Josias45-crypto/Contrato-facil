import { useNavigate } from 'react-router-dom'

const tipos = [
  {
    id: 'arrendamiento',
    titulo: 'Contrato de Arrendamiento',
    desc: 'Alquiler de vivienda o local',
    icon: '🏠',
  },
  {
    id: 'compraventa',
    titulo: 'Contrato de Compraventa',
    desc: 'Venta de bienes muebles o inmuebles',
    icon: '🤝',
  },
  {
    id: 'servicios',
    titulo: 'Contrato de Prestación de Servicios',
    desc: 'Trabajos y consultoría',
    icon: '💼',
  },
  {
    id: 'trabajo',
    titulo: 'Contrato de Trabajo',
    desc: 'Relación laboral D.L. 728',
    icon: '👔',
  },
  {
    id: 'locacion',
    titulo: 'Locación de Servicios',
    desc: 'Honorarios sin vínculo laboral',
    icon: '📋',
  },
  {
    id: 'prestamo',
    titulo: 'Préstamo de Dinero',
    desc: 'Mutuo dinerario entre personas',
    icon: '💰',
  },
  {
    id: 'dj_simple',
    titulo: 'Declaración Jurada Simple',
    desc: 'Declaración personal de hechos',
    icon: '📝',
  },
  {
    id: 'dj_domicilio',
    titulo: 'Declaración Jurada de Domicilio',
    desc: 'Para trámites y gestiones',
    icon: '🏡',
  },
  {
    id: 'carta_poder',
    titulo: 'Carta Poder Simple',
    desc: 'Autoriza a otra persona a actuar',
    icon: '✉️',
  },
  {
    id: 'viaje_menor',
    titulo: 'Autorización de Viaje de Menor',
    desc: 'Para viajes de hijos menores',
    icon: '✈️',
  },
]

export default function Home() {
  const navigate = useNavigate()

  const ir = (id) => navigate(`/generar?tipo=${id}`)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      }}>
        <div>
          <div className="font-display" style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--ink)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Contrato<span style={{ color: 'var(--red)' }}>Fácil</span>
          </div>
          <div style={{
            fontSize: '0.68rem',
            color: 'var(--ink4)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            Documentos legales peruanos
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--ink3)',
            fontWeight: 500,
          }}>
            🇵🇪 Perú
          </span>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #fff 0%, #fdf5f5 50%, #fff9ee 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '4rem 1.5rem 3.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Patrón de fondo sutil */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217,16,35,0.04) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(245,166,35,0.05) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto' }}>
          {/* Badge */}
          <div className="animate-fade-up" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            background: 'rgba(217,16,35,0.06)',
            border: '1px solid rgba(217,16,35,0.15)',
            borderRadius: 999,
            padding: '0.35rem 1rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--red)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
            Generador de contratos legales
          </div>

          <h1 className="font-display animate-fade-up delay-1" style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            color: 'var(--ink)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1.1rem',
          }}>
            Genera tu contrato legal<br />
            <span style={{ color: 'var(--red)', fontStyle: 'italic' }}>en minutos</span>
          </h1>

          <p className="animate-fade-up delay-2" style={{
            fontSize: '1rem',
            color: 'var(--ink3)',
            lineHeight: 1.75,
            marginBottom: '2rem',
          }}>
            Documentos adaptados a la legislación peruana vigente.<br />
            Sin registro. Descarga en PDF y Word.
          </p>

          {/* Trust signals */}
          <div className="animate-fade-up delay-3" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '⚖️', text: 'Código Civil peruano' },
              { icon: '🔒', text: 'Sin registro' },
              { icon: '⚡', text: 'PDF + Word instantáneo' },
              { icon: '✅', text: 'Gratuito' },
            ].map(i => (
              <span key={i.text} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
                color: 'var(--ink3)',
                fontWeight: 500,
              }}>
                <span>{i.icon}</span>
                {i.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Separador con título de sección ─────────────────────── */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        width: '100%',
        padding: '2.5rem 1.5rem 1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--ink4)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Elige tu documento
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
      </div>

      {/* ── Grid de documentos ──────────────────────────────────── */}
      <main style={{
        flex: 1,
        maxWidth: 960,
        margin: '0 auto',
        width: '100%',
        padding: '0.5rem 1.5rem 3rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
        }}>
          {tipos.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => ir(t.id)}
              className={`card card-hover animate-fade-up delay-${Math.min(idx + 1, 10)}`}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'block',
                width: '100%',
                transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                e.currentTarget.style.borderColor = 'var(--gold-border)'
                e.currentTarget.querySelector('.card-arrow').style.transform = 'translateX(4px)'
                e.currentTarget.querySelector('.card-accent-bar').style.background = 'var(--gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = ''
                e.currentTarget.querySelector('.card-arrow').style.transform = ''
                e.currentTarget.querySelector('.card-accent-bar').style.background = 'var(--red)'
              }}
            >
              {/* Barra acento superior */}
              <div
                className="card-accent-bar"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'var(--red)',
                  transition: 'background 0.22s',
                }}
              />

              <div style={{ marginTop: '0.25rem', marginBottom: '0.85rem', fontSize: '1.75rem' }}>
                {t.icon}
              </div>

              <div className="font-display" style={{
                fontWeight: 700,
                fontSize: '0.98rem',
                color: 'var(--ink)',
                lineHeight: 1.3,
                marginBottom: '0.4rem',
              }}>
                {t.titulo}
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--ink3)',
                lineHeight: 1.5,
                marginBottom: '1.25rem',
              }}>
                {t.desc}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--red)',
                }}>
                  Generar documento
                </span>
                <span
                  className="card-arrow"
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--red)',
                    transition: 'transform 0.2s',
                  }}
                >
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="legal-badge">🛡️ Documento Legal Referencial</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--ink4)' }}>
          © 2026 ContratoFácil · Documentos para Perú · Los documentos son de carácter referencial. Consulte con un abogado colegiado para asesoría formal.
        </p>
      </footer>

      <style>{`
        @media (max-width: 600px) {
          .grid-docs {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
