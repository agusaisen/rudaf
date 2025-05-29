import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

// Tipos para TypeScript
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// Interfaz para los datos de instituciones
interface Institucion {
  id: string
  nombre: string
  tipo: string
  localidad: string
  documentacionCompleta: boolean
  email?: string
  telefono?: string
  presidente?: string
  direccion?: string
}

// Interfaz para los datos de documentos
interface Documento {
  id: string
  nombre: string
  validado: boolean
  archivo: string | null
  fechaCarga: string | null
  institucionId?: string
  institucionNombre?: string
}

// Actualizar la interfaz ReportOptions para incluir el historial
interface ReportOptions {
  titulo: string
  subtitulo?: string
  incluirContacto?: boolean
  incluirDocumentos?: boolean
  incluirHistorial?: boolean
  filtros?: Record<string, any>
  orientacion?: "portrait" | "landscape"
  logo?: string
}

// Añadir la interfaz para el historial
interface HistorialCambio {
  fecha: string
  accion: string
  usuario: string
  detalles: string
}

// Modificar la función generarPDF para manejar correctamente el logo
export function generarPDF(
  datos: Institucion[] | Documento[],
  opciones: ReportOptions,
  tipoReporte: "instituciones" | "documentos" | "estadisticas",
) {
  // Crear un nuevo documento PDF
  const orientacion = opciones.orientacion || "portrait"
  const doc = new jsPDF({
    orientation: orientacion,
    unit: "mm",
    format: "a4",
  })

  // Configurar el encabezado
  const pageWidth = orientacion === "portrait" ? 210 : 297
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  // Añadir logo solo si está disponible y es seguro
  // Comentamos esta parte para evitar el error
  /*
  if (opciones.logo) {
    try {
      doc.addImage(opciones.logo, "PNG", margin, margin, 40, 15);
    } catch (error) {
      console.warn("No se pudo añadir el logo al PDF:", error);
      // Continuar sin el logo
    }
  }
  */

  // Ajustar la posición del título según si hay logo o no
  const tituloY = margin // + (opciones.logo ? 20 : 0);

  // Añadir título y subtítulo
  doc.setFontSize(18)
  doc.setTextColor(43, 62, 76) // #2B3E4C
  doc.text(opciones.titulo, pageWidth / 2, tituloY, { align: "center" })

  if (opciones.subtitulo) {
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(opciones.subtitulo, pageWidth / 2, tituloY + 10, { align: "center" })
  }

  // Añadir fecha de generación
  const fechaGeneracion = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${fechaGeneracion}`, pageWidth - margin, margin, { align: "right" })

  // Añadir información de filtros si existen
  if (opciones.filtros && Object.keys(opciones.filtros).length > 0) {
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    let yPos = tituloY + 20

    doc.text("Filtros aplicados:", margin, yPos)
    yPos += 5

    Object.entries(opciones.filtros).forEach(([key, value]) => {
      if (value && value !== "todos" && value !== "todas") {
        const filtroTexto = `${key}: ${value}`
        doc.text(filtroTexto, margin + 5, yPos)
        yPos += 5
      }
    })
  }

  // Configurar la tabla según el tipo de reporte
  if (tipoReporte === "instituciones") {
    generarTablaPDFInstituciones(doc, datos as Institucion[], opciones)

    // Añadir historial si está habilitado
    if (opciones.incluirHistorial && datos.length > 0) {
      // Añadir una nueva página para el historial
      doc.addPage()

      // Título de la sección de historial
      doc.setFontSize(16)
      doc.setTextColor(43, 62, 76) // #2B3E4C
      doc.text("Historial de Cambios", pageWidth / 2, margin, { align: "center" })

      // Generar historial para cada institución
      generarHistorialPDF(doc, datos as Institucion[], margin + 10)
    }
  } else if (tipoReporte === "documentos") {
    generarTablaPDFDocumentos(doc, datos as Documento[], opciones)

    // Añadir historial si está habilitado
    if (opciones.incluirHistorial && datos.length > 0) {
      // Añadir una nueva página para el historial
      doc.addPage()

      // Título de la sección de historial
      doc.setFontSize(16)
      doc.setTextColor(43, 62, 76) // #2B3E4C
      doc.text("Historial de Cambios de Documentación", pageWidth / 2, margin, { align: "center" })

      // Generar historial para cada documento
      generarHistorialDocumentosPDF(doc, datos as Documento[], margin + 10)
    }
  } else {
    // Para estadísticas, podríamos añadir gráficos o tablas resumen
    doc.text("Reporte estadístico - Ver gráficos adjuntos", margin, margin + 30)
  }

  // Añadir pie de página con numeración
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Página ${i} de ${totalPages} - Gobierno de la Provincia del Neuquén`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
  }

  // Devolver el documento PDF como blob URL para previsualización o descarga
  const pdfBlob = doc.output("blob")
  return URL.createObjectURL(pdfBlob)
}

