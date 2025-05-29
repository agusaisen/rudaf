"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

// Interfaz para las noticias
interface Noticia {
  id: string
  titulo: string
  resumen: string
  contenido: string
  fecha: string
  imagen: string
  categoria: string
  destacada: boolean
  fuente?: string
  noticiasRelacionadas?: {
    id: string
    titulo: string
    imagen: string
  }[]
}

// Función para obtener todas las noticias
export async function getNoticias(): Promise<Noticia[]> {
  try {
    // En una implementación real, aquí se consultaría la base de datos

    // Datos simulados
    const noticias: Noticia[] = [
      {
        id: "1",
        titulo: "Nueva normativa para instituciones deportivas en Neuquén",
        resumen:
          "La provincia ha publicado una nueva normativa que regula el funcionamiento de las instituciones deportivas.",
        contenido:
          "El Ministerio de Deportes de la Provincia del Neuquén ha publicado una nueva normativa que establece los requisitos y procedimientos para el funcionamiento de las instituciones deportivas en la provincia.\n\nLa normativa, que entrará en vigor el próximo mes, busca simplificar los trámites administrativos y mejorar la transparencia en la gestión de las instituciones deportivas. Entre las principales novedades, se destaca la implementación de un sistema digital para la presentación de documentación y la creación de un registro único de instituciones deportivas.\n\nAdemás, se establecen nuevos criterios para la categorización de las instituciones según su tamaño, infraestructura y actividades que desarrollan, lo que permitirá adaptar los requisitos a las características específicas de cada entidad.\n\nLas instituciones deportivas tendrán un plazo de 180 días para adecuarse a la nueva normativa. El Ministerio de Deportes ofrecerá capacitaciones gratuitas para facilitar la transición.",
        fecha: "2024-05-15T10:30:00Z",
        imagen: "/sports-regulations.png",
        categoria: "Normativa",
        destacada: true,
        fuente: "Ministerio de Deportes de Neuquén",
        noticiasRelacionadas: [
          {
            id: "2",
            titulo: "Programa de subsidios para instituciones deportivas",
            imagen: "/sports-funding.png",
          },
          {
            id: "3",
            titulo: "Capacitaciones gratuitas sobre gestión deportiva",
            imagen: "/sports-management-concept.png",
          },
        ],
      },
      {
        id: "2",
        titulo: "Programa de subsidios para instituciones deportivas",
        resumen:
          "La provincia lanza un nuevo programa de subsidios para apoyar a las instituciones deportivas locales.",
        contenido:
          "El Gobierno de la Provincia del Neuquén, a través del Ministerio de Deportes, ha lanzado un nuevo programa de subsidios destinado a apoyar a las instituciones deportivas de la provincia.\n\nEl programa, denominado 'Neuquén Deportivo', cuenta con un presupuesto de 50 millones de pesos y tiene como objetivo fortalecer la infraestructura y equipamiento de clubes, asociaciones y federaciones deportivas.\n\nLas instituciones interesadas podrán presentar proyectos en tres categorías: mejora de infraestructura, adquisición de equipamiento deportivo y desarrollo de programas de formación. Los montos máximos por proyecto varían según la categoría y el tamaño de la institución.\n\nPara participar, las instituciones deben estar registradas en el sistema provincial y tener su documentación al día. Las solicitudes se recibirán a partir del 1 de junio a través de la plataforma digital del Ministerio de Deportes.",
        fecha: "2024-05-10T14:45:00Z",
        imagen: "/sports-funding-program.png",
        categoria: "Subsidios",
        destacada: true,
        fuente: "Ministerio de Deportes de Neuquén",
      },
      {
        id: "3",
        titulo: "Capacitaciones gratuitas sobre gestión deportiva",
        resumen:
          "El Ministerio de Deportes ofrece un ciclo de capacitaciones gratuitas sobre gestión deportiva para dirigentes.",
        contenido:
          "El Ministerio de Deportes de la Provincia del Neuquén ha anunciado un ciclo de capacitaciones gratuitas sobre gestión deportiva dirigido a dirigentes y personal administrativo de instituciones deportivas.\n\nLas capacitaciones, que se desarrollarán entre junio y noviembre de 2024, abordarán temas como administración financiera, planificación estratégica, marketing deportivo, captación de fondos, aspectos legales y fiscales, y uso de herramientas digitales para la gestión.\n\nLas clases serán dictadas por profesionales especializados en cada área y se realizarán en formato híbrido, con encuentros presenciales en distintas localidades de la provincia y sesiones virtuales para facilitar la participación de instituciones de toda la región.\n\nLos participantes que completen el ciclo recibirán una certificación oficial del Ministerio de Deportes. Las inscripciones ya están abiertas y pueden realizarse a través del sitio web oficial.",
        fecha: "2024-05-05T09:15:00Z",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20management%20training",
        categoria: "Capacitación",
        destacada: false,
      },
      {
        id: "4",
        titulo: "Juegos Neuquinos 2024: Abiertas las inscripciones",
        resumen:
          "Ya están abiertas las inscripciones para los Juegos Neuquinos 2024, el evento deportivo más importante de la provincia.",
        contenido:
          "La Subsecretaría de Deportes de la Provincia del Neuquén ha anunciado la apertura de inscripciones para los Juegos Neuquinos 2024, el evento deportivo más importante de la provincia.\n\nLos Juegos, que celebran su 25ª edición, se desarrollarán entre agosto y noviembre en diferentes sedes de la provincia y contarán con competencias en más de 20 disciplinas deportivas, divididas en categorías infantiles, juveniles y adultos.\n\nLas instituciones deportivas interesadas en participar deberán inscribir a sus equipos y deportistas a través de la plataforma digital habilitada para tal fin. El plazo de inscripción estará abierto hasta el 30 de junio.\n\nComo novedad, este año se incorporan tres nuevas disciplinas: escalada deportiva, skateboarding y breaking, en línea con los deportes que se han sumado al programa olímpico en los últimos años.",
        fecha: "2024-04-28T11:20:00Z",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20games%20competition",
        categoria: "Eventos",
        destacada: false,
      },
      {
        id: "5",
        titulo: "Reconocimiento a instituciones deportivas destacadas",
        resumen:
          "La provincia distinguirá a las instituciones deportivas que se destacaron por su labor social y deportiva durante 2023.",
        contenido:
          "El Gobierno de la Provincia del Neuquén realizará un acto de reconocimiento a las instituciones deportivas que se destacaron por su labor social y deportiva durante el año 2023.\n\nLa ceremonia, que se llevará a cabo el próximo 20 de junio en el Centro Cultural Provincial, distinguirá a clubes, asociaciones y federaciones en diferentes categorías: promoción del deporte comunitario, inclusión social a través del deporte, formación de deportistas de alto rendimiento, y gestión institucional innovadora.\n\nLas instituciones reconocidas recibirán un diploma de honor y un apoyo económico para continuar desarrollando sus proyectos. Además, serán incluidas en un programa especial de acompañamiento técnico por parte del Ministerio de Deportes.\n\nLa selección de las instituciones destacadas estuvo a cargo de un jurado integrado por referentes del ámbito deportivo, académico y social de la provincia.",
        fecha: "2024-04-20T16:30:00Z",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20awards%20ceremony",
        categoria: "Reconocimientos",
        destacada: false,
      },
      {
        id: "6",
        titulo: "Nuevo sistema digital para trámites deportivos",
        resumen:
          "La provincia implementa un nuevo sistema digital para simplificar los trámites de las instituciones deportivas.",
        contenido:
          "El Ministerio de Deportes de la Provincia del Neuquén ha implementado un nuevo sistema digital que simplificará los trámites administrativos de las instituciones deportivas.\n\nLa plataforma, denominada 'Neuquén Deportes Digital', permitirá realizar de manera online diversos trámites como la actualización de datos institucionales, la presentación de documentación, la solicitud de subsidios y apoyos, y la inscripción en competencias y capacitaciones.\n\nEl sistema también incluye un módulo de seguimiento que permitirá a las instituciones conocer el estado de sus trámites en tiempo real y recibir notificaciones sobre vencimientos y nuevas convocatorias.\n\nPara facilitar la transición al nuevo sistema, el Ministerio ofrecerá talleres de capacitación en diferentes localidades de la provincia durante los meses de junio y julio. Además, se ha habilitado una mesa de ayuda telefónica y por correo electrónico para resolver consultas y brindar asistencia técnica.",
        fecha: "2024-04-15T13:45:00Z",
        imagen: "/placeholder.svg?height=400&width=600&query=digital%20system%20sports%20management",
        categoria: "Tecnología",
        destacada: false,
      },
    ]

    return noticias
  } catch (error) {
    console.error("Error al obtener noticias:", error)
    return []
  }
}

