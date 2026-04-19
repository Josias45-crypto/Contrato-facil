import { useState } from 'react'
import { generarPDF } from '../utils/generarPDF'
import { validarClave } from '../utils/claveHoraria'

const clausulasExtra = {
  alquiler: ['No se permiten mascotas', 'No se permite subarrendar', 'Mantenimiento a cargo del inquilino', 'Servicios incluidos en renta', 'Garantía de 1 mes', 'Prohibido uso comercial', 'Inspección mensual permitida'],
  compraventa: ['Venta al contado', 'Bien libre de cargas', 'Garantía de 30 días', 'Transferencia inmediata', 'Pago en cuotas', 'Se incluye inventario', 'Sin devoluciones'],
  servicios: ['Pago al finalizar', '50% de adelanto', 'Revisiones ilimitadas', 'Confidencialidad total', 'Penalidad por cancelación', 'Derechos de autor al cliente', 'Entrega por etapas'],
  libre: [],
}

const camposPor = {
  alquiler: [
    { id: 'arrendador', label: 'Nombre completo del propietario', placeholder: 'Juan Pérez García', required: true },
    { id: 'dni_arrendador', label: 'DNI del propietario', placeholder: '12345678', optional: true },
    { id: 'arrendatario', label: 'Nombre completo del inquilino', placeholder: 'María López Torres', required: true },
    { id: 'dni_arrendatario', label: 'DNI del inquilino', placeholder: '87654321', optional: true },
    { id: 'direccion', label: 'Dirección del inmueble', placeholder: 'Jr. Las Flores 123, Miraflores, Lima', required: true },
    { id: 'monto', label: 'Alquiler mensual (S/.)', placeholder: '1500', required: true },
    { id: 'duracion', label: 'Duración del contrato', placeholder: '12 meses', required: true },
    { id: 'fecha', label: 'Fecha de inicio', placeholder: '01 de enero del 2026', required: true },
  ],
  compraventa: [
    { id: 'vendedor', label: 'Nombre completo del vendedor', placeholder: 'Juan Pérez García', required: true },
    { id: 'dni_vendedor', label: 'DNI del vendedor', placeholder: '12345678', optional: true },
    { id: 'comprador', label: 'Nombre completo del comprador', placeholder: 'María López Torres', required: true },
    { id: 'dni_comprador', label: 'DNI del comprador', placeholder: '87654321', optional: true },
    { id: 'bien', label: 'Descripción detallada del bien', placeholder: 'Toyota Yaris 2020, placa ABC-123, color blanco', required: true },
    { id: 'precio', label: 'Precio de venta (S/.)', placeholder: '25000', required: true },
    { id: 'fecha', label: 'Fecha de la transacción', placeholder: '01 de enero del 2026', required: true },
  ],
  servicios: [
    { id: 'contratante', label: 'Nombre del cliente o empresa', placeholder: 'Empresa SAC', required: true },
    { id: 'dni_contratante', label: 'DNI / RUC del cliente', placeholder: '12345678', optional: true },
    { id: 'proveedor', label: 'Nombre del proveedor de servicios', placeholder: 'Juan Pérez García', required: true },
    { id: 'dni_proveedor', label: 'DNI del proveedor', placeholder: '87654321', optional: true },
    { id: 'servicio', label: 'Descripción detallada del servicio', placeholder: 'Diseño de identidad corporativa: logo, colores y manual de marca', required: true },
    { id: 'monto', label: 'Monto total del servicio (S/.)', placeholder: '3000', required: true },
    { id: 'plazo', label: 'Plazo de entrega', placeholder: '30 días calendario', required: true },
    { id: 'fecha', label: 'Fecha de inicio', placeholder: '01 de enero del 2026', required: true },
  ],
  libre: [
    { id: 'titulo_doc', label: '¿Qué tipo de documento necesitas?', placeholder: 'Ej: Carta de compromiso, Acuerdo de confidencialidad, Declaración jurada...', required: true },
    { id: 'parte1', label: 'Primera parte (nombre completo)', placeholder: 'Juan Pérez García', required: true },
    { id: 'parte2', label: 'Segunda parte (opcional)', placeholder: 'María López Torres o Empresa SAC', optional: true },
    { id: 'descripcion', label: 'Describe lo que necesitas en el documento', placeholder: 'Quiero un acuerdo donde Juan se compromete a entregar el vehículo el 15 de enero...', required: true },
    { id: 'fecha', label: 'Fecha del documento', placeholder: '01 de enero del 2026', required: true },
  ],
}

