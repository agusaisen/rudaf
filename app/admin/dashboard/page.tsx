import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getInstituciones } from "@/app/actions/admin-actions"
import DashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, CheckCircle, AlertTriangle, Users } from "lucide-react"

export default async function AdminDashboardPage() {
  // Verificar si el usuario está autenticado y es administrador
  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/login")
  }

  // Obtener lista de instituciones
  const instituciones = await getInstituciones()

  // Calcular estadísticas
  const totalInstituciones = instituciones.length
  const institucionesAlDia = instituciones.filter((inst) => inst.documentacionCompleta).length
  const institucionesAdeudando = totalInstituciones - institucionesAlDia

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Panel de Administración</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#2B3E4C]" />
              <Input
                type="search"
                placeholder="Buscar institución..."
                className="w-[250px] border-[#2B3E4C] pl-8 text-[#2B3E4C]"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2B3E4C]">Total de Instituciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-[#2B3E4C]" />
                <div className="text-3xl font-bold text-[#2B3E4C]">{totalInstituciones}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2B3E4C]">Documentación al Día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="text-3xl font-bold text-green-600">{institucionesAlDia}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2B3E4C]">Adeuda Documentación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="text-3xl font-bold text-red-600">{institucionesAdeudando}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Instituciones Registradas</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              Listado de todas las instituciones deportivas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#2B3E4C]/20">
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Nombre</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Tipo</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Localidad</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Estado</th>
                    <th className="py-3 text-left font-medium text-[#2B3E4C]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {instituciones.length > 0 ? (
                    instituciones.map((institucion, index) => (
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
                            {institucion.documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN"}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <Link href={`/admin/instituciones/${institucion.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                              >
                                Ver detalles
                              </Button>
                            </Link>
                            <Link href={`/admin/instituciones/${institucion.id}/documentacion`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                              >
                                <FileText className="mr-1 h-4 w-4" />
                                Documentos
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-[#2B3E4C]/70">
                        No hay instituciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