// Función para obtener una noticia por ID
export async function getNoticiaById(id: string): Promise<Noticia | null> {
  try {
    // En una implementación real, aquí se consultaría la base de datos

    // Obtener todas las noticias y filtrar por ID
    const noticias = await getNoticias()
    const noticia = noticias.find((n) => n.id === id)

    return noticia || null
  } catch (error) {
    console.error("Error al obtener noticia por ID:", error)
    return null
  }
}

// Función para crear una nueva noticia
export async function crearNoticia(data: Omit<Noticia, "id" | "noticiasRelacionadas">) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se guardaría en la base de datos
    console.log("Creando nueva noticia:", data)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/noticias")
    revalidatePath("/dashboard/noticias")

    return { success: true }
  } catch (error) {
    console.error("Error al crear noticia:", error)
    return { success: false, error: "Error al crear la noticia" }
  }
}

// Función para actualizar una noticia
export async function actualizarNoticia(id: string, data: Partial<Noticia>) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se actualizaría en la base de datos
    console.log("Actualizando noticia:", id, data)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/noticias")
    revalidatePath(`/admin/noticias/${id}`)
    revalidatePath("/dashboard/noticias")
    revalidatePath(`/dashboard/noticias/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar noticia:", error)
    return { success: false, error: "Error al actualizar la noticia" }
  }
}

// Función para eliminar una noticia
export async function eliminarNoticia(id: string) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se eliminaría de la base de datos
    console.log("Eliminando noticia:", id)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/noticias")
    revalidatePath("/dashboard/noticias")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar noticia:", error)
    return { success: false, error: "Error al eliminar la noticia" }
  }
}

// Función para destacar o quitar destacado de una noticia
export async function toggleDestacadaNoticia(id: string) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se actualizaría en la base de datos
    console.log("Cambiando estado destacado de noticia:", id)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/noticias")
    revalidatePath(`/admin/noticias/${id}`)
    revalidatePath("/dashboard/noticias")
    revalidatePath(`/dashboard/noticias/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Error al cambiar estado destacado de noticia:", error)
    return { success: false, error: "Error al cambiar estado destacado de la noticia" }
  }
}