const titulos = {
  alquiler: 'Contrato de Arrendamiento',
  compraventa: 'Contrato de Compraventa',
  servicios: 'Contrato de Prestación de Servicios',
  libre: 'Documento Personalizado',
}

function buildPrompt(tipo, datos, clausulas, notaExtra, clausulaPersonalizada) {
  const campos = camposPor[tipo] || []
  const datosStr = campos.filter(c => datos[c.id]).map(c => `${c.label}: ${datos[c.id]}`).join('\n')
  const clausulasExtra = clausulas.length > 0
    ? `\nCLÁUSULAS ADICIONALES REQUERIDAS POR EL CLIENTE:\n${clausulas.map(c => `- ${c}`).join('\n')}`
    : ''
  const notaStr = notaExtra ? `\nINDICACIONES ADICIONALES DEL CLIENTE: ${notaExtra}` : ''
  const clausulaStr = clausulaPersonalizada
    ? `\nCLÁUSULA PERSONALIZADA A INCORPORAR TEXTUALMENTE: "${clausulaPersonalizada}"`
    : ''

  const REGLAS_COMUNES = `
REGLAS DE REDACCIÓN OBLIGATORIAS:
- Texto plano exclusivamente. PROHIBIDO usar asteriscos, guiones como viñetas, markdown, corchetes ni símbolos especiales.
- Todos los títulos de sección en MAYÚSCULAS sostenidas.
- Lenguaje jurídico formal peruano en todo momento. Nada de lenguaje coloquial.
- Citar artículos del Código Civil peruano (D. Leg. N° 295) donde corresponda.
- NO incluir líneas de firma, guiones, puntos suspensivos ni espacio para rúbricas al final. El bloque de firmas se agrega por separado.
- Terminar el texto con el párrafo de cierre "En señal de conformidad..." seguido de ciudad y fecha.`

  if (tipo === 'alquiler') {
    return `Eres un abogado peruano colegiado, especialista en derecho civil e inmobiliario, con 20 años de experiencia litigando ante juzgados civiles de Lima. Redacta un CONTRATO DE ARRENDAMIENTO completo, al amparo del artículo 1666° y siguientes del Código Civil peruano (D. Leg. N° 295).

DATOS DEL CONTRATO:
${datosStr}
${clausulasExtra}${notaStr}${clausulaStr}

ESTRUCTURA OBLIGATORIA (en este orden exacto):

CONTRATO DE ARRENDAMIENTO
[Ciudad], [fecha completa]

IDENTIFICACIÓN DE LAS PARTES
Presentar a cada parte con la fórmula: "De una parte, [nombre completo], identificado(a) con Documento Nacional de Identidad N° [DNI], a quien en lo sucesivo se denominará EL ARRENDADOR; y, de la otra parte, [nombre completo], identificado(a) con DNI N° [DNI], a quien en lo sucesivo se denominará EL ARRENDATARIO."

ANTECEDENTES
Párrafo declarando que el arrendador es propietario o tiene legítima posesión del inmueble y su voluntad de cederlo en arrendamiento.

CLÁUSULA PRIMERA: OBJETO DEL CONTRATO
CLÁUSULA SEGUNDA: VIGENCIA Y PLAZO
CLÁUSULA TERCERA: RENTA MENSUAL
CLÁUSULA CUARTA: FORMA Y CONDICIONES DE PAGO
CLÁUSULA QUINTA: OBLIGACIONES DEL ARRENDADOR
CLÁUSULA SEXTA: OBLIGACIONES DEL ARRENDATARIO
CLÁUSULA SÉPTIMA: PENALIDADES POR INCUMPLIMIENTO (incluir interés legal si hay mora)
CLÁUSULA OCTAVA: CAUSALES DE RESOLUCIÓN DEL CONTRATO
CLÁUSULA NOVENA: MECANISMO DE SOLUCIÓN DE CONTROVERSIAS (conciliación extrajudicial y juzgado competente)
CLÁUSULA DÉCIMA: DISPOSICIONES FINALES (domicilios para notificaciones, validez de copias)
${clausulas.length > 0 ? 'CLÁUSULA ADICIONAL: incorporar las cláusulas adicionales solicitadas como artículos independientes numerados.' : ''}

CIERRE
Terminar con: "En señal de conformidad con todos y cada uno de los términos del presente instrumento, las partes contratantes lo suscriben en [ciudad], a los [día] días del mes de [mes] del año [año]."

${REGLAS_COMUNES}

Redacta el contrato completo:`
  }

  if (tipo === 'compraventa') {
    return `Eres un abogado peruano colegiado, especialista en derecho patrimonial y contratos de transferencia, con 20 años de experiencia. Redacta un CONTRATO DE COMPRAVENTA completo, al amparo del artículo 1529° y siguientes del Código Civil peruano (D. Leg. N° 295).

DATOS DEL CONTRATO:
${datosStr}
${clausulasExtra}${notaStr}${clausulaStr}

ESTRUCTURA OBLIGATORIA (en este orden exacto):

CONTRATO DE COMPRAVENTA
[Ciudad], [fecha completa]

IDENTIFICACIÓN DE LAS PARTES
"De una parte, [nombre completo], identificado(a) con DNI N° [DNI], a quien en lo sucesivo se denominará EL VENDEDOR; y, de la otra parte, [nombre completo], identificado(a) con DNI N° [DNI], a quien en lo sucesivo se denominará EL COMPRADOR."

DECLARACIONES PREVIAS
Párrafo donde el vendedor declara ser propietario legítimo del bien y que éste se encuentra libre de cargas, gravámenes, hipotecas, embargos u otro tipo de afectación que impida su libre disposición, salvo que se indique lo contrario.

CLÁUSULA PRIMERA: OBJETO DE LA COMPRAVENTA (descripción detallada e inequívoca del bien)
CLÁUSULA SEGUNDA: PRECIO Y FORMA DE PAGO
CLÁUSULA TERCERA: TRANSFERENCIA DE PROPIEDAD Y TRADICIÓN (art. 947° o 949° C.C. según corresponda)
CLÁUSULA CUARTA: SANEAMIENTO POR EVICCIÓN (art. 1484° C.C.)
CLÁUSULA QUINTA: DECLARACIÓN DE CARGAS Y GRAVÁMENES
CLÁUSULA SEXTA: OBLIGACIONES DEL VENDEDOR
CLÁUSULA SÉPTIMA: OBLIGACIONES DEL COMPRADOR
CLÁUSULA OCTAVA: PENALIDADES POR INCUMPLIMIENTO
CLÁUSULA NOVENA: RESOLUCIÓN DEL CONTRATO
CLÁUSULA DÉCIMA: SOLUCIÓN DE CONTROVERSIAS
CLÁUSULA UNDÉCIMA: DISPOSICIONES FINALES
${clausulas.length > 0 ? 'CLÁUSULA ADICIONAL: incorporar las cláusulas adicionales solicitadas como artículos independientes numerados.' : ''}

CIERRE
"En señal de conformidad con todos y cada uno de los términos del presente instrumento, las partes contratantes lo suscriben en [ciudad], a los [día] días del mes de [mes] del año [año]."

${REGLAS_COMUNES}

Redacta el contrato completo:`
  }

  if (tipo === 'servicios') {
    return `Eres un abogado peruano colegiado, especialista en derecho de obligaciones y contratos de servicios empresariales, con 20 años de experiencia. Redacta un CONTRATO DE PRESTACIÓN DE SERVICIOS completo, al amparo del artículo 1764° y siguientes del Código Civil peruano (D. Leg. N° 295).

DATOS DEL CONTRATO:
${datosStr}
${clausulasExtra}${notaStr}${clausulaStr}

ESTRUCTURA OBLIGATORIA (en este orden exacto):

CONTRATO DE PRESTACIÓN DE SERVICIOS
[Ciudad], [fecha completa]

IDENTIFICACIÓN DE LAS PARTES
"De una parte, [nombre o razón social], identificado(a) con DNI/RUC N° [número], a quien en lo sucesivo se denominará EL COMITENTE; y, de la otra parte, [nombre completo], identificado(a) con DNI N° [DNI], a quien en lo sucesivo se denominará EL PRESTADOR DE SERVICIOS."

ANTECEDENTES
Párrafo indicando que el comitente requiere los servicios profesionales del prestador y que éste declara tener la capacidad, experiencia y conocimientos necesarios para ejecutarlos.

CLÁUSULA PRIMERA: OBJETO DEL CONTRATO (descripción precisa y detallada del servicio)
CLÁUSULA SEGUNDA: PLAZO DE EJECUCIÓN Y CRONOGRAMA DE ENTREGABLES
CLÁUSULA TERCERA: CONTRAPRESTACIÓN ECONÓMICA
CLÁUSULA CUARTA: CONDICIONES DE PAGO (hitos, anticipos, pagos a la entrega)
CLÁUSULA QUINTA: OBLIGACIONES DEL PRESTADOR DE SERVICIOS
CLÁUSULA SEXTA: OBLIGACIONES DEL COMITENTE
CLÁUSULA SÉPTIMA: CONFIDENCIALIDAD Y PROPIEDAD INTELECTUAL (precisar titularidad de entregables)
CLÁUSULA OCTAVA: PENALIDADES POR INCUMPLIMIENTO O DEMORA
CLÁUSULA NOVENA: CAUSALES Y PROCEDIMIENTO DE RESOLUCIÓN
CLÁUSULA DÉCIMA: INDEPENDENCIA DE LAS PARTES (no relación laboral)
CLÁUSULA UNDÉCIMA: SOLUCIÓN DE CONTROVERSIAS
CLÁUSULA DUODÉCIMA: DISPOSICIONES FINALES
${clausulas.length > 0 ? 'CLÁUSULA ADICIONAL: incorporar las cláusulas adicionales solicitadas como artículos independientes numerados.' : ''}

CIERRE
"En señal de conformidad con todos y cada uno de los términos del presente instrumento, las partes contratantes lo suscriben en [ciudad], a los [día] días del mes de [mes] del año [año]."

${REGLAS_COMUNES}

Redacta el contrato completo:`
  }

  // tipo === 'libre'
  return `Eres un abogado peruano colegiado con 20 años de experiencia en derecho civil y notarial. Redacta el siguiente documento jurídico de manera completamente profesional y formal, conforme a la legislación peruana vigente.

DATOS DEL DOCUMENTO:
${datosStr}
${notaStr}

INSTRUCCIONES DE REDACCIÓN:

1. ENCABEZADO: Título del documento en MAYÚSCULAS, ciudad y fecha.

2. IDENTIFICACIÓN DE PARTES: Usar fórmula formal: "[nombre completo], identificado(a) con DNI N° [número], con domicilio en [lugar si se conoce], a quien en lo sucesivo se denominará [denominación]."

3. CUERPO DEL DOCUMENTO: Organizar en cláusulas o secciones numeradas según la naturaleza del documento. Emplear expresiones jurídicas formales peruanas tales como: "al amparo de la legislación vigente", "las partes contratantes acuerdan", "en pleno uso de sus facultades legales", "con sujeción a lo establecido en el Código Civil peruano", "en mérito a lo expuesto", "en consecuencia", "sin perjuicio de lo anterior".

4. DISPOSICIONES FINALES: Incluir cláusula de domicilios para notificaciones y mecanismo de solución de controversias si aplica.

5. CIERRE: "En señal de conformidad con el contenido del presente documento, las partes lo suscriben en [ciudad], a los [día] días del mes de [mes] del año [año]."

${REGLAS_COMUNES}

Redacta el documento completo:`
}

