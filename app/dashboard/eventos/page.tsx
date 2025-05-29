import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getEventos } from "@/app/actions/eventos-actions"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react"

export default async function EventosPage() {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener eventos
  const eventos = await getEventos()

  // Agrupar eventos por mes
  const eventosPorMes: Record<string, typeof eventos> = {}

  eventos.forEach((evento) => {
    const fecha = new Date(evento.fechaInicio)
    const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`
    const nombreMes = fecha.toLocaleString("es", { month: "long", year: "numeric" })

    if (!eventosPorMes[mes]) {
      eventosPorMes[mes] = []
    }

    eventosPorMes[mes].push(evento)
    eventosPorMes[mes].nombreMes = nombreMes
  })

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Eventos y Capacitaciones</h1>
        </div>

        {Object.keys(eventosPorMes).length > 0 ? (
          Object.keys(eventosPorMes)
            .sort()
            .map((mes) => (
              <div key={mes} className="space-y-4">
                <h2 className="text-xl font-semibold capitalize text-[#2B3E4C]">{eventosPorMes[mes].nombreMes}</h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {eventosPorMes[mes].map((evento) => (
                    <Card key={evento.id} className="overflow-hidden bg-white">
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={evento.imagen || "/placeholder.svg"}
                          alt={evento.titulo}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <Badge
                          className={`absolute right-2 top-2 ${
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
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-2 text-xl text-[#2B3E4C]">{evento.titulo}</CardTitle>
                        <CardDescription className="line-clamp-2 text-[#2B3E4C]/70">
                          {evento.descripcion}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-2">
                        <div className="flex items-center text-sm text-[#2B3E4C]/80">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {new Date(evento.fechaInicio).toLocaleDateString()}
                            {evento.fechaFin &&
                              evento.fechaFin !== evento.fechaInicio &&
                              ` al ${new Date(evento.fechaFin).toLocaleDateString()}`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-[#2B3E4C]/80">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{evento.horario}</span>
                        </div>
                        <div className="flex items-center text-sm text-[#2B3E4C]/80">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{evento.ubicacion}</span>
                        </div>
                        {evento.cupos && (
                          <div className="flex items-center text-sm text-[#2B3E4C]/80">
                            <Users className="mr-2 h-4 w-4" />
                            <span>
                              Cupos: {evento.cuposDisponibles} disponibles de {evento.cupos}
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Link href={`/dashboard/eventos/${evento.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                          >
                            Ver detalles
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-500">No hay eventos disponibles</h3>
            <p className="mt-1 text-sm text-gray-400">No hay eventos o capacitaciones programados en este momento.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
