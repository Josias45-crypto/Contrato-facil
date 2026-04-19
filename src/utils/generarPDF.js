import { jsPDF } from 'jspdf'

// firmas: [{ rol, nombre, dni }, { rol, nombre, dni }] | null
export function generarPDF(textoContrato, titulo, firmas = null) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const MARGEN = 22
  const ANCHO  = 210 - MARGEN * 2   // 166 mm útiles
  let y = MARGEN

  // ── Encabezado ───────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(titulo.toUpperCase(), 105, y, { align: 'center' })
  y += 7

  doc.setDrawColor(212, 132, 26)
  doc.setLineWidth(0.8)
  doc.line(MARGEN, y, 210 - MARGEN, y)
  y += 9

  // ── Eliminar el bloque de firmas que genera la IA ────────────
  // La IA produce líneas como  ___  ---  ...  (4+ caracteres)
  // También detectamos encabezados de firma comunes en español
  let textoRender = textoContrato
  if (firmas) {
    const lines = textoContrato.split('\n')
    const desde = Math.floor(lines.length * 0.5)   // buscar solo en el 50% final
    let corte = -1

    // Patrón 1: línea que es SOLO guiones/subrayados/puntos/espacios (≥4 chars)
    const soloSeparador = /^[\s_\-\.]{4,}$/
    // Patrón 2: línea que CONTIENE 4+ guiones/subrayados/puntos consecutivos
    const contieneLinea = /_{4,}|-{4,}|\.{6,}/

    for (let i = lines.length - 1; i >= desde; i--) {
      if (soloSeparador.test(lines[i]) || contieneLinea.test(lines[i])) {
        corte = i
        break
      }
    }

    // Retroceder sobre líneas vacías justo antes del corte
    if (corte > 10) {
      while (corte > 1 && lines[corte - 1].trim() === '') corte--
      textoRender = lines.slice(0, corte).join('\n').trimEnd()
    }
  }

  // ── Cuerpo del texto ─────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(40, 35, 30)

  for (const linea of doc.splitTextToSize(textoRender, ANCHO)) {
    if (y > 272) { doc.addPage(); y = MARGEN }
    doc.text(linea, MARGEN, y)
    y += 5.2
  }

  // ── Bloque de firmas — dos columnas exactamente simétricas ───
  if (firmas && firmas.length >= 2) {
    const [f1, f2] = firmas

    // Nueva página si no cabe el bloque (necesitamos ≈ 40 mm)
    if (y > 240) { doc.addPage(); y = MARGEN }

    y += 12

    // Línea separadora tenue
    doc.setDrawColor(210, 200, 190)
    doc.setLineWidth(0.3)
    doc.line(MARGEN, y, 210 - MARGEN, y)
    y += 12

    // Geometría de columnas
    const mitad    = MARGEN + ANCHO / 2          // 105 mm (centro de la página)
    const gap      = 20                           // separación entre columnas
    const lineaW   = (ANCHO - gap) / 2           // ancho de cada línea = 73 mm
    const col1cx   = MARGEN + lineaW / 2         // centro col. izquierda
    const col2cx   = 210 - MARGEN - lineaW / 2   // centro col. derecha (simétrico)

    // ── Líneas de firma (mismo ancho exacto) ─────────────────
    doc.setDrawColor(60, 55, 50)
    doc.setLineWidth(0.6)
    doc.line(col1cx - lineaW / 2, y, col1cx + lineaW / 2, y)
    doc.line(col2cx - lineaW / 2, y, col2cx + lineaW / 2, y)
    y += 6

    // ── ROL ──────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(35, 30, 25)
    doc.text(f1.rol, col1cx, y, { align: 'center' })
    doc.text(f2.rol, col2cx, y, { align: 'center' })
    y += 5.5

    // ── Nombre ───────────────────────────────────────────────
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(40, 35, 30)
    if (f1.nombre) doc.text(f1.nombre, col1cx, y, { align: 'center' })
    if (f2.nombre) doc.text(f2.nombre, col2cx, y, { align: 'center' })
    y += 5

    // ── DNI ──────────────────────────────────────────────────
    doc.setFontSize(8)
    doc.setTextColor(100, 95, 90)
    if (f1.dni) doc.text(`DNI: ${f1.dni}`, col1cx, y, { align: 'center' })
    if (f2.dni) doc.text(`DNI: ${f2.dni}`, col2cx, y, { align: 'center' })
    y += 5

    // ── Huella digital ───────────────────────────────────────
    doc.setFontSize(7.5)
    doc.setTextColor(155, 150, 145)
    doc.text('Huella Digital', col1cx, y, { align: 'center' })
    doc.text('Huella Digital', col2cx, y, { align: 'center' })
  }

  // ── Pie de página ────────────────────────────────────────────
  doc.setFontSize(7.5)
  doc.setTextColor(150, 140, 130)
  doc.text('Generado por ContratoFácil · Solo referencial · Consulte con un abogado colegiado', 105, 290, { align: 'center' })

  doc.save(`${titulo.replace(/\s+/g, '_')}.pdf`)
}
