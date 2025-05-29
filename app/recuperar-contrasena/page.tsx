"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { solicitarRestablecerContrasena } from "@/app/actions/auth-actions"
import { Mail } from "lucide-react"

// Esquema de validación para el formulario
const formSchema = z.object({
  email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
})

export default function RecuperarContrasenaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)

  // Inicializar el formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Llamar a la acción del servidor para solicitar restablecimiento
      const result = await solicitarRestablecerContrasena(values.email)

      if (result.success) {
        setEmailEnviado(true)
        toast({
          title: "Solicitud enviada",
          description: "Se ha enviado un correo con instrucciones para restablecer su contraseña.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo procesar su solicitud. Por favor, intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al solicitar restablecimiento:", error)
      toast({
        title: "Error",
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
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2B3E4C]">Recuperar Contraseña</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">
                Ingrese su correo electrónico para recibir instrucciones de recuperación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailEnviado ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-[#2B3E4C]">Correo enviado</h3>
                  <p className="text-[#2B3E4C]/70">
                    Hemos enviado un correo electrónico con instrucciones para restablecer su contraseña. Por favor,
                    revise su bandeja de entrada y siga las instrucciones.
                  </p>
                  <p className="text-sm text-[#2B3E4C]/70">
                    Si no recibe el correo en unos minutos, revise su carpeta de spam o solicite un nuevo correo.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            Ingrese el correo electrónico asociado a su cuenta.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Instrucciones"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <Link href="/login" className="text-[#2B3E4C] hover:underline">
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </CardFooter>
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
