import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { generarPDF } from '../utils/generarPDF'
import { validarClave } from '../utils/claveHoraria'

// ─── Constantes ────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres el Dr. Alejandro Quispe Morales, abogado peruano colegiado con 25 años de experiencia en derecho civil, laboral y contractual. Legislación peruana vigente 2026.
REGLAS ABSOLUTAS: Solo español jurídico formal peruano. NUNCA inventes datos — si falta alguno escribe [DATO PENDIENTE]. Estructura: título centrado en mayúsculas, datos de las partes, cláusulas numeradas (CLÁUSULA PRIMERA, SEGUNDA...), cita los artículos del Código Civil (D.Leg.295) y leyes aplicables. Al final: lugar, fecha actual, líneas para firma y huella digital de ambas partes. PROHIBIDO: markdown, asteriscos, guiones como viñetas, negritas.`

const titulos = {
  arrendamiento:  'Contrato de Arrendamiento',
  compraventa:    'Contrato de Compraventa',
  servicios:      'Contrato de Prestación de Servicios',
  trabajo:        'Contrato de Trabajo',
  locacion:       'Locación de Servicios',
  prestamo:       'Préstamo de Dinero',
  dj_simple:      'Declaración Jurada Simple',
  dj_domicilio:   'Declaración Jurada de Domicilio',
  carta_poder:    'Carta Poder Simple',
  viaje_menor:    'Autorización de Viaje de Menor',
}

const preguntas = {
  arrendamiento: `Hola, voy a ayudarte a redactar tu Contrato de Arrendamiento conforme al Código Civil peruano (art. 1666°).

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo y DNI del propietario (arrendador)
2. Dirección del domicilio del propietario
3. Nombre completo y DNI del inquilino (arrendatario)
4. Dirección del domicilio del inquilino
5. Dirección exacta del inmueble: calle, número, distrito, provincia, departamento
6. Uso del inmueble: vivienda o comercial
7. Monto mensual del alquiler en S/.
8. Forma de pago (efectivo / transferencia / depósito bancario)
9. Fecha de inicio del contrato
10. Duración en meses o fecha de vencimiento
11. Meses de garantía (depósito de seguridad)`,

  compraventa: `Hola, voy a ayudarte a redactar tu Contrato de Compraventa conforme al Código Civil peruano (art. 1529°).

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo, DNI y domicilio del vendedor
2. Nombre completo, DNI y domicilio del comprador
3. Descripción detallada del bien (qué se vende, características, estado)
4. Estado del bien: nuevo o usado
5. Precio de venta en S/.
6. Forma de pago (efectivo / transferencia / cuotas — si cuotas: número y monto de cada una)
7. Fecha de entrega del bien
8. Distrito y ciudad donde se firma el contrato`,

  servicios: `Hola, voy a ayudarte a redactar tu Contrato de Prestación de Servicios conforme al Código Civil peruano (art. 1764°).

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre o razón social, DNI o RUC y domicilio del contratante
2. Nombre completo, DNI y domicilio del prestador del servicio
3. Descripción detallada del servicio a realizar
4. Monto total en S/.
5. Forma de pago (por adelantado / al finalizar / en hitos)
6. Fecha de inicio
7. Plazo de entrega o fecha de fin
8. ¿Incluye materiales o solo mano de obra?
9. Lugar de prestación del servicio`,

  trabajo: `Hola, voy a ayudarte a redactar tu Contrato de Trabajo conforme al D.L. 728 — Ley de Productividad y Competitividad Laboral.

Por favor indícame lo siguiente en un solo mensaje:

