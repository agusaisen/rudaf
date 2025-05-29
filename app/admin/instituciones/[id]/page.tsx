import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getInstitucion } from "@/app/actions/institucion-actions"
import DashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Mail, Phone, MapPin } from "lucide-react"

export default async function DetalleInstitucionPage({ params }: { params: { id: string } }) {
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
          <h1 className="text-2xl font-bold text-[#2B3E4C]">Detalles de Institución</h1>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-[#2B3E4C]">{institucion.nombre}</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">{institucion.tipo}</CardDescription>
              </div>
              <Badge className={institucion.documentacionCompleta ? "bg-green-600" : "bg-red-600"}>
                {institucion.documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2B3E4C]">Información General</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-32 font-medium text-[#2B3E4C]">Presidente:</div>
                    <div className="text-[#2B3E4C]">{institucion.presidente}</div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-32 font-medium text-[#2B3E4C]">PPJJ:</div>
                    <div className="text-[#2B3E4C]">{institucion.ppjj}</div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-32 font-medium text-[#2B3E4C]">Fecha de registro:</div>
                    <div className="text-[#2B3E4C]">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2B3E4C]">Contacto</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 flex-shrink-0 text-[#2B3E4C]" />
                    <div className="break-all text-[#2B3E4C]">{institucion.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-[#2B3E4C]" />
                    <div className="text-[#2B3E4C]">{institucion.telefono}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-[#2B3E4C]" />
                    <div className="text-[#2B3E4C]">
                      {institucion.direccion}, {institucion.localidad}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-lg font-semibold text-[#2B3E4C]">Notas Administrativas</h3>
              <p className="text-[#2B3E4C]">
                No hay notas administrativas para esta institución. Haga clic en "Agregar nota" para registrar
                observaciones importantes.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                >
                  Agregar nota
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/admin/instituciones/${institucionId}/documentacion`}>
                <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver documentación
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Historial de Actividad</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              Registro de actividades y cambios realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  fecha: "15/05/2024",
                  accion: "Registro de institución",
                  usuario: "Sistema",
                  detalles: "Institución registrada en el sistema",
                },
                {
                  fecha: "16/05/2024",
                  accion: "Carga de documento",
                  usuario: "info@clubdeportivoneuquen.com",
                  detalles: "Se cargó el documento: Estatuto",
                },
                {
                  fecha: "17/05/2024",
                  accion: "Validación de documento",
                  usuario: "admin@neuquen.gob.ar",
                  detalles: "Se validó el documento: Estatuto",
                },
                {
                  fecha: "18/05/2024",
                  accion: "Carga de documento",
                  usuario: "info@clubdeportivoneuquen.com",
                  detalles: "Se cargó el documento: Acta de designación de autoridades",
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-[#2B3E4C]">{item.accion}</div>
                    <div className="text-sm text-[#2B3E4C]/70">{item.fecha}</div>
                  </div>
                  <div className="mt-1 text-sm text-[#2B3E4C]">{item.detalles}</div>
                  <div className="mt-1 text-xs text-[#2B3E4C]/70">Usuario: {item.usuario}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