// Ajustar la posición de inicio de la tabla en las funciones generarTablaPDFInstituciones y generarTablaPDFDocumentos
function generarTablaPDFInstituciones(doc: jsPDF, instituciones: Institucion[], opciones: ReportOptions) {
  // Definir las columnas según las opciones
  const columns = [
    { header: "Nombre", dataKey: "nombre" },
    { header: "Tipo", dataKey: "tipo" },
    { header: "Localidad", dataKey: "localidad" },
    { header: "Estado", dataKey: "estado" },
  ]

  if (opciones.incluirContacto) {
    columns.push({ header: "Email", dataKey: "email" })
    columns.push({ header: "Teléfono", dataKey: "telefono" })
  }

  // Preparar los datos para la tabla
  const data = instituciones.map((inst) => {
    const row: Record<string, any> = {
      nombre: inst.nombre,
      tipo: inst.tipo,
      localidad: inst.localidad,
      estado: inst.documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN",
    }

    if (opciones.incluirContacto) {
      row.email = inst.email || "-"
      row.telefono = inst.telefono || "-"
    }

    return row
  })

  // Calcular la posición Y donde comenzará la tabla
  // Ajustamos para que funcione sin el logo
  const startY = opciones.filtros && Object.keys(opciones.filtros).length > 0 ? 50 : 30

  // Generar la tabla
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => row[col.dataKey])),
    startY: startY,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [220, 220, 220],
    },
    headStyles: {
      fillColor: [43, 62, 76], // #2B3E4C
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      estado: {
        fontStyle: "bold",
      },
    },
  })
}

function generarTablaPDFDocumentos(doc: jsPDF, documentos: Documento[], opciones: ReportOptions) {
  // Definir las columnas
  const columns = [
    { header: "Institución", dataKey: "institucionNombre" },
    { header: "Documento", dataKey: "nombre" },
    { header: "Estado", dataKey: "estado" },
    { header: "Fecha de carga", dataKey: "fechaCarga" },
  ]

  // Preparar los datos para la tabla
  const data = documentos.map((doc) => {
    let estado = "Pendiente de carga"
    if (doc.archivo) {
      estado = doc.validado ? "Validado" : "Pendiente de validación"
    }

    return {
      institucionNombre: doc.institucionNombre || "-",
      nombre: doc.nombre,
      estado: estado,
      fechaCarga: doc.fechaCarga ? new Date(doc.fechaCarga).toLocaleDateString() : "-",
    }
  })

  // Calcular la posición Y donde comenzará la tabla
  // Ajustamos para que funcione sin el logo
  const startY = opciones.filtros && Object.keys(opciones.filtros).length > 0 ? 50 : 30

  // Generar la tabla
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => row[col.dataKey])),
    startY: startY,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [220, 220, 220],
    },
    headStyles: {
      fillColor: [43, 62, 76], // #2B3E4C
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      estado: {
        fontStyle: "bold",
      },
    },
  })
}

/**
 * Prepara el contenido para impresión
 */
