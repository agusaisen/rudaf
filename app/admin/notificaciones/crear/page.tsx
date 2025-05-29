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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, Loader2, Users } from "lucide-react"
import { crearNotificacion } from "@/app/actions/notificaciones-actions"

export default function CrearNotificacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    mensaje: "",
    tipo: "documento",
    prioridad: "media",
    destinatarios: "todos",
    accion: "",
    accionUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await crearNotificacion({
        ...formData,
        fecha: new Date().toISOString(),
        leida: false,
      })

      if (result.success) {
        router.push("/admin/notificaciones")
      } else {
        alert("Error al crear la notificación: " + result.error)
      }
    } catch (error) {
      console.error("Error al crear la notificación:", error)
      alert("Error al crear la notificación. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center space-x-2">
          <Link href="/admin/notificaciones">
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Crear Nueva Notificación</h1>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Información de la Notificación</CardTitle>
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
                    placeholder="Ingrese el título de la notificación"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Notificación</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de notificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documento">Documentación</SelectItem>
                      <SelectItem value="noticia">Noticia</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  placeholder="Contenido de la notificación"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <RadioGroup
                    value={formData.prioridad}
                    onValueChange={(value) => handleSelectChange("prioridad", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alta" id="alta" />
                      <Label htmlFor="alta" className="text-red-600">
                        Alta
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="media" />
                      <Label htmlFor="media" className="text-amber-600">
                        Media
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="baja" id="baja" />
                      <Label htmlFor="baja" className="text-blue-600">
                        Baja
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Destinatarios</Label>
                  <RadioGroup
                    value={formData.destinatarios}
                    onValueChange={(value) => handleSelectChange("destinatarios", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="todos" id="todos" />
                      <Label htmlFor="todos">Todos los usuarios</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seleccionados" id="seleccionados" />
                      <Label htmlFor="seleccionados">Usuarios seleccionados</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {formData.destinatarios === "seleccionados" && (
                <div className="space-y-2">
                  <Label>Seleccionar Destinatarios</Label>
                  <div className="flex space-x-2">
                    <Input placeholder="Buscar usuarios..." />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Seleccionar
                    </Button>
                  </div>
                  <div className="mt-2 rounded-md border p-4">
                    <p className="text-sm text-gray-500">No hay destinatarios seleccionados</p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accion">Texto de Acción (opcional)</Label>
                  <Input
                    id="accion"
                    name="accion"
                    value={formData.accion}
                    onChange={handleChange}
                    placeholder="Ej: Ver documento, Leer más"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accionUrl">URL de Acción (opcional)</Label>
                  <Input
                    id="accionUrl"
                    name="accionUrl"
                    value={formData.accionUrl}
                    onChange={handleChange}
                    placeholder="Ej: /dashboard/documentacion"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin/notificaciones">
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
                      Enviar Notificación
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
