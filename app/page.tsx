import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#87B867]">
      <header className="bg-[#2B3E4C] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/logo-gobierno-2024.png" alt="Logo Gobierno de Neuquén" className="h-20" />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-[#F4D7A9] bg-transparent text-[#F4D7A9] hover:bg-[#3a4f61] hover:text-[#F4D7A9]"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <section className="mb-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold text-[#2B3E4C]">Registro Provincial de Instituciones Deportivas</h2>
                <p className="text-lg text-[#2B3E4C]">
                  Plataforma oficial para el registro y gestión de documentación de instituciones deportivas de la
                  Provincia del Neuquén.
                </p>
                <div className="pt-4">
                  <Link href="/registro">
                    <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">Registrar Institución</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/paisaje-neuquen.jpg"
                  alt="Hermoso paisaje de la Provincia del Neuquén con lago azul y montañas"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-[#2B3E4C]">Tipos de Instituciones</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Club", icon: "🏆" },
                { title: "Federación", icon: "🏅" },
                { title: "Asociación", icon: "🤝" },
                { title: "Institución deportiva no regulada", icon: "🏃" },
              ].map((item, index) => (
                <Card key={index} className="overflow-hidden bg-white transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 text-4xl">{item.icon}</div>
                    <h3 className="mb-2 text-xl font-semibold text-[#2B3E4C]">{item.title}</h3>
                    <p className="mb-4 text-sm text-[#2B3E4C]">
                      Registro para {item.title.toLowerCase()} deportiva de la provincia.
                    </p>
                    <Link
                      href={`/registro?tipo=${encodeURIComponent(item.title)}`}
                      className="flex items-center text-[#2B3E4C]"
                    >
                      Registrar <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-[#2B3E4C]">Proceso de Registro</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: "1. Registro",
                  description: "Complete el formulario con los datos de su institución deportiva.",
                },
                {
                  title: "2. Documentación",
                  description: "Suba la documentación requerida para validar su institución.",
                },
                {
                  title: "3. Verificación",
                  description: "El equipo técnico verificará su documentación y actualizará su estado.",
                },
              ].map((step, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold text-[#2B3E4C]">{step.title}</h3>
                  <p className="text-[#2B3E4C]">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#2B3E4C] py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Gobierno de la Provincia del Neuquén</h3>
              <p className="text-sm">Ministerio de Deportes</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
              <p className="text-sm">contacto@deportes.neuquen.gob.ar</p>
              <p className="text-sm">+54 299 XXX-XXXX</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.neuquen.gob.ar/" className="hover:underline">
                    Sitio Oficial
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
            <p>© {new Date().getFullYear()} Gobierno de la Provincia del Neuquén. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
