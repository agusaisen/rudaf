"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, Printer } from "lucide-react"

interface PDFViewerProps {
  url: string
  title: string
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handlePrint = () => {
    // En una implementación real, aquí se imprimiría el PDF
    window.print()
  }

  const handleDownload = () => {
    // En una implementación real, aquí se descargaría el PDF
    const link = document.createElement("a")
    link.href = url
    link.download = title.replace(/\s+/g, "-").toLowerCase() + ".pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>Ver PDF</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" />
              Descargar
            </Button>
          </div>
        </DialogHeader>
        <div className="h-[70vh] w-full">
          <iframe src={url} className="h-full w-full rounded border" title={title} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
