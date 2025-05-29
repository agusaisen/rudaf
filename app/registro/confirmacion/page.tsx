import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmacionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#87B867]">
      <header className="bg-[#2B3E4C] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <img src="/logo-gobierno-2024.png" alt="Logo Gobierno de Neuquén" className="h-20" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-md bg-white text-center">
            <CardHeader>
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-[#2B3E4C]">¡Registro Exitoso!</CardTitle>
              <CardDescription className="text-[#2B3E4C]/70">
                Su institución ha sido registrada correctamente en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#2B3E4C]">
                Hemos enviado un correo electrónico con los datos de acceso a la dirección proporcionada.
              </p>
              <p className="text-[#2B3E4C]">
                Por favor, revise su bandeja de entrada (y la carpeta de spam) para encontrar las instrucciones sobre
                cómo acceder al sistema y cargar la documentación requerida.
              </p>
              <div className="rounded-lg bg-[#F4D7A9]/30 p-4 text-left">
                <h3 className="mb-2 font-semibold text-[#2B3E4C]">Próximos pasos:</h3>
                <ol className="ml-5 list-decimal space-y-1 text-[#2B3E4C]">
                  <li>Inicie sesión con las credenciales enviadas</li>
                  <li>Complete su perfil institucional</li>
                  <li>Cargue la documentación requerida</li>
                  <li>Espere la verificación por parte del equipo técnico</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#2B3E4C] text-[#2B3E4C] hover:bg-[#2B3E4C] hover:text-[#F4D7A9]"
                >
                  Volver al inicio
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-[#2B3E4C] text-[#F4D7A9] hover:bg-[#3a4f61]">Iniciar sesión</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-[#2B3E4C] py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gobierno de la Provincia del Neuquén. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
