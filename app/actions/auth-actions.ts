"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { hashPassword } from "@/app/utils/password-utils"

// Esquema de validación para el formulario de login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Función para iniciar sesión
export async function login(formData: z.infer<typeof loginSchema>) {
  try {
    // Validar los datos del formulario
    const validatedData = loginSchema.parse(formData)

    // Simular autenticación
    // En una implementación real, aquí se verificarían las credenciales en la base de datos
    // y se verificaría la contraseña con verifyPassword(validatedData.password, hashedPasswordFromDB)

    // Para esta simulación, vamos a aceptar cualquier contraseña que cumpla con la validación
    // En un entorno real, esto sería reemplazado por una verificación adecuada

    // Determinar si es un usuario administrador (para este ejemplo, usamos un correo específico)
    const isAdmin = validatedData.email === "admin@neuquen.gob.ar"

    // Determinar si es el primer inicio de sesión (para este ejemplo, usamos una lógica simple)
    // En una implementación real, esto se verificaría en la base de datos
    const primerInicio = !isAdmin && validatedData.email.includes("@") && !validatedData.email.includes("admin")

    // Simular creación de sesión
    const session = {
      userId: "123",
      email: validatedData.email,
      isAdmin,
      institucionId: isAdmin ? null : "456",
      primerInicio,
    }

    // Guardar la sesión en una cookie
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return { success: true, isAdmin, primerInicio }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de formulario inválidos" }
    }

    return { success: false, error: "Credenciales incorrectas" }
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser() {
  // Obtener la cookie de sesión
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    // Parsear la cookie de sesión
    const session = JSON.parse(sessionCookie.value)

    return session
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error)
    return null
  }
}

// Función para cerrar sesión
export async function logout() {
  // Eliminar la cookie de sesión
  cookies().delete("session")

  return { success: true }
}

// Esquema de validación para el formulario de cambio de contraseña
const cambioContrasenaSchema = z.object({
  contrasenaActual: z.string().min(6),
  nuevaContrasena: z.string().min(8),
  confirmarContrasena: z.string().min(8),
})

// Función para cambiar la contraseña
export async function cambiarContrasena(formData: z.infer<typeof cambioContrasenaSchema>) {
  try {
    // Validar los datos del formulario
    const validatedData = cambioContrasenaSchema.parse(formData)

    // Obtener el usuario actual
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // En una implementación real, aquí se verificaría la contraseña actual en la base de datos
    // const isPasswordValid = await verifyPassword(validatedData.contrasenaActual, hashedPasswordFromDB);
    // if (!isPasswordValid) {
    //   return { success: false, error: "La contraseña actual es incorrecta" };
    // }

    try {
      // Encriptar la nueva contraseña
      const hashedPassword = await hashPassword(validatedData.nuevaContrasena)

      // Simular actualización de contraseña
      console.log("Actualizando contraseña para el usuario:", user.email)
      console.log("Nueva contraseña encriptada:", hashedPassword)

      // Actualizar el estado de primer inicio de sesión
      if (user.primerInicio) {
        // Actualizar la sesión para indicar que ya no es el primer inicio
        const updatedSession = {
          ...user,
          primerInicio: false,
        }

        // Guardar la sesión actualizada en una cookie
        cookies().set("session", JSON.stringify(updatedSession), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: "/",
        })
      }

      // En una implementación real, aquí se actualizaría la contraseña en la base de datos
      // await updateUserPassword(user.userId, hashedPassword);

      return { success: true }
    } catch (error) {
      console.error("Error al encriptar contraseña:", error)
      return { success: false, error: "Error al procesar la contraseña" }
    }
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de formulario inválidos" }
    }

    return { success: false, error: "Error al cambiar la contraseña" }
  }
}

// Función para solicitar restablecimiento de contraseña
export async function solicitarRestablecerContrasena(email: string) {
  try {
    // Validar el correo electrónico
    if (!email || !email.includes("@")) {
      return { success: false, error: "Correo electrónico inválido" }
    }

    // En una implementación real, aquí se verificaría si el correo existe en la base de datos
    // y se generaría un token de restablecimiento

    // Simular generación de token
    const resetToken = Math.random().toString(36).substring(2, 15)

    // Simular envío de correo con el token
    console.log(`Enviando correo de restablecimiento a ${email} con token: ${resetToken}`)

    // En una implementación real, aquí se guardaría el token en la base de datos
    // y se enviaría un correo electrónico con un enlace para restablecer la contraseña

    return { success: true }
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}

// Función para restablecer contraseña con token
export async function restablecerContrasena(token: string, nuevaContrasena: string) {
  try {
    // Validar el token y la nueva contraseña
    if (!token || nuevaContrasena.length < 8) {
      return { success: false, error: "Token o contraseña inválidos" }
    }

    // En una implementación real, aquí se verificaría si el token es válido y no ha expirado

    // Encriptar la nueva contraseña
    const hashedPassword = await hashPassword(nuevaContrasena)

    // Simular actualización de contraseña
    console.log(`Restableciendo contraseña con token: ${token}`)
    console.log(`Nueva contraseña encriptada: ${hashedPassword}`)

    // En una implementación real, aquí se actualizaría la contraseña en la base de datos
    // y se invalidaría el token utilizado

    return { success: true }
  } catch (error) {
    console.error("Error al restablecer contraseña:", error)
    return { success: false, error: "Error al restablecer la contraseña" }
  }
}
