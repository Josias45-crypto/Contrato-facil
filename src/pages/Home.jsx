import { useNavigate } from 'react-router-dom'

const tipos = [
  { id: 'arrendamiento', titulo: 'Contrato de Arrendamiento',          desc: 'Alquiler de vivienda o local',           icon: '🏠', popular: true  },
  { id: 'compraventa',   titulo: 'Contrato de Compraventa',            desc: 'Venta de bienes muebles o inmuebles',    icon: '🤝' },
  { id: 'servicios',     titulo: 'Contrato de Prestación de Servicios',desc: 'Trabajos y consultoría',                 icon: '💼' },
  { id: 'trabajo',       titulo: 'Contrato de Trabajo',                desc: 'Relación laboral D.L. 728',              icon: '👔' },
  { id: 'locacion',      titulo: 'Locación de Servicios',              desc: 'Honorarios sin vínculo laboral',         icon: '📋' },
  { id: 'prestamo',      titulo: 'Préstamo de Dinero',                 desc: 'Mutuo dinerario entre personas',         icon: '💰' },
  { id: 'dj_simple',     titulo: 'Declaración Jurada Simple',          desc: 'Declaración personal de hechos',         icon: '📝' },
  { id: 'dj_domicilio',  titulo: 'Declaración Jurada de Domicilio',    desc: 'Para trámites y gestiones',              icon: '🏡' },
  { id: 'carta_poder',   titulo: 'Carta Poder Simple',                 desc: 'Autoriza a otra persona a actuar',       icon: '✉️' },
  { id: 'viaje_menor',   titulo: 'Autorización de Viaje de Menor',     desc: 'Para viajes de hijos menores',           icon: '✈️', nuevo: true },
]

const resenas = [
  { texto: '"Generé mi contrato de alquiler en menos de 2 minutos. Lo imprimí y lo firmamos ese mismo día. Increíble."', autor: 'Carlos M.', ciudad: 'Lima' },
  { texto: '"Vendí mi moto con contrato por primera vez. Todo quedó claro y el documento se veía muy profesional."',      autor: 'Rosa T.',   ciudad: 'Arequipa' },
  { texto: '"Usé el contrato de servicios para un cliente nuevo. Me ahorré ir a un abogado y quedó perfecto."',           autor: 'Jorge P.',  ciudad: 'Trujillo' },
  { texto: '"La declaración jurada la llevé a la SUNAT sin ningún problema. Muy recomendado para todo trámite."',         autor: 'Lucía R.',  ciudad: 'Piura' },
]

const pasos = [
  { n: '1', t: 'Elige el tipo',       d: 'Selecciona entre 10 documentos legales' },
  { n: '2', t: 'Completa los datos',  d: 'Solo los campos esenciales, con guía' },
  { n: '3', t: 'La IA redacta',       d: 'Documento profesional en segundos' },
  { n: '4', t: 'Descarga PDF + Word', d: 'Listo para firmar e imprimir' },
]

