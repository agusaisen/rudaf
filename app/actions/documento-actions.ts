"use server"

import { revalidatePath } from "next/cache"

// Función para cargar un documento
export async function cargarDocumento(formData: FormData) {
  try {
    // Obtener los datos del formulario
    const documentoId = formData.get("documentoId") as string
    const archivo = formData.get("archivo") as File

    if (!documentoId || !archivo) {
      return { success: false, error: "Faltan datos requeridos" }
    }

    // Simular carga de archivo
    console.log("Cargando documento:", documentoId, "Archivo:", archivo.name, "Tamaño:", archivo.size)

    // En una implementación real, aquí se guardaría el archivo en el servidor
    // y se registraría en la base de datos

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/documentacion")

    return { success: true }
  } catch (error) {
    console.error("Error al cargar documento:", error)
    return { success: false, error: "Error al cargar el documento" }
  }
}
