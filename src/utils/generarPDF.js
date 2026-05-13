import { jsPDF } from 'jspdf'
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  convertInchesToTwip,
} from 'docx'

// ─── Utilidad: elimina el bloque de firmas que genera la IA ─────
function stripAISignature(texto) {
  const lines = texto.split('\n')
  const desde = Math.floor(lines.length * 0.5)
  let corte = -1
  const soloSep     = /^[\s_\-\.]{4,}$/
  const contieneSep = /_{4,}|-{4,}|\.{6,}/
  for (let i = lines.length - 1; i >= desde; i--) {
    if (soloSep.test(lines[i]) || contieneSep.test(lines[i])) { corte = i; break }
  }
  if (corte > 10) {
    let c = corte
    while (c > 1 && lines[c - 1].trim() === '') c--
    return lines.slice(0, c).join('\n').trimEnd()
  }
  return texto
}

// ─── PDF ────────────────────────────────────────────────────────
export function generarPDF(textoContrato, titulo, firmas = null) {
  const doc    = new jsPDF({ unit: 'mm', format: 'a4' })
  const MARGEN = 22
  const ANCHO  = 210 - MARGEN * 2   // 166 mm útiles
  let y = MARGEN

  // Encabezado
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(titulo.toUpperCase(), 105, y, { align: 'center' })
  y += 7
  doc.setDrawColor(217, 16, 35)
  doc.setLineWidth(0.8)
  doc.line(MARGEN, y, 210 - MARGEN, y)
  y += 9

  // Texto del contrato — si hay bloque de firmas propio, eliminar el de la IA
  const textoRender = firmas ? stripAISignature(textoContrato) : textoContrato

  // Cuerpo
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(40, 35, 30)
  for (const linea of doc.splitTextToSize(textoRender, ANCHO)) {
    if (y > 272) { doc.addPage(); y = MARGEN }
    doc.text(linea, MARGEN, y)
    y += 5.2
  }

  // ── Bloque de firmas — dos columnas simétricas ───────────────
  if (firmas && firmas.length >= 2) {
    const [f1, f2] = firmas

    if (y > 238) { doc.addPage(); y = MARGEN }
    y += 14

    // Separador tenue
    doc.setDrawColor(210, 200, 190)
    doc.setLineWidth(0.3)
    doc.line(MARGEN, y, 210 - MARGEN, y)
    y += 14

    // Geometría de columnas
    const gap    = 22                       // separación entre columnas
    const lineaW = (ANCHO - gap) / 2       // ancho de cada firma: 72 mm
    const col1x  = MARGEN                  // inicio columna izquierda: 22 mm
    const col2x  = MARGEN + lineaW + gap   // inicio columna derecha: 116 mm
    const col1cx = col1x  + lineaW / 2     // centro izq: 22 + 36 = 58 mm
    const col2cx = col2x  + lineaW / 2     // centro der: 116 + 36 = 152 mm

    // Líneas de firma — mismo ancho exacto
    doc.setDrawColor(50, 45, 40)
    doc.setLineWidth(0.55)
    doc.line(col1x,            y, col1x  + lineaW, y)
    doc.line(col2x,            y, col2x  + lineaW, y)
    y += 5.5

    // ROL
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(25, 20, 15)
    doc.text(f1.rol, col1cx, y, { align: 'center' })
    doc.text(f2.rol, col2cx, y, { align: 'center' })
    y += 5

    // Nombre
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(40, 35, 30)
    if (f1.nombre) doc.text(f1.nombre, col1cx, y, { align: 'center' })
    if (f2.nombre) doc.text(f2.nombre, col2cx, y, { align: 'center' })
    y += 4.5

    // DNI
    doc.setFontSize(7.5)
    doc.setTextColor(100, 95, 90)
    if (f1.dni) doc.text(`DNI: ${f1.dni}`, col1cx, y, { align: 'center' })
    if (f2.dni) doc.text(`DNI: ${f2.dni}`, col2cx, y, { align: 'center' })
    y += 5

    // Huella
    doc.setFontSize(7)
    doc.setTextColor(155, 150, 145)
    doc.text('Huella Digital', col1cx, y, { align: 'center' })
    doc.text('Huella Digital', col2cx, y, { align: 'center' })
  }

  // Pie de página
  doc.setFontSize(7.5)
  doc.setTextColor(150, 140, 130)
  doc.text(
    'Generado por ContratoFácil · Solo referencial · Consulte con un abogado colegiado',
    105, 290, { align: 'center' }
  )

  doc.save(`${titulo.replace(/\s+/g, '_')}.pdf`)
}

