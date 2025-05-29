import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getInstitucion, getDocumentos } from "@/app/actions/institucion-actions"
import DashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle, X, ArrowLeft, Upload } from "lucide-react"

export default async function DocumentacionInstitucionPage({ params }: { params: { id: string } }) {
  // Verificar si el usuario está autenticado y es administrador
  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/login")
  }

  const institucionId = params.id

  // Obtener datos de la institución
  const institucion = await getInstitucion(institucionId)

  if (!institucion) {
    redirect("/admin/dashboard")
  }

  // Obtener documentos de la institución
  const documentos = await getDocumentos(institucionId)

  // Calcular el estado de la documentación
  const documentacionCompleta = documentos.every((doc) => doc.validado)
  const estadoDocumentacion = documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN"
  const colorEstado = documentacionCompleta ? "text-green-600" : "text-red-600"

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center space-x-2">
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2B3E4C]">Documentación de {institucion.nombre}</h1>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#2B3E4C]">Información de la Institución</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">Datos registrados de la institución</CardDescription>
              </div>
              <Badge className={documentacionCompleta ? "bg-green-600" : "bg-red-600"}>{estadoDocumentacion}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">Tipo</div>
                <div className="text-[#2B3E4C]">{institucion.tipo}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">Presidente</div>
                <div className="text-[#2B3E4C]">{institucion.presidente}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">PPJJ</div>
                <div className="text-[#2B3E4C]">{institucion.ppjj}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">Localidad</div>
                <div className="text-[#2B3E4C]">{institucion.localidad}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">Dirección</div>
                <div className="text-[#2B3E4C]">{institucion.direccion}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">Teléfono</div>
                <div className="text-[#2B3E4C]">{institucion.telefono}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#2B3E4C]/70">Email</div>
                <div className="text-[#2B3E4C]">{institucion.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Documentación</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              Revise y valide los documentos presentados por la institución
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#2B3E4C]/20">
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Documento</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Estado</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Fecha de carga</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.length > 0 ? (
                    documentos.map((doc, index) => (
                      <tr key={index} className="border-b border-[#2B3E4C]/10">
                        <td className="py-3 text-[#2B3E4C]">{doc.nombre}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              doc.validado
                                ? "bg-green-100 text-green-800"
                                : doc.archivo
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {doc.validado ? "Validado" : doc.archivo ? "Pendiente de validación" : "Pendiente de carga"}
                          </span>
                        </td>
                        <td className="py-3 text-[#2B3E4C]">
                          {doc.fechaCarga ? new Date(doc.fechaCarga).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3">
                          {doc.archivo ? (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Descargar
                              </Button>

                              {!doc.validado && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-green-600 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                                  >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Validar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-600 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                  >
                                    <X className="mr-1 h-4 w-4" />
                                    Rechazar
                                  </Button>
                                </>
                              )}

                              <Link
                                href={`/admin/instituciones/${institucionId}/cargar-documento?id=${doc.id}&reemplazar=true`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                                >
                                  <Upload className="mr-1 h-4 w-4" />
                                  Reemplazar
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <Link href={`/admin/instituciones/${institucionId}/cargar-documento?id=${doc.id}`}>
                              <Button size="sm" className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                                <Upload className="mr-1 h-4 w-4" />
                                Cargar documento
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-[#2B3E4C]/70">
                        No hay documentos configurados para esta institución.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              Volver
            </Button>
          </Link>
          <Link href={`/admin/instituciones/${institucionId}`}>
            <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">Ver detalles de la institución</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
