"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { registrarInstitucion } from "@/app/actions/institucion-actions"

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  tipo: z.string().min(1, { message: "Seleccione un tipo de institución" }),
  presidente: z.string().min(3, { message: "Ingrese el nombre del presidente" }),
  ppjj: z.string().min(3, { message: "Ingrese el número de Personería Jurídica" }),
  localidad: z.string().min(1, { message: "Seleccione una localidad" }),
  direccion: z.string().min(5, { message: "Ingrese una dirección válida" }),
  telefono: z.string().min(8, { message: "Ingrese un número de teléfono válido" }),
  email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
})

// Lista de localidades de Neuquén (simulada, en producción vendría de la base de datos)
const localidades = [
  "Neuquén Capital",
  "Plottier",
  "Centenario",
  "Cutral Có",
  "Plaza Huincul",
  "Zapala",
  "San Martín de los Andes",
  "Junín de los Andes",
  "Villa La Angostura",
  "Chos Malal",
  "Rincón de los Sauces",
  "Senillosa",
  "Piedra del Águila",
  "Aluminé",
  "Las Lajas",
  "Loncopué",
  "Andacollo",
  "Buta Ranquil",
  "El Chocón",
  "Picún Leufú",
]

export default function RegistroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get("tipo") || ""
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar el formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      tipo: tipoParam,
      presidente: "",
      ppjj: "",
      localidad: "",
      direccion: "",
      telefono: "",
      email: "",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Llamar a la acción del servidor para registrar la institución
      const result = await registrarInstitucion(values)

      if (result.success) {
        toast({
          title: "Registro exitoso",
          description:
            "Su institución ha sido registrada correctamente. Se ha enviado un correo con los datos de acceso.",
        })

        // Redirigir a la página de confirmación
        router.push("/registro/confirmacion")
      } else {
        toast({
          title: "Error en el registro",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al registrar:", error)
      toast({
        title: "Error en el registro",
        description: "Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#87B867]">
      <header className="bg-[#2B3E4C] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <img src="/logo-gobierno-2024.png" alt="Logo Gobierno de Neuquén" className="h-20" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-[#F4D7A9] bg-transparent text-[#F4D7A9] hover:bg-[#3a4f61]">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2B3E4C]">Registro de Institución Deportiva</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">
                Complete el siguiente formulario para registrar su institución en el sistema provincial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Tipo de Institución</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#2B3E4C] text-[#2B3E4C]">
                              <SelectValue placeholder="Seleccione un tipo de institución" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Club">Club</SelectItem>
                            <SelectItem value="Federación">Federación</SelectItem>
                            <SelectItem value="Asociación">Asociación</SelectItem>
                            <SelectItem value="Institución deportiva no regulada">
                              Institución deportiva no regulada
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-[#2B3E4C]/70">
                          Seleccione el tipo de institución que desea registrar.
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Nombre de la Institución</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el nombre completo"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presidente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Presidente</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre y apellido del presidente"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ppjj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Personería Jurídica (PPJJ)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de personería jurídica"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Localidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#2B3E4C] text-[#2B3E4C]">
                              <SelectValue placeholder="Seleccione una localidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {localidades.map((localidad) => (
                              <SelectItem key={localidad} value={localidad}>
                                {localidad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Dirección</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dirección completa"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de teléfono"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="correo@ejemplo.com"
                            type="email"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormDescription className="text-[#2B3E4C]/70">
                          Se enviará un correo con los datos de acceso a esta dirección.
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Link href="/">
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registrando..." : "Registrar Institución"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-[#2B3E4C] py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gobierno de la Provincia del Neuquén. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
