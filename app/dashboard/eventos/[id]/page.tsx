"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getEventoById } from "@/app/actions/eventos-actions"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Download, ExternalLink, Mail, Phone } from "lucide-react"

export default async function EventoDetallePage({ params }: { params: { id: string } }) {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener evento por ID
  const evento = await getEventoById(params.id)

  if (!evento) {
    redirect("/dashboard/eventos")
  }

  // Verificar si el evento ya pasó
  const eventoFinalizado = new Date(evento.fechaFin || evento.fechaInicio) < new Date()

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/eventos">
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2B3E4C]">Evento</h1>
        </div>

        <Card className="bg-white">
          <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
            <img src={evento.imagen || "/placeholder.svg"} alt={evento.titulo} className="h-full w-full object-cover" />
            <Badge
              className={`absolute right-4 top-4 ${
                evento.tipo === "Capacitación"
                  ? "bg-blue-500"
                  : evento.tipo === "Torneo"
                    ? "bg-green-500"
                    : evento.tipo === "Conferencia"
                      ? "bg-purple-500"
                      : "bg-[#2B3E4C]"
              }`}
            >
              {evento.tipo}
            </Badge>
          </div>
          <CardHeader>
            <h2 className="text-3xl font-bold text-[#2B3E4C]">{evento.titulo}</h2>
            <p className="text-lg text-[#2B3E4C]/70">{evento.descripcion}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#2B3E4C]">Detalles del evento</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-[#2B3E4C]/80">
                      <Calendar className="mr-3 h-5 w-5" />
                      <div>
                        <strong>Fecha:</strong> {new Date(evento.fechaInicio).toLocaleDateString()}
                        {evento.fechaFin &&
                          evento.fechaFin !== evento.fechaInicio &&
                          ` al ${new Date(evento.fechaFin).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="flex items-center text-[#2B3E4C]/80">
                      <Clock className="mr-3 h-5 w-5" />
                      <div>
                        <strong>Horario:</strong> {evento.horario}
                      </div>
                    </div>
                    <div className="flex items-center text-[#2B3E4C]/80">
                      <MapPin className="mr-3 h-5 w-5" />
                      <div>
                        <strong>Ubicación:</strong> {evento.ubicacion}
                      </div>
                    </div>
                    {evento.cupos && (
                      <div className="flex items-center text-[#2B3E4C]/80">
                        <Users className="mr-3 h-5 w-5" />
                        <div>
                          <strong>Cupos:</strong> {evento.cuposDisponibles} disponibles de {evento.cupos}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {evento.organizador && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-[#2B3E4C]">Organizador</h3>
                    <p className="mb-2 text-[#2B3E4C]/80">{evento.organizador}</p>
                    {evento.contacto && (
                      <div className="space-y-2 text-sm">
                        {evento.contacto.email && (
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-[#2B3E4C]" />
                            <a href={`mailto:${evento.contacto.email}`} className="text-[#2B3E4C] hover:underline">
                              {evento.contacto.email}
                            </a>
                          </div>
                        )}
                        {evento.contacto.telefono && (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-[#2B3E4C]" />
                            <a href={`tel:${evento.contacto.telefono}`} className="text-[#2B3E4C] hover:underline">
                              {evento.contacto.telefono}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#2B3E4C]">Descripción completa</h3>
                  <div className="prose max-w-none text-[#2B3E4C]/80">
                    {evento.contenido.split("\n\n").map((parrafo, index) => (
                      <p key={index}>{parrafo}</p>
                    ))}
                  </div>
                </div>

                {evento.requisitos && evento.requisitos.length > 0 && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-[#2B3E4C]">Requisitos</h3>
                    <ul className="list-inside list-disc space-y-1 text-[#2B3E4C]/80">
                      {evento.requisitos.map((requisito, index) => (
                        <li key={index}>{requisito}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!eventoFinalizado && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-blue-800">Inscripción</h3>
                    <p className="mb-4 text-blue-700">
                      {evento.cuposDisponibles === 0
                        ? "Lo sentimos, no hay cupos disponibles para este evento."
                        : "Complete el formulario para inscribirse en este evento."}
                    </p>
                    {evento.cuposDisponibles > 0 && (
                      <Button className="w-full bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">Inscribirse</Button>
                    )}
                  </div>
                )}

                {eventoFinalizado && (
                  <div className="rounded-lg bg-amber-50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-amber-800">Evento finalizado</h3>
                    <p className="text-amber-700">
                      Este evento ya ha finalizado. Si desea información sobre próximos eventos similares, consulte el
                      calendario de eventos o contacte con el organizador.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {evento.documentos && evento.documentos.length > 0 && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 text-lg font-semibold text-[#2B3E4C]">Documentos</h3>
                <div className="space-y-2">
                  {evento.documentos.map((documento, index) => (
                    <div key={index} className="flex items-center justify-between rounded border p-3">
                      <span className="text-[#2B3E4C]">{documento.nombre}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                        onClick={() => window.open(documento.url, "_blank")}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evento.enlaces && evento.enlaces.length > 0 && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 text-lg font-semibold text-[#2B3E4C]">Enlaces de interés</h3>
                <div className="space-y-2">
                  {evento.enlaces.map((enlace, index) => (
                    <div key={index} className="flex items-center">
                      <ExternalLink className="mr-2 h-4 w-4 text-[#2B3E4C]" />
                      <a
                        href={enlace.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2B3E4C] hover:underline"
                      >
                        {enlace.nombre}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  onClick={() => {
                    navigator
                      .share({
                        title: evento.titulo,
                        text: evento.descripcion,
                        url: window.location.href,
                      })
                      .catch((err) => console.error("Error al compartir:", err))
                  }}
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  Compartir
                </Button>
                {evento.calendario && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                    onClick={() => window.open(evento.calendario, "_blank")}
                  >
                    <Calendar className="mr-1 h-4 w-4" />
                    Añadir al calendario
                  </Button>
                )}
              </div>
              <Link href="/dashboard/eventos">
                <Button
                  variant="outline"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Volver a eventos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {evento.eventosRelacionados && evento.eventosRelacionados.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-bold text-[#2B3E4C]">Eventos relacionados</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {evento.eventosRelacionados.map((relacionado) => (
                <Card key={relacionado.id} className="overflow-hidden bg-white">
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={relacionado.imagen || "/placeholder.svg"}
                      alt={relacionado.titulo}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge
                      className={`absolute right-2 top-2 ${
                        relacionado.tipo === "Capacitación"
                          ? "bg-blue-500"
                          : relacionado.tipo === "Torneo"
                            ? "bg-green-500"
                            : relacionado.tipo === "Conferencia"
                              ? "bg-purple-500"
                              : "bg-[#2B3E4C]"
                      }`}
                    >
                      {relacionado.tipo}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <h4 className="line-clamp-2 text-lg font-semibold text-[#2B3E4C]">{relacionado.titulo}</h4>
                    <div className="flex items-center text-sm text-[#2B3E4C]/80">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{new Date(relacionado.fecha).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/eventos/${relacionado.id}`}>
                      <Button variant="link" className="p-0 text-[#2B3E4C]">
                        Ver detalles
                        <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
