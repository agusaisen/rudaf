"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload } from "lucide-react"
import { cargarDocumento } from "@/app/actions/documento-actions"
import { getDocumentos } from "@/app/actions/institucion-actions"

export default function CargarDocumentacionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const documentoId = searchParams.get("id")

  const [tipoDocumento, setTipoDocumento] = useState(documentoId || "")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentosPendientes, setDocumentosPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar documentos pendientes al iniciar
  useEffect(() => {
    async function cargarDocumentosPendientes() {
      try {
        // En una implementación real, aquí se obtendría el ID de la institución del usuario actual
        const institucionId = "456" // Simulado, en producción vendría de la sesión del usuario

        // Obtener todos los documentos
        const todosDocumentos = await getDocumentos(institucionId)

        // Filtrar solo los documentos no cargados o rechazados
        const pendientes = todosDocumentos.filter((doc) => !doc.archivo || (doc.archivo && !doc.validado))

        setDocumentosPendientes(pendientes)

        // Si hay un ID en la URL, verificar que sea válido
        if (documentoId) {
          const docExiste = pendientes.some((doc) => doc.id === documentoId)
          if (!docExiste) {
            toast({
              title: "Error",
              description: "El documento seleccionado no existe o no requiere carga.",
              variant: "destructive",
            })
            router.push("/dashboard/documentacion")
          }
        }
      } catch (error) {
        console.error("Error al cargar documentos pendientes:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos pendientes.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarDocumentosPendientes()
  }, [documentoId, router])

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0])
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tipoDocumento) {
      toast({
        title: "Error",
        description: "Debe seleccionar un tipo de documento.",
        variant: "destructive",
      })
      return
    }

    if (!archivo) {
      toast({
        title: "Error",
        description: "Debe seleccionar un archivo para cargar.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Simular carga de archivo (en producción, se enviaría al servidor)
      const formData = new FormData()
      formData.append("documentoId", tipoDocumento)
      formData.append("archivo", archivo)

      // Llamar a la acción del servidor para cargar el documento
      const result = await cargarDocumento(formData)

      if (result.success) {
        toast({
          title: "Documento cargado",
          description: "El documento ha sido cargado correctamente y está pendiente de validación.",
        })

        // Redirigir al dashboard de documentación
        router.push("/dashboard/documentacion")
      } else {
        toast({
          title: "Error al cargar documento",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar documento:", error)
      toast({
        title: "Error al cargar documento",
        description: "Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-2">
        <Link href="/dashboard/documentacion">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#007934]">Cargar Documentación</h1>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Cargar Documento</CardTitle>
          <CardDescription>Seleccione el tipo de documento y suba el archivo correspondiente.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tipo-documento">Tipo de Documento</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento} disabled={!!documentoId}>
                <SelectTrigger id="tipo-documento">
                  <SelectValue placeholder="Seleccione un tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentosPendientes.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {documentosPendientes.length === 0 && (
                <p className="text-sm text-amber-600">
                  No hay documentos pendientes de carga. Todos sus documentos han sido cargados y están en proceso de
                  validación o ya han sido validados.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="archivo">Archivo</Label>
              <div className="rounded-md border border-dashed border-gray-300 p-6">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {archivo ? archivo.name : "Arrastre y suelte o haga clic para seleccionar"}
                    </p>
                    <p className="text-xs text-gray-500">Formatos aceptados: PDF, JPG, PNG (máx. 10MB)</p>
                  </div>
                  <Input
                    id="archivo"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("archivo")?.click()}
                  >
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/documentacion">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#007934] hover:bg-[#006228]"
              disabled={isSubmitting || !tipoDocumento || !archivo || documentosPendientes.length === 0}
            >
              {isSubmitting ? "Cargando..." : "Cargar documento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
