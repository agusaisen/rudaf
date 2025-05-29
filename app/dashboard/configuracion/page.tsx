"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { cambiarContrasena } from "@/app/actions/auth-actions"

// Esquema de validación para el formulario de cambio de contraseña
const passwordFormSchema = z
  .object({
    contrasenaActual: z.string().min(6, { message: "La contraseña actual debe tener al menos 6 caracteres" }),
    nuevaContrasena: z.string().min(8, {
      message: "La nueva contraseña debe tener al menos 8 caracteres",
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

// Esquema de validación para el formulario de notificaciones
const notificationsFormSchema = z.object({
  emailDocumentos: z.boolean().default(true),
  emailNoticias: z.boolean().default(false),
  emailEventos: z.boolean().default(false),
})

export default function ConfiguracionPage() {
  const router = useRouter()
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [isSubmittingNotifications, setIsSubmittingNotifications] = useState(false)

  // Inicializar el formulario de cambio de contraseña
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      contrasenaActual: "",
      nuevaContrasena: "",
      confirmarContrasena: "",
    },
  })

  // Inicializar el formulario de notificaciones
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailDocumentos: true,
      emailNoticias: false,
      emailEventos: false,
    },
  })

  // Manejar el envío del formulario de cambio de contraseña
  async function onSubmitPassword(values: z.infer<typeof passwordFormSchema>) {
    try {
      setIsSubmittingPassword(true)

      // Llamar a la acción del servidor para cambiar la contraseña
      const result = await cambiarContrasena(values)

      if (result.success) {
        toast({
          title: "Contraseña actualizada",
          description: "Su contraseña ha sido actualizada correctamente.",
        })

        // Limpiar el formulario
        passwordForm.reset({
          contrasenaActual: "",
          nuevaContrasena: "",
          confirmarContrasena: "",
        })
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
      setIsSubmittingPassword(false)
    }
  }

  // Manejar el envío del formulario de notificaciones
  async function onSubmitNotifications(values: z.infer<typeof notificationsFormSchema>) {
    try {
      setIsSubmittingNotifications(true)

      // Simular actualización de preferencias de notificaciones
      console.log("Actualizando preferencias de notificaciones:", values)

      // En una implementación real, aquí se actualizarían las preferencias en la base de datos

      toast({
        title: "Preferencias actualizadas",
        description: "Sus preferencias de notificaciones han sido actualizadas correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar preferencias:", error)
      toast({
        title: "Error al actualizar preferencias",
        description: "Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingNotifications(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold text-[#2B3E4C]">Configuración</h1>

        <Tabs defaultValue="cuenta" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="cuenta">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-[#2B3E4C]">Cambiar Contraseña</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">
                  Actualice su contraseña para mantener la seguridad de su cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="contrasenaActual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#2B3E4C]">Contraseña Actual</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese su contraseña actual"
                              type="password"
                              {...field}
                              className="border-[#2B3E4C] text-[#2B3E4C]"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
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
                      control={passwordForm.control}
                      name="confirmarContrasena"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#2B3E4C]">Confirmar Nueva Contraseña</FormLabel>
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
                      className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                      disabled={isSubmittingPassword}
                    >
                      {isSubmittingPassword ? "Actualizando..." : "Cambiar Contraseña"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-white">
              <CardHeader>
                <CardTitle className="text-[#2B3E4C]">Información de la Cuenta</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">
                  Detalles de su cuenta en el sistema provincial.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-[#2B3E4C]/70">Correo Electrónico</h3>
                      <p className="text-[#2B3E4C]">usuario@ejemplo.com</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#2B3E4C]/70">Último Acceso</h3>
                      <p className="text-[#2B3E4C]">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#2B3E4C]/70">Tipo de Usuario</h3>
                      <p className="text-[#2B3E4C]">Institución Deportiva</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#2B3E4C]/70">Estado de la Cuenta</h3>
                      <p className="text-[#2B3E4C]">Activa</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-[#2B3E4C]/70">
                  Para cambiar su correo electrónico o información básica, contacte al soporte técnico.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-[#2B3E4C]">Preferencias de Notificaciones</CardTitle>
                <CardDescription className="text-[#2B3E4C]/70">
                  Configure qué notificaciones desea recibir por correo electrónico.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                    <FormField
                      control={notificationsForm.control}
                      name="emailDocumentos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-[#2B3E4C]">Notificaciones de Documentación</FormLabel>
                            <FormDescription className="text-[#2B3E4C]/70">
                              Recibir notificaciones cuando el estado de sus documentos cambie.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="emailNoticias"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-[#2B3E4C]">Noticias y Novedades</FormLabel>
                            <FormDescription className="text-[#2B3E4C]/70">
                              Recibir información sobre novedades del sistema y noticias deportivas.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="emailEventos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-[#2B3E4C]">Eventos y Capacitaciones</FormLabel>
                            <FormDescription className="text-[#2B3E4C]/70">
                              Recibir información sobre eventos deportivos y capacitaciones.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]"
                      disabled={isSubmittingNotifications}
                    >
                      {isSubmittingNotifications ? "Guardando..." : "Guardar Preferencias"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