1. Razón social, RUC y domicilio del empleador
2. Nombre completo, DNI y domicilio del trabajador
3. Cargo o puesto de trabajo
4. Remuneración mensual en S/.
5. Fecha de inicio
6. Modalidad: indefinido o plazo fijo — si es plazo fijo indicar fecha de fin
7. Jornada laboral (horas por semana)
8. Lugar de trabajo (dirección y distrito)`,

  locacion: `Hola, voy a ayudarte a redactar tu Contrato de Locación de Servicios conforme al Código Civil peruano (art. 1764°).

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre o empresa, DNI o RUC del comitente (quien contrata)
2. Nombre completo y DNI del locador (quien presta el servicio)
3. Descripción del servicio profesional u oficio
4. Honorarios en S/.
5. Forma de pago
6. Plazo de ejecución
7. Entregables esperados`,

  prestamo: `Hola, voy a ayudarte a redactar tu Contrato de Préstamo de Dinero (Mutuo Dinerario) conforme al Código Civil peruano (art. 1648°).

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo, DNI y domicilio del prestamista
2. Nombre completo, DNI y domicilio del prestatario
3. Monto del préstamo en S/.
4. Fecha de entrega del dinero
5. Fecha de devolución
6. ¿Con intereses? Sí o No — si sí, indicar la tasa
7. Forma de devolución: pago único o cuotas — si cuotas: número y monto`,

  dj_simple: `Hola, voy a ayudarte a redactar tu Declaración Jurada Simple.

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo y DNI del declarante
2. Domicilio del declarante
3. Hecho que declara (descríbelo con detalle)
4. Motivo o destino del documento (para qué trámite o entidad)
5. Lugar y fecha de la declaración`,

  dj_domicilio: `Hola, voy a ayudarte a redactar tu Declaración Jurada de Domicilio.

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo y DNI del declarante
2. Dirección exacta que declara como domicilio: calle, número, departamento (si aplica)
3. Distrito, provincia y departamento
4. Motivo o entidad a la que va dirigida (para qué trámite)
5. Lugar y fecha de la declaración`,

  carta_poder: `Hola, voy a ayudarte a redactar tu Carta Poder Simple.

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo, DNI y domicilio del poderdante (quien otorga el poder)
2. Nombre completo, DNI y domicilio del apoderado (quien actúa en su nombre)
3. Facultades otorgadas: ¿qué puede hacer exactamente el apoderado?
4. Vigencia del poder (fecha de vencimiento o si es indefinido)
5. Lugar y fecha`,

  viaje_menor: `Hola, voy a ayudarte a redactar la Autorización de Viaje de Menor de Edad.

Por favor indícame lo siguiente en un solo mensaje:

1. Nombre completo y DNI del padre, madre o tutor que autoriza
2. Nombre completo y DNI (o número de partida de nacimiento) del menor
3. Destino del viaje (ciudad y país)
4. Fecha de salida
5. Fecha de retorno
6. Adulto acompañante (nombre y DNI, si aplica) — o si viaja solo
7. Motivo del viaje
8. Lugar y fecha del documento`,
}

// ─── Modal de Yape ─────────────────────────────────────────────
function ModalYape({ onCerrar, onDescarga, contrato, titulo }) {
  const [paso, setPaso] = useState('pago')
  const [clave, setClave] = useState('')
  const [claveError, setClaveError] = useState(false)

  const abrirWhatsApp = () => {
    const msg = encodeURIComponent('Hola Joel, acabo de yapear S/.4.90 por mi contrato. Por favor envíame la clave de descarga.')
    window.open(`https://wa.me/51929201444?text=${msg}`, '_blank')
    setPaso('clave')
  }

  const handleClave = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setClave(val)
    setClaveError(false)
    if (val.length === 4) {
      if (validarClave(val)) {
        generarPDF(contrato, titulo, null)
        onDescarga()
      } else {
        setClaveError(true)
      }
    }
  }

  const overlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '1rem',
  }
  const card = {
    background: '#fff',
    borderRadius: 16,
    padding: '2rem',
    maxWidth: 400,
    width: '100%',
    border: '1px solid var(--border)',
    borderTop: '3px solid var(--red)',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  }

  if (paso === 'clave') {
    return (
      <div style={overlay} onClick={e => e.target === e.currentTarget && onCerrar()}>
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔑</div>
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.4rem' }}>
              Ingresa tu clave de descarga
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--ink3)', lineHeight: 1.65 }}>
              Joel te enviará una clave de 4 caracteres<br />por WhatsApp para desbloquear tu descarga.
            </p>
          </div>
          <input
            autoFocus
            className="input-field"
            type="text"
            inputMode="text"
            placeholder="_ _ _ _"
            value={clave}
            onChange={handleClave}
            maxLength={4}
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '0.5em',
              textAlign: 'center',
              padding: '1rem',
              fontFamily: 'monospace',
              borderColor: claveError ? '#D91023' : clave.length === 4 ? 'var(--green)' : undefined,
              textTransform: 'uppercase',
            }}
          />
          {claveError && (
            <p style={{ color: '#D91023', fontSize: '0.82rem', textAlign: 'center', marginTop: '0.6rem', fontWeight: 500 }}>
              Clave incorrecta. Pídele a Joel que te reenvíe la clave actual.
            </p>
          )}
          {!claveError && clave.length < 4 && (
            <p style={{ color: 'var(--ink4)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.6rem' }}>
              La descarga se activa automáticamente al ingresar los 4 caracteres correctos.
            </p>
          )}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.6rem' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setPaso('pago'); setClave(''); setClaveError(false) }}>← Atrás</button>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={onCerrar}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onCerrar()}>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>🔒</div>
          <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.3rem' }}>
            Descarga tu documento
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink3)' }}>
            Yapea S/.4.90 y recibe tu clave al instante por WhatsApp
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-block', padding: 8, background: '#fff', borderRadius: 14, border: '2px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <img src="/yape-qr.webp" alt="QR Yape" style={{ width: 160, height: 160, borderRadius: 8, objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)' }}>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {[
              { label: 'Número', value: '929 201 444' },
              { label: 'Nombre',  value: 'Joel Rojas Alca' },
              { label: 'Monto',   value: 'S/. 4.90', big: true },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--ink3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</span>
                <span style={{ fontSize: row.big ? '1.2rem' : '0.95rem', fontWeight: row.big ? 800 : 600, color: row.big ? 'var(--red)' : 'var(--ink)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginBottom: '0.6rem' }} onClick={abrirWhatsApp}>
          📱 Enviar comprobante por WhatsApp
        </button>
        <button className="btn-ghost" style={{ width: '100%' }} onClick={onCerrar}>Cancelar</button>
      </div>
    </div>
  )
}

