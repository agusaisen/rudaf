import Link from "next/link"
import type { ReactNode } from "react"
import { Home, LogOut, Settings, User, Users, BarChart, Bell, Newspaper, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotificacionesDropdown from "@/components/notificaciones-dropdown"

interface AdminDashboardLayoutProps {
  children: ReactNode
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
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
              <div className="mb-2 text-sm font-medium text-gray-500">ADMINISTRACIÓN</div>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" />
                      Inicio
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/instituciones">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Instituciones
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/reportes">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart className="mr-2 h-4 w-4" />
                      Reportes
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/noticias">
                    <Button variant="ghost" className="w-full justify-start">
                      <Newspaper className="mr-2 h-4 w-4" />
                      Noticias
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/eventos">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Eventos
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/notificaciones">
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notificaciones
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/usuarios">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Usuarios
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/configuracion">
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
