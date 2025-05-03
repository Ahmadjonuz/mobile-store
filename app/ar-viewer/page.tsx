"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

// Mock phone data
const phones = [
  {
    id: "1",
    name: "UltraPhone 15 Pro",
    model: "ultraphone-15-pro",
    price: 999,
    image: "/placeholder.svg?height=400&width=200",
  },
  {
    id: "2",
    name: "UltraPhone 15",
    model: "ultraphone-15",
    price: 799,
    image: "/placeholder.svg?height=400&width=200",
  },
  {
    id: "3",
    name: "UltraPhone SE",
    model: "ultraphone-se",
    price: 499,
    image: "/placeholder.svg?height=400&width=200",
  },
]

const translations = {
  en: {
    arViewer: "AR Viewer",
    scanQrCode: "Scan this QR code with your phone to view in AR",
    viewIn3d: "View in 3D",
    viewInAr: "View in AR",
    backToProduct: "Back to product",
    share: "Share",
    notSupported: "AR is not supported on your device",
    loading: "Loading AR experience...",
    instructions: "Point your camera at a flat surface to place the phone",
  },
  es: {
    arViewer: "Visor de RA",
    scanQrCode: "Escanea este código QR con tu teléfono para ver en RA",
    viewIn3d: "Ver en 3D",
    viewInAr: "Ver en RA",
    backToProduct: "Volver al producto",
    share: "Compartir",
    notSupported: "RA no es compatible con tu dispositivo",
    loading: "Cargando experiencia de RA...",
    instructions: "Apunta tu cámara a una superficie plana para colocar el teléfono",
  },
  fr: {
    arViewer: "Visionneuse RA",
    scanQrCode: "Scannez ce code QR avec votre téléphone pour voir en RA",
    viewIn3d: "Voir en 3D",
    viewInAr: "Voir en RA",
    backToProduct: "Retour au produit",
    share: "Partager",
    notSupported: "La RA n'est pas prise en charge sur votre appareil",
    loading: "Chargement de l'expérience RA...",
    instructions: "Pointez votre caméra vers une surface plane pour placer le téléphone",
  },
}

export default function ARViewer() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [isARSupported, setIsARSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations]

  const phone = phones.find((p) => p.id === id) || phones[0]

  useEffect(() => {
    // Check if AR is supported
    const checkARSupport = async () => {
      try {
        // This is a simplified check - in a real app, you'd use proper AR libraries
        const isSupported = "xr" in navigator || "webkitXR" in navigator
        setIsARSupported(isSupported)
        setIsLoading(false)
      } catch (error) {
        setIsARSupported(false)
        setIsLoading(false)
      }
    }

    checkARSupport()

    // Simulate AR loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${phone.name} in AR`,
        text: `Check out the ${phone.name} in augmented reality!`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-6">
          <Link href={`/products/${id}`}>
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {t.backToProduct}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.arViewer}</h1>
          <Button variant="ghost" onClick={handleShare}>
            <Share2 size={16} />
            <span className="sr-only">{t.share}</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 flex flex-col items-center">
            <div className="relative w-full h-[500px] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t.loading}</p>
                </div>
              ) : isARSupported ? (
                <div className="text-center">
                  <img
                    src={phone.image || "/placeholder.svg"}
                    alt={phone.name}
                    className="h-[400px] object-contain mx-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 text-white p-4 rounded-lg">{t.instructions}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={phone.image || "/placeholder.svg"}
                    alt={phone.name}
                    className="h-[400px] object-contain mx-auto"
                  />
                  <p className="text-red-500 mt-4">{t.notSupported}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-4 w-full">
              <Button className="flex-1">{t.viewIn3d}</Button>
              <Button className="flex-1" variant={isARSupported ? "default" : "secondary"} disabled={!isARSupported}>
                {t.viewInAr}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{phone.name}</h2>
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">{t.scanQrCode}</p>
              <div className="bg-white p-4 inline-block rounded-lg">
                {/* Placeholder for QR code */}
                <div className="w-[200px] h-[200px] bg-gray-200 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-2 border-gray-400 grid grid-cols-3 grid-rows-3">
                    <div className="border-2 border-gray-800 m-1 col-span-1 row-span-1"></div>
                    <div className="border-2 border-gray-800 m-1 col-span-1 row-span-1 col-start-3"></div>
                    <div className="border-2 border-gray-800 m-1 col-span-1 row-span-1 row-start-3"></div>
                    <div className="border-2 border-gray-800 m-1 col-span-1 row-span-1 col-start-3 row-start-3"></div>
                    <div className="border-2 border-gray-800 m-1 col-span-1 row-span-1 col-start-2 row-start-2"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Features:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>360° view of the phone</li>
                <li>Place the phone in your environment</li>
                <li>Examine details up close</li>
                <li>See the phone in different colors</li>
              </ul>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