// ─── Modal de Yape ─────────────────────────────────────────────
function ModalYape({ onCerrar, onDescarga, contrato, titulo, firmas }) {
  const [paso, setPaso] = useState('pago') // 'pago' | 'clave'
  const [clave, setClave] = useState('')
  const [claveError, setClaveError] = useState(false)

  const abrirWhatsApp = () => {
    const msg = encodeURIComponent(
      'Hola Joel, acabo de yapear S/.4.90 por mi contrato. Por favor envíame la clave de descarga.'
    )
    window.open(`https://wa.me/51929201444?text=${msg}`, '_blank')
    setPaso('clave')
  }

  const handleClave = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setClave(val)
    setClaveError(false)
    if (val.length === 4) {
      if (validarClave(val)) {
        generarPDF(contrato, titulo, firmas)
        onDescarga()
      } else {
        setClaveError(true)
      }
    }
  }

  const overlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(14,26,52,0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '1rem',
  }
  const card = {
    background: 'var(--surface)',
    borderRadius: 16,
    padding: '2rem',
    maxWidth: 400,
    width: '100%',
    border: '1px solid var(--border)',
    borderTop: '3px solid var(--navy)',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(14,26,52,0.25)',
  }

  if (paso === 'clave') {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--navy-tint)', border: '2px solid var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>🔑</div>
            <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.4rem' }}>
              Ingresa tu clave de descarga
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--ink3)', lineHeight: 1.65 }}>
              Joel te enviará una clave de 4 caracteres<br />por WhatsApp para desbloquear tu PDF.
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
              width: '100%',
              fontSize: '2.8rem',
              fontWeight: 800,
              letterSpacing: '0.5em',
              textAlign: 'center',
              padding: '1rem',
              fontFamily: 'monospace',
              borderColor: claveError ? '#C0392B' : clave.length === 4 ? 'var(--green)' : undefined,
              boxShadow: claveError ? '0 0 0 3px rgba(192,57,43,0.12)' : clave.length === 4 ? '0 0 0 3px rgba(46,125,82,0.12)' : undefined,
              textTransform: 'uppercase',
            }}
          />

          {claveError && (
            <p style={{ color: '#C0392B', fontSize: '0.82rem', textAlign: 'center', marginTop: '0.6rem', fontWeight: 500 }}>
              Clave incorrecta. Pídele a Joel que te reenvíe la clave actual.
            </p>
          )}

          {!claveError && clave.length < 4 && (
            <p style={{ color: 'var(--ink3)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.6rem' }}>
              La descarga se activa automáticamente al ingresar los 4 caracteres correctos
            </p>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.6rem' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setPaso('pago'); setClave(''); setClaveError(false) }}>
              ← Atrás
            </button>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={onCerrar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={overlay}>
      <div style={card}>
        {/* Cabecera de confianza */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🔒</span>
            <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)' }}>
              Pago seguro con Yape
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink3)' }}>
            Realiza el pago para descargar tu contrato en PDF
          </p>
        </div>

        {/* QR */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-block', padding: 8, background: '#fff', borderRadius: 14, border: '2px solid var(--border2)', boxShadow: '0 4px 12px rgba(27,58,107,0.1)' }}>
            <img
              src="/yape-qr.png"
              alt="QR Yape"
              style={{ width: 160, height: 160, borderRadius: 8, objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>

        {/* Datos de pago */}
        <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border2)', borderLeft: '3px solid var(--gold)' }}>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--ink3)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Número</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em' }}>929 201 444</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--ink3)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Nombre</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>Joel Rojas Alca</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--ink3)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Monto</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>S/. 4.90</span>
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', marginBottom: '0.6rem', fontSize: '0.97rem' }}
          onClick={abrirWhatsApp}
        >
          📱 Enviar comprobante por WhatsApp
        </button>
        <button className="btn-ghost" style={{ width: '100%' }} onClick={onCerrar}>Cancelar</button>
      </div>
    </div>
  )
}

