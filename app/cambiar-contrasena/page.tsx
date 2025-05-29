"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle } from "lucide-react"
import { cambiarContrasena, getCurrentUser } from "@/app/actions/auth-actions"

// Esquema de validación para el formulario de cambio de contraseña
const formSchema = z
  .object({
    contrasenaActual: z.string().min(6, { message: "La contraseña actual debe tener al menos 6 caracteres" }),
    nuevaContrasena: z
      .string()
      .min(8, {
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
      }),
    confirmarContrasena: z.string().min(8, {
      message: "La confirmación de contraseña debe tener al menos 8 caracteres",
    }),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  })
  .refine((data) => data.nuevaContrasena !== data.contrasenaActual, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["nuevaContrasena"],
  })

export default function CambiarContrasenaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const esPrimerInicio = searchParams.get("primer") === "true"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contrasenaActualizada, setContrasenaActualizada] = useState(false)

  // Inicializar el formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contrasenaActual: "",
      nuevaContrasena: "",
      confirmarContrasena: "",
    },
  })

  // Verificar si el usuario está autenticado
  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error("Error al verificar usuario:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  // Manejar el envío del formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Llamar a la acción del servidor para cambiar la contraseña
      const result = await cambiarContrasena(values)

      if (result.success) {
        setContrasenaActualizada(true)
        toast({
          title: "Contraseña actualizada",
          description: "Su contraseña ha sido actualizada correctamente.",
        })

        // Si no es primer inicio, redirigir al dashboard después de un breve retraso
        if (!esPrimerInicio) {
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        }
      } else {
        toast({
          title: "Error al cambiar contraseña",
          description: result.error || "La contraseña actual es incorrecta. Por favor, verifique e intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      toast({
        title: "Error al cambiar contraseña",
        description: "Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return null // O un componente de carga
  }

  return (
    <div className="flex min-h-screen flex-col">
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
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-[#007934]">Cambiar Contraseña</CardTitle>
              <CardDescription>
                {esPrimerInicio
                  ? "Es necesario cambiar su contraseña temporal por motivos de seguridad."
                  : "Actualice su contraseña para mantener la seguridad de su cuenta."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contrasenaActualizada ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-[#2B3E4C]">Contraseña actualizada</h3>
                  <p className="text-[#2B3E4C]/70">
                    Su contraseña ha sido actualizada correctamente.
                    {esPrimerInicio
                      ? " Ahora puede acceder a todas las funcionalidades del sistema."
                      : " Será redirigido al panel de control en unos segundos."}
                  </p>
                  <Button
                    className="mt-4 bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                    onClick={() => router.push("/dashboard")}
                  >
                    Ir al Panel de Control
                  </Button>
                </div>
              ) : (
                <>
                  {esPrimerInicio && (
                    <Alert className="mb-6 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-600">Primer inicio de sesión</AlertTitle>
                      <AlertDescription>
                        Por motivos de seguridad, debe cambiar la contraseña temporal que se le asignó durante el
                        registro. No podrá acceder al sistema hasta que cambie su contraseña.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="contrasenaActual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña Actual</FormLabel>
                            <FormControl>
                              <Input placeholder="Ingrese su contraseña actual" type="password" {...field} />
                            </FormControl>
                            {esPrimerInicio && (
                              <FormDescription>
                                Ingrese la contraseña temporal que recibió por correo electrónico.
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nuevaContrasena"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nueva Contraseña</FormLabel>
                            <FormControl>
                              <Input placeholder="Ingrese su nueva contraseña" type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula,
                              una minúscula, un número y un carácter especial (@$!%*?&).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmarContrasena"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                            <FormControl>
                              <Input placeholder="Confirme su nueva contraseña" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full bg-[#007934] hover:bg-[#006228]" disabled={isSubmitting}>
                        {isSubmitting ? "Actualizando..." : "Cambiar Contraseña"}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
            {!esPrimerInicio && !contrasenaActualizada && (
              <CardFooter className="flex justify-center">
                <Link href="/dashboard">
                  <Button variant="outline">Volver al panel</Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>

      <footer className="bg-[#007934] py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gobierno de la Provincia del Neuquén. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
