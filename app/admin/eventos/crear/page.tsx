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
import { ArrowLeft, Save, ImageIcon, Loader2, Plus, Trash } from "lucide-react"
import { crearEvento } from "@/app/actions/eventos-actions"

export default function CrearEventoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    tipo: "Capacitación",
    fechaInicio: "",
    fechaFin: "",
    horario: "",
    ubicacion: "",
    imagen: "",
    organizador: "",
    contactoEmail: "",
    contactoTelefono: "",
    cupos: "",
    requisitos: [""],
    documentos: [{ nombre: "", url: "" }],
    enlaces: [{ nombre: "", url: "" }],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipo: value }))
  }

  const handleRequisitosChange = (index: number, value: string) => {
    const newRequisitos = [...formData.requisitos]
    newRequisitos[index] = value
    setFormData((prev) => ({ ...prev, requisitos: newRequisitos }))
  }

  const addRequisito = () => {
    setFormData((prev) => ({ ...prev, requisitos: [...prev.requisitos, ""] }))
  }

  const removeRequisito = (index: number) => {
    const newRequisitos = [...formData.requisitos]
    newRequisitos.splice(index, 1)
    setFormData((prev) => ({ ...prev, requisitos: newRequisitos }))
  }

  const handleDocumentoChange = (index: number, field: string, value: string) => {
    const newDocumentos = [...formData.documentos]
    newDocumentos[index] = { ...newDocumentos[index], [field]: value }
    setFormData((prev) => ({ ...prev, documentos: newDocumentos }))
  }

  const addDocumento = () => {
    setFormData((prev) => ({ ...prev, documentos: [...prev.documentos, { nombre: "", url: "" }] }))
  }

  const removeDocumento = (index: number) => {
    const newDocumentos = [...formData.documentos]
    newDocumentos.splice(index, 1)
    setFormData((prev) => ({ ...prev, documentos: newDocumentos }))
  }

  const handleEnlaceChange = (index: number, field: string, value: string) => {
    const newEnlaces = [...formData.enlaces]
    newEnlaces[index] = { ...newEnlaces[index], [field]: value }
    setFormData((prev) => ({ ...prev, enlaces: newEnlaces }))
  }

  const addEnlace = () => {
    setFormData((prev) => ({ ...prev, enlaces: [...prev.enlaces, { nombre: "", url: "" }] }))
  }

  const removeEnlace = (index: number) => {
    const newEnlaces = [...formData.enlaces]
    newEnlaces.splice(index, 1)
    setFormData((prev) => ({ ...prev, enlaces: newEnlaces }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // En una implementación real, aquí se enviaría la imagen al servidor
      // y se obtendría la URL para guardarla en la base de datos
      const imagenUrl = formData.imagen || "/community-event.png"

      // Filtrar requisitos, documentos y enlaces vacíos
      const requisitos = formData.requisitos.filter((req) => req.trim() !== "")
      const documentos = formData.documentos.filter((doc) => doc.nombre.trim() !== "" && doc.url.trim() !== "")
      const enlaces = formData.enlaces.filter((enlace) => enlace.nombre.trim() !== "" && enlace.url.trim() !== "")

      const result = await crearEvento({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        contenido: formData.contenido,
        tipo: formData.tipo as "Capacitación" | "Torneo" | "Conferencia" | "Otro",
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin || undefined,
        horario: formData.horario,
        ubicacion: formData.ubicacion,
        imagen: imagenUrl,
        organizador: formData.organizador || undefined,
        contacto: {
          email: formData.contactoEmail || undefined,
          telefono: formData.contactoTelefono || undefined,
        },
        cupos: formData.cupos ? Number.parseInt(formData.cupos) : undefined,
        cuposDisponibles: formData.cupos ? Number.parseInt(formData.cupos) : undefined,
        requisitos: requisitos.length > 0 ? requisitos : undefined,
        documentos: documentos.length > 0 ? documentos : undefined,
        enlaces: enlaces.length > 0 ? enlaces : undefined,
      })

      if (result.success) {
        router.push("/admin/eventos")
      } else {
        alert("Error al crear el evento: " + result.error)
      }
    } catch (error) {
      console.error("Error al crear el evento:", error)
      alert("Error al crear el evento. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center space-x-2">
          <Link href="/admin/eventos">
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[#2B3E4C]">Crear Nuevo Evento</h1>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">Información del Evento</CardTitle>
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
                    placeholder="Ingrese el título del evento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Evento</Label>
                  <Select value={formData.tipo} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Capacitación">Capacitación</SelectItem>
                      <SelectItem value="Torneo">Torneo</SelectItem>
                      <SelectItem value="Conferencia">Conferencia</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción Breve</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  placeholder="Breve descripción del evento (máximo 200 caracteres)"
                  maxLength={200}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido Completo</Label>
                <Textarea
                  id="contenido"
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                  placeholder="Descripción detallada del evento"
                  rows={8}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    name="fechaInicio"
                    type="datetime-local"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha de Finalización (opcional)</Label>
                  <Input
                    id="fechaFin"
                    name="fechaFin"
                    type="datetime-local"
                    value={formData.fechaFin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="horario">Horario</Label>
                  <Input
                    id="horario"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 9:00 a 17:00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Centro de Convenciones, Neuquén Capital"
                  />
                </div>
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

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="organizador">Organizador (opcional)</Label>
                  <Input
                    id="organizador"
                    name="organizador"
                    value={formData.organizador}
                    onChange={handleChange}
                    placeholder="Ej: Ministerio de Deportes de Neuquén"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactoEmail">Email de Contacto (opcional)</Label>
                  <Input
                    id="contactoEmail"
                    name="contactoEmail"
                    type="email"
                    value={formData.contactoEmail}
                    onChange={handleChange}
                    placeholder="Ej: eventos@deportes.neuquen.gob.ar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactoTelefono">Teléfono de Contacto (opcional)</Label>
                  <Input
                    id="contactoTelefono"
                    name="contactoTelefono"
                    value={formData.contactoTelefono}
                    onChange={handleChange}
                    placeholder="Ej: +54 299 4495200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cupos">Cupos (opcional)</Label>
                <Input
                  id="cupos"
                  name="cupos"
                  type="number"
                  min="1"
                  value={formData.cupos}
                  onChange={handleChange}
                  placeholder="Deje en blanco si no hay límite de cupos"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Requisitos (opcional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequisito}
                    className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Agregar Requisito
                  </Button>
                </div>
                {formData.requisitos.map((requisito, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={requisito}
                      onChange={(e) => handleRequisitosChange(index, e.target.value)}
                      placeholder={`Requisito ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequisito(index)}
                      disabled={formData.requisitos.length === 1}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Documentos (opcional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDocumento}
                    className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Agregar Documento
                  </Button>
                </div>
                {formData.documentos.map((documento, index) => (
                  <div key={index} className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={documento.nombre}
                        onChange={(e) => handleDocumentoChange(index, "nombre", e.target.value)}
                        placeholder="Nombre del documento"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={documento.url}
                        onChange={(e) => handleDocumentoChange(index, "url", e.target.value)}
                        placeholder="URL del documento"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDocumento(index)}
                        disabled={formData.documentos.length === 1}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enlaces (opcional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEnlace}
                    className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Agregar Enlace
                  </Button>
                </div>
                {formData.enlaces.map((enlace, index) => (
                  <div key={index} className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={enlace.nombre}
                        onChange={(e) => handleEnlaceChange(index, "nombre", e.target.value)}
                        placeholder="Nombre del enlace"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={enlace.url}
                        onChange={(e) => handleEnlaceChange(index, "url", e.target.value)}
                        placeholder="URL del enlace"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEnlace(index)}
                        disabled={formData.enlaces.length === 1}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin/eventos">
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
                      Guardar Evento
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
