"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { generateRandomPassword, hashPassword } from "@/app/utils/password-utils"

// Esquema de validación para el formulario de registro
const institucionSchema = z.object({
  nombre: z.string().min(3),
  tipo: z.string().min(1),
  presidente: z.string().min(3),
  ppjj: z.string().min(3),
  localidad: z.string().min(1),
  direccion: z.string().min(5),
  telefono: z.string().min(8),
  email: z.string().email(),
})

// Función para registrar una nueva institución
export async function registrarInstitucion(formData: z.infer<typeof institucionSchema>) {
  try {
    // Validar los datos del formulario
    const validatedData = institucionSchema.parse(formData)

    // Generar una contraseña aleatoria segura
    const randomPassword = generateRandomPassword(12)

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(randomPassword)

    // Simular conexión a la base de datos
    console.log("Registrando institución:", validatedData)
    console.log("Contraseña generada (solo para desarrollo):", randomPassword)
    console.log("Contraseña encriptada:", hashedPassword)

    // Simular envío de correo electrónico con las credenciales
    console.log("Enviando correo a:", validatedData.email, "con la contraseña temporal")

    // Simular creación de usuario
    console.log("Creando usuario para la institución con contraseña encriptada")

    // En una implementación real, aquí se guardarían los datos en la base de datos MySQL
    // y se enviaría un correo electrónico con las credenciales de acceso
    // const userId = await createUser(validatedData.email, hashedPassword, { primerInicio: true });
    // await createInstitucion({ ...validatedData, userId });
    // await sendCredentialsEmail(validatedData.email, randomPassword);

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al registrar institución:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de formulario inválidos" }
    }

    return { success: false, error: "Error al registrar la institución" }
  }
}

// Función para obtener los datos de una institución
export async function getInstitucion(id: string) {
  // Simular consulta a la base de datos
  // En una implementación real, aquí se consultaría la base de datos MySQL

  // Datos de ejemplo
  return {
    id,
    nombre: "Club Deportivo Neuquén",
    tipo: "Club",
    presidente: "Juan Pérez",
    ppjj: "12345/2023",
    localidad: "Neuquén Capital",
    direccion: "Av. Argentina 123",
    telefono: "299-1234567",
    email: "info@clubdeportivoneuquen.com",
    documentacionCompleta: false,
  }
}

// Función para obtener los documentos de una institución
export async function getDocumentos(institucionId: string) {
  // Simular consulta a la base de datos
  // En una implementación real, aquí se consultaría la base de datos MySQL

  // Documentos de ejemplo
  return [
    {
      id: "1",
      nombre: "Estatuto",
      validado: true,
      archivo: "estatuto.pdf",
      fechaCarga: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      nombre: "Acta de designación de autoridades",
      validado: false,
      archivo: "acta.pdf",
      fechaCarga: "2023-05-16T14:20:00Z",
    },
    {
      id: "3",
      nombre: "Certificado de Personería Jurídica",
      validado: false,
      archivo: null,
      fechaCarga: null,
    },
    {
      id: "4",
      nombre: "Constancia de CUIT",
      validado: true,
      archivo: "cuit.pdf",
      fechaCarga: "2023-05-14T09:15:00Z",
    },
    {
      id: "5",
      nombre: "Memoria y balance del último ejercicio",
      validado: false,
      archivo: null,
      fechaCarga: null,
    },
  ]
}