export function imprimirListado(
  datos: Institucion[] | Documento[],
  opciones: ReportOptions,
  tipoReporte: "instituciones" | "documentos" | "estadisticas",
) {
  // Crear un elemento oculto para la impresión
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Por favor, permita las ventanas emergentes para imprimir.")
    return
  }

  // Estilos CSS para la impresión
  const estilos = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #2B3E4C;
        margin-bottom: 5px;
      }
      .header h2 {
        color: #666;
        font-weight: normal;
        font-size: 16px;
        margin-top: 0;
      }
      .fecha {
        text-align: right;
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
      }
      .filtros {
        margin-bottom: 20px;
        font-size: 12px;
        color: #666;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th {
        background-color: #2B3E4C;
        color: white;
        padding: 8px;
        text-align: left;
      }
      td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }
      tr:nth-child(even) {
        background-color: #f5f5f5;
      }
      .estado-completo {
        color: green;
        font-weight: bold;
      }
      .estado-incompleto {
        color: red;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #666;
        margin-top: 20px;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
      .historial-section {
        margin-top: 30px;
        page-break-before: always;
      }
      .historial-title {
        color: #2B3E4C;
        font-size: 18px;
        margin-bottom: 15px;
        text-align: center;
      }
      .historial-item {
        margin-bottom: 20px;
      }
      .historial-item h3 {
        color: #2B3E4C;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
      }
      @media print {
        body {
          margin: 0;
          padding: 15mm;
        }
        .no-print {
          display: none;
        }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        .historial-section { page-break-before: always; }
      }
    </style>
  `

  // Fecha de generación
  const fechaGeneracion = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Contenido HTML según el tipo de reporte
  let contenidoTabla = ""
  if (tipoReporte === "instituciones") {
    contenidoTabla = generarTablaHTMLInstituciones(datos as Institucion[], opciones)
  } else if (tipoReporte === "documentos") {
    contenidoTabla = generarTablaHTMLDocumentos(datos as Documento[], opciones)
  } else {
    contenidoTabla = "<p>Reporte estadístico - Ver gráficos adjuntos</p>"
  }

  // Información de filtros
  let filtrosHTML = ""
  if (opciones.filtros && Object.keys(opciones.filtros).length > 0) {
    filtrosHTML = `<div class="filtros"><strong>Filtros aplicados:</strong><br>`
    Object.entries(opciones.filtros).forEach(([key, value]) => {
      if (value && value !== "todos" && value !== "todas") {
        filtrosHTML += `${key}: ${value}<br>`
      }
    })
    filtrosHTML += `</div>`
  }

  // Generar historial si está habilitado
  let historialHTML = ""
  if (opciones.incluirHistorial && datos.length > 0) {
    if (tipoReporte === "instituciones") {
      historialHTML = generarHistorialHTMLInstituciones(datos as Institucion[])
    } else if (tipoReporte === "documentos") {
      historialHTML = generarHistorialHTMLDocumentos(datos as Documento[])
    }
  }

  // Construir el HTML completo
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${opciones.titulo}</title>
      ${estilos}
    </head>
    <body>
      <div class="header">
        <h1>${opciones.titulo}</h1>
        ${opciones.subtitulo ? `<h2>${opciones.subtitulo}</h2>` : ""}
      </div>
      
      <div class="fecha">Generado el: ${fechaGeneracion}</div>
      
      ${filtrosHTML}
      
      ${contenidoTabla}
      
      ${historialHTML}
      
      <div class="footer">
        Gobierno de la Provincia del Neuquén - Sistema de Registro de Instituciones Deportivas
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print();" style="padding: 10px 20px; background-color: #2B3E4C; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Imprimir
        </button>
        <button onclick="window.close();" style="padding: 10px 20px; background-color: #f0f0f0; color: #333; border: none; border-radius: 4px; margin-left: 10px; cursor: pointer;">
          Cerrar
        </button>
      </div>
    </body>
    </html>
  `

  // Escribir el HTML en la ventana de impresión
  printWindow.document.write(html)
  printWindow.document.close()
}