// ─── Componente principal ───────────────────────────────────────
export default function Generador({ tipo, onVolver, theme, toggleTheme }) {
  const [datos, setDatos] = useState({})
  const [clausulas, setClausulas] = useState([])
  const [notaExtra, setNotaExtra] = useState('')
  const [clausulaPersonalizada, setClausulaPersonalizada] = useState('')
  const [contrato, setContrato] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [paso, setPaso] = useState(1)
  const [mostrarYape, setMostrarYape] = useState(false)
  const [descargado, setDescargado] = useState(false)

  const campos = camposPor[tipo] || []
  const clausulasOpciones = clausulasExtra[tipo] || []
  const progreso = contrato ? 100 : paso === 2 ? 66 : 33

  const toggleClausula = (c) => setClausulas(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const handleChange = (id, value) => setDatos(prev => ({ ...prev, [id]: value }))

  const getFirmas = () => {
    const d = datos
    if (tipo === 'alquiler') return [
      { rol: 'ARRENDADOR', nombre: d.arrendador || '', dni: d.dni_arrendador || '' },
      { rol: 'ARRENDATARIO', nombre: d.arrendatario || '', dni: d.dni_arrendatario || '' },
    ]
    if (tipo === 'compraventa') return [
      { rol: 'VENDEDOR', nombre: d.vendedor || '', dni: d.dni_vendedor || '' },
      { rol: 'COMPRADOR', nombre: d.comprador || '', dni: d.dni_comprador || '' },
    ]
    if (tipo === 'servicios') return [
      { rol: 'CONTRATANTE', nombre: d.contratante || '', dni: d.dni_contratante || '' },
      { rol: 'PROVEEDOR DE SERVICIOS', nombre: d.proveedor || '', dni: d.dni_proveedor || '' },
    ]
    if (tipo === 'libre' && d.parte1) return [
      { rol: 'PRIMERA PARTE', nombre: d.parte1 || '', dni: '' },
      { rol: 'SEGUNDA PARTE', nombre: d.parte2 || '', dni: '' },
    ]
    return null
  }

  const avanzarPaso = () => {
    const requeridos = campos.filter(c => c.required && !datos[c.id])
    if (requeridos.length > 0) { setError('Completa los campos obligatorios.'); return }
    setError('')
    setPaso(2)
  }

  const generarContrato = async () => {
    setCargando(true)
    setContrato('')
    setError('')
    const prompt = buildPrompt(tipo, datos, clausulas, notaExtra, clausulaPersonalizada)
    try {
      const response = await fetch('http://localhost:3001/api/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      if (data.content?.[0]?.text) setContrato(data.content[0].text)
      else setError('Error al generar. Intenta de nuevo.')
    } catch {
      setError('Error de conexión.')
    }
    setCargando(false)
  }

  const nav = (
    <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--navy)', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px rgba(27,58,107,0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onVolver} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.15s' }}>← Volver</button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
          Contrato<span style={{ color: 'var(--gold)' }}>Fácil</span>
          <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginLeft: 8, fontSize: '0.82rem' }}>· {titulos[tipo]}</span>
        </span>
      </div>
      <button className="toggle-theme" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
    </nav>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {nav}
      {mostrarYape && (
        <ModalYape
          contrato={contrato}
          titulo={titulos[tipo]}
          firmas={getFirmas()}
          onCerrar={() => setMostrarYape(false)}
          onDescarga={() => { setMostrarYape(false); setDescargado(true) }}
        />
      )}

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Progreso */}
        <div style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ink3)' }}>
          <span>{contrato ? 'Contrato listo' : paso === 2 ? 'Cláusulas y notas' : 'Datos del contrato'}</span>
          <span>{progreso}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progreso}%` }} /></div>

        {/* PASO 1: Datos */}
        {!contrato && paso === 1 && (
          <div className="animate-fade-up">
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📋</span>
                <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15 }}>{titulos[tipo]}</h2>
              </div>
              <p style={{ color: 'var(--ink3)', fontSize: '0.86rem' }}>
                Los campos marcados con <span style={{ color: 'var(--navy)', fontWeight: 700 }}>*</span> son obligatorios.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {campos.map(campo => (
                  <div key={campo.id}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink2)', marginBottom: '0.4rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                      {campo.label}
                      {campo.required && <span style={{ color: 'var(--navy)', marginLeft: 3 }}>*</span>}
                      {campo.optional && <span style={{ color: 'var(--ink3)', fontWeight: 400, marginLeft: 6, textTransform: 'none' }}>(opcional)</span>}
                    </label>
                    <input className="input-field" type="text" placeholder={campo.placeholder} value={datos[campo.id] || ''} onChange={e => handleChange(campo.id, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {error && <p style={{ color: '#C0392B', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
            <button className="btn-primary" style={{ width: '100%' }} onClick={avanzarPaso}>Continuar →</button>
          </div>
        )}

        {/* PASO 2: Cláusulas + notas */}
        {!contrato && paso === 2 && (
          <div className="animate-fade-up">
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.4rem' }}>Personaliza tu contrato</h2>
              <p style={{ color: 'var(--ink3)', fontSize: '0.86rem' }}>Todo es opcional. Puedes generar directamente.</p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
              {clausulasOpciones.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink2)', marginBottom: '0.75rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Cláusulas predefinidas</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {clausulasOpciones.map(c => (
                      <button key={c} className={`tag-clausula ${clausulas.includes(c) ? 'activo' : ''}`} onClick={() => toggleClausula(c)}>
                        {clausulas.includes(c) ? '✓ ' : '+ '}{c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink2)', marginBottom: '0.4rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Cláusula personalizada <span style={{ color: 'var(--ink3)', fontWeight: 400, textTransform: 'none' }}>(opcional)</span>
                </label>
                <input className="input-field" type="text" placeholder='Ej: "El inquilino no puede tener visitas después de las 11pm"' value={clausulaPersonalizada} onChange={e => setClausulaPersonalizada(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink2)', marginBottom: '0.4rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Indicaciones adicionales <span style={{ color: 'var(--ink3)', fontWeight: 400, textTransform: 'none' }}>(opcional)</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder='Ej: "Quiero que el contrato sea muy estricto con los pagos tardíos" o "Incluir cláusula de renovación automática"'
                  value={notaExtra}
                  onChange={e => setNotaExtra(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {error && <p style={{ color: '#C0392B', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-ghost" onClick={() => setPaso(1)}>← Atrás</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={generarContrato} disabled={cargando}>
                {cargando ? '⏳ Generando contrato...' : '✨ Generar Contrato'}
              </button>
            </div>
          </div>
        )}

        {/* RESULTADO */}
        {contrato && (
          <div className="animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ background: 'var(--green-bg)', color: 'var(--green)', fontSize: '0.72rem', fontWeight: 700, padding: '0.28rem 0.85rem', borderRadius: 999, display: 'inline-block', marginBottom: '0.6rem', border: '1px solid rgba(46,125,82,0.2)' }}>✓ Contrato generado</span>
                <h2 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--ink)' }}>Revisa tu contrato</h2>
                <p style={{ color: 'var(--ink3)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Léelo antes de descargar</p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button className="btn-ghost" onClick={() => { setContrato(''); setPaso(1) }}>Editar</button>
                {descargado
                  ? <button className="btn-primary" onClick={() => generarPDF(contrato, titulos[tipo], getFirmas())}>⬇ Descargar de nuevo</button>
                  : <button className="btn-primary" onClick={() => setMostrarYape(true)}>⬇ Descargar PDF — S/. 4.90</button>
                }
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--navy)', borderRadius: 'var(--radius)', padding: '2.5rem', whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: '0.875rem', color: 'var(--ink)', maxHeight: '60vh', overflowY: 'auto', boxShadow: 'var(--shadow)', fontFamily: 'Georgia, serif' }}>
              {contrato}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span className="legal-badge">🛡️ Documento Legal Referencial</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--ink3)' }}>· Consulte con un abogado colegiado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}