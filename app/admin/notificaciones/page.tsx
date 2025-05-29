import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getNotificaciones } from "@/app/actions/notificaciones-actions"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle, MoreHorizontal, Edit, Trash, Eye, Send } from "lucide-react"

export default async function AdminNotificacionesPage() {
  // Verificar si el usuario está autenticado y es administrador
  const user = await getCurrentUser()

  if (!user || user.rol !== "admin") {
    redirect("/login")
  }

  // Obtener notificaciones
  const notificaciones = await getNotificaciones()

  return (
    <AdminDashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Administración de Notificaciones</h1>
          <Link href="/admin/notificaciones/crear">
            <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Notificación
            </Button>
          </Link>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Listado de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificaciones.map((notificacion) => (
                  <TableRow key={notificacion.id}>
                    <TableCell className="font-medium">{notificacion.titulo}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          notificacion.tipo === "documento"
                            ? "border-blue-500 text-blue-500"
                            : notificacion.tipo === "noticia"
                              ? "border-green-500 text-green-500"
                              : "border-amber-500 text-amber-500"
                        }
                      >
                        {notificacion.tipo === "documento"
                          ? "Documentación"
                          : notificacion.tipo === "noticia"
                            ? "Noticia"
                            : "Evento"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(notificacion.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          notificacion.prioridad === "alta"
                            ? "bg-red-100 text-red-800"
                            : notificacion.prioridad === "media"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {notificacion.prioridad === "alta"
                          ? "Alta"
                          : notificacion.prioridad === "media"
                            ? "Media"
                            : "Baja"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notificacion.leida ? (
                        <Badge variant="outline" className="border-gray-500 text-gray-500">
                          Leída
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          No leída
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                              href={`/admin/notificaciones/${notificacion.id}`}
                              className="flex w-full items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/admin/notificaciones/${notificacion.id}/editar`}
                              className="flex w-full items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/admin/notificaciones/${notificacion.id}/reenviar`}
                              className="flex w-full items-center"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              <span>Reenviar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Link
                              href={`/admin/notificaciones/${notificacion.id}/eliminar`}
                              className="flex w-full items-center"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {notificaciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay notificaciones disponibles.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
