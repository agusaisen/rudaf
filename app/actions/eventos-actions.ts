"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

// Interfaz para los eventos
interface Evento {
  id: string
  titulo: string
  descripcion: string
  contenido: string
  tipo: "Capacitación" | "Torneo" | "Conferencia" | "Otro"
  fechaInicio: string
  fechaFin?: string
  horario: string
  ubicacion: string
  imagen: string
  organizador?: string
  contacto?: {
    email?: string
    telefono?: string
  }
  cupos?: number
  cuposDisponibles?: number
  requisitos?: string[]
  documentos?: {
    nombre: string
    url: string
  }[]
  enlaces?: {
    nombre: string
    url: string
  }[]
  calendario?: string
  eventosRelacionados?: {
    id: string
    titulo: string
    imagen: string
    tipo: "Capacitación" | "Torneo" | "Conferencia" | "Otro"
    fecha: string
  }[]
}

// Función para obtener todos los eventos
export async function getEventos(): Promise<Evento[]> {
  try {
    // En una implementación real, aquí se consultaría la base de datos

    // Datos simulados
    const eventos: Evento[] = [
      {
        id: "1",
        titulo: "Capacitación: Gestión Deportiva para Dirigentes",
        descripcion: "Aprenda las mejores prácticas en gestión deportiva para mejorar su institución.",
        contenido:
          "Esta capacitación está dirigida a dirigentes y personal administrativo de instituciones deportivas que deseen mejorar sus habilidades de gestión.\n\nDurante las sesiones, se abordarán temas como planificación estratégica, administración financiera, captación de fondos, marketing deportivo, aspectos legales y fiscales, y uso de herramientas digitales para la gestión.\n\nLas clases serán dictadas por profesionales especializados en cada área y combinarán aspectos teóricos con ejercicios prácticos y estudios de casos reales. Los participantes tendrán la oportunidad de aplicar los conocimientos adquiridos a situaciones específicas de sus propias instituciones.\n\nAl finalizar el curso, los participantes recibirán un certificado oficial del Ministerio de Deportes de la Provincia del Neuquén.",
        tipo: "Capacitación",
        fechaInicio: "2024-06-15T09:00:00Z",
        fechaFin: "2024-06-16T17:00:00Z",
        horario: "9:00 a 17:00",
        ubicacion: "Centro de Convenciones, Neuquén Capital",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20management%20training",
        organizador: "Ministerio de Deportes de Neuquén",
        contacto: {
          email: "capacitaciones@deportes.neuquen.gob.ar",
          telefono: "+54 299 4495200",
        },
        cupos: 50,
        cuposDisponibles: 15,
        requisitos: [
          "Ser dirigente o personal administrativo de una institución deportiva registrada",
          "Tener conocimientos básicos de administración",
          "Traer computadora portátil (opcional)",
        ],
        documentos: [
          {
            nombre: "Programa de la capacitación",
            url: "#",
          },
          {
            nombre: "Formulario de inscripción",
            url: "#",
          },
        ],
        enlaces: [
          {
            nombre: "Sitio web del Ministerio de Deportes",
            url: "https://www.neuquen.gob.ar",
          },
        ],
        calendario: "#",
        eventosRelacionados: [
          {
            id: "3",
            titulo: "Taller: Marketing Digital para Instituciones Deportivas",
            imagen: "/placeholder.svg?height=200&width=300&query=digital%20marketing%20sports",
            tipo: "Capacitación",
            fecha: "2024-07-10T14:00:00Z",
          },
          {
            id: "5",
            titulo: "Conferencia: Financiamiento del Deporte",
            imagen: "/placeholder.svg?height=200&width=300&query=sports%20funding%20conference",
            tipo: "Conferencia",
            fecha: "2024-08-05T10:00:00Z",
          },
        ],
      },
      {
        id: "2",
        titulo: "Torneo Provincial de Deportes 2024",
        descripcion: "El evento deportivo más importante de la provincia con competencias en múltiples disciplinas.",
        contenido:
          "El Torneo Provincial de Deportes 2024 es el evento deportivo más importante de la provincia, con competencias en más de 20 disciplinas deportivas.\n\nLas competencias se desarrollarán en diferentes sedes de la provincia y contarán con la participación de instituciones deportivas de toda la región. Las disciplinas incluyen fútbol, básquet, vóley, natación, atletismo, tenis, hockey, handball, entre otras.\n\nEl torneo está organizado en categorías infantiles, juveniles y adultos, y otorgará puntos para el ranking provincial. Los equipos y deportistas ganadores representarán a la provincia en los torneos regionales y nacionales.\n\nLas inscripciones están abiertas hasta el 30 de junio y pueden realizarse a través de la plataforma digital del Ministerio de Deportes.",
        tipo: "Torneo",
        fechaInicio: "2024-08-10T08:00:00Z",
        fechaFin: "2024-11-30T20:00:00Z",
        horario: "Según cronograma",
        ubicacion: "Múltiples sedes en la provincia",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20tournament%20competition",
        organizador: "Subsecretaría de Deportes de Neuquén",
        contacto: {
          email: "torneos@deportes.neuquen.gob.ar",
          telefono: "+54 299 4495201",
        },
        requisitos: [
          "Instituciones deportivas registradas en el sistema provincial",
          "Deportistas federados o no federados según la categoría",
          "Documentación médica actualizada de los participantes",
        ],
        documentos: [
          {
            nombre: "Reglamento del torneo",
            url: "#",
          },
          {
            nombre: "Cronograma de competencias",
            url: "#",
          },
          {
            nombre: "Formulario de inscripción",
            url: "#",
          },
        ],
        enlaces: [
          {
            nombre: "Plataforma de inscripción",
            url: "#",
          },
          {
            nombre: "Resultados en vivo",
            url: "#",
          },
        ],
        eventosRelacionados: [
          {
            id: "6",
            titulo: "Ceremonia de Inauguración - Torneo Provincial",
            imagen: "/placeholder.svg?height=200&width=300&query=opening%20ceremony%20sports",
            tipo: "Otro",
            fecha: "2024-08-10T18:00:00Z",
          },
          {
            id: "7",
            titulo: "Entrega de Premios - Torneo Provincial",
            imagen: "/placeholder.svg?height=200&width=300&query=awards%20ceremony%20sports",
            tipo: "Otro",
            fecha: "2024-12-05T19:00:00Z",
          },
        ],
      },
      {
        id: "3",
        titulo: "Taller: Marketing Digital para Instituciones Deportivas",
        descripcion: "Aprenda a utilizar las herramientas digitales para promocionar su institución deportiva.",
        contenido:
          "Este taller práctico está diseñado para ayudar a las instituciones deportivas a mejorar su presencia digital y aprovechar las herramientas de marketing online.\n\nDurante la jornada, se abordarán temas como la creación y gestión de redes sociales, diseño de contenido atractivo, estrategias de comunicación digital, publicidad online, y análisis de métricas para medir resultados.\n\nEl taller incluirá ejercicios prácticos donde los participantes podrán trabajar en casos reales de sus propias instituciones, con la guía de especialistas en marketing digital deportivo.\n\nSe recomienda que los participantes traigan sus computadoras portátiles para poder realizar los ejercicios prácticos.",
        tipo: "Capacitación",
        fechaInicio: "2024-07-10T14:00:00Z",
        fechaFin: "2024-07-10T18:00:00Z",
        horario: "14:00 a 18:00",
        ubicacion: "Centro Cultural Provincial, Neuquén Capital",
        imagen: "/placeholder.svg?height=400&width=600&query=digital%20marketing%20sports%20workshop",
        organizador: "Ministerio de Deportes de Neuquén",
        contacto: {
          email: "capacitaciones@deportes.neuquen.gob.ar",
          telefono: "+54 299 4495200",
        },
        cupos: 30,
        cuposDisponibles: 8,
        requisitos: [
          "Conocimientos básicos de redes sociales",
          "Traer computadora portátil",
          "Tener acceso a las cuentas de redes sociales de su institución (opcional)",
        ],
        documentos: [
          {
            nombre: "Material del taller",
            url: "#",
          },
        ],
      },
      {
        id: "4",
        titulo: "Jornada de Actualización en Medicina Deportiva",
        descripcion: "Actualización en prevención y tratamiento de lesiones deportivas para profesionales de la salud.",
        contenido:
          "Esta jornada de actualización está dirigida a médicos, kinesiólogos, preparadores físicos y otros profesionales de la salud que trabajan con deportistas.\n\nDurante el evento, especialistas en medicina deportiva compartirán los últimos avances en prevención y tratamiento de lesiones deportivas, rehabilitación, nutrición deportiva, y evaluación de la condición física.\n\nLa jornada incluirá conferencias, talleres prácticos y mesas redondas donde los participantes podrán intercambiar experiencias y conocimientos con colegas y expertos en el campo.\n\nAl finalizar, se entregará un certificado de asistencia avalado por el Ministerio de Deportes y el Ministerio de Salud de la Provincia del Neuquén.",
        tipo: "Conferencia",
        fechaInicio: "2024-07-20T09:00:00Z",
        fechaFin: "2024-07-20T18:00:00Z",
        horario: "9:00 a 18:00",
        ubicacion: "Hospital Provincial Dr. Eduardo Castro Rendón, Neuquén Capital",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20medicine%20conference",
        organizador: "Ministerio de Deportes y Ministerio de Salud de Neuquén",
        contacto: {
          email: "medicinadeportiva@salud.neuquen.gob.ar",
          telefono: "+54 299 4490800",
        },
        cupos: 100,
        cuposDisponibles: 35,
        requisitos: [
          "Ser profesional de la salud o estudiante avanzado",
          "Presentar matrícula profesional o certificado de estudios",
        ],
        documentos: [
          {
            nombre: "Programa de la jornada",
            url: "#",
          },
          {
            nombre: "Formulario de inscripción",
            url: "#",
          },
        ],
        enlaces: [
          {
            nombre: "Sitio web del Ministerio de Salud",
            url: "https://www.saludneuquen.gob.ar",
          },
        ],
      },
      {
        id: "5",
        titulo: "Conferencia: Financiamiento del Deporte",
        descripcion:
          "Expertos nacionales e internacionales analizarán las diferentes fuentes de financiamiento para el deporte.",
        contenido:
          "Esta conferencia reunirá a expertos nacionales e internacionales para analizar las diferentes fuentes de financiamiento para el deporte, tanto público como privado.\n\nDurante el evento, se presentarán casos de éxito, se analizarán políticas públicas de financiamiento deportivo, y se explorarán alternativas como el patrocinio empresarial, el crowdfunding, y los programas de responsabilidad social corporativa.\n\nLa conferencia está dirigida a dirigentes deportivos, funcionarios públicos, empresarios interesados en el patrocinio deportivo, y profesionales del sector.\n\nEl evento contará con traducción simultánea para las presentaciones de los expertos internacionales.",
        tipo: "Conferencia",
        fechaInicio: "2024-08-05T10:00:00Z",
        fechaFin: "2024-08-05T17:00:00Z",
        horario: "10:00 a 17:00",
        ubicacion: "Hotel Casino Magic, Neuquén Capital",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20funding%20conference",
        organizador: "Ministerio de Deportes de Neuquén",
        contacto: {
          email: "conferencias@deportes.neuquen.gob.ar",
          telefono: "+54 299 4495200",
        },
        cupos: 150,
        cuposDisponibles: 72,
        documentos: [
          {
            nombre: "Programa de la conferencia",
            url: "#",
          },
          {
            nombre: "Perfiles de los expositores",
            url: "#",
          },
        ],
        enlaces: [
          {
            nombre: "Transmisión en vivo",
            url: "#",
          },
        ],
      },
      {
        id: "6",
        titulo: "Ceremonia de Inauguración - Torneo Provincial",
        descripcion: "Ceremonia oficial de inauguración del Torneo Provincial de Deportes 2024.",
        contenido:
          "La Ceremonia de Inauguración del Torneo Provincial de Deportes 2024 marcará el inicio oficial de este importante evento deportivo.\n\nLa ceremonia contará con un desfile de las delegaciones participantes, presentaciones artísticas, discursos de autoridades provinciales, y el encendido del pebetero que simboliza el espíritu deportivo del torneo.\n\nEl evento es abierto al público y se invita especialmente a las familias de los deportistas y a toda la comunidad a participar de esta celebración del deporte provincial.",
        tipo: "Otro",
        fechaInicio: "2024-08-10T18:00:00Z",
        fechaFin: "2024-08-10T21:00:00Z",
        horario: "18:00 a 21:00",
        ubicacion: "Estadio Ruca Che, Neuquén Capital",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20opening%20ceremony",
        organizador: "Subsecretaría de Deportes de Neuquén",
        enlaces: [
          {
            nombre: "Transmisión en vivo",
            url: "#",
          },
        ],
      },
      {
        id: "7",
        titulo: "Entrega de Premios - Torneo Provincial",
        descripcion: "Ceremonia de clausura y entrega de premios del Torneo Provincial de Deportes 2024.",
        contenido:
          "La Ceremonia de Entrega de Premios marcará la clausura oficial del Torneo Provincial de Deportes 2024.\n\nDurante el evento, se reconocerá a los equipos y deportistas destacados en las diferentes disciplinas y categorías, se entregarán medallas, trofeos y reconocimientos especiales.\n\nLa ceremonia contará con la presencia de autoridades provinciales, dirigentes deportivos, y figuras destacadas del deporte regional y nacional.\n\nEl evento es abierto al público y se transmitirá en vivo por los canales oficiales del gobierno provincial.",
        tipo: "Otro",
        fechaInicio: "2024-12-05T19:00:00Z",
        fechaFin: "2024-12-05T22:00:00Z",
        horario: "19:00 a 22:00",
        ubicacion: "Centro de Convenciones, Neuquén Capital",
        imagen: "/placeholder.svg?height=400&width=600&query=sports%20awards%20ceremony",
        organizador: "Subsecretaría de Deportes de Neuquén",
        enlaces: [
          {
            nombre: "Transmisión en vivo",
            url: "#",
          },
          {
            nombre: "Resultados finales",
            url: "#",
          },
        ],
      },
    ]

    return eventos
  } catch (error) {
    console.error("Error al obtener eventos:", error)
    return []
  }
}

