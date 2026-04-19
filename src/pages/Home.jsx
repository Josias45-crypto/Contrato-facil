export default function Home({ onEmpezar, theme, toggleTheme }) {
  const tipos = [
    {
      id: 'alquiler',
      titulo: 'Contrato de Alquiler',
      desc: 'Departamento, casa, cuarto o local comercial',
      icon: '🏠',
      popular: true,
      tiempo: '90 seg',
    },
    {
      id: 'compraventa',
      titulo: 'Contrato de Compraventa',
      desc: 'Vehículo, inmueble, maquinaria u objeto de valor',
      icon: '🤝',
      popular: false,
      tiempo: '2 min',
    },
    {
      id: 'servicios',
      titulo: 'Contrato de Servicios',
      desc: 'Freelance, consultoría, obra o trabajo específico',
      icon: '💼',
      popular: false,
      tiempo: '2 min',
    },
    {
      id: 'libre',
      titulo: 'Documento Personalizado',
      desc: 'Carta notarial, declaración jurada, acuerdo confidencial y más',
      icon: '✍️',
      popular: false,
      tiempo: '2 min',
      nuevo: true,
    },
  ]

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)' },

    nav: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: '0.875rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--navy)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 2px 12px rgba(27,58,107,0.25)',
    },
    logo: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#FFFFFF',
      letterSpacing: '-0.02em',
    },
    navRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },

    hero: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '5.5rem 1.5rem 3rem',
      textAlign: 'center',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--green-bg)',
      color: 'var(--green)',
      borderRadius: 999,
      padding: '0.38rem 1rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginBottom: '1.75rem',
      letterSpacing: '0.04em',
      border: '1px solid rgba(46,125,82,0.2)',
    },
    h1: {
      fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      color: 'var(--ink)',
      marginBottom: '1.25rem',
      letterSpacing: '-0.03em',
    },
    sub: {
      fontSize: '1.05rem',
      color: 'var(--ink2)',
      lineHeight: 1.8,
      maxWidth: 500,
      margin: '0 auto 1.75rem',
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.75rem',
      flexWrap: 'wrap',
      marginBottom: '4rem',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontSize: '0.83rem',
      color: 'var(--ink2)',
      fontWeight: 500,
    },

    grid: {
      maxWidth: 880,
      margin: '0 auto',
      padding: '0 1.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '4rem',
    },
    cardInner: { padding: '1.75rem 1.5rem', cursor: 'pointer', position: 'relative' },
    cardIcon: { fontSize: '2rem', marginBottom: '1rem' },
    cardTitle: { fontWeight: 700, color: 'var(--ink)', marginBottom: '0.4rem', fontSize: '1rem', fontFamily: 'Fraunces, Georgia, serif' },
    cardDesc: { fontSize: '0.82rem', color: 'var(--ink3)', lineHeight: 1.6, marginBottom: '1.25rem' },
    cardCta: { fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 600 },
    popularBadge: {
      position: 'absolute',
      top: 14,
      right: 14,
      background: 'var(--gold-bg)',
      color: '#8A6820',
      fontSize: '0.65rem',
      fontWeight: 700,
      padding: '0.22rem 0.6rem',
      borderRadius: 999,
      letterSpacing: '0.06em',
      border: '1px solid var(--gold-border)',
    },
    timeBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--bg2)',
      color: 'var(--ink3)',
      fontSize: '0.72rem',
      padding: '0.22rem 0.6rem',
      borderRadius: 999,
    },

    sectionHow: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    },
    howGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '2rem',
      marginTop: '2.5rem',
    },
    howStep: { textAlign: 'center' },
    howNum: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--navy)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 0.85rem',
      boxShadow: '0 4px 12px rgba(27,58,107,0.25)',
    },
    howTitle: { fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem', color: 'var(--ink)' },
    howDesc: { fontSize: '0.8rem', color: 'var(--ink3)', lineHeight: 1.6 },

    trustRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      flexWrap: 'wrap',
      marginBottom: '1rem',
    },
    trust: { fontSize: '0.83rem', color: 'var(--ink3)', display: 'flex', alignItems: 'center', gap: 6 },

    footer: {
      textAlign: 'center',
      padding: '2.5rem 1.5rem',
      borderTop: '1px solid var(--border)',
      fontSize: '0.75rem',
      color: 'var(--ink3)',
      lineHeight: 1.75,
      background: 'var(--bg2)',
    },
  }

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <span className="font-display" style={s.logo}>
          Contrato<span style={{ color: 'var(--gold)' }}>Fácil</span>
        </span>
        <div style={s.navRight}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
            <span className="dot-live" />
            Disponible ahora
          </span>
          <button className="toggle-theme" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero} className="animate-fade-up">
        <div style={s.badge}>
          <span className="dot-live" />
          +2,400 contratos generados este mes
        </div>

        <h1 className="font-display" style={s.h1}>
          Genera tu contrato legal en Perú<br />
          en <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>menos de 2 minutos</span>
        </h1>

        <p style={s.sub}>
          Contratos de alquiler, compraventa y servicios adaptados al Código Civil peruano.
          Con inteligencia artificial. Gratis, sin registro, descarga en PDF.
        </p>

        <div style={s.statsRow}>
          {[
            { icon: '🛡️', text: 'Ley peruana vigente' },
            { icon: '✅', text: 'Descarga en PDF' },
            { icon: '🔒', text: 'Sin registro' },
            { icon: '⚡', text: 'Listo en segundos' },
          ].map(i => (
            <span key={i.text} style={s.stat}>
              <span>{i.icon}</span>
              {i.text}
            </span>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={s.grid}>
        {tipos.map((t, idx) => (
          <div
            key={t.id}
            className={`card card-accent card-hover animate-fade-up delay-${idx + 2}`}
            onClick={() => onEmpezar(t.id)}
          >
            <div style={s.cardInner}>
              {t.popular && <span style={s.popularBadge}>MÁS USADO</span>}
              {t.nuevo && <span style={{ ...s.popularBadge, background: 'var(--green-bg)', color: 'var(--green)', borderColor: 'rgba(46,125,82,0.25)' }}>NUEVO</span>}
              <div style={s.cardIcon}>{t.icon}</div>
              <div style={s.cardTitle}>{t.titulo}</div>
              <div style={s.cardDesc}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={s.cardCta}>Generar →</span>
                <span style={s.timeBadge}>⏱ {t.tiempo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cómo funciona */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={s.sectionHow}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.12em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Cómo funciona
          </div>
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
            Cómo generar tu contrato en Perú
          </h2>
          <div style={s.howGrid}>
            {[
              { n: '1', t: 'Elige el tipo', d: 'Alquiler, compraventa o servicios' },
              { n: '2', t: 'Completa los datos', d: 'Solo los campos esenciales' },
              { n: '3', t: 'La IA redacta', d: 'Contrato profesional en segundos' },
              { n: '4', t: 'Descarga el PDF', d: 'Listo para firmar e imprimir' },
            ].map(step => (
              <div key={step.n} style={s.howStep}>
                <div style={s.howNum}>{step.n}</div>
                <div style={s.howTitle}>{step.t}</div>
                <div style={s.howDesc}>{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--ink)' }}>
          Peruanos que ya generaron sus contratos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { texto: '"Generé mi contrato de alquiler en 1 minuto. Increíble."', autor: 'Carlos M., Lima' },
            { texto: '"Perfecto para mi negocio. Ahorro en abogados cada mes."', autor: 'Rosa T., Arequipa' },
            { texto: '"Sencillo, rápido y el PDF quedó muy profesional."', autor: 'Jorge P., Trujillo' },
          ].map(r => (
            <div key={r.autor} className="card" style={{ padding: '1.5rem', textAlign: 'left', borderLeft: '3px solid var(--gold)' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7, marginBottom: '1rem', fontStyle: 'italic' }}>
                {r.texto}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink3)', fontWeight: 600 }}>— {r.autor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--ink)', textAlign: 'center' }}>
          Preguntas frecuentes sobre contratos en Perú
        </h2>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {[
            { q: '¿Cómo generar un contrato de alquiler en Perú gratis?', a: 'En ContratoFácil completas los datos del propietario e inquilino, eliges las cláusulas y la IA redacta un contrato adaptado a la ley peruana en segundos. Lo descargas en PDF listo para firmar.' },
            { q: '¿Los contratos generados son legales en Perú?', a: 'Están basados en la legislación civil peruana vigente (Código Civil y leyes de arrendamiento). Son referenciales — para casos complejos recomendamos consultar con un abogado colegiado.' },
            { q: '¿Necesito registrarme o pagar para usarlo?', a: 'No. ContratoFácil es 100% gratis y no requiere registro. Entra, completa los datos y descarga tu PDF directamente.' },
            { q: '¿Puedo usar este contrato para alquilar un departamento en Lima?', a: 'Sí. El contrato de arrendamiento incluye todas las cláusulas requeridas por la ley peruana: monto, duración, penalidades y obligaciones de ambas partes.' },
          ].map(faq => (
            <div key={faq.q} className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink2)', lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sección SEO local — texto indexable con keywords geográficas */}
      <div style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.7)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            Generador de contratos legales para todo el Perú
          </h2>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Disponible para Lima, Arequipa, Trujillo, Chiclayo, Piura, Cusco y todas las ciudades del país.
            Contratos adaptados al <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Código Civil peruano (D. Leg. N° 295)</strong> y la legislación vigente 2025.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
            {[
              'Contrato de alquiler Lima',
              'Contrato de arrendamiento Perú',
              'Contrato de compraventa de vehículo',
              'Contrato de servicios freelance',
              'Declaración jurada Peru',
              'Modelo contrato 2025',
            ].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '0.3rem 0.8rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span className="legal-badge">🛡️ Documento Legal Referencial</span>
        </div>
        <p style={{ fontWeight: 600, color: 'var(--ink2)', marginBottom: '0.3rem' }}>
          ContratoFácil · Generador de contratos legales · Perú 🇵🇪
        </p>
        <p style={{ marginBottom: '0.3rem' }}>
          Contratos de alquiler, compraventa, servicios y documentos personalizados adaptados a la ley peruana.
        </p>
        <p>
          Los contratos son de carácter referencial. Para asesoría legal formal, consulte con un abogado colegiado del Colegio de Abogados del Perú.
        </p>
      </footer>
    </div>
  )
}