const faq = [
  {
    q: '¿Cómo generar un contrato de alquiler en Perú gratis?',
    a: 'Elige "Contrato de Arrendamiento", completa los datos del propietario e inquilino y la IA redacta el documento adaptado al Código Civil peruano (art. 1666°) en segundos. Lo descargas en PDF y Word listos para firmar.',
  },
  {
    q: '¿Los documentos generados son legales en Perú?',
    a: 'Están basados en la legislación civil peruana vigente (D. Leg. N° 295) y leyes complementarias. Son documentos referenciales — para casos complejos recomendamos consultar con un abogado colegiado.',
  },
  {
    q: '¿Necesito registrarme o crear una cuenta?',
    a: 'No. ContratoFácil no requiere registro. Entra, completa los datos y descarga directamente.',
  },
  {
    q: '¿Por qué cuesta S/. 4.90 la descarga?',
    a: 'La generación es gratuita — puedes leer y revisar el documento sin pagar nada. Los S/. 4.90 cubren la descarga en PDF + Word editable y el mantenimiento del servicio.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const ir = (id) => navigate(`/generar?tipo=${id}`)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={{
        background: 'var(--navy)',
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 12px rgba(27,58,107,0.3)',
      }}>
        <div>
          <div className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Contrato<span style={{ color: 'var(--gold)' }}>Fácil</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Documentos legales peruanos
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
            <span className="dot-live" /> Disponible ahora
          </span>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--navy)',
        padding: '4.5rem 1.5rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 20% 60%, rgba(201,168,76,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 40%, rgba(255,255,255,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div className="animate-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 999, padding: '0.35rem 1rem',
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)',
            letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem',
          }}>
            <span className="dot-live" />
            +2,400 contratos generados este mes
          </div>

          <h1 className="font-display animate-fade-up delay-1" style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700,
            color: '#fff', lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: '1.1rem',
          }}>
            Genera tu contrato legal en Perú<br />
            en <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>menos de 2 minutos</span>
          </h1>

          <p className="animate-fade-up delay-2" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Contratos adaptados al Código Civil peruano con inteligencia artificial.<br />
            Sin registro. Descarga en PDF y Word.
          </p>

          <div className="animate-fade-up delay-3" style={{ display: 'flex', justifyContent: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🛡️', text: 'Ley peruana vigente' },
              { icon: '✅', text: 'PDF + Word' },
              { icon: '🔒', text: 'Sin registro' },
              { icon: '⚡', text: 'Listo en segundos' },
            ].map(i => (
              <span key={i.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                <span>{i.icon}</span>{i.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Separador ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Elige tu documento
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
      </div>

      {/* ── Grid de documentos ──────────────────────────────────── */}
      <main style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '0.75rem 1.5rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {tipos.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => ir(t.id)}
              className={`card card-hover animate-fade-up delay-${Math.min(idx + 1, 10)}`}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '1.5rem',
                cursor: 'pointer', textAlign: 'left', display: 'block', width: '100%',
                transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                e.currentTarget.style.borderColor = 'var(--gold-border)'
                e.currentTarget.querySelector('.card-arrow').style.transform = 'translateX(4px)'
                e.currentTarget.querySelector('.card-bar').style.background = 'var(--gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = ''
                e.currentTarget.querySelector('.card-arrow').style.transform = ''
                e.currentTarget.querySelector('.card-bar').style.background = 'var(--navy)'
              }}
            >
              <div className="card-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--navy)', transition: 'background 0.22s' }} />
              {t.popular && <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gold-bg)', color: '#8A6820', fontSize: '0.63rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 999, border: '1px solid var(--gold-border)', letterSpacing: '0.06em' }}>MÁS USADO</span>}
              {t.nuevo   && <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--green-bg)', color: 'var(--green)', fontSize: '0.63rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 999, border: '1px solid rgba(46,125,82,0.25)', letterSpacing: '0.06em' }}>NUEVO</span>}

              <div style={{ marginTop: '0.35rem', marginBottom: '0.85rem', fontSize: '1.75rem' }}>{t.icon}</div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--ink)', lineHeight: 1.3, marginBottom: '0.4rem' }}>{t.titulo}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink3)', lineHeight: 1.5, marginBottom: '1.25rem' }}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>Generar →</span>
                <span className="card-arrow" style={{ fontSize: '0.85rem', color: 'var(--gold)', transition: 'transform 0.2s' }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* ── Cómo funciona ────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Cómo funciona
          </div>
          <h2 className="font-display" style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '2.5rem' }}>
            Tu contrato listo en 4 pasos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem' }}>
            {pasos.map(p => (
              <div key={p.n} style={{ textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy)', color: '#fff', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem', boxShadow: '0 4px 12px rgba(27,58,107,0.25)' }}>
                  {p.n}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.35rem' }}>{p.t}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink3)', lineHeight: 1.6 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reseñas ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Testimonios
          </div>
          <h2 className="font-display" style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--ink)' }}>
            Peruanos que ya generaron sus contratos
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {resenas.map(r => (
            <div key={r.autor} className="card" style={{ padding: '1.4rem 1.5rem', borderLeft: '3px solid var(--gold)' }}>
              <div style={{ fontSize: '1rem', color: 'var(--gold)', marginBottom: '0.6rem' }}>★★★★★</div>
              <p style={{ fontSize: '0.86rem', color: 'var(--ink2)', lineHeight: 1.75, marginBottom: '1rem', fontStyle: 'italic' }}>
                {r.texto}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                  {r.autor[0]}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--ink3)', fontWeight: 600 }}>
                  {r.autor} · {r.ciudad}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Preguntas frecuentes</div>
            <h2 className="font-display" style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--ink)' }}>
              Todo lo que necesitas saber
            </h2>
          </div>
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {faq.map(f => (
              <div key={f.q} className="card" style={{ padding: '1.25rem 1.5rem', borderLeft: '3px solid var(--navy)' }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>{f.q}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--ink2)', lineHeight: 1.75 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sección SEO ──────────────────────────────────────────── */}
      <div style={{ background: 'var(--navy)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.7rem' }}>
            Generador de contratos legales para todo el Perú
          </h2>
          <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Disponible para Lima, Arequipa, Trujillo, Chiclayo, Piura, Cusco y todo el país.
            Documentos adaptados al <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Código Civil peruano (D. Leg. N° 295)</strong>, legislación vigente 2026.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {['Contrato de alquiler Lima', 'Contrato arrendamiento Perú', 'Contrato compraventa vehículo', 'Contrato servicios freelance', 'Declaración jurada Perú', 'Préstamo de dinero Perú', 'Modelo contrato 2026'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: '0.28rem 0.75rem', fontSize: '0.73rem', color: 'rgba(255,255,255,0.65)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span className="legal-badge">🛡️ Documento Legal Referencial</span>
        </div>

        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink2)', marginBottom: '0.3rem' }}>
          ContratoFácil · Generador de contratos legales · Perú 🇵🇪
        </p>
        <p style={{ fontSize: '0.76rem', color: 'var(--ink3)', marginBottom: '0.75rem', lineHeight: 1.65 }}>
          Contratos de alquiler, compraventa, servicios y documentos personalizados adaptados a la ley peruana.<br />
          Los documentos son de carácter referencial. Para asesoría formal consulte con un abogado colegiado.
        </p>

        {/* Contacto discreto */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          <a href="tel:+51929201444" style={{ fontSize: '0.74rem', color: 'var(--ink4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            📞 929 201 444
          </a>
          <span style={{ color: 'var(--border2)', fontSize: '0.9rem' }}>·</span>
          <a href="mailto:joeljosias45@gmail.com" style={{ fontSize: '0.74rem', color: 'var(--ink4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            ✉️ joeljosias45@gmail.com
          </a>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--ink4)' }}>
          © 2026 <strong style={{ color: 'var(--ink3)' }}>Nexvora Systems</strong> · Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
