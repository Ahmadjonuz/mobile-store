"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PresentationControls, Stage, useGLTF, Html } from "@react-three/drei"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ShoppingCart, Heart, Share2, Maximize2, Minimize2, RotateCcw, Camera } from "lucide-react"

// Mock phone data - in a real app, this would come from an API
const phones = {
  "phone-x-pro": {
    id: "phone-x-pro",
    name: "PhoneX Pro",
    basePrice: 999,
    colors: [
      { name: "Midnight Black", value: "#111111", textureMap: null },
      { name: "Silver", value: "#E0E0E0", textureMap: null },
      { name: "Gold", value: "#FFD700", textureMap: null },
      { name: "Pacific Blue", value: "#005A9C", textureMap: null },
    ],
    storage: [
      { size: "128GB", priceModifier: 0 },
      { size: "256GB", priceModifier: 100 },
      { size: "512GB", priceModifier: 200 },
      { size: "1TB", priceModifier: 400 },
    ],
    features: ["5G", "Triple Camera", "Face ID", "Water Resistant"],
    modelPath: "/assets/3d/phone.glb", // Using a placeholder path
  },
  "phone-y": {
    id: "phone-y",
    name: "PhoneY",
    basePrice: 799,
    colors: [
      { name: "Black", value: "#111111", textureMap: null },
      { name: "White", value: "#FFFFFF", textureMap: null },
      { name: "Red", value: "#FF0000", textureMap: null },
      { name: "Green", value: "#00FF00", textureMap: null },
    ],
    storage: [
      { size: "64GB", priceModifier: 0 },
      { size: "128GB", priceModifier: 100 },
      { size: "256GB", priceModifier: 200 },
    ],
    features: ["5G", "Dual Camera", "Face ID", "Water Resistant"],
    modelPath: "/assets/3d/phone.glb", // Using a placeholder path
  },
}

// Translations
const translations = {
  en: {
    configurator: "3D Configurator",
    customize: "Customize Your Phone",
    color: "Color",
    storage: "Storage",
    price: "Price",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    share: "Share",
    download: "Download",
    features: "Features",
    specifications: "Specifications",
    reviews: "Reviews",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen",
    resetView: "Reset View",
    takeScreenshot: "Take Screenshot",
    processor: "Processor",
    display: "Display",
    camera: "Camera",
    battery: "Battery",
    connectivity: "Connectivity",
    dimensions: "Dimensions",
    weight: "Weight",
    os: "Operating System",
  },
  es: {
    configurator: "Configurador 3D",
    customize: "Personaliza Tu Teléfono",
    color: "Color",
    storage: "Almacenamiento",
    price: "Precio",
    addToCart: "Añadir al Carrito",
    addToWishlist: "Añadir a Favoritos",
    share: "Compartir",
    download: "Descargar",
    features: "Características",
    specifications: "Especificaciones",
    reviews: "Reseñas",
    fullscreen: "Pantalla Completa",
    exitFullscreen: "Salir de Pantalla Completa",
    resetView: "Restablecer Vista",
    takeScreenshot: "Capturar Pantalla",
    processor: "Procesador",
    display: "Pantalla",
    camera: "Cámara",
    battery: "Batería",
    connectivity: "Conectividad",
    dimensions: "Dimensiones",
    weight: "Peso",
    os: "Sistema Operativo",
  },
  fr: {
    configurator: "Configurateur 3D",
    customize: "Personnalisez Votre Téléphone",
    color: "Couleur",
    storage: "Stockage",
    price: "Prix",
    addToCart: "Ajouter au Panier",
    addToWishlist: "Ajouter aux Favoris",
    share: "Partager",
    download: "Télécharger",
    features: "Caractéristiques",
    specifications: "Spécifications",
    reviews: "Avis",
    fullscreen: "Plein Écran",
    exitFullscreen: "Quitter le Plein Écran",
    resetView: "Réinitialiser la Vue",
    takeScreenshot: "Prendre une Capture d'Écran",
    processor: "Processeur",
    display: "Écran",
    camera: "Caméra",
    battery: "Batterie",
    connectivity: "Connectivité",
    dimensions: "Dimensions",
    weight: "Poids",
    os: "Système d'Exploitation",
  },
  // Add more languages as needed
}

// Phone 3D Model component
function PhoneModel({ color, modelPath }) {
  const { scene } = useGLTF("/assets/3d/duck.glb") // Using duck as placeholder

  useEffect(() => {
    // Apply color to the model
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color)
      }
    })
  }, [color, scene])

  return <primitive object={scene} scale={2} />
}

// Loading fallback
function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-primary font-medium">Loading 3D Model...</p>
      </div>
    </Html>
  )
}

