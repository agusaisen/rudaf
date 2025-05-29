import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getNoticias } from "@/app/actions/noticias-actions"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle, MoreHorizontal, Edit, Trash, Eye, Star } from "lucide-react"

export default async function AdminNoticiasPage() {
  // Verificar si el usuario está autenticado y es administrador
  const user = await getCurrentUser()

  if (!user || user.rol !== "admin") {
    redirect("/login")
  }

  // Obtener noticias
  const noticias = await getNoticias()

  return (
    <AdminDashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Administración de Noticias</h1>
          <Link href="/admin/noticias/crear">
            <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Noticia
            </Button>
          </Link>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Listado de Noticias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Destacada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noticias.map((noticia) => (
                  <TableRow key={noticia.id}>
                    <TableCell className="font-medium">{noticia.titulo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#2B3E4C] text-[#2B3E4C]">
                        {noticia.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(noticia.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {noticia.destacada ? (
                        <Badge className="bg-amber-500">Destacada</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          No
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
                            <Link href={`/admin/noticias/${noticia.id}`} className="flex w-full items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/noticias/${noticia.id}/editar`} className="flex w-full items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/noticias/${noticia.id}/destacar`} className="flex w-full items-center">
                              <Star className="mr-2 h-4 w-4" />
                              <span>{noticia.destacada ? "Quitar destacado" : "Destacar"}</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Link href={`/admin/noticias/${noticia.id}/eliminar`} className="flex w-full items-center">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {noticias.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay noticias disponibles.
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
