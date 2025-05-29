"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { restablecerContrasena } from "@/app/actions/auth-actions"
import { CheckCircle } from "lucide-react"

// Esquema de validación para el formulario
const formSchema = z
  .object({
    nuevaContrasena: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
    confirmarContrasena: z.string().min(8, {
      message: "La confirmación de contraseña debe tener al menos 8 caracteres",
    }),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  })

export default function RestablecerContrasenaPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [restablecido, setRestablecido] = useState(false)
  const token = params.token

  // Inicializar el formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nuevaContrasena: "",
      confirmarContrasena: "",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Llamar a la acción del servidor para restablecer la contraseña
      const result = await restablecerContrasena(token, values.nuevaContrasena)

      if (result.success) {
        setRestablecido(true)
        toast({
          title: "Contraseña restablecida",
          description: "Su contraseña ha sido restablecida correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo restablecer la contraseña. Por favor, intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
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
              <CardTitle className="text-2xl text-[#2B3E4C]">Restablecer Contraseña</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">
                {restablecido
                  ? "Su contraseña ha sido restablecida correctamente."
                  : "Ingrese su nueva contraseña para restablecer su cuenta."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {restablecido ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-[#2B3E4C]">Contraseña restablecida</h3>
                  <p className="text-[#2B3E4C]/70">
                    Su contraseña ha sido restablecida correctamente. Ahora puede iniciar sesión con su nueva
                    contraseña.
                  </p>
                  <Button
                    className="mt-4 bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                    onClick={() => router.push("/login")}
                  >
                    Ir a Iniciar Sesión
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="nuevaContrasena"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#2B3E4C]">Nueva Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese su nueva contraseña"
                              type="password"
                              {...field}
                              className="border-[#2B3E4C] text-[#2B3E4C]"
                            />
                          </FormControl>
                          <FormDescription className="text-[#2B3E4C]/70">
                            La contraseña debe tener al menos 8 caracteres y contener letras y números.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmarContrasena"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#2B3E4C]">Confirmar Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirme su nueva contraseña"
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
                      {isSubmitting ? "Procesando..." : "Restablecer Contraseña"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {!restablecido && (
                <div className="text-center text-sm">
                  <Link href="/login" className="text-[#2B3E4C] hover:underline">
                    Volver a Iniciar Sesión
                  </Link>
                </div>
              )}
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
