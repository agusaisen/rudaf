"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

// Interfaz para las notificaciones
interface Notificacion {
  id: string
  tipo: "documento" | "noticia" | "evento"
  titulo: string
  mensaje: string
  fecha: string
  leida: boolean
  prioridad: "alta" | "media" | "baja"
  accion?: string
  accionUrl?: string
}

// Función para obtener todas las notificaciones del usuario actual
export async function getNotificaciones(): Promise<Notificacion[]> {
  try {
    // Obtener el usuario actual
    const user = await getCurrentUser()

    if (!user) {
      return []
    }

    // En una implementación real, aquí se consultaría la base de datos
    // para obtener las notificaciones del usuario

    // Datos simulados
    const notificaciones: Notificacion[] = [
      {
        id: "1",
        tipo: "documento",
        titulo: "Documento validado",
        mensaje: "Su documento 'Estatuto' ha sido validado correctamente.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
        leida: false,
        prioridad: "alta",
        accion: "Ver documento",
        accionUrl: "/dashboard/documentacion",
      },
      {
        id: "2",
        tipo: "documento",
        titulo: "Documento pendiente de corrección",
        mensaje: "Su documento 'Acta de designación de autoridades' requiere correcciones.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 día atrás
        leida: true,
        prioridad: "alta",
        accion: "Cargar corrección",
        accionUrl: "/dashboard/cargar-documentacion?id=2",
      },
      {
        id: "3",
        tipo: "noticia",
        titulo: "Nueva normativa deportiva",
        mensaje: "Se ha publicado una nueva normativa para instituciones deportivas. Consulte los detalles.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 días atrás
        leida: false,
        prioridad: "media",
        accion: "Leer más",
        accionUrl: "/dashboard/noticias/1",
      },
      {
        id: "4",
        tipo: "evento",
        titulo: "Capacitación: Gestión Deportiva",
        mensaje: "Próxima capacitación gratuita sobre gestión deportiva el 15 de junio.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 días atrás
        leida: false,
        prioridad: "media",
        accion: "Inscribirse",
        accionUrl: "/dashboard/eventos/1",
      },
      {
        id: "5",
        tipo: "evento",
        titulo: "Torneo Provincial",
        mensaje: "Inscripciones abiertas para el Torneo Provincial de Deportes 2024.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 días atrás
        leida: true,
        prioridad: "baja",
        accion: "Ver detalles",
        accionUrl: "/dashboard/eventos/2",
      },
      {
        id: "6",
        tipo: "noticia",
        titulo: "Subsidios para instituciones deportivas",
        mensaje: "Nuevo programa de subsidios para instituciones deportivas de la provincia.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 días atrás
        leida: true,
        prioridad: "alta",
        accion: "Solicitar",
        accionUrl: "/dashboard/subsidios",
      },
      {
        id: "7",
        tipo: "documento",
        titulo: "Recordatorio de documentación",
        mensaje: "Recuerde que debe cargar el documento 'Memoria y balance del último ejercicio'.",
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 días atrás
        leida: true,
        prioridad: "media",
        accion: "Cargar documento",
        accionUrl: "/dashboard/cargar-documentacion?id=5",
      },
    ]

    return notificaciones
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    return []
  }
}

// Función para crear una nueva notificación
export async function crearNotificacion(data: Omit<Notificacion, "id">) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se guardaría en la base de datos
    console.log("Creando nueva notificación:", data)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/notificaciones")
    revalidatePath("/dashboard/notificaciones")

    return { success: true }
  } catch (error) {
    console.error("Error al crear notificación:", error)
    return { success: false, error: "Error al crear la notificación" }
  }
}

// Función para marcar una notificación como leída
export async function marcarComoLeida(notificacionId: string) {
  try {
    // Obtener el usuario actual
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // En una implementación real, aquí se actualizaría la base de datos
    console.log("Marcando notificación como leída:", notificacionId)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/notificaciones")

    return { success: true }
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error)
    return { success: false, error: "Error al marcar la notificación como leída" }
  }
}

// Función para marcar todas las notificaciones como leídas
export async function marcarTodasComoLeidas() {
  try {
    // Obtener el usuario actual
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // En una implementación real, aquí se actualizaría la base de datos
    console.log("Marcando todas las notificaciones como leídas")

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/notificaciones")

    return { success: true }
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error)
    return { success: false, error: "Error al marcar todas las notificaciones como leídas" }
  }
}

// Función para actualizar las preferencias de notificaciones
export async function actualizarPreferenciasNotificaciones(preferencias: {
  emailDocumentos: boolean
  emailNoticias: boolean
  emailEventos: boolean
}) {
  try {
    // Obtener el usuario actual
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // En una implementación real, aquí se actualizaría la base de datos
    console.log("Actualizando preferencias de notificaciones:", preferencias)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/notificaciones")
    revalidatePath("/dashboard/configuracion")

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar preferencias de notificaciones:", error)
    return { success: false, error: "Error al actualizar las preferencias de notificaciones" }
  }
}

// Función para eliminar una notificación
export async function eliminarNotificacion(notificacionId: string) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se eliminaría de la base de datos
    console.log("Eliminando notificación:", notificacionId)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/notificaciones")
    revalidatePath("/dashboard/notificaciones")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar notificación:", error)
    return { success: false, error: "Error al eliminar la notificación" }
  }
}

// Función para reenviar una notificación
export async function reenviarNotificacion(notificacionId: string) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se reenviaría la notificación
    console.log("Reenviando notificación:", notificacionId)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/notificaciones")
    revalidatePath("/dashboard/notificaciones")

    return { success: true }
  } catch (error) {
    console.error("Error al reenviar notificación:", error)
    return { success: false, error: "Error al reenviar la notificación" }
  }
}
