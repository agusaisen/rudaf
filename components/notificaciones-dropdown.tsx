"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, FileText, Newspaper, Calendar } from "lucide-react"
import { getNotificaciones } from "@/app/actions/notificaciones-actions"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function NotificacionesDropdown() {
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchNotificaciones() {
      try {
        const data = await getNotificaciones()
        setNotificaciones(data)
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotificaciones()
  }, [])

  // Filtrar notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida)

  // Obtener el ícono según el tipo de notificación
  const getIcono = (tipo: string) => {
    switch (tipo) {
      case "documento":
        return <FileText className="h-4 w-4 text-[#2B3E4C]" />
      case "noticia":
        return <Newspaper className="h-4 w-4 text-[#2B3E4C]" />
      case "evento":
        return <Calendar className="h-4 w-4 text-[#2B3E4C]" />
      default:
        return <Bell className="h-4 w-4 text-[#2B3E4C]" />
    }
  }

  // Formatear la fecha relativa
  const formatearFechaRelativa = (fecha: string) => {
    return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-[#3a4f61]">
          <Bell className="h-5 w-5" />
          {notificacionesNoLeidas.length > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white">
              {notificacionesNoLeidas.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {notificacionesNoLeidas.length > 0 && (
            <Badge className="bg-red-500">
              {notificacionesNoLeidas.length} nueva{notificacionesNoLeidas.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Cargando notificaciones...</div>
        ) : notificaciones.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {notificaciones.slice(0, 5).map((notif, index) => (
              <DropdownMenuItem key={index} className="cursor-pointer p-0">
                <Link
                  href={notif.accionUrl || "/dashboard/notificaciones"}
                  className="flex w-full items-start gap-2 p-3 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex-shrink-0 pt-1">{getIcono(notif.tipo)}</div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm font-medium ${notif.leida ? "text-gray-600" : "text-[#2B3E4C]"}`}>
                      {notif.titulo}
                    </p>
                    <p className={`text-xs ${notif.leida ? "text-gray-400" : "text-[#2B3E4C]/70"}`}>{notif.mensaje}</p>
                    <p className="text-xs text-gray-400">{formatearFechaRelativa(notif.fecha)}</p>
                  </div>
                  {!notif.leida && <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">No hay notificaciones</div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center p-2 text-center">
          <Link
            href="/dashboard/notificaciones"
            className="w-full text-sm font-medium text-[#2B3E4C]"
            onClick={() => setOpen(false)}
          >
            Ver todas las notificaciones
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
