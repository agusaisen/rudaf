import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getNoticias } from "@/app/actions/noticias-actions"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, Calendar, ArrowRight, Tag } from "lucide-react"

export default async function NoticiasPage() {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener noticias
  const noticias = await getNoticias()

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Noticias y Novedades</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <Card key={noticia.id} className="overflow-hidden bg-white">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={noticia.imagen || "/placeholder.svg"}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {noticia.destacada && <Badge className="absolute right-2 top-2 bg-amber-500">Destacada</Badge>}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline" className="border-[#2B3E4C] text-[#2B3E4C]">
                    <Tag className="mr-1 h-3 w-3" />
                    {noticia.categoria}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-xl text-[#2B3E4C]">{noticia.titulo}</CardTitle>
                <CardDescription className="line-clamp-2 text-[#2B3E4C]/70">{noticia.resumen}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-3 text-sm text-[#2B3E4C]/80">{noticia.contenido}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/noticias/${noticia.id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  >
                    Leer más
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {noticias.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Newspaper className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-500">No hay noticias disponibles</h3>
            <p className="mt-1 text-sm text-gray-400">No hay noticias o novedades disponibles en este momento.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
