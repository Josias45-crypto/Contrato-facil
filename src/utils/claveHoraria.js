// Caracteres sin ambigüedad visual (sin 0,O,1,I,L)
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // 31 chars

function fnv32a(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
    h = h >>> 0
  }
  return h
}

function generarClave(hora, secret) {
  const h = fnv32a(`${hora}|${secret}`)
  const N = CHARS.length
  return (
    CHARS[(h & 0x1f) % N] +
    CHARS[((h >>> 5) & 0x1f) % N] +
    CHARS[((h >>> 10) & 0x1f) % N] +
    CHARS[((h >>> 15) & 0x1f) % N]
  )
}

export function getClavesActuales() {
  const ahora = new Date()
  const hora = ahora.getHours()
  const secret = import.meta.env.VITE_SECRET_KEY || 'JOEL2024'

  const expira = new Date(ahora)
  expira.setHours(hora + 1, 0, 0, 0)

  return {
    actual: generarClave(hora, secret),
    anterior: generarClave((hora - 1 + 24) % 24, secret),
    siguiente: generarClave((hora + 1) % 24, secret),
    hora,
    expira,
  }
}

export function validarClave(input) {
  const { actual, anterior } = getClavesActuales()
  const up = input.toUpperCase().trim()
  return up.length === 4 && (up === actual || up === anterior)
}
