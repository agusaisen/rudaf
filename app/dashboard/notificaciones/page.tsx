"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, FileText, Newspaper } from "lucide-react"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getNotificaciones } from "@/app/actions/notificaciones-actions"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function NotificacionesPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab") || "todas"

  const [user, setUser] = useState<any>(null)
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [preferencias, setPreferencias] = useState({
    emailDocumentos: true,
    emailNoticias: false,
    emailEventos: false,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener el usuario actual
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // Obtener las notificaciones
        const notificacionesData = await getNotificaciones()
        setNotificaciones(notificacionesData)

        // En una implementación real, aquí se obtendrían las preferencias del usuario
        // Por ahora, usamos valores predeterminados
        setPreferencias({
          emailDocumentos: true,
          emailNoticias: false,
          emailEventos: false,
        })
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar notificaciones según la pestaña seleccionada
  const filtrarNotificaciones = (tipo: string) => {
    if (tipo === "todas") {
      return notificaciones
    }
    return notificaciones.filter((notif) => notif.tipo === tipo)
  }

  // Obtener el ícono según el tipo de notificación
  const getIcono = (tipo: string, leida: boolean) => {
    switch (tipo) {
      case "documento":
        return <FileText className={`h-5 w-5 ${leida ? "text-gray-400" : "text-[#2B3E4C]"}`} />
      case "noticia":
        return <Newspaper className={`h-5 w-5 ${leida ? "text-gray-400" : "text-[#2B3E4C]"}`} />
      case "evento":
        return <Calendar className={`h-5 w-5 ${leida ? "text-gray-400" : "text-[#2B3E4C]"}`} />
      default:
        return <Bell className={`h-5 w-5 ${leida ? "text-gray-400" : "text-[#2B3E4C]"}`} />
    }
  }

  // Obtener el color de la notificación según su prioridad
  const getColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-amber-100 text-amber-800"
      case "baja":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Formatear la fecha relativa
  const formatearFechaRelativa = (fecha: string) => {
    return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-8">
          <p>Cargando notificaciones...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Notificaciones</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              Marcar todas como leídas
            </Button>
          </div>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Centro de Notificaciones</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              Reciba actualizaciones sobre su documentación, noticias y eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={tabParam} className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="todas">
                  Todas
                  <Badge className="ml-2 bg-[#2B3E4C]">{notificaciones.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="documento">
                  Documentación
                  <Badge className="ml-2 bg-[#2B3E4C]">
                    {notificaciones.filter((n) => n.tipo === "documento").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="noticia">
                  Noticias
                  <Badge className="ml-2 bg-[#2B3E4C]">
                    {notificaciones.filter((n) => n.tipo === "noticia").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="evento">
                  Eventos
                  <Badge className="ml-2 bg-[#2B3E4C]">
                    {notificaciones.filter((n) => n.tipo === "evento").length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {["todas", "documento", "noticia", "evento"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-4">
                    {filtrarNotificaciones(tab).length > 0 ? (
                      filtrarNotificaciones(tab).map((notif, index) => (
                        <div
                          key={index}
                          className={`rounded-lg border p-4 transition-colors ${
                            notif.leida ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">{getIcono(notif.tipo, notif.leida)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-medium ${notif.leida ? "text-gray-500" : "text-[#2B3E4C]"}`}>
                                  {notif.titulo}
                                </h3>
                                <Badge className={getColorPrioridad(notif.prioridad)}>
                                  {notif.prioridad === "alta"
                                    ? "Importante"
                                    : notif.prioridad === "media"
                                      ? "Notificación"
                                      : "Informativo"}
                                </Badge>
                              </div>
                              <p className={`mt-1 text-sm ${notif.leida ? "text-gray-400" : "text-[#2B3E4C]/70"}`}>
                                {notif.mensaje}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">{formatearFechaRelativa(notif.fecha)}</span>
                                {notif.accion && (
                                  <Button
                                    variant="link"
                                    className="h-auto p-0 text-sm text-[#2B3E4C]"
                                    onClick={() => (window.location.href = notif.accionUrl || "#")}
                                  >
                                    {notif.accion}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <div className="mb-4 rounded-full bg-gray-100 p-3">
                          {tab === "documento" ? (
                            <FileText className="h-6 w-6 text-gray-400" />
                          ) : tab === "noticia" ? (
                            <Newspaper className="h-6 w-6 text-gray-400" />
                          ) : tab === "evento" ? (
                            <Calendar className="h-6 w-6 text-gray-400" />
                          ) : (
                            <Bell className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-500">No hay notificaciones</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {tab === "todas"
                            ? "No tienes notificaciones en este momento."
                            : `No tienes notificaciones de ${
                                tab === "documento" ? "documentación" : tab === "noticia" ? "noticias" : "eventos"
                              } en este momento.`}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Preferencias de Notificaciones</CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">Configure qué notificaciones desea recibir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-[#2B3E4C]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#2B3E4C]">Notificaciones de Documentación</h3>
                      <Badge className={preferencias.emailDocumentos ? "bg-green-600" : "bg-gray-400"}>
                        {preferencias.emailDocumentos ? "Activado" : "Desactivado"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#2B3E4C]/70">
                      Reciba notificaciones cuando el estado de sus documentos cambie, cuando se validen o cuando se
                      requieran correcciones.
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                        onClick={() => {
                          setPreferencias({ ...preferencias, emailDocumentos: !preferencias.emailDocumentos })
                        }}
                      >
                        {preferencias.emailDocumentos ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Newspaper className="h-5 w-5 text-[#2B3E4C]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#2B3E4C]">Noticias y Novedades</h3>
                      <Badge className={preferencias.emailNoticias ? "bg-green-600" : "bg-gray-400"}>
                        {preferencias.emailNoticias ? "Activado" : "Desactivado"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#2B3E4C]/70">
                      Reciba información sobre novedades del sistema y noticias deportivas relevantes para su
                      institución.
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                        onClick={() => {
                          setPreferencias({ ...preferencias, emailNoticias: !preferencias.emailNoticias })
                        }}
                      >
                        {preferencias.emailNoticias ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-[#2B3E4C]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#2B3E4C]">Eventos y Capacitaciones</h3>
                      <Badge className={preferencias.emailEventos ? "bg-green-600" : "bg-gray-400"}>
                        {preferencias.emailEventos ? "Activado" : "Desactivado"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#2B3E4C]/70">
                      Reciba información sobre eventos deportivos, capacitaciones y talleres organizados por la
                      provincia.
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                        onClick={() => {
                          setPreferencias({ ...preferencias, emailEventos: !preferencias.emailEventos })
                        }}
                      >
                        {preferencias.emailEventos ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