function generarTablaHTMLInstituciones(instituciones: Institucion[], opciones: ReportOptions): string {
  let html = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Localidad</th>
          <th>Estado</th>
          ${opciones.incluirContacto ? "<th>Email</th><th>Teléfono</th>" : ""}
        </tr>
      </thead>
      <tbody>
  `

  instituciones.forEach((institucion) => {
    html += `
      <tr>
        <td>${institucion.nombre}</td>
        <td>${institucion.tipo}</td>
        <td>${institucion.localidad}</td>
        <td class="${institucion.documentacionCompleta ? "estado-completo" : "estado-incompleto"}">
          ${institucion.documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN"}
        </td>
        ${opciones.incluirContacto ? `<td>${institucion.email || "-"}</td><td>${institucion.telefono || "-"}</td>` : ""}
      </tr>
    `
  })

  html += `
      </tbody>
    </table>
  `

  return html
}

function generarTablaHTMLDocumentos(documentos: Documento[], opciones: ReportOptions): string {
  let html = `
    <table>
      <thead>
        <tr>
          <th>Institución</th>
          <th>Documento</th>
          <th>Estado</th>
          <th>Fecha de carga</th>
        </tr>
      </thead>
      <tbody>
  `

  documentos.forEach((documento) => {
    let estado = "Pendiente de carga"
    if (documento.archivo) {
      estado = documento.validado ? "Validado" : "Pendiente de validación"
    }

    html += `
      <tr>
        <td>${documento.institucionNombre || "-"}</td>
        <td>${documento.nombre}</td>
        <td>${estado}</td>
        <td>${documento.fechaCarga ? new Date(documento.fechaCarga).toLocaleDateString() : "-"}</td>
      </tr>
    `
  })

  html += `
      </tbody>
    </table>
  `

  return html
}

// Función para generar el historial HTML de instituciones
function generarHistorialHTMLInstituciones(instituciones: Institucion[]): string {
  let html = `
    <div class="historial-section">
      <div class="historial-title">Historial de Cambios</div>
  `

  instituciones.forEach((institucion) => {
    const historial = generarHistorialSimulado(institucion)

    html += `
      <div class="historial-item">
        <h3>Historial de: ${institucion.nombre}</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Usuario</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
    `

    historial.forEach((item) => {
      html += `
        <tr>
          <td>${item.fecha}</td>
          <td>${item.accion}</td>
          <td>${item.usuario}</td>
          <td>${item.detalles}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </div>
    `
  })

  html += `</div>`

  return html
}

// Función para generar el historial HTML de documentos
function generarHistorialHTMLDocumentos(documentos: Documento[]): string {
  let html = `
    <div class="historial-section">
      <div class="historial-title">Historial de Cambios de Documentación</div>
  `

  documentos.forEach((documento) => {
    const historial = generarHistorialDocumentoSimulado(documento)

    html += `
      <div class="historial-item">
        <h3>Historial de documento: ${documento.nombre}</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Usuario</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
    `

    historial.forEach((item) => {
      html += `
        <tr>
          <td>${item.fecha}</td>
          <td>${item.accion}</td>
          <td>${item.usuario}</td>
          <td>${item.detalles}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </div>
    `
  })

  html += `</div>`

  return html
}

// Función para preparar los datos de instituciones para Excel
function prepararDatosExcelInstituciones(instituciones: Institucion[], opciones: ReportOptions): any[] {
  const headers = ["Nombre", "Tipo", "Localidad", "Estado"]
  if (opciones.incluirContacto) {
    headers.push("Email", "Teléfono")
  }

  const data = instituciones.map((institucion) => {
    const row: any[] = [
      institucion.nombre,
      institucion.tipo,
      institucion.localidad,
      institucion.documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN",
    ]
    if (opciones.incluirContacto) {
      row.push(institucion.email || "-", institucion.telefono || "-")
    }
    return row
  })

  // Añadir información de título y fecha
  const fechaGeneracion = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const titulo = [[opciones.titulo], [opciones.subtitulo || ""], [`Generado el: ${fechaGeneracion}`], []]

  // Añadir información de filtros
  if (opciones.filtros && Object.keys(opciones.filtros).length > 0) {
    const filtros = ["Filtros aplicados:"]
    Object.entries(opciones.filtros).forEach(([key, value]) => {
      if (value && value !== "todos" && value !== "todas") {
        filtros.push(`${key}: ${value}`)
      }
    })
    titulo.push(filtros)
    titulo.push([]) // Espacio después de los filtros
  }

  return [...titulo, headers, ...data]
}

// Función para preparar los datos de documentos para Excel
function prepararDatosExcelDocumentos(documentos: Documento[], opciones: ReportOptions): any[] {
  const headers = ["Institución", "Documento", "Estado", "Fecha de carga"]

  const data = documentos.map((documento) => {
    let estado = "Pendiente de carga"
    if (documento.archivo) {
      estado = documento.validado ? "Validado" : "Pendiente de validación"
    }

    return [
      documento.institucionNombre || "-",
      documento.nombre,
      estado,
      documento.fechaCarga ? new Date(documento.fechaCarga).toLocaleDateString() : "-",
    ]
  })

  // Añadir información de título y fecha
  const fechaGeneracion = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const titulo = [[opciones.titulo], [opciones.subtitulo || ""], [`Generado el: ${fechaGeneracion}`], []]

  // Añadir información de filtros
  if (opciones.filtros && Object.keys(opciones.filtros).length > 0) {
    const filtros = ["Filtros aplicados:"]
    Object.entries(opciones.filtros).forEach(([key, value]) => {
      if (value && value !== "todos" && value !== "todas") {
        filtros.push(`${key}: ${value}`)
      }
    })
    titulo.push(filtros)
    titulo.push([]) // Espacio después de los filtros
  }

  return [...titulo, headers, ...data]
}

/**
 * Exporta los datos a un archivo Excel
 */
export function exportarExcel(
  datos: Institucion[] | Documento[],
  opciones: ReportOptions,
  tipoReporte: "instituciones" | "documentos" | "estadisticas",
) {
  // Crear un nuevo libro de trabajo
  const wb = XLSX.utils.book_new()

  // Preparar los datos según el tipo de reporte
  let wsData: any[] = []
  let nombreHoja = ""

  if (tipoReporte === "instituciones") {
    wsData = prepararDatosExcelInstituciones(datos as Institucion[], opciones)
    nombreHoja = "Instituciones"

    // Añadir hoja de historial si está habilitado
    if (opciones.incluirHistorial && datos.length > 0) {
      const historialData = prepararHistorialExcelInstituciones(datos as Institucion[])
      const wsHistorial = XLSX.utils.aoa_to_sheet(historialData)
      XLSX.utils.book_append_sheet(wb, wsHistorial, "Historial")
    }
  } else if (tipoReporte === "documentos") {
    wsData = prepararDatosExcelDocumentos(datos as Documento[], opciones)
    nombreHoja = "Documentos"

    // Añadir hoja de historial si está habilitado
    if (opciones.incluirHistorial && datos.length > 0) {
      const historialData = prepararHistorialExcelDocumentos(datos as Documento[])
      const wsHistorial = XLSX.utils.aoa_to_sheet(historialData)
      XLSX.utils.book_append_sheet(wb, wsHistorial, "Historial Documentos")
    }
  } else {
    wsData = [["Reporte estadístico - Ver gráficos adjuntos"]]
    nombreHoja = "Estadísticas"
  }

  // Crear la hoja de trabajo
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, nombreHoja)

  // Generar el archivo Excel
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

  // Devolver la URL del blob para descarga
  return URL.createObjectURL(blob)
}

// Función para preparar los datos de historial para Excel de instituciones
function prepararHistorialExcelInstituciones(instituciones: Institucion[]): any[] {
  // Encabezados
  const headers = ["Institución", "Fecha", "Acción", "Usuario", "Detalles"]

  // Datos
  const data: any[] = []

  instituciones.forEach((institucion) => {
    const historial = generarHistorialSimulado(institucion)

    historial.forEach((item) => {
      data.push([institucion.nombre, item.fecha, item.accion, item.usuario, item.detalles])
    })
  })

  // Añadir información de título y fecha
  const fechaGeneracion = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const titulo = [["Historial de Cambios - Instituciones"], [`Generado el: ${fechaGeneracion}`], []]

  // Combinar todo
  return [...titulo, headers, ...data]
}

// Función para preparar los datos de historial para Excel de documentos
function prepararHistorialExcelDocumentos(documentos: Documento[]): any[] {
  // Encabezados
  const headers = ["Documento", "Institución", "Fecha", "Acción", "Usuario", "Detalles"]

  // Datos
  const data: any[] = []

  documentos.forEach((documento) => {
    const historial = generarHistorialDocumentoSimulado(documento)

    historial.forEach((item) => {
      data.push([
        documento.nombre,
        documento.institucionNombre || "-",
        item.fecha,
        item.accion,
        item.usuario,
        item.detalles,
      ])
    })
  })

  // Añadir información de título y fecha
  const fechaGeneracion = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const titulo = [["Historial de Cambios - Documentación"], [`Generado el: ${fechaGeneracion}`], []]

  // Combinar todo
  return [...titulo, headers, ...data]
}

// Función para generar el historial de instituciones en PDF
function generarHistorialPDF(doc: jsPDF, instituciones: Institucion[], startY: number) {
  // Para cada institución, generar un historial simulado
  let currentY = startY

  instituciones.forEach((institucion, index) => {
    // Verificar si hay espacio suficiente en la página actual
    if (currentY > doc.internal.pageSize.height - 40) {
      doc.addPage()
      currentY = 20
    }

    // Título de la institución
    doc.setFontSize(12)
    doc.setTextColor(43, 62, 76) // #2B3E4C
    doc.text(`Historial de: ${institucion.nombre}`, 15, currentY)
    currentY += 8

    // Generar historial simulado
    const historial = generarHistorialSimulado(institucion)

    // Crear tabla de historial
    doc.autoTable({
      head: [["Fecha", "Acción", "Usuario", "Detalles"]],
      body: historial.map((item) => [item.fecha, item.accion, item.usuario, item.detalles]),
      startY: currentY,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
      },
      headStyles: {
        fillColor: [43, 62, 76], // #2B3E4C
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })

    // Actualizar la posición Y para la siguiente institución
    currentY = (doc as any).lastAutoTable.finalY + 15
  })
}

// Función para generar el historial de documentos en PDF
function generarHistorialDocumentosPDF(doc: jsPDF, documentos: Documento[], startY: number) {
  // Para cada documento, generar un historial simulado
  let currentY = startY

  documentos.forEach((documento, index) => {
    // Verificar si hay espacio suficiente en la página actual
    if (currentY > doc.internal.pageSize.height - 40) {
      doc.addPage()
      currentY = 20
    }

    // Título del documento
    doc.setFontSize(12)
    doc.setTextColor(43, 62, 76) // #2B3E4C
    doc.text(`Historial de documento: ${documento.nombre}`, 15, currentY)
    currentY += 8

    // Generar historial simulado para documentos
    const historial = generarHistorialDocumentoSimulado(documento)

    // Crear tabla de historial
    doc.autoTable({
      head: [["Fecha", "Acción", "Usuario", "Detalles"]],
      body: historial.map((item) => [item.fecha, item.accion, item.usuario, item.detalles]),
      startY: currentY,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
      },
      headStyles: {
        fillColor: [43, 62, 76], // #2B3E4C
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })

    // Actualizar la posición Y para el siguiente documento
    currentY = (doc as any).lastAutoTable.finalY + 15
  })
}

// Función para generar historial simulado para una institución
function generarHistorialSimulado(institucion: Institucion): HistorialCambio[] {
  // Generar fechas en orden cronológico (últimos 3 meses)
  const hoy = new Date()
  const fechaRegistro = new Date(hoy)
  fechaRegistro.setMonth(hoy.getMonth() - 3)

  const fechaModificacion1 = new Date(fechaRegistro)
  fechaModificacion1.setDate(fechaRegistro.getDate() + 5)

  const fechaModificacion2 = new Date(fechaModificacion1)
  fechaModificacion2.setDate(fechaModificacion1.getDate() + 15)

  const fechaDocumento = new Date(fechaModificacion2)
  fechaDocumento.setDate(fechaModificacion2.getDate() + 10)

  // Crear historial simulado
  return [
    {
      fecha: fechaRegistro.toLocaleDateString(),
      accion: "Registro de institución",
      usuario: "Sistema",
      detalles: `Institución ${institucion.nombre} registrada en el sistema`,
    },
    {
      fecha: fechaModificacion1.toLocaleDateString(),
      accion: "Modificación de datos",
      usuario: institucion.email || "usuario@ejemplo.com",
      detalles: "Actualización de información de contacto",
    },
    {
      fecha: fechaModificacion2.toLocaleDateString(),
      accion: "Cambio de presidente",
      usuario: institucion.email || "usuario@ejemplo.com",
      detalles: `Nuevo presidente: ${institucion.presidente || "Nombre del presidente"}`,
    },
    {
      fecha: fechaDocumento.toLocaleDateString(),
      accion: "Carga de documentación",
      usuario: institucion.email || "usuario@ejemplo.com",
      detalles: "Se cargó el estatuto de la institución",
    },
    {
      fecha: hoy.toLocaleDateString(),
      accion: "Validación de documentación",
      usuario: "admin@neuquen.gob.ar",
      detalles: institucion.documentacionCompleta
        ? "Toda la documentación ha sido validada"
        : "Documentación pendiente de validación",
    },
  ]
}

// Función para generar historial simulado para un documento
function generarHistorialDocumentoSimulado(documento: Documento): HistorialCambio[] {
  // Generar fechas en orden cronológico (últimos 2 meses)
  const hoy = new Date()

  let fechaCarga = new Date(hoy)
  if (documento.fechaCarga) {
    fechaCarga = new Date(documento.fechaCarga)
  } else {
    fechaCarga.setMonth(hoy.getMonth() - 2)
  }

  const fechaRevision = new Date(fechaCarga)
  fechaRevision.setDate(fechaCarga.getDate() + 7)

  const fechaValidacion = new Date(fechaRevision)
  fechaValidacion.setDate(fechaRevision.getDate() + 5)

  // Crear historial simulado
  const historial: HistorialCambio[] = [
    {
      fecha: fechaCarga.toLocaleDateString(),
      accion: "Carga inicial",
      usuario: documento.institucionNombre ? `${documento.institucionNombre} (usuario)` : "usuario@ejemplo.com",
      detalles: `Documento ${documento.nombre} cargado en el sistema`,
    },
  ]

  // Si el documento tiene archivo
  if (documento.archivo) {
    historial.push({
      fecha: fechaRevision.toLocaleDateString(),
      accion: "Revisión",
      usuario: "admin@neuquen.gob.ar",
      detalles: "Documento en proceso de revisión",
    })

    // Si el documento está validado
    if (documento.validado) {
      historial.push({
        fecha: fechaValidacion.toLocaleDateString(),
        accion: "Validación",
        usuario: "admin@neuquen.gob.ar",
        detalles: "Documento validado correctamente",
      })
    } else {
      historial.push({
        fecha: fechaValidacion.toLocaleDateString(),
        accion: "Observación",
        usuario: "admin@neuquen.gob.ar",
        detalles: "Se solicitaron correcciones en el documento",
      })

      // Agregar una carga posterior
      const fechaRecarga = new Date(fechaValidacion)
      fechaRecarga.setDate(fechaValidacion.getDate() + 10)

      historial.push({
        fecha: fechaRecarga.toLocaleDateString(),
        accion: "Recarga",
        usuario: documento.institucionNombre ? `${documento.institucionNombre} (usuario)` : "usuario@ejemplo.com",
        detalles: "Documento actualizado con las correcciones solicitadas",
      })
    }
  }

  return historial
}