// Función para obtener un evento por ID
export async function getEventoById(id: string): Promise<Evento | null> {
  try {
    // En una implementación real, aquí se consultaría la base de datos

    // Obtener todos los eventos y filtrar por ID
    const eventos = await getEventos()
    const evento = eventos.find((e) => e.id === id)

    return evento || null
  } catch (error) {
    console.error("Error al obtener evento por ID:", error)
    return null
  }
}

// Función para crear un nuevo evento
export async function crearEvento(data: Omit<Evento, "id" | "eventosRelacionados" | "calendario">) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se guardaría en la base de datos
    console.log("Creando nuevo evento:", data)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/eventos")
    revalidatePath("/dashboard/eventos")

    return { success: true }
  } catch (error) {
    console.error("Error al crear evento:", error)
    return { success: false, error: "Error al crear el evento" }
  }
}

// Función para actualizar un evento
export async function actualizarEvento(id: string, data: Partial<Evento>) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se actualizaría en la base de datos
    console.log("Actualizando evento:", id, data)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/eventos")
    revalidatePath(`/admin/eventos/${id}`)
    revalidatePath("/dashboard/eventos")
    revalidatePath(`/dashboard/eventos/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar evento:", error)
    return { success: false, error: "Error al actualizar el evento" }
  }
}

// Función para eliminar un evento
export async function eliminarEvento(id: string) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se eliminaría de la base de datos
    console.log("Eliminando evento:", id)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/admin/eventos")
    revalidatePath("/dashboard/eventos")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar evento:", error)
    return { success: false, error: "Error al eliminar el evento" }
  }
}

// Función para inscribirse en un evento
export async function inscribirseEvento(eventoId: string, datos: any) {
  try {
    // Verificar si el usuario está autenticado
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // En una implementación real, aquí se actualizaría la base de datos
    console.log("Inscripción en evento:", eventoId, datos)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/eventos")
    revalidatePath(`/dashboard/eventos/${eventoId}`)

    return { success: true }
  } catch (error) {
    console.error("Error al inscribirse en evento:", error)
    return { success: false, error: "Error al procesar la inscripción" }
  }
}

// Función para obtener las inscripciones de un evento
export async function getInscripcionesEvento(eventoId: string) {
  try {
    // Verificar si el usuario está autenticado y es administrador
    const user = await getCurrentUser()

    if (!user || user.rol !== "admin") {
      return { success: false, error: "No tiene permisos para realizar esta acción" }
    }

    // En una implementación real, aquí se consultaría la base de datos
    console.log("Obteniendo inscripciones del evento:", eventoId)

    // Datos simulados
    const inscripciones = [
      {
        id: "1",
        nombre: "Juan Pérez",
        email: "juan.perez@example.com",
        institucion: "Club Deportivo Neuquén",
        fechaInscripcion: "2024-05-10T14:30:00Z",
      },
      {
        id: "2",
        nombre: "María González",
        email: "maria.gonzalez@example.com",
        institucion: "Asociación Atlética Centenario",
        fechaInscripcion: "2024-05-11T09:15:00Z",
      },
      {
        id: "3",
        nombre: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com",
        institucion: "Club Social y Deportivo Plottier",
        fechaInscripcion: "2024-05-12T16:45:00Z",
      },
    ]

    return { success: true, inscripciones }
  } catch (error) {
    console.error("Error al obtener inscripciones:", error)
    return { success: false, error: "Error al obtener las inscripciones" }
  }
}
