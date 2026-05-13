import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { generarPDF, generarDOCX } from '../utils/generarPDF'
import { validarClave } from '../utils/claveHoraria'

// ─── Constantes ────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres el Dr. Alejandro Quispe Morales, abogado peruano colegiado con 25 años de experiencia en derecho civil, laboral y contractual. Legislación peruana vigente 2026.
REGLAS ABSOLUTAS: Solo español jurídico formal peruano. NUNCA inventes datos — si falta alguno escribe [DATO PENDIENTE]. Estructura: título centrado en mayúsculas, datos de las partes, cláusulas numeradas (CLÁUSULA PRIMERA, SEGUNDA...), cita artículos del Código Civil (D.Leg.295) y leyes aplicables. Al final: lugar, fecha, líneas de firma (________________________) y espacio para huella digital de ambas partes. PROHIBIDO: markdown, asteriscos, guiones como viñetas, negritas.`

const titulos = {
  arrendamiento: 'Contrato de Arrendamiento',
  compraventa:   'Contrato de Compraventa',
  servicios:     'Contrato de Prestación de Servicios',
  trabajo:       'Contrato de Trabajo',
  locacion:      'Locación de Servicios',
  prestamo:      'Préstamo de Dinero',
  dj_simple:     'Declaración Jurada Simple',
  dj_domicilio:  'Declaración Jurada de Domicilio',
  carta_poder:   'Carta Poder Simple',
  viaje_menor:   'Autorización de Viaje de Menor',
}

const camposPorTipo = {
  arrendamiento: [
    { id: 'arrendador',      label: 'Nombre completo y DNI del propietario (arrendador)',  placeholder: 'Ej: Juan Pérez García, DNI 12345678',                           hint: 'Incluye nombre y DNI' },
    { id: 'dom_arrendador',  label: 'Domicilio del propietario',                           placeholder: 'Ej: Jr. Las Flores 123, Miraflores, Lima' },
    { id: 'arrendatario',    label: 'Nombre completo y DNI del inquilino (arrendatario)',  placeholder: 'Ej: María López Torres, DNI 87654321' },
    { id: 'dom_arrendatario',label: 'Domicilio del inquilino',                             placeholder: 'Ej: Av. Perú 456, Cercado de Lima' },
    { id: 'inmueble',        label: 'Dirección exacta del inmueble a arrendar',            placeholder: 'Calle, número, piso/dpto, distrito, provincia, departamento',    hint: 'Cuanto más precisa, más sólido el contrato' },
    { id: 'uso',             label: 'Uso del inmueble',                                    placeholder: 'Vivienda familiar / comercial / mixto' },
    { id: 'monto',           label: 'Monto mensual del alquiler (S/.)',                    placeholder: 'Ej: 1500' },
    { id: 'forma_pago',      label: 'Forma de pago',                                      placeholder: 'Efectivo / transferencia bancaria / depósito' },
    { id: 'fecha_inicio',    label: 'Fecha de inicio del contrato',                       placeholder: 'Ej: 01 de junio del 2026' },
    { id: 'duracion',        label: 'Duración del contrato',                               placeholder: 'Ej: 12 meses — o indicar fecha de vencimiento' },
    { id: 'garantia',        label: 'Meses de garantía (depósito de seguridad)',           placeholder: 'Ej: 2 meses' },
  ],
  compraventa: [
    { id: 'vendedor',        label: 'Nombre completo, DNI y domicilio del vendedor',       placeholder: 'Ej: Carlos Torres Quispe, DNI 45678901, Av. Arequipa 123, Lima' },
    { id: 'comprador',       label: 'Nombre completo, DNI y domicilio del comprador',      placeholder: 'Ej: Rosa Mamani Flores, DNI 78901234, Jr. Callao 56, Arequipa' },
    { id: 'bien',            label: 'Descripción detallada del bien que se vende',         placeholder: 'Ej: Moto Honda CB190R, placa B4K-321, año 2023, color negro',    hint: 'Más detalle = más protección legal' },
    { id: 'estado',          label: 'Estado del bien',                                     placeholder: 'Nuevo / usado en buen estado / describir desgastes' },
    { id: 'precio',          label: 'Precio de venta (S/.)',                               placeholder: 'Ej: 8500' },
    { id: 'forma_pago',      label: 'Forma de pago',                                      placeholder: 'Efectivo / transferencia / cuotas (indicar número y monto c/u)' },
    { id: 'fecha_entrega',   label: 'Fecha de entrega del bien',                           placeholder: 'Ej: 20 de junio del 2026' },
    { id: 'lugar_firma',     label: 'Distrito y ciudad donde se firma',                    placeholder: 'Ej: Miraflores, Lima' },
  ],
  servicios: [
    { id: 'contratante',     label: 'Nombre o empresa, DNI o RUC y domicilio del contratante', placeholder: 'Ej: Empresa SAC, RUC 20123456789, Av. La Marina 200, Lima' },
    { id: 'prestador',       label: 'Nombre completo, DNI y domicilio del prestador',      placeholder: 'Ej: Luis Quispe Mamani, DNI 56789012, Jr. Moquegua 88, Lima' },
    { id: 'servicio',        label: 'Descripción del servicio',                            placeholder: 'Ej: Diseño de logotipo y manual de marca corporativa',           hint: 'Sé específico — un buen detalle evita disputas' },
    { id: 'monto',           label: 'Monto total del servicio (S/.)',                      placeholder: 'Ej: 2800' },
    { id: 'forma_pago',      label: 'Forma de pago',                                      placeholder: 'Adelanto 50% + saldo al entregar / al finalizar / por hitos' },
    { id: 'fecha_inicio',    label: 'Fecha de inicio',                                    placeholder: 'Ej: 01 de junio del 2026' },
    { id: 'plazo',           label: 'Plazo de entrega o fecha de fin',                     placeholder: 'Ej: 30 días calendario / 15 de julio del 2026' },
    { id: 'materiales',      label: '¿Incluye materiales o insumos?',                      placeholder: 'Solo mano de obra / incluye materiales (indicar cuáles)' },
    { id: 'lugar',           label: 'Lugar de prestación del servicio',                    placeholder: 'Ej: Oficinas del cliente / trabajo remoto / Lima' },
  ],
  trabajo: [
    { id: 'empleador',       label: 'Razón social, RUC y domicilio del empleador',         placeholder: 'Ej: Distribuidora Norte SAC, RUC 20987654321, Av. Industrial 500, Trujillo' },
    { id: 'trabajador',      label: 'Nombre completo, DNI y domicilio del trabajador',     placeholder: 'Ej: Ana Flores Torres, DNI 34567890, Calle Los Pinos 12, Trujillo' },
    { id: 'cargo',           label: 'Cargo o puesto de trabajo',                           placeholder: 'Ej: Asistente contable / Vendedor de campo / Operario' },
    { id: 'remuneracion',    label: 'Remuneración mensual (S/.)',                          placeholder: 'Ej: 1200 — indicar si hay comisiones o bonos adicionales' },
    { id: 'fecha_inicio',    label: 'Fecha de inicio',                                    placeholder: 'Ej: 01 de junio del 2026' },
    { id: 'modalidad',       label: 'Modalidad del contrato',                              placeholder: 'Indefinido / Plazo fijo — si es plazo fijo, indicar fecha de término' },
    { id: 'jornada',         label: 'Jornada laboral',                                    placeholder: 'Ej: 48 horas semanales / lunes a sábado 8am–5pm' },
    { id: 'lugar_trabajo',   label: 'Lugar de trabajo',                                   placeholder: 'Dirección completa y distrito' },
  ],
  locacion: [
    { id: 'comitente',       label: 'Nombre o empresa y DNI o RUC del comitente (quien contrata)', placeholder: 'Ej: Pedro Salcedo, DNI 67890123 / Empresa XYZ, RUC 20456789012' },
    { id: 'locador',         label: 'Nombre completo y DNI del locador (quien presta el servicio)', placeholder: 'Ej: Jorge Mamani Quispe, DNI 89012345' },
    { id: 'servicio',        label: 'Descripción del servicio profesional',                placeholder: 'Ej: Asesoría contable mensual / Fotografía de eventos / Clases' },
    { id: 'honorarios',      label: 'Honorarios (S/.)',                                    placeholder: 'Ej: S/. 800 mensuales / S/. 1500 por proyecto' },
    { id: 'forma_pago',      label: 'Forma de pago',                                      placeholder: 'Mensual / al finalizar / por entregable' },
    { id: 'plazo',           label: 'Plazo de ejecución',                                  placeholder: 'Ej: 3 meses / mientras dure el proyecto' },
    { id: 'entregables',     label: 'Entregables o resultado esperado',                    placeholder: 'Ej: Informes mensuales / código fuente / 200 fotos editadas' },
  ],
  prestamo: [
    { id: 'prestamista',     label: 'Nombre completo, DNI y domicilio del prestamista',    placeholder: 'Ej: Manuel Quispe López, DNI 23456789, Av. La Victoria 88, Lima' },
    { id: 'prestatario',     label: 'Nombre completo, DNI y domicilio del prestatario',    placeholder: 'Ej: Susana Torres Ramos, DNI 90123456, Jr. Ancash 34, Lima' },
    { id: 'monto',           label: 'Monto del préstamo (S/.)',                            placeholder: 'Ej: 5000' },
    { id: 'fecha_entrega',   label: 'Fecha en que se entrega el dinero',                   placeholder: 'Ej: 10 de junio del 2026' },
    { id: 'fecha_devolucion',label: 'Fecha de devolución',                                 placeholder: 'Ej: 10 de diciembre del 2026 — o indicar fechas de cuotas' },
    { id: 'intereses',       label: '¿Con o sin intereses?',                               placeholder: 'Sin intereses / Con intereses al X% anual — indicar la tasa' },
    { id: 'forma_devolucion',label: 'Forma de devolución',                                 placeholder: 'Pago único / cuotas mensuales de S/. X durante Y meses' },
  ],
  dj_simple: [
    { id: 'declarante',      label: 'Nombre completo y DNI del declarante',                placeholder: 'Ej: Ricardo Palma Torres, DNI 12340987' },
    { id: 'domicilio',       label: 'Domicilio del declarante',                            placeholder: 'Ej: Jr. Camaná 123, Cercado de Lima' },
    { id: 'hecho',           label: 'Hecho que declara',                                   placeholder: 'Ej: Declaro ser el único propietario del vehículo de placa ABC-123, libre de toda carga', hint: 'Sé preciso — la IA redactará el texto formal' },
    { id: 'motivo',          label: 'Motivo o entidad a la que va dirigida',               placeholder: 'Ej: Para presentar ante la SUNAT / Municipalidad / banco' },
    { id: 'lugar_fecha',     label: 'Lugar y fecha de la declaración',                     placeholder: 'Ej: Lima, 10 de junio del 2026' },
  ],
  dj_domicilio: [
    { id: 'declarante',      label: 'Nombre completo y DNI del declarante',                placeholder: 'Ej: Carmen López Ruiz, DNI 45123678' },
    { id: 'direccion',       label: 'Dirección exacta que declara como domicilio',         placeholder: 'Calle/Jr./Av., número, piso/dpto si aplica' },
    { id: 'distrito',        label: 'Distrito, provincia y departamento',                  placeholder: 'Ej: San Isidro, Lima, Lima' },
    { id: 'motivo',          label: 'Motivo o entidad destinataria',                       placeholder: 'Ej: Apertura de cuenta bancaria / trámite en RENIEC / postulación' },
    { id: 'lugar_fecha',     label: 'Lugar y fecha',                                       placeholder: 'Ej: Lima, 10 de junio del 2026' },
  ],
  carta_poder: [
    { id: 'poderdante',      label: 'Nombre completo, DNI y domicilio del poderdante (quien otorga el poder)', placeholder: 'Ej: Carlos Mendoza Quispe, DNI 56781234, Av. Brasil 200, Lima' },
    { id: 'apoderado',       label: 'Nombre completo, DNI y domicilio del apoderado (quien actúa en su nombre)', placeholder: 'Ej: María Mamani Torres, DNI 78123456, Jr. Huallaga 55, Lima' },
    { id: 'facultades',      label: '¿Qué puede hacer exactamente el apoderado?',          placeholder: 'Ej: Cobrar y firmar cheques / retirar documentos notariales / tramitar licencia municipal', hint: 'Cuanto más específico, más protección legal' },
    { id: 'vigencia',        label: 'Vigencia del poder',                                  placeholder: 'Ej: Hasta el 31 de diciembre del 2026 / indefinido / hasta revocar' },
    { id: 'lugar_fecha',     label: 'Lugar y fecha',                                       placeholder: 'Ej: Lima, 10 de junio del 2026' },
  ],
  viaje_menor: [
    { id: 'autorizante',     label: 'Nombre completo y DNI del padre, madre o tutor que autoriza', placeholder: 'Ej: Alejandro Torres Mamani, DNI 34129870' },
    { id: 'menor',           label: 'Nombre completo y DNI (o N° de partida de nacimiento) del menor', placeholder: 'Ej: Valentina Torres Quispe, DNI 75341290' },
    { id: 'destino',         label: 'Destino del viaje',                                   placeholder: 'Ej: Cusco, Perú / Buenos Aires, Argentina' },
    { id: 'salida',          label: 'Fecha de salida',                                     placeholder: 'Ej: 15 de julio del 2026' },
    { id: 'retorno',         label: 'Fecha de retorno',                                    placeholder: 'Ej: 30 de julio del 2026' },
    { id: 'acompanante',     label: 'Adulto acompañante (si aplica)',                      placeholder: 'Nombre y DNI del acompañante — o "viaja solo/a"' },
    { id: 'motivo',          label: 'Motivo del viaje',                                    placeholder: 'Ej: Vacaciones / visita familiar / competencia escolar' },
    { id: 'lugar_fecha',     label: 'Lugar y fecha del documento',                         placeholder: 'Ej: Lima, 10 de junio del 2026' },
  ],
}

// Extrae nombres para el bloque de firmas del PDF/DOCX
function getFirmasDesdeValores(tipo, valores) {
  const nombre = (campo) => (valores[campo] || '').split(',')[0].trim()
  const pares = {
    arrendamiento: ['EL ARRENDADOR',             'arrendador', 'EL ARRENDATARIO',            'arrendatario'],
    compraventa:   ['EL VENDEDOR',               'vendedor',   'EL COMPRADOR',                'comprador'],
    servicios:     ['EL CONTRATANTE',            'contratante','EL PRESTADOR DE SERVICIOS',   'prestador'],
    trabajo:       ['EL EMPLEADOR',              'empleador',  'EL TRABAJADOR',               'trabajador'],
    locacion:      ['EL COMITENTE',              'comitente',  'EL LOCADOR',                  'locador'],
    prestamo:      ['EL MUTUANTE',               'prestamista','EL MUTUATARIO',               'prestatario'],
    carta_poder:   ['EL PODERDANTE',             'poderdante', 'EL APODERADO',                'apoderado'],
    viaje_menor:   ['EL AUTORIZANTE',            'autorizante','EL MENOR',                    'menor'],
  }
  const par = pares[tipo]
  if (!par) return null
  return [
    { rol: par[0], nombre: nombre(par[1]), dni: '' },
    { rol: par[2], nombre: nombre(par[3]), dni: '' },
  ]
}

function buildPrompt(tipo, campos, valores) {
  const datosStr = campos
    .filter(c => valores[c.id]?.trim())
    .map((c, i) => `${i + 1}. ${c.label}: ${valores[c.id]}`)
    .join('\n')
  return `TIPO DE DOCUMENTO: ${titulos[tipo]}\n\nDATOS PROPORCIONADOS:\n${datosStr}\n\nRedacta el documento completo con la estructura legal correspondiente conforme a la legislación peruana vigente 2026.`
}

// ─── Modal Yape ─────────────────────────────────────────────────
function ModalYape({ onCerrar, onDescarga, contrato, titulo, firmas }) {
  const [paso, setPaso] = useState('pago')
  const [clave, setClave] = useState('')
  const [claveError, setClaveError] = useState(false)

  const abrirWhatsApp = () => {
    const msg = encodeURIComponent('Hola Joel, te acabo de yapear S/.4.90. Te adjunto la captura del pago. Por favor envíame la clave para descargar mi contrato.')
    window.open(`https://wa.me/51929201444?text=${msg}`, '_blank')
    setPaso('clave')
  }

  const handleClave = async (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setClave(val)
    setClaveError(false)
    if (val.length === 4) {
      if (validarClave(val)) {
        generarPDF(contrato, titulo, firmas)
        await generarDOCX(contrato, titulo, firmas)
        onDescarga()
      } else {
        setClaveError(true)
      }
    }
  }

  const overlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
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
    borderTop: '3px solid var(--navy)',
    maxHeight: '92vh',
    overflowY: 'auto',
    boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
  }

  if (paso === 'clave') {
    return (
      <div style={overlay} onClick={e => e.target === e.currentTarget && onCerrar()}>
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🔑</div>
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.4rem' }}>
              Ingresa tu clave de descarga
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--ink3)', lineHeight: 1.65 }}>
              Joel te enviará la clave por WhatsApp en segundos.
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
              borderColor: claveError ? 'var(--red)' : clave.length === 4 ? 'var(--green)' : undefined,
              textTransform: 'uppercase',
            }}
          />
          {claveError && (
            <p style={{ color: 'var(--red)', fontSize: '0.82rem', textAlign: 'center', marginTop: '0.6rem', fontWeight: 500 }}>
              Clave incorrecta. Pídele a Joel que te reenvíe la clave actual.
            </p>
          )}
          {!claveError && clave.length < 4 && (
            <p style={{ color: 'var(--ink4)', fontSize: '0.73rem', textAlign: 'center', marginTop: '0.6rem' }}>
              La descarga se activa al ingresar los 4 caracteres correctos.
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
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.3rem' }}>
            Descarga tu documento
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink3)' }}>
            Recibe el PDF y el Word editable en segundos
          </p>
        </div>

        {/* QR */}
        <div style={{ textAlign: 'center', marginBottom: '1.1rem' }}>
          <div style={{ display: 'inline-block', padding: 8, background: '#fff', borderRadius: 14, border: '2px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <img src="/yape-qr.webp" alt="QR Yape" style={{ width: 150, height: 150, borderRadius: 8, objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        {/* Datos de pago */}
        <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '0.9rem 1.1rem', marginBottom: '1rem', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)' }}>
          {[
            { label: 'Número', value: '929 201 444' },
            { label: 'Nombre',  value: 'Joel Rojas Alca' },
            { label: 'Monto',   value: 'S/. 4.90', grande: true },
          ].map((r, i, arr) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length - 1 ? '0.5rem' : 0, marginBottom: i < arr.length - 1 ? '0.5rem' : 0, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--ink3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.label}</span>
              <span style={{ fontSize: r.grande ? '1.15rem' : '0.92rem', fontWeight: r.grande ? 800 : 600, color: r.grande ? 'var(--navy)' : 'var(--ink)' }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* CTA persuasivo */}
        <div style={{
          background: 'var(--navy-tint)',
          border: '1px solid rgba(27,58,107,0.14)',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>📸</span>
          <p style={{ fontSize: '0.79rem', color: 'var(--ink2)', lineHeight: 1.55 }}>
            Yapea, toma captura del comprobante y mándasela a Joel por WhatsApp.
            <strong style={{ color: 'var(--navy)' }}> Recibes tu clave al instante.</strong>
          </p>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', marginBottom: '0.55rem', fontSize: '0.95rem', padding: '0.9rem' }}
          onClick={abrirWhatsApp}
        >
          📱 Ya yapé — enviar captura por WhatsApp →
        </button>
        <button className="btn-ghost" style={{ width: '100%', fontSize: '0.85rem' }} onClick={onCerrar}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Componente principal ───────────────────────────────────────
export default function Generador() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tipo   = searchParams.get('tipo') || 'arrendamiento'
  const titulo = titulos[tipo] || 'Documento Legal'
  const campos = camposPorTipo[tipo] || camposPorTipo.arrendamiento

  const [valores,          setValores]          = useState({})
  const [contrato,         setContrato]         = useState('')
  const [cargando,         setCargando]         = useState(false)
  const [error,            setError]            = useState('')
  const [edicionesRestantes, setEdicionesRestantes] = useState(1)
  const [mostrarEditar,    setMostrarEditar]    = useState(false)
  const [textoCorreccion,  setTextoCorreccion]  = useState('')
  const [cargandoEdicion,  setCargandoEdicion]  = useState(false)
  const [mostrarYape,      setMostrarYape]      = useState(false)
  const [descargado,       setDescargado]       = useState(false)

  const firmas = getFirmasDesdeValores(tipo, valores)

  const setValor = (id, val) => setValores(prev => ({ ...prev, [id]: val }))

  const llamarAPI = async (prompt) => {
    const res  = await fetch('/api/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ prompt, system: SYSTEM_PROMPT }),
    })
    const data = await res.json()
    if (data.content?.[0]?.text) return data.content[0].text
    throw new Error('Sin respuesta')
  }

  const generarContrato = async () => {
    const vacios = campos.filter(c => !valores[c.id]?.trim())
    if (vacios.length === campos.length) { setError('Completa al menos algunos campos para generar el documento.'); return }
    setCargando(true)
    setError('')
    try {
      const texto = await llamarAPI(buildPrompt(tipo, campos, valores))
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
      const prompt = `DOCUMENTO GENERADO ANTERIORMENTE:\n${contrato}\n\nCORRECCIÓN SOLICITADA:\n${textoCorreccion}\n\nGenera la versión COMPLETA del documento con los cambios incorporados. Mantén todo lo correcto, aplica solo los cambios indicados.`
      const texto = await llamarAPI(prompt)
      setContrato(texto)
      setEdicionesRestantes(0)
      setMostrarEditar(false)
      setTextoCorreccion('')
    } catch {
      setError('Error al procesar la corrección. Intenta de nuevo.')
    }
    setCargandoEdicion(false)
  }

  // ── Navegación ─────────────────────────────────────────────────
  const nav = (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)', fontSize: '0.88rem', fontWeight: 500, padding: '0.3rem 0', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← Inicio
        </button>
        <span style={{ color: 'var(--border2)' }}>|</span>
        <span className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
          Contrato<span style={{ color: 'var(--gold)' }}>Fácil</span>
          <span style={{ fontWeight: 400, color: 'var(--ink3)', marginLeft: 8, fontSize: '0.8rem' }}>· {titulo}</span>
        </span>
      </div>
    </header>
  )

  // ── Vista: formulario ──────────────────────────────────────────
  if (!contrato) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {nav}
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

          {/* Badge tipo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              background: 'var(--navy-tint)',
              color: 'var(--navy)',
              border: '1px solid rgba(27,58,107,0.18)',
              borderRadius: 999,
              padding: '0.28rem 0.85rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {titulo}
            </span>
          </div>

          {/* Presentación del Dr. Quispe */}
          <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 42, height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A1A1A 0%, #3D3D3D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
              border: '2px solid rgba(27,58,107,0.25)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              ⚖️
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink3)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Dr. Alejandro Quispe Morales · Abogado Colegiado
              </div>
              <div className="chat-bubble-ai">
                Hola, voy a redactar tu <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{titulo}</strong> conforme al Código Civil peruano.
                <br /><br />
                Completa los campos con la mayor precisión posible. Si tienes detalles adicionales, escríbelos en el mismo campo — eso hace el documento más sólido. Si no tienes algún dato ahora, escribe <em>"pendiente"</em>.
              </div>
            </div>
          </div>

          {/* Campos estructurados */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow)',
            marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {campos.map((campo, i) => (
                <div key={campo.id}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--ink2)',
                    marginBottom: campo.hint ? '0.2rem' : '0.4rem',
                    lineHeight: 1.4,
                  }}>
                    <span style={{ color: 'var(--navy)', fontWeight: 700, marginRight: 5 }}>{i + 1}.</span>
                    {campo.label}
                  </label>
                  {campo.hint && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--ink4)', marginBottom: '0.4rem', fontStyle: 'italic' }}>
                      {campo.hint}
                    </p>
                  )}
                  <input
                    className="input-field"
                    type="text"
                    placeholder={campo.placeholder}
                    value={valores[campo.id] || ''}
                    onChange={e => { setValor(campo.id, e.target.value); setError('') }}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--red)', fontSize: '0.83rem', marginBottom: '1rem', padding: '0.6rem 1rem', background: 'rgba(217,16,35,0.05)', borderRadius: 8, border: '1px solid rgba(217,16,35,0.14)' }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={generarContrato}
            disabled={cargando}
          >
            {cargando ? <><span className="spinner" /> Generando tu documento...</> : '✨ Generar documento'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--ink4)', marginTop: '0.85rem', lineHeight: 1.5 }}>
            Generado con IA · Documento referencial · Consulta con un abogado colegiado para asesoría formal
          </p>
        </div>
      </div>
    )
  }

  // ── Vista: resultado ───────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {nav}
      {mostrarYape && (
        <ModalYape
          contrato={contrato}
          titulo={titulo}
          firmas={firmas}
          onCerrar={() => setMostrarYape(false)}
          onDescarga={() => { setMostrarYape(false); setDescargado(true) }}
        />
      )}

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>

        {/* Cabecera resultado */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ background: 'var(--green-bg)', color: 'var(--green)', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 999, border: '1px solid rgba(27,138,78,0.2)', display: 'inline-block', marginBottom: '0.4rem' }}>
              ✓ Documento generado
            </span>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>Revisa tu documento</h2>
            <p style={{ fontSize: '0.81rem', color: 'var(--ink3)' }}>Léelo cuidadosamente antes de descargar.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.73rem', fontWeight: 600,
              color: edicionesRestantes === 0 ? 'var(--red)' : 'var(--ink3)',
              background: edicionesRestantes === 0 ? 'rgba(217,16,35,0.06)' : 'var(--bg2)',
              padding: '0.25rem 0.75rem', borderRadius: 999,
              border: `1px solid ${edicionesRestantes === 0 ? 'rgba(217,16,35,0.18)' : 'var(--border)'}`,
            }}>
              ✏️ Correcciones restantes: {edicionesRestantes}
            </span>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {edicionesRestantes > 0 && !mostrarEditar && (
                <button className="btn-ghost" onClick={() => setMostrarEditar(true)}>Corregir</button>
              )}
              <button className="btn-primary" onClick={() => setMostrarYape(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⬇ {descargado ? 'Descargar de nuevo' : 'Descargar PDF + Word — S/. 4.90'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de corrección — estilo chat ─────────────────── */}
        {mostrarEditar && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.25rem',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)',
          }}>
            {/* Mensaje del Dr. Quispe */}
            <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 34, height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1A1A1A 0%, #3D3D3D 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', flexShrink: 0,
                  border: '1.5px solid rgba(27,58,107,0.22)',
                }}>
                  ⚖️
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--ink3)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                    Dr. Alejandro Quispe Morales
                  </div>
                  <div className="chat-bubble-ai" style={{ fontSize: '0.85rem', padding: '0.85rem 1rem' }}>
                    Entendido. Cuéntame qué quieres modificar o corregir — describe los cambios con detalle y lo corrijo de inmediato.
                  </div>
                </div>
              </div>
            </div>

            {/* Input de corrección */}
            <div style={{ padding: '1rem 1.25rem' }}>
              <textarea
                autoFocus
                className="input-field"
                rows={3}
                placeholder='Ej: "Cambiar el monto del préstamo a S/. 3,000" · "El DNI del inquilino es 45678901" · "Agregar cláusula de renovación automática"'
                value={textoCorreccion}
                onChange={e => setTextoCorreccion(e.target.value)}
                style={{ resize: 'vertical', marginBottom: '0.75rem', fontSize: '0.88rem' }}
              />
              {error && (
                <p style={{ color: 'var(--red)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</p>
              )}
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                <button className="btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => { setMostrarEditar(false); setTextoCorreccion('') }}>
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  onClick={enviarCorreccion}
                  disabled={cargandoEdicion || !textoCorreccion.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', padding: '0.65rem 1.25rem' }}
                >
                  {cargandoEdicion ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Procesando...</> : 'Enviar →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documento */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--gold)',
          borderRadius: 'var(--radius)',
          padding: '2.5rem 3rem',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.9,
          fontSize: '0.875rem',
          color: 'var(--ink)',
          fontFamily: "'Playfair Display', Georgia, serif",
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '65vh',
          overflowY: 'auto',
        }}>
          {contrato}
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span className="legal-badge">🛡️ Documento Legal Referencial</span>
          <span style={{ fontSize: '0.73rem', color: 'var(--ink4)' }}>· Consulte con un abogado colegiado</span>
        </div>
      </div>
    </div>
  )
}
