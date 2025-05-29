import Link from "next/link"
import type { ReactNode } from "react"
import { FileText, Home, LogOut, Settings, User, Bell, Newspaper, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotificacionesDropdown from "@/components/notificaciones-dropdown"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
            <div className="flex items-center space-x-4">
              <NotificacionesDropdown />
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#3a4f61]">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white">
          <nav className="flex flex-col p-4">
            <div className="mb-6 px-2 py-4">
              <div className="mb-2 text-sm font-medium text-gray-500">MENÚ PRINCIPAL</div>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" />
                      Inicio
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/documentacion">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Documentación
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/notificaciones">
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notificaciones
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/noticias">
                    <Button variant="ghost" className="w-full justify-start">
                      <Newspaper className="mr-2 h-4 w-4" />
                      Noticias
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/eventos">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Eventos
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/editar-perfil">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/configuracion">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>

      <footer className="bg-[#007934] py-4 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gobierno de la Provincia del Neuquén. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