export default function ProductConfiguratorPage() {
  const params = useParams()
  const phoneId = params.id
  const phone = phones[phoneId] || phones["phone-x-pro"] // Default to first phone if ID not found

  const { language } = useLanguage()
  const { currency, convertPrice } = useCurrency()
  const t = translations[language] || translations.en

  const [selectedColor, setSelectedColor] = useState(phone.colors[0])
  const [selectedStorage, setSelectedStorage] = useState(phone.storage[0])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)

  // Calculate price based on selections
  const totalPrice = phone.basePrice + selectedStorage.priceModifier

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Reset view
  const resetView = () => {
    setZoom(1)
    // The OrbitControls reset will be handled by the ref in a real implementation
  }

  // Take screenshot
  const takeScreenshot = () => {
    // In a real implementation, this would capture the canvas and download it
    alert("Screenshot functionality would be implemented here")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Breadcrumb */}
        <nav className="w-full mb-4">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <a href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </a>
              <ChevronRight className="h-4 w-4 mx-1" />
            </li>
            <li className="flex items-center">
              <a href="/products" className="text-muted-foreground hover:text-foreground">
                Products
              </a>
              <ChevronRight className="h-4 w-4 mx-1" />
            </li>
            <li className="text-foreground font-medium">{phone.name}</li>
          </ol>
        </nav>

        {/* 3D Viewer */}
        <div className="lg:w-2/3 relative">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px] w-full relative">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                  <Suspense fallback={<ModelLoader />}>
                    <PresentationControls
                      global
                      zoom={zoom}
                      rotation={[0, 0, 0]}
                      polar={[-Math.PI / 3, Math.PI / 3]}
                      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                    >
                      <Stage environment="studio" intensity={0.5} contactShadow shadows>
                        <PhoneModel color={selectedColor.value} modelPath={phone.modelPath} />
                      </Stage>
                    </PresentationControls>
                    <OrbitControls enablePan={false} />
                  </Suspense>
                </Canvas>

                {/* Controls overlay */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? t.exitFullscreen : t.fullscreen}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="secondary" size="icon" onClick={resetView} title={t.resetView}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={takeScreenshot} title={t.takeScreenshot}>
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Options */}
        <div className="lg:w-1/3">
          <h1 className="text-3xl font-bold mb-2">{phone.name}</h1>
          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold mr-2">
              {currency.symbol}
              {convertPrice(totalPrice, currency.code)}
            </span>
            {selectedStorage.priceModifier > 0 && (
              <Badge variant="outline" className="ml-2">
                +{currency.symbol}
                {convertPrice(selectedStorage.priceModifier, currency.code)}
              </Badge>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t.customize}</h2>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">{t.color}</h3>
            <div className="flex flex-wrap gap-3">
              {phone.colors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor.name === color.name
                      ? "border-primary ring-2 ring-primary ring-opacity-50"
                      : "border-muted-foreground border-opacity-20"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-sm mt-2">{selectedColor.name}</p>
          </div>

          {/* Storage Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">{t.storage}</h3>
            <RadioGroup
              value={selectedStorage.size}
              onValueChange={(value) => {
                const storage = phone.storage.find((s) => s.size === value)
                if (storage) setSelectedStorage(storage)
              }}
              className="grid grid-cols-2 gap-2"
            >
              {phone.storage.map((storage) => (
                <div key={storage.size} className="flex items-center space-x-2">
                  <RadioGroupItem value={storage.size} id={`storage-${storage.size}`} />
                  <Label htmlFor={`storage-${storage.size}`} className="flex justify-between w-full">
                    <span>{storage.size}</span>
                    {storage.priceModifier > 0 && (
                      <span className="text-sm text-muted-foreground">
                        +{currency.symbol}
                        {convertPrice(storage.priceModifier, currency.code)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">{t.features}</h3>
            <div className="flex flex-wrap gap-2">
              {phone.features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" /> {t.addToCart}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" /> {t.addToWishlist}
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> {t.share}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">{t.specifications}</TabsTrigger>
            <TabsTrigger value="features">{t.features}</TabsTrigger>
            <TabsTrigger value="reviews">{t.reviews}</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">{t.processor}</h3>
                <p className="text-sm text-muted-foreground">A15 Bionic chip with 6-core CPU</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.display}</h3>
                <p className="text-sm text-muted-foreground">6.1-inch Super Retina XDR display</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.camera}</h3>
                <p className="text-sm text-muted-foreground">Triple 12MP camera system with ultra wide and telephoto</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.battery}</h3>
                <p className="text-sm text-muted-foreground">Up to 19 hours video playback</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.connectivity}</h3>
                <p className="text-sm text-muted-foreground">5G, Wi-Fi 6, Bluetooth 5.0</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.dimensions}</h3>
                <p className="text-sm text-muted-foreground">146.7 x 71.5 x 7.65 mm</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.weight}</h3>
                <p className="text-sm text-muted-foreground">174 grams</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t.os}</h3>
                <p className="text-sm text-muted-foreground">iOS 16</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="features" className="p-4">
            <ul className="list-disc pl-5 space-y-2">
              {phone.features.map((feature) => (
                <li key={feature} className="text-sm">
                  {feature}
                </li>
              ))}
              <li className="text-sm">Water and dust resistant (IP68)</li>
              <li className="text-sm">Ceramic Shield front</li>
              <li className="text-sm">Face ID facial recognition</li>
              <li className="text-sm">MagSafe wireless charging</li>
              <li className="text-sm">iOS 16 with Focus mode and Lock Screen widgets</li>
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
