"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminDashboardLayout from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, ImageIcon, Loader2 } from "lucide-react"
import { crearNoticia } from "@/app/actions/noticias-actions"

export default function CrearNoticiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    resumen: "",
    contenido: "",
    categoria: "",
    destacada: false,
    fuente: "",
    imagen: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, destacada: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // En una implementación real, aquí se enviaría la imagen al servidor
      // y se obtendría la URL para guardarla en la base de datos
      const imagenUrl = formData.imagen || "/news-collage.png"

      const result = await crearNoticia({
        ...formData,
        imagen: imagenUrl,
        fecha: new Date().toISOString(),
      })

      if (result.success) {
        router.push("/admin/noticias")
      } else {
        alert("Error al crear la noticia: " + result.error)
      }
    } catch (error) {
      console.error("Error al crear la noticia:", error)
      alert("Error al crear la noticia. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center space-x-2">
          <Link href="/admin/noticias">
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Crear Nueva Noticia</h1>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Información de la Noticia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el título de la noticia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Normativa, Subsidios, Capacitación"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumen">Resumen</Label>
                <Textarea
                  id="resumen"
                  name="resumen"
                  value={formData.resumen}
                  onChange={handleChange}
                  required
                  placeholder="Breve resumen de la noticia (máximo 200 caracteres)"
                  maxLength={200}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea
                  id="contenido"
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                  placeholder="Contenido completo de la noticia"
                  rows={10}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fuente">Fuente (opcional)</Label>
                  <Input
                    id="fuente"
                    name="fuente"
                    value={formData.fuente}
                    onChange={handleChange}
                    placeholder="Ej: Ministerio de Deportes de Neuquén"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagen">URL de la imagen (opcional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="imagen"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleChange}
                      placeholder="URL de la imagen"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Subir
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="destacada" checked={formData.destacada} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="destacada">Marcar como noticia destacada</Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin/noticias">
                  <Button variant="outline" className="border-[#2B3E4C] text-[#2B3E4C]">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Noticia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
