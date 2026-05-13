import { jsPDF } from 'jspdf'
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  HeadingLevel, PageOrientation, convertInchesToTwip,
} from 'docx'

// ─── PDF ────────────────────────────────────────────────────────
export function generarPDF(textoContrato, titulo, firmas = null) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const MARGEN = 22
  const ANCHO  = 210 - MARGEN * 2
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

  // Eliminar bloque de firmas generado por la IA (si se pasará bloque propio)
  let textoRender = textoContrato
  if (firmas) {
    const lines = textoContrato.split('\n')
    const desde = Math.floor(lines.length * 0.5)
    let corte = -1
    const soloSeparador = /^[\s_\-\.]{4,}$/
    const contieneLinea = /_{4,}|-{4,}|\.{6,}/
    for (let i = lines.length - 1; i >= desde; i--) {
      if (soloSeparador.test(lines[i]) || contieneLinea.test(lines[i])) { corte = i; break }
    }
    if (corte > 10) {
      while (corte > 1 && lines[corte - 1].trim() === '') corte--
      textoRender = lines.slice(0, corte).join('\n').trimEnd()
    }
  }

  // Cuerpo
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(40, 35, 30)
  for (const linea of doc.splitTextToSize(textoRender, ANCHO)) {
    if (y > 272) { doc.addPage(); y = MARGEN }
    doc.text(linea, MARGEN, y)
    y += 5.2
  }

  // Bloque de firmas
  if (firmas && firmas.length >= 2) {
    const [f1, f2] = firmas
    if (y > 240) { doc.addPage(); y = MARGEN }
    y += 12
    doc.setDrawColor(210, 200, 190)
    doc.setLineWidth(0.3)
    doc.line(MARGEN, y, 210 - MARGEN, y)
    y += 12
    const mitad = MARGEN + ANCHO / 2
    const gap = 20
    const lineaW = (ANCHO - gap) / 2
    const col1cx = MARGEN + lineaW / 2
    const col2cx = 210 - MARGEN - lineaW / 2
    doc.setDrawColor(60, 55, 50)
    doc.setLineWidth(0.6)
    doc.line(col1cx - lineaW / 2, y, col1cx + lineaW / 2, y)
    doc.line(col2cx - lineaW / 2, y, col2cx + lineaW / 2, y)
    y += 6
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(35, 30, 25)
    doc.text(f1.rol, col1cx, y, { align: 'center' })
    doc.text(f2.rol, col2cx, y, { align: 'center' })
    y += 5.5
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(40, 35, 30)
    if (f1.nombre) doc.text(f1.nombre, col1cx, y, { align: 'center' })
    if (f2.nombre) doc.text(f2.nombre, col2cx, y, { align: 'center' })
    y += 5
    doc.setFontSize(8); doc.setTextColor(100, 95, 90)
    if (f1.dni) doc.text(`DNI: ${f1.dni}`, col1cx, y, { align: 'center' })
    if (f2.dni) doc.text(`DNI: ${f2.dni}`, col2cx, y, { align: 'center' })
    y += 5
    doc.setFontSize(7.5); doc.setTextColor(155, 150, 145)
    doc.text('Huella Digital', col1cx, y, { align: 'center' })
    doc.text('Huella Digital', col2cx, y, { align: 'center' })
  }

  // Pie de página
  doc.setFontSize(7.5)
  doc.setTextColor(150, 140, 130)
  doc.text('Generado por ContratoFácil · Solo referencial · Consulte con un abogado colegiado', 105, 290, { align: 'center' })

  doc.save(`${titulo.replace(/\s+/g, '_')}.pdf`)
}

// ─── DOCX ───────────────────────────────────────────────────────
export async function generarDOCX(textoContrato, titulo) {
  const lineas = textoContrato.split('\n')

  const children = [
    // Título
    new Paragraph({
      children: [new TextRun({ text: titulo.toUpperCase(), bold: true, size: 28, font: 'Times New Roman' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    // Separador visual
    new Paragraph({
      children: [new TextRun({ text: '─'.repeat(60), color: 'D91023', size: 18 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 280 },
    }),
    // Cuerpo
    ...lineas.map(linea => {
      const texto = linea.trim()
      const esTitulo = texto === texto.toUpperCase() && texto.length > 5 && !texto.match(/^\d/)
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
    }),
    // Pie de página en el documento
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
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${titulo.replace(/\s+/g, '_')}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
