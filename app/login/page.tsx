"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { login } from "@/app/actions/auth-actions"

// Esquema de validación para el formulario de login
const formSchema = z.object({
  email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar el formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Llamar a la acción del servidor para iniciar sesión
      const result = await login(values)

      if (result.success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema de registro de instituciones deportivas.",
        })

        // Redirigir según el rol y si es primer inicio de sesión
        if (result.isAdmin) {
          router.push("/admin/dashboard")
        } else if (result.primerInicio) {
          router.push("/cambiar-contrasena?primer=true")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: result.error || "Credenciales incorrectas. Por favor, verifique e intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      toast({
        title: "Error de autenticación",
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
              <CardTitle className="text-2xl text-[#2B3E4C]">Iniciar Sesión</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">
                Ingrese sus credenciales para acceder al sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2B3E4C]">Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese su contraseña"
                            type="password"
                            {...field}
                            className="border-[#2B3E4C] text-[#2B3E4C]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <Link href="/recuperar-contrasena" className="text-[#2B3E4C] hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="text-center text-sm text-[#2B3E4C]">
                ¿No tiene una cuenta?{" "}
                <Link href="/registro" className="text-[#2B3E4C] font-medium hover:underline">
                  Registre su institución
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
