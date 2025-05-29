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
import { cargarDocumentoAdmin } from "@/app/actions/admin-actions"
import DashboardLayout from "@/components/admin-dashboard-layout"
import { getDocumentos, getInstitucion } from "@/app/actions/institucion-actions"

export default function CargarDocumentoAdminPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const documentoId = searchParams.get("id")
  const esReemplazo = searchParams.get("reemplazar") === "true"
  const institucionId = params.id

  const [tipoDocumento, setTipoDocumento] = useState(documentoId || "")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentosPendientes, setDocumentosPendientes] = useState<any[]>([])
  const [institucion, setInstitucion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Cargar datos de la institución y documentos pendientes al iniciar
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Obtener datos de la institución
        const datosInstitucion = await getInstitucion(institucionId)
        setInstitucion(datosInstitucion)

        // Obtener todos los documentos
        const todosDocumentos = await getDocumentos(institucionId)

        // Si es reemplazo, mostrar todos los documentos
        // Si no es reemplazo, filtrar solo los documentos no cargados
        const pendientes = esReemplazo ? todosDocumentos : todosDocumentos.filter((doc) => !doc.archivo)

        setDocumentosPendientes(pendientes)

        // Si hay un ID en la URL, verificar que sea válido
        if (documentoId) {
          const docExiste = todosDocumentos.some((doc) => doc.id === documentoId)
          if (!docExiste) {
            toast({
              title: "Error",
              description: "El documento seleccionado no existe.",
              variant: "destructive",
            })
            router.push(`/admin/instituciones/${institucionId}/documentacion`)
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [documentoId, institucionId, router, esReemplazo])

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

      // Preparar datos para la carga
      const formData = new FormData()
      formData.append("documentoId", tipoDocumento)
      formData.append("archivo", archivo)
      formData.append("institucionId", institucionId)
      formData.append("esReemplazo", esReemplazo ? "true" : "false")

      // Llamar a la acción del servidor para cargar el documento
      const result = await cargarDocumentoAdmin(formData)

      if (result.success) {
        toast({
          title: esReemplazo ? "Documento reemplazado" : "Documento cargado",
          description: `El documento ha sido ${
            esReemplazo ? "reemplazado" : "cargado"
          } correctamente por el administrador.`,
        })

        // Redirigir a la página de documentación
        router.push(`/admin/instituciones/${institucionId}/documentacion`)
      } else {
        toast({
          title: `Error al ${esReemplazo ? "reemplazar" : "cargar"} documento`,
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error al ${esReemplazo ? "reemplazar" : "cargar"} documento:`, error)
      toast({
        title: `Error al ${esReemplazo ? "reemplazar" : "cargar"} documento`,
        description: "Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-8">
          <p>Cargando...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center space-x-2">
          <Link href={`/admin/instituciones/${institucionId}/documentacion`}>
            <Button
              variant="outline"
              size="icon"
              className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2B3E4C]">
            {esReemplazo ? "Reemplazar" : "Cargar"} Documento para {institucion?.nombre}
          </h1>
        </div>

        <Card className="mx-auto max-w-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-[#2B3E4C]">
              {esReemplazo ? "Reemplazar" : "Cargar"} Documento como Administrador
            </CardTitle>
            <CardDescription className="text-[#2B3E4C]/70">
              {esReemplazo
                ? "Reemplace el documento existente con una nueva versión."
                : "Cargue un documento en nombre de la institución."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Nota:</span> Está {esReemplazo ? "reemplazando" : "cargando"} este
                  documento como administrador en nombre de la institución. Esta acción quedará registrada en el
                  historial.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo-documento" className="text-[#2B3E4C]">
                  Tipo de Documento
                </Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento} disabled={!!documentoId}>
                  <SelectTrigger id="tipo-documento" className="border-[#2B3E4C] text-[#2B3E4C]">
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
                  <p className="text-sm text-amber-600">No hay documentos pendientes de carga para esta institución.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="archivo" className="text-[#2B3E4C]">
                  Archivo
                </Label>
                <div className="rounded-md border border-dashed border-gray-300 p-6">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#2B3E4C]">
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
                      className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                      onClick={() => document.getElementById("archivo")?.click()}
                    >
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/admin/instituciones/${institucionId}/documentacion`}>
                <Button
                  variant="outline"
                  type="button"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                disabled={isSubmitting || !tipoDocumento || !archivo || documentosPendientes.length === 0}
              >
                {isSubmitting ? "Procesando..." : esReemplazo ? "Reemplazar documento" : "Cargar documento"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