// ─── DOCX ───────────────────────────────────────────────────────
function crearTablaFirmasDOCX(firmas) {
  const sin = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const sinBordes = { top: sin, bottom: sin, left: sin, right: sin }

  const celda = (texto, negrita = false) => new TableCell({
    borders: sinBordes,
    width: { size: 50, type: WidthType.PERCENTAGE },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: texto,
        bold: negrita,
        size: negrita ? 20 : 18,
        font: 'Times New Roman',
      })],
      spacing: { after: 80 },
    })],
  })

  const [f1, f2] = firmas

  const filas = [
    new TableRow({ children: [celda('_____________________'), celda('_____________________')] }),
    new TableRow({ children: [celda(f1.rol, true), celda(f2.rol, true)] }),
  ]

  if (f1.nombre || f2.nombre) {
    filas.push(new TableRow({ children: [celda(f1.nombre || ''), celda(f2.nombre || '')] }))
  }
  if (f1.dni || f2.dni) {
    filas.push(new TableRow({ children: [
      celda(f1.dni ? `DNI: ${f1.dni}` : ''),
      celda(f2.dni ? `DNI: ${f2.dni}` : ''),
    ]}))
  }

  filas.push(new TableRow({ children: [celda('Huella Digital'), celda('Huella Digital')] }))
  filas.push(new TableRow({ children: [celda('_______________'), celda('_______________')] }))

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: filas,
  })
}

export async function generarDOCX(textoContrato, titulo, firmas = null) {
  const textoRender = firmas ? stripAISignature(textoContrato) : textoContrato
  const lineas = textoRender.split('\n')

  const cuerpo = lineas.map(linea => {
    const texto = linea.trim()
    const esTitulo = texto === texto.toUpperCase() && texto.length > 5 && !/^\d/.test(texto)
    return new Paragraph({
      children: [new TextRun({
        text: linea,
        size: esTitulo ? 22 : 20,
        bold: esTitulo,
        font: 'Times New Roman',
      })],
      spacing: { after: esTitulo ? 160 : 80 },
      alignment: esTitulo ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    })
  })

  const bloquesFirma = firmas && firmas.length >= 2
    ? [
        new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: 400, after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: '─'.repeat(60), color: 'CCCCCC', size: 16 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 280 },
        }),
        crearTablaFirmasDOCX(firmas),
      ]
    : []

  const children = [
    new Paragraph({
      children: [new TextRun({ text: titulo.toUpperCase(), bold: true, size: 28, font: 'Times New Roman' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: '─'.repeat(60), color: 'D91023', size: 18 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 280 },
    }),
    ...cuerpo,
    ...bloquesFirma,
    new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: 400 } }),
    new Paragraph({
      children: [new TextRun({
        text: 'Generado por ContratoFácil · Documento de carácter referencial · Consulte con un abogado colegiado del Colegio de Abogados del Perú.',
        size: 16,
        color: '9E9E9E',
        italics: true,
        font: 'Arial',
      })],
      alignment: AlignmentType.CENTER,
    }),
  ]

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top:    convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left:   convertInchesToTwip(1.25),
            right:  convertInchesToTwip(1.25),
          },
        },
      },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${titulo.replace(/\s+/g, '_')}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
