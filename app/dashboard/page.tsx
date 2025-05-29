import { redirect } from "next/navigation"
import { getInstitucion, getDocumentos } from "@/app/actions/institucion-actions"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getNotificaciones } from "@/app/actions/notificaciones-actions"
import { getNoticias } from "@/app/actions/noticias-actions"
import { getEventos } from "@/app/actions/eventos-actions"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, AlertTriangle, CheckCircle, Bell, Newspaper, Calendar } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener datos de la institución
  const institucion = await getInstitucion(user.institucionId)

  if (!institucion) {
    redirect("/login")
  }

  // Obtener documentos de la institución
  const documentos = await getDocumentos(user.institucionId)

  // Obtener notificaciones recientes
  const notificaciones = await getNotificaciones()
  const notificacionesRecientes = notificaciones.slice(0, 3)
  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length

  // Obtener noticias recientes
  const noticias = await getNoticias()
  const noticiasRecientes = noticias.slice(0, 2)

  // Obtener eventos próximos
  const eventos = await getEventos()
  const eventosProximos = eventos
    .filter((e) => new Date(e.fechaInicio) > new Date())
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
    .slice(0, 2)

  // Calcular el estado de la documentación
  const documentacionCompleta = documentos.every((doc) => doc.validado)
  const estadoDocumentacion = documentacionCompleta ? "DOCUMENTACIÓN AL DÍA" : "ADEUDA DOCUMENTACIÓN"
  const colorEstado = documentacionCompleta ? "text-green-600" : "text-red-600"
  const iconoEstado = documentacionCompleta ? (
    <CheckCircle className="h-8 w-8 text-green-600" />
  ) : (
    <AlertTriangle className="h-8 w-8 text-red-600" />
  )

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Panel de Control</h1>
          <div className="flex items-center space-x-2">
            <div className={`font-semibold ${colorEstado}`}>{estadoDocumentacion}</div>
            {iconoEstado}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#2B3E4C]">Información de la Institución</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">Datos registrados de su institución</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium text-[#2B3E4C]">Nombre:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.nombre}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">Tipo:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.tipo}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">Presidente:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.presidente}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">PPJJ:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.ppjj}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">Localidad:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.localidad}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">Dirección:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.direccion}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">Teléfono:</div>
                <div className="text-sm text-[#2B3E4C]">{institucion.telefono}</div>

                <div className="text-sm font-medium text-[#2B3E4C]">Nombre:</div>
                <div className="text-sm text-[#2B3E4C] break-all">{institucion.email}</div>
              </div>

              <div className="pt-4">
                <Link href="/dashboard/editar-perfil">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  >
                    Editar información
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#2B3E4C]">Estado de Documentación</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">Verifique el estado de sus documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`rounded-lg p-3 ${documentacionCompleta ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center space-x-2">
                  {iconoEstado}
                  <span className={`font-medium ${colorEstado}`}>{estadoDocumentacion}</span>
                </div>
                <p className="mt-2 text-sm text-[#2B3E4C]">
                  {documentacionCompleta
                    ? "Toda su documentación ha sido validada correctamente."
                    : "Tiene documentación pendiente de carga o validación."}
                </p>
              </div>

              <div className="pt-2">
                <Link href="/dashboard/documentacion">
                  <Button className="w-full bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                    <FileText className="mr-2 h-4 w-4" />
                    Ver documentación
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#2B3E4C]">Cargar Documentación</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">Suba los documentos requeridos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-[#2B3E4C]">
                Mantenga su documentación al día para evitar inconvenientes con su registro.
              </p>
              <Link href="/dashboard/cargar-documentacion">
                <Button className="w-full bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                  <Upload className="mr-2 h-4 w-4" />
                  Cargar documentos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[#2B3E4C]">Notificaciones</CardTitle>
              {notificacionesNoLeidas > 0 && (
                <div className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {notificacionesNoLeidas} nueva{notificacionesNoLeidas !== 1 ? "s" : ""}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {notificacionesRecientes.length > 0 ? (
                <div className="space-y-3">
                  {notificacionesRecientes.map((notif, index) => (
                    <div key={index} className={`rounded-lg border p-3 ${notif.leida ? "bg-gray-50" : "bg-white"}`}>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 pt-0.5">
                          {notif.tipo === "documento" ? (
                            <FileText className="h-5 w-5 text-[#2B3E4C]" />
                          ) : notif.tipo === "noticia" ? (
                            <Newspaper className="h-5 w-5 text-[#2B3E4C]" />
                          ) : (
                            <Calendar className="h-5 w-5 text-[#2B3E4C]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${notif.leida ? "text-gray-500" : "text-[#2B3E4C]"}`}>
                            {notif.titulo}
                          </h4>
                          <p className={`mt-1 text-xs ${notif.leida ? "text-gray-400" : "text-[#2B3E4C]/70"}`}>
                            {notif.mensaje.length > 60 ? `${notif.mensaje.substring(0, 60)}...` : notif.mensaje}
                          </p>
                          {notif.accion && (
                            <Link href={notif.accionUrl || "#"}>
                              <Button variant="link" className="h-auto p-0 text-xs text-[#2B3E4C]">
                                {notif.accion}
                              </Button>
                            </Link>
                          )}
                        </div>
                        {!notif.leida && <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>}
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <Link href="/dashboard/notificaciones">
                      <Button variant="link" className="h-auto p-0 text-sm text-[#2B3E4C]">
                        Ver todas las notificaciones
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Bell className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">No hay notificaciones</p>
                  <Link href="/dashboard/notificaciones">
                    <Button variant="link" className="mt-2 h-auto p-0 text-sm text-[#2B3E4C]">
                      Ver centro de notificaciones
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2B3E4C]">Noticias Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {noticiasRecientes.length > 0 ? (
                <div className="space-y-3">
                  {noticiasRecientes.map((noticia, index) => (
                    <div key={index} className="rounded-lg border p-3">
                      <h4 className="text-sm font-medium text-[#2B3E4C]">{noticia.titulo}</h4>
                      <p className="mt-1 text-xs text-[#2B3E4C]/70">
                        {noticia.resumen.length > 80 ? `${noticia.resumen.substring(0, 80)}...` : noticia.resumen}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{new Date(noticia.fecha).toLocaleDateString()}</span>
                        <Link href={`/dashboard/noticias/${noticia.id}`}>
                          <Button variant="link" className="h-auto p-0 text-xs text-[#2B3E4C]">
                            Leer más
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <Link href="/dashboard/noticias">
                      <Button variant="link" className="h-auto p-0 text-sm text-[#2B3E4C]">
                        Ver todas las noticias
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Newspaper className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">No hay noticias recientes</p>
                  <Link href="/dashboard/noticias">
                    <Button variant="link" className="mt-2 h-auto p-0 text-sm text-[#2B3E4C]">
                      Ver todas las noticias
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2B3E4C]">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {eventosProximos.length > 0 ? (
                <div className="space-y-3">
                  {eventosProximos.map((evento, index) => (
                    <div key={index} className="rounded-lg border p-3">
                      <h4 className="text-sm font-medium text-[#2B3E4C]">{evento.titulo}</h4>
                      <div className="mt-2 flex items-center text-xs text-[#2B3E4C]/80">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{new Date(evento.fechaInicio).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-[#2B3E4C]/80">{evento.tipo}</span>
                        <Link href={`/dashboard/eventos/${evento.id}`}>
                          <Button variant="link" className="h-auto p-0 text-xs text-[#2B3E4C]">
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <Link href="/dashboard/eventos">
                      <Button variant="link" className="h-auto p-0 text-sm text-[#2B3E4C]">
                        Ver todos los eventos
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Calendar className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">No hay eventos próximos</p>
                  <Link href="/dashboard/eventos">
                    <Button variant="link" className="mt-2 h-auto p-0 text-sm text-[#2B3E4C]">
                      Ver todos los eventos
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Documentación Requerida</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              Estado de los documentos necesarios para su institución
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#2B3E4C]/20">
                    <th className="py-2 text-left font-medium text-[#2B3E4C]">Documento</th>
                    <th className="py-2 text-left font-medium text-[#2B3E4C]">Estado</th>
                    <th className="py-2 text-left font-medium text-[#2B3E4C]">Fecha de carga</th>
                    <th className="py-2 text-left font-medium text-[#2B3E4C]">Acciones</th>
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
                            {doc.validado ? "Validado" : doc.archivo ? "Pendiente de validación" : "No cargado"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">
                          {doc.archivo ? new Date(doc.fechaCarga).toLocaleDateString() : "No cargado"}
                        </td>
                        <td className="py-3">
                          {doc.archivo ? (
                            <Button variant="outline" size="sm" disabled={doc.validado}>
                              Ver documento
                            </Button>
                          ) : (
                            <Link href="/dashboard/cargar-documentacion">
                              <Button variant="outline" size="sm">
                                Cargar
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No hay documentos requeridos
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
