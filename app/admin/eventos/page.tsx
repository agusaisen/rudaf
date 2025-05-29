import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getEventos } from "@/app/actions/eventos-actions"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle, MoreHorizontal, Edit, Trash, Eye, Users } from "lucide-react"

export default async function AdminEventosPage() {
  // Verificar si el usuario está autenticado y es administrador
  const user = await getCurrentUser()

  if (!user || user.rol !== "admin") {
    redirect("/login")
  }

  // Obtener eventos
  const eventos = await getEventos()

  return (
    <AdminDashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Administración de Eventos</h1>
          <Link href="/admin/eventos/crear">
            <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </Link>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Listado de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Cupos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventos.map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell className="font-medium">{evento.titulo}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          evento.tipo === "Capacitación"
                            ? "bg-blue-500"
                            : evento.tipo === "Torneo"
                              ? "bg-green-500"
                              : evento.tipo === "Conferencia"
                                ? "bg-purple-500"
                                : "bg-[#2B3E4C]"
                        }
                      >
                        {evento.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(evento.fechaInicio).toLocaleDateString()}
                      {evento.fechaFin &&
                        evento.fechaFin !== evento.fechaInicio &&
                        ` al ${new Date(evento.fechaFin).toLocaleDateString()}`}
                    </TableCell>
                    <TableCell>{evento.ubicacion}</TableCell>
                    <TableCell>
                      {evento.cupos ? (
                        <span>
                          {evento.cuposDisponibles} / {evento.cupos}
                        </span>
                      ) : (
                        <span className="text-gray-500">Sin límite</span>
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
                            <Link href={`/admin/eventos/${evento.id}`} className="flex w-full items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/eventos/${evento.id}/editar`} className="flex w-full items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/admin/eventos/${evento.id}/inscripciones`}
                              className="flex w-full items-center"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              <span>Inscripciones</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Link href={`/admin/eventos/${evento.id}/eliminar`} className="flex w-full items-center">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {eventos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay eventos disponibles.
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
