"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getNoticiaById } from "@/app/actions/noticias-actions"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag, Share2, Printer } from "lucide-react"

export default async function NoticiaDetallePage({ params }: { params: { id: string } }) {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener noticia por ID
  const noticia = await getNoticiaById(params.id)

  if (!noticia) {
    redirect("/dashboard/noticias")
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/noticias">
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2B3E4C]">Noticia</h1>
        </div>

        <Card className="bg-white">
          <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
            <img
              src={noticia.imagen || "/placeholder.svg"}
              alt={noticia.titulo}
              className="h-full w-full object-cover"
            />
            {noticia.destacada && <Badge className="absolute right-4 top-4 bg-amber-500">Destacada</Badge>}
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="border-[#2B3E4C] text-[#2B3E4C]">
                <Tag className="mr-1 h-3 w-3" />
                {noticia.categoria}
              </Badge>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-[#2B3E4C]">{noticia.titulo}</h2>
            <p className="text-lg text-[#2B3E4C]/70">{noticia.resumen}</p>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-[#2B3E4C]/80">
              {noticia.contenido.split("\n\n").map((parrafo, index) => (
                <p key={index}>{parrafo}</p>
              ))}
            </div>

            {noticia.fuente && (
              <div className="mt-6 text-sm text-gray-500">
                <strong>Fuente:</strong> {noticia.fuente}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-1 h-4 w-4" />
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  onClick={() => {
                    navigator
                      .share({
                        title: noticia.titulo,
                        text: noticia.resumen,
                        url: window.location.href,
                      })
                      .catch((err) => console.error("Error al compartir:", err))
                  }}
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  Compartir
                </Button>
              </div>
              <Link href="/dashboard/noticias">
                <Button
                  variant="outline"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Volver a noticias
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {noticia.noticiasRelacionadas && noticia.noticiasRelacionadas.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-bold text-[#2B3E4C]">Noticias relacionadas</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {noticia.noticiasRelacionadas.map((relacionada) => (
                <Card key={relacionada.id} className="overflow-hidden bg-white">
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={relacionada.imagen || "/placeholder.svg"}
                      alt={relacionada.titulo}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <h4 className="line-clamp-2 text-lg font-semibold text-[#2B3E4C]">{relacionada.titulo}</h4>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/noticias/${relacionada.id}`}>
                      <Button variant="link" className="p-0 text-[#2B3E4C]">
                        Leer más
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