// ─── Componente principal ───────────────────────────────────────
export default function Generador() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tipo = searchParams.get('tipo') || 'arrendamiento'
  const titulo = titulos[tipo] || 'Documento Legal'
  const pregunta = preguntas[tipo] || preguntas.arrendamiento

  const [respuesta, setRespuesta] = useState('')
  const [contrato, setContrato] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [edicionesRestantes, setEdicionesRestantes] = useState(1)
  const [mostrarEditar, setMostrarEditar] = useState(false)
  const [textoCorreccion, setTextoCorreccion] = useState('')
  const [cargandoEdicion, setCargandoEdicion] = useState(false)
  const [mostrarYape, setMostrarYape] = useState(false)
  const [descargado, setDescargado] = useState(false)

  const llamarAPI = async (prompt) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system: SYSTEM_PROMPT }),
    })
    const data = await response.json()
    if (data.content?.[0]?.text) return data.content[0].text
    throw new Error('Sin respuesta de la IA')
  }

  const generarContrato = async () => {
    if (!respuesta.trim()) { setError('Por favor escribe tus datos antes de continuar.'); return }
    setCargando(true)
    setError('')
    try {
      const prompt = `TIPO DE DOCUMENTO: ${titulo}\n\nDATOS PROPORCIONADOS:\n${respuesta}\n\nRedacta el documento completo con la estructura legal correspondiente.`
      const texto = await llamarAPI(prompt)
      setContrato(texto)
    } catch {
      setError('Error al generar el contrato. Por favor intenta de nuevo.')
    }
    setCargando(false)
  }

  const enviarCorreccion = async () => {
    if (!textoCorreccion.trim()) return
    setCargandoEdicion(true)
    setError('')
    try {
      const prompt = `DOCUMENTO GENERADO ANTERIORMENTE:\n${contrato}\n\nCORRECCIÓN O MODIFICACIÓN SOLICITADA:\n${textoCorreccion}\n\nGenera la versión COMPLETA del documento con los cambios incorporados. Mantén toda la estructura y contenido correcto, solo aplica los cambios indicados.`
      const texto = await llamarAPI(prompt)
      setContrato(texto)
      setEdicionesRestantes(0)
      setMostrarEditar(false)
      setTextoCorreccion('')
    } catch {
      setError('Error al procesar la corrección. Por favor intenta de nuevo.')
    }
    setCargandoEdicion(false)
  }

  // ── Nav ───────────────────────────────────────────────────────
  const nav = (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)', fontSize: '0.88rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← Inicio
        </button>
        <span style={{ color: 'var(--border2)', fontSize: '1.2rem' }}>|</span>
        <span className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
          Contrato<span style={{ color: 'var(--red)' }}>Fácil</span>
          <span style={{ fontWeight: 400, color: 'var(--ink3)', marginLeft: 8, fontSize: '0.82rem' }}>· {titulo}</span>
        </span>
      </div>
    </header>
  )

  // ── Vista de chat ─────────────────────────────────────────────
  if (!contrato) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {nav}

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          {/* Tipo badge */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'var(--red-tint)',
              color: 'var(--red)',
              border: '1px solid rgba(217,16,35,0.15)',
              borderRadius: 999,
              padding: '0.28rem 0.8rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {titulo}
            </span>
          </div>

          {/* Mensaje del abogado */}
          <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.75rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A1A1A 0%, #3D3D3D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', flexShrink: 0,
              border: '2px solid rgba(217,16,35,0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              ⚖️
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink3)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Dr. Alejandro Quispe Morales · Abogado Colegiado
              </div>
              <div className="chat-bubble-ai" style={{ whiteSpace: 'pre-line' }}>
                {pregunta}
              </div>
            </div>
          </div>

          {/* Respuesta del usuario */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--ink3)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: '0.5rem',
            }}>
              Tu respuesta
            </label>
            <textarea
              className="input-field"
              rows={8}
              placeholder="Escribe aquí todos los datos solicitados arriba..."
              value={respuesta}
              onChange={e => { setRespuesta(e.target.value); setError('') }}
              style={{ resize: 'vertical', lineHeight: 1.7, fontSize: '0.9rem' }}
            />
          </div>

          {error && (
            <div style={{ color: '#D91023', fontSize: '0.83rem', marginBottom: '1rem', padding: '0.6rem 1rem', background: 'rgba(217,16,35,0.06)', borderRadius: 8, border: '1px solid rgba(217,16,35,0.15)' }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={generarContrato}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner" />
                Generando tu contrato...
              </>
            ) : (
              '✨ Generar contrato'
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.73rem', color: 'var(--ink4)', marginTop: '0.85rem', lineHeight: 1.5 }}>
            Generado por IA · Documento referencial · Consulta con un abogado colegiado para asesoría formal
          </p>
        </div>
      </div>
    )
  }

  // ── Vista de resultado ────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {nav}
      {mostrarYape && (
        <ModalYape
          contrato={contrato}
          titulo={titulo}
          onCerrar={() => setMostrarYape(false)}
          onDescarga={() => { setMostrarYape(false); setDescargado(true) }}
        />
      )}

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>

        {/* Cabecera de resultado */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{
                background: 'var(--green-bg)',
                color: 'var(--green)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                border: '1px solid rgba(27,138,78,0.2)',
              }}>
                ✓ Documento generado
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
              Revisa tu documento
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink3)' }}>
              Léelo cuidadosamente antes de descargar.
            </p>
          </div>

          {/* Contador de ediciones + botones */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: edicionesRestantes === 0 ? '#D91023' : 'var(--ink3)',
              background: edicionesRestantes === 0 ? 'rgba(217,16,35,0.06)' : 'var(--bg2)',
              padding: '0.25rem 0.75rem',
              borderRadius: 999,
              border: `1px solid ${edicionesRestantes === 0 ? 'rgba(217,16,35,0.18)' : 'var(--border)'}`,
            }}>
              ✏️ Intentos restantes: {edicionesRestantes}
            </span>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {edicionesRestantes > 0 && !mostrarEditar && (
                <button className="btn-ghost" onClick={() => setMostrarEditar(true)}>
                  Editar / Corregir
                </button>
              )}
              <button
                className="btn-primary"
                onClick={() => setMostrarYape(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                ⬇ {descargado ? 'Descargar de nuevo' : 'Descargar — S/. 4.90'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de edición */}
        {mostrarEditar && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow)',
          }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
              ¿Qué quieres corregir o agregar?
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder='Ej: "Cambiar el monto de alquiler a S/. 1,800" o "El DNI del inquilino es 45678901"'
              value={textoCorreccion}
              onChange={e => setTextoCorreccion(e.target.value)}
              style={{ resize: 'vertical', marginBottom: '0.85rem' }}
            />
            {error && (
              <div style={{ color: '#D91023', fontSize: '0.83rem', marginBottom: '0.75rem' }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn-ghost" onClick={() => { setMostrarEditar(false); setTextoCorreccion('') }}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={enviarCorreccion}
                disabled={cargandoEdicion || !textoCorreccion.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {cargandoEdicion ? <><span className="spinner" /> Procesando...</> : 'Enviar corrección'}
              </button>
            </div>
          </div>
        )}

        {/* Documento */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--red)',
          borderRadius: 'var(--radius)',
          padding: '2.5rem 3rem',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.9,
          fontSize: '0.88rem',
          color: 'var(--ink)',
          fontFamily: "'Playfair Display', Georgia, serif",
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '65vh',
          overflowY: 'auto',
        }}>
          {contrato}
        </div>

        {/* Footer legal */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span className="legal-badge">🛡️ Documento Legal Referencial</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--ink4)' }}>· Consulte con un abogado colegiado</span>
        </div>
      </div>
    </div>
  )
}
