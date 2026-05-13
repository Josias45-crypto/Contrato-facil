// Caracteres sin ambigüedad visual (sin 0,O,1,I,L)
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // 31 chars
const INTERVALO_MIN = 10 // minutos por período

function fnv32a(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
    h = h >>> 0
  }
  return h
}

function generarClave(periodo, secret) {
  const h = fnv32a(`${periodo}|${secret}`)
  const N = CHARS.length
  return (
    CHARS[(h & 0x1f) % N] +
    CHARS[((h >>> 5) & 0x1f) % N] +
    CHARS[((h >>> 10) & 0x1f) % N] +
    CHARS[((h >>> 15) & 0x1f) % N]
  )
}

// Retorna el índice de período actual (minutos desde epoch / INTERVALO_MIN)
function periodoActual() {
  return Math.floor(Date.now() / (INTERVALO_MIN * 60 * 1000))
}

export function getClavesActuales() {
  const ahora = new Date()
  const secret = import.meta.env.VITE_SECRET_KEY || 'JOEL2024'
  const periodo = periodoActual()

  // Calcular cuándo expira el período actual
  const msEnPeriodo = INTERVALO_MIN * 60 * 1000
  const expira = new Date(Math.ceil(Date.now() / msEnPeriodo) * msEnPeriodo)

  // Hora y minuto de inicio del período actual
  const minutosEnHora = ahora.getMinutes()
  const bloque = Math.floor(minutosEnHora / INTERVALO_MIN) * INTERVALO_MIN

  return {
    actual:    generarClave(periodo,     secret),
    anterior:  generarClave(periodo - 1, secret),
    siguiente: generarClave(periodo + 1, secret),
    periodo,
    expira,
    bloque, // minuto de inicio del bloque actual (0, 10, 20, 30, 40, 50)
  }
}

export function validarClave(input) {
  const { actual, anterior } = getClavesActuales()
  const up = input.toUpperCase().trim()
  return up.length === 4 && (up === actual || up === anterior)
}
