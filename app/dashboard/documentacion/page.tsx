import { redirect } from "next/navigation"
import Link from "next/link"
import { getInstitucion, getDocumentos } from "@/app/actions/institucion-actions"
import { getCurrentUser } from "@/app/actions/auth-actions"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Eye, AlertTriangle, CheckCircle, FileX } from "lucide-react"

export default async function DocumentacionPage() {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  if (!user || user.isAdmin) {
    redirect("/login")
  }

  // Obtener datos de la institución
  const institucion = await getInstitucion(user.institucionId)

  if (!institucion) {
    redirect("/login")
  }

  // Obtener documentos de la institución
  const documentos = await getDocumentos(user.institucionId)

  // Calcular el estado de la documentación
  const documentacionCompleta = documentos.every((doc) => doc.validado)
  const estadoDocumentacion = documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN"
  const colorEstado = documentacionCompleta ? "text-green-600" : "text-red-600"

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Documentación</h1>
          <div className="flex items-center space-x-2">
            <div className={`font-semibold ${colorEstado}`}>{estadoDocumentacion}</div>
            {documentacionCompleta ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Estado de Documentación</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              Revise el estado de los documentos requeridos para su institución
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-[#2B3E4C]">
                  <span className="font-medium">Importante:</span> Todos los documentos deben estar en formato PDF y ser
                  legibles. El tamaño máximo por archivo es de 10MB.
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#2B3E4C]/20">
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Documento</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Estado</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Fecha de carga</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Observaciones</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.length > 0 ? (
                    documentos.map((doc, index) => {
                      // Determinar el estado y el color del badge
                      let estadoTexto = "Pendiente de carga"
                      let badgeClasses = "bg-red-100 text-red-800"
                      let iconoEstado = <FileX className="mr-1 h-4 w-4" />

                      if (doc.validado) {
                        estadoTexto = "Validado"
                        badgeClasses = "bg-green-100 text-green-800"
                        iconoEstado = <CheckCircle className="mr-1 h-4 w-4" />
                      } else if (doc.archivo) {
                        estadoTexto = "Pendiente de validación"
                        badgeClasses = "bg-yellow-100 text-yellow-800"
                        iconoEstado = <AlertTriangle className="mr-1 h-4 w-4" />
                      }

                      // Determinar si hay observaciones (simulado)
                      const observaciones = doc.archivo && !doc.validado ? "Pendiente de revisión" : "-"

                      return (
                        <tr key={index} className="border-b border-[#2B3E4C]/10">
                          <td className="py-3 text-[#2B3E4C]">{doc.nombre}</td>
                          <td className="py-3">
                            <Badge className={badgeClasses}>
                              <span className="flex items-center">
                                {iconoEstado}
                                {estadoTexto}
                              </span>
                            </Badge>
                          </td>
                          <td className="py-3 text-[#2B3E4C]">
                            {doc.fechaCarga ? new Date(doc.fechaCarga).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 text-[#2B3E4C]">{observaciones}</td>
                          <td className="py-3">
                            {doc.archivo ? (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                                >
                                  <Eye className="mr-1 h-4 w-4" />
                                  Ver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                                >
                                  <Download className="mr-1 h-4 w-4" />
                                  Descargar
                                </Button>
                                {!doc.validado && (
                                  <Link href={`/dashboard/cargar-documentacion?id=${doc.id}`}>
                                    <Button size="sm" className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                                      Reemplazar
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <Link href={`/dashboard/cargar-documentacion?id=${doc.id}`}>
                                <Button size="sm" className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                                  <Upload className="mr-1 h-4 w-4" />
                                  Cargar
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-[#2B3E4C]/70">
                        No hay documentos configurados para su institución.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Link href="/dashboard/cargar-documentacion">
                <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                  <Upload className="mr-2 h-4 w-4" />
                  Cargar nuevo documento
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Información Importante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-800">Plazos de validación</h3>
              <p className="text-sm text-blue-800">
                La validación de documentos puede demorar hasta 5 días hábiles. Una vez validados, recibirá una
                notificación por correo electrónico.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-4">
              <h3 className="mb-2 font-semibold text-amber-800">Documentos rechazados</h3>
              <p className="text-sm text-amber-800">
                Si un documento es rechazado, deberá cargarlo nuevamente corrigiendo las observaciones indicadas por el
                equipo técnico.
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-800">Documentación completa</h3>
              <p className="text-sm text-green-800">
                Una vez que todos los documentos estén validados, su institución quedará registrada oficialmente en el
                sistema provincial.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
