"use client"

import { useState } from "react"
import DashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { FileText, Download, Printer, BarChart, Filter } from "lucide-react"
import { getInstituciones } from "@/app/actions/admin-actions"
import { generarPDF, imprimirListado, exportarExcel } from "@/app/utils/report-utils"

// Componente para generar reportes
const GenerarReporte = ({
  tipo,
  filtros,
  datos,
  incluirContacto,
  incluirDocumentos,
  incluirHistorial,
}: {
  tipo: string
  filtros: any
  datos: any[]
  incluirContacto: boolean
  incluirDocumentos: boolean
  incluirHistorial: boolean
}) => {
  // Función para generar PDF
  const handleGenerarPDF = async () => {
    try {
      // Configurar opciones del reporte
      const opciones = {
        titulo: `Reporte de ${tipo}`,
        subtitulo: "Sistema de Registro de Instituciones Deportivas",
        incluirContacto,
        incluirDocumentos,
        incluirHistorial,
        filtros,
        orientacion: incluirContacto ? "landscape" : "portrait",
        // Eliminar la referencia al logo para evitar el error
        // logo: "/logo-gobierno-2024.png",
      }

      // Generar el PDF
      const pdfUrl = generarPDF(datos, opciones, tipo.toLowerCase() as any)

      // Abrir el PDF en una nueva ventana
      window.open(pdfUrl, "_blank")

      toast({
        title: "Reporte generado",
        description: `El reporte de ${tipo} ha sido generado correctamente.`,
      })
    } catch (error) {
      console.error("Error al generar reporte:", error)
      toast({
        title: "Error al generar reporte",
        description: "Ocurrió un error al generar el reporte. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Función para imprimir
  const handleImprimir = () => {
    try {
      // Configurar opciones del reporte
      const opciones = {
        titulo: `Reporte de ${tipo}`,
        subtitulo: "Sistema de Registro de Instituciones Deportivas",
        incluirContacto,
        incluirDocumentos,
        incluirHistorial,
        filtros,
      }

      // Imprimir el listado
      imprimirListado(datos, opciones, tipo.toLowerCase() as any)

      toast({
        title: "Preparando impresión",
        description: "Se ha abierto una nueva ventana para imprimir el reporte.",
      })
    } catch (error) {
      console.error("Error al preparar impresión:", error)
      toast({
        title: "Error al preparar impresión",
        description: "Ocurrió un error al preparar la impresión. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Función para exportar a Excel
  const handleExportarExcel = () => {
    try {
      // Configurar opciones del reporte
      const opciones = {
        titulo: `Reporte de ${tipo}`,
        subtitulo: "Sistema de Registro de Instituciones Deportivas",
        incluirContacto,
        incluirDocumentos,
        incluirHistorial,
        filtros,
      }

      // Generar el archivo Excel
      const excelUrl = exportarExcel(datos, opciones, tipo.toLowerCase() as any)

      // Crear un enlace para descargar el archivo
      const link = document.createElement("a")
      link.href = excelUrl
      link.download = `reporte_${tipo.toLowerCase()}_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Excel generado",
        description: `El archivo Excel de ${tipo} ha sido generado y descargado.`,
      })
    } catch (error) {
      console.error("Error al exportar a Excel:", error)
      toast({
        title: "Error al exportar a Excel",
        description: "Ocurrió un error al exportar a Excel. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-4 flex space-x-2">
      <Button onClick={handleGenerarPDF} className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
        <FileText className="mr-2 h-4 w-4" />
        Generar PDF
      </Button>
      <Button
        onClick={handleImprimir}
        variant="outline"
        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
      <Button
        onClick={handleExportarExcel}
        variant="outline"
        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  )
}

export default function ReportesPage() {
  // Estados para los filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("")
  const [filtroLocalidad, setFiltroLocalidad] = useState<string>("")
  const [filtroEstado, setFiltroEstado] = useState<string>("")
  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")
  const [incluirDocumentos, setIncluirDocumentos] = useState<boolean>(true)
  const [incluirContacto, setIncluirContacto] = useState<boolean>(true)
  const [incluirHistorial, setIncluirHistorial] = useState<boolean>(false)

  // Datos simulados (en producción, se obtendrían de la base de datos)
  const [instituciones, setInstituciones] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Cargar instituciones
  const cargarInstituciones = async () => {
    setLoading(true)
    try {
      const data = await getInstituciones()

      // Aplicar filtros a los datos obtenidos
      let filteredData = [...data]

      // Filtrar por tipo de institución
      if (filtroTipo && filtroTipo !== "todos") {
        filteredData = filteredData.filter((inst) => inst.tipo === filtroTipo)
      }

      // Filtrar por localidad
      if (filtroLocalidad && filtroLocalidad !== "todas") {
        filteredData = filteredData.filter((inst) => inst.localidad === filtroLocalidad)
      }

      // Filtrar por estado de documentación
      if (filtroEstado && filtroEstado !== "todos") {
        const documentacionCompleta = filtroEstado === "completa"
        filteredData = filteredData.filter((inst) => inst.documentacionCompleta === documentacionCompleta)
      }

      // Filtrar por fecha (simulado, ya que no tenemos fechas reales en los datos de ejemplo)
      // En una implementación real, se filtrarían por fechaRegistro
      if (fechaDesde || fechaHasta) {
        console.log("Filtro de fechas aplicado:", { fechaDesde, fechaHasta })
        // Aquí iría la lógica real de filtrado por fechas
      }

      setInstituciones(filteredData)
    } catch (error) {
      console.error("Error al cargar instituciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las instituciones.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  const aplicarFiltros = () => {
    cargarInstituciones()
    toast({
      title: "Filtros aplicados",
      description: "Los filtros han sido aplicados correctamente.",
    })
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroTipo("")
    setFiltroLocalidad("")
    setFiltroEstado("")
    setFechaDesde("")
    setFechaHasta("")
    setIncluirDocumentos(true)
    setIncluirContacto(true)
    setIncluirHistorial(false)
    toast({
      title: "Filtros limpiados",
      description: "Se han restablecido todos los filtros.",
    })
  }

  // Obtener los filtros aplicados
  const obtenerFiltrosAplicados = () => {
    const filtros: Record<string, any> = {}

    if (filtroTipo && filtroTipo !== "todos") filtros["Tipo de institución"] = filtroTipo
    if (filtroLocalidad && filtroLocalidad !== "todas") filtros["Localidad"] = filtroLocalidad
    if (filtroEstado && filtroEstado !== "todos") {
      filtros["Estado de documentación"] =
        filtroEstado === "completa" ? "Documentación completa" : "Documentación incompleta"
    }
    if (fechaDesde) filtros["Fecha desde"] = fechaDesde
    if (fechaHasta) filtros["Fecha hasta"] = fechaHasta

    return filtros
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold text-[#2B3E4C]">Reportes</h1>

        <Tabs defaultValue="instituciones" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="instituciones">Instituciones</TabsTrigger>
            <TabsTrigger value="documentacion">Documentación</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="instituciones">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-[#2B3E4C]">Reporte de Instituciones</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">
                  Genere reportes detallados de las instituciones registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-4 flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-[#2B3E4C]" />
                      <h3 className="text-lg font-semibold text-[#2B3E4C]">Filtros</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="tipo" className="text-[#2B3E4C]">
                          Tipo de Institución
                        </Label>
                        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                          <SelectTrigger id="tipo" className="border-[#2B3E4C] text-[#2B3E4C]">
                            <SelectValue placeholder="Todos los tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos los tipos</SelectItem>
                            <SelectItem value="Club">Club</SelectItem>
                            <SelectItem value="Federación">Federación</SelectItem>
                            <SelectItem value="Asociación">Asociación</SelectItem>
                            <SelectItem value="Institución deportiva no regulada">
                              Institución deportiva no regulada
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="localidad" className="text-[#2B3E4C]">
                          Localidad
                        </Label>
                        <Select value={filtroLocalidad} onValueChange={setFiltroLocalidad}>
                          <SelectTrigger id="localidad" className="border-[#2B3E4C] text-[#2B3E4C]">
                            <SelectValue placeholder="Todas las localidades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas las localidades</SelectItem>
                            <SelectItem value="Neuquén Capital">Neuquén Capital</SelectItem>
                            <SelectItem value="Plottier">Plottier</SelectItem>
                            <SelectItem value="Centenario">Centenario</SelectItem>
                            <SelectItem value="San Martín de los Andes">San Martín de los Andes</SelectItem>
                            <SelectItem value="Zapala">Zapala</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado" className="text-[#2B3E4C]">
                          Estado de Documentación
                        </Label>
                        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                          <SelectTrigger id="estado" className="border-[#2B3E4C] text-[#2B3E4C]">
                            <SelectValue placeholder="Todos los estados" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="completa">Documentación completa</SelectItem>
                            <SelectItem value="incompleta">Documentación incompleta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fecha-desde" className="text-[#2B3E4C]">
                          Fecha de Registro Desde
                        </Label>
                        <Input
                          id="fecha-desde"
                          type="date"
                          value={fechaDesde}
                          onChange={(e) => setFechaDesde(e.target.value)}
                          className="border-[#2B3E4C] text-[#2B3E4C]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fecha-hasta" className="text-[#2B3E4C]">
                          Fecha de Registro Hasta
                        </Label>
                        <Input
                          id="fecha-hasta"
                          type="date"
                          value={fechaHasta}
                          onChange={(e) => setFechaHasta(e.target.value)}
                          className="border-[#2B3E4C] text-[#2B3E4C]"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="incluir-documentos"
                          checked={incluirDocumentos}
                          onCheckedChange={(checked) => setIncluirDocumentos(checked as boolean)}
                        />
                        <Label htmlFor="incluir-documentos" className="text-[#2B3E4C]">
                          Incluir estado de documentación
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="incluir-contacto"
                          checked={incluirContacto}
                          onCheckedChange={(checked) => setIncluirContacto(checked as boolean)}
                        />
                        <Label htmlFor="incluir-contacto" className="text-[#2B3E4C]">
                          Incluir información de contacto
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="incluir-historial"
                          checked={incluirHistorial}
                          onCheckedChange={(checked) => setIncluirHistorial(checked as boolean)}
                        />
                        <Label htmlFor="incluir-historial" className="text-[#2B3E4C]">
                          Incluir historial de cambios
                        </Label>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <Button onClick={aplicarFiltros} className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                        Aplicar Filtros
                      </Button>
                      <Button
                        onClick={limpiarFiltros}
                        variant="outline"
                        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                      >
                        Limpiar Filtros
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-semibold text-[#2B3E4C]">Vista Previa del Reporte</h3>

                    {loading ? (
                      <div className="flex h-40 items-center justify-center">
                        <p className="text-[#2B3E4C]">Cargando instituciones...</p>
                      </div>
                    ) : instituciones.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-[#2B3E4C]/20">
                              <th className="py-3 text-left font-medium text-[#2B3E4C]">Nombre</th>
                              <th className="py-3 text-left font-medium text-[#2B3E4C]">Tipo</th>
                              <th className="py-3 text-left font-medium text-[#2B3E4C]">Localidad</th>
                              <th className="py-3 text-left font-medium text-[#2B3E4C]">Estado</th>
                              {incluirContacto && (
                                <th className="py-3 text-left font-medium text-[#2B3E4C]">Contacto</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {instituciones.map((institucion, index) => (
                              <tr key={index} className="border-b border-[#2B3E4C]/10">
                                <td className="py-3 text-[#2B3E4C]">{institucion.nombre}</td>
                                <td className="py-3 text-[#2B3E4C]">{institucion.tipo}</td>
                                <td className="py-3 text-[#2B3E4C]">{institucion.localidad}</td>
                                <td className="py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      institucion.documentacionCompleta
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {institucion.documentacionCompleta
                                      ? "DOCUMENTACIÓN AL DÍA"
                                      : "ADEUDA DOCUMENTACIÓN"}
                                  </span>
                                </td>
                                {incluirContacto && (
                                  <td className="py-3 text-[#2B3E4C]">{institucion.email || "info@ejemplo.com"}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center">
                        <p className="text-[#2B3E4C]">
                          No hay instituciones que coincidan con los filtros seleccionados.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <GenerarReporte
                  tipo="Instituciones"
                  filtros={obtenerFiltrosAplicados()}
                  datos={instituciones}
                  incluirContacto={incluirContacto}
                  incluirDocumentos={incluirDocumentos}
                  incluirHistorial={incluirHistorial}
                />
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documentacion">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-[#2B3E4C]">Reporte de Documentación</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">
                  Genere reportes sobre el estado de la documentación de las instituciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-4 flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-[#2B3E4C]" />
                      <h3 className="text-lg font-semibold text-[#2B3E4C]">Filtros</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="tipo-doc" className="text-[#2B3E4C]">
                          Tipo de Documento
                        </Label>
                        <Select>
                          <SelectTrigger id="tipo-doc" className="border-[#2B3E4C] text-[#2B3E4C]">
                            <SelectValue placeholder="Todos los documentos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos los documentos</SelectItem>
                            <SelectItem value="estatuto">Estatuto</SelectItem>
                            <SelectItem value="acta">Acta de designación de autoridades</SelectItem>
                            <SelectItem value="ppjj">Certificado de Personería Jurídica</SelectItem>
                            <SelectItem value="cuit">Constancia de CUIT</SelectItem>
                            <SelectItem value="balance">Memoria y balance del último ejercicio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado-doc" className="text-[#2B3E4C]">
                          Estado del Documento
                        </Label>
                        <Select>
                          <SelectTrigger id="estado-doc" className="border-[#2B3E4C] text-[#2B3E4C]">
                            <SelectValue placeholder="Todos los estados" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="validado">Validado</SelectItem>
                            <SelectItem value="pendiente">Pendiente de validación</SelectItem>
                            <SelectItem value="rechazado">Rechazado</SelectItem>
                            <SelectItem value="no-cargado">No cargado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institucion" className="text-[#2B3E4C]">
                          Institución
                        </Label>
                        <Select>
                          <SelectTrigger id="institucion" className="border-[#2B3E4C] text-[#2B3E4C]">
                            <SelectValue placeholder="Todas las instituciones" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas las instituciones</SelectItem>
                            <SelectItem value="1">Club Deportivo Neuquén</SelectItem>
                            <SelectItem value="2">Asociación de Básquet de Neuquén</SelectItem>
                            <SelectItem value="3">Federación Neuquina de Fútbol</SelectItem>
                            <SelectItem value="4">Club Atlético Plottier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fecha-carga-desde" className="text-[#2B3E4C]">
                          Fecha de Carga Desde
                        </Label>
                        <Input id="fecha-carga-desde" type="date" className="border-[#2B3E4C] text-[#2B3E4C]" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fecha-carga-hasta" className="text-[#2B3E4C]">
                          Fecha de Carga Hasta
                        </Label>
                        <Input id="fecha-carga-hasta" type="date" className="border-[#2B3E4C] text-[#2B3E4C]" />
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">Aplicar Filtros</Button>
                      <Button
                        variant="outline"
                        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                      >
                        Limpiar Filtros
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-semibold text-[#2B3E4C]">Vista Previa del Reporte</h3>
                    <p className="text-center text-[#2B3E4C]">
                      Aplique filtros para generar una vista previa del reporte de documentación.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <GenerarReporte
                  tipo="Documentación"
                  filtros={{}}
                  datos={[]}
                  incluirContacto={false}
                  incluirDocumentos={true}
                  incluirHistorial={incluirHistorial}
                />
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="estadisticas">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-[#2B3E4C]">Estadísticas</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">
                  Genere reportes estadísticos sobre las instituciones registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-6">
                      <h3 className="mb-4 text-lg font-semibold text-[#2B3E4C]">Instituciones por Tipo</h3>
                      <div className="flex h-64 items-center justify-center">
                        <BarChart className="h-32 w-32 text-[#2B3E4C]/50" />
                      </div>
                      <div className="mt-4 text-center text-sm text-[#2B3E4C]/70">
                        Seleccione "Generar PDF" para ver el gráfico completo
                      </div>
                    </div>

                    <div className="rounded-lg border p-6">
                      <h3 className="mb-4 text-lg font-semibold text-[#2B3E4C]">Instituciones por Localidad</h3>
                      <div className="flex h-64 items-center justify-center">
                        <BarChart className="h-32 w-32 text-[#2B3E4C]/50" />
                      </div>
                      <div className="mt-4 text-center text-sm text-[#2B3E4C]/70">
                        Seleccione "Generar PDF" para ver el gráfico completo
                      </div>
                    </div>

                    <div className="rounded-lg border p-6">
                      <h3 className="mb-4 text-lg font-semibold text-[#2B3E4C]">Estado de Documentación</h3>
                      <div className="flex h-64 items-center justify-center">
                        <BarChart className="h-32 w-32 text-[#2B3E4C]/50" />
                      </div>
                      <div className="mt-4 text-center text-sm text-[#2B3E4C]/70">
                        Seleccione "Generar PDF" para ver el gráfico completo
                      </div>
                    </div>

                    <div className="rounded-lg border p-6">
                      <h3 className="mb-4 text-lg font-semibold text-[#2B3E4C]">Registros por Mes</h3>
                      <div className="flex h-64 items-center justify-center">
                        <BarChart className="h-32 w-32 text-[#2B3E4C]/50" />
                      </div>
                      <div className="mt-4 text-center text-sm text-[#2B3E4C]/70">
                        Seleccione "Generar PDF" para ver el gráfico completo
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <GenerarReporte
                  tipo="Estadísticas"
                  filtros={{}}
                  datos={[]}
                  incluirContacto={false}
                  incluirDocumentos={false}
                  incluirHistorial={incluirHistorial}
                />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
