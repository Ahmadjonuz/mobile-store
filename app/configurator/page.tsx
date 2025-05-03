"use client"

import React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { Separator } from "@/components/ui/separator"
import * as THREE from 'three'
// Mock phone model - in a real app, this would be a proper 3D model
function PhoneModel({ color, ...props }: { color: string }) {
  const { nodes, materials } = useGLTF("/placeholder.svg") || { nodes: {}, materials: {} }
  const { viewport } = useThree()
  const ref = useRef<THREE.Group>(null)

  // Simulate a phone model with a simple box
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* Phone body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Phone screen */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[0.9, 1.8]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Camera bump */}
      <mesh position={[0.3, 0.8, 0.051]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Button */}
      <mesh position={[0.55, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.03]} />
        <meshStandardMaterial color="darkgray" />
      </mesh>
    </group>
  )
}

const colors = [
  { name: "Midnight Black", value: "black", hex: "#000000" },
  { name: "Stellar Silver", value: "silver", hex: "#C0C0C0" },
  { name: "Ocean Blue", value: "blue", hex: "#0077be" },
  { name: "Cosmic Purple", value: "purple", hex: "#800080" },
  { name: "Rose Gold", value: "rosegold", hex: "#B76E79" },
]

const storageOptions = [
  { name: "128GB", value: "128", price: 0 },
  { name: "256GB", value: "256", price: 100 },
  { name: "512GB", value: "512", price: 200 },
  { name: "1TB", value: "1024", price: 350 },
]

export default function ConfiguratorPage() {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { toast } = useToast()
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0])
  const [isRotating, setIsRotating] = useState(true)
  const [activeTab, setActiveTab] = useState("appearance")
  const [isAdding, setIsAdding] = useState(false)

  const basePrice = 999
  const totalPrice = basePrice + selectedStorage.price

  const handleAddToCart = () => {
    setIsAdding(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Added to cart",
        description: `UltraPhone Pro (${selectedColor.name}, ${selectedStorage.name}) has been added to your cart.`,
      })
      setIsAdding(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{t("configurator.title")}</h1>
      <p className="text-muted-foreground mb-8">Customize your UltraPhone Pro to match your style and needs.</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 3D Model Viewer */}
        <div className="h-[500px] bg-gradient-to-b from-muted/50 to-muted rounded-xl overflow-hidden relative">
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <PhoneModel color={selectedColor.hex} />
            <Environment preset="city" />
            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={1.5} far={5} />
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              autoRotate={isRotating}
              autoRotateSpeed={2}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
            />
          </Canvas>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background/80 backdrop-blur-sm"
              onClick={() => setIsRotating(!isRotating)}
            >
              {isRotating ? "Stop Rotation" : "Start Rotation"}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary/20"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
                animate={{
                  y: [null, Math.random() * 100 + "%"],
                  x: [null, Math.random() * 100 + "%"],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Configuration Options */}
        <div>
          <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">{t("configurator.color")}</h2>
                <div className="grid grid-cols-5 gap-4">
                  {colors.map((color) => (
                    <motion.div
                      key={color.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`cursor-pointer flex flex-col items-center ${
                        selectedColor.value === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                      } rounded-lg p-2`}
                    >
                      <div
                        className="w-12 h-12 rounded-full mb-2"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-center">{color.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-lg font-medium mb-4">{t("configurator.storage")}</h2>
                <RadioGroup
                  value={selectedStorage.value}
                  onValueChange={(value) => {
                    const option = storageOptions.find(opt => opt.value === value)
                    if (option) setSelectedStorage(option)
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  {storageOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <RadioGroupItem
                        value={option.value}
                        id={`storage-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`storage-${option.value}`}
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-medium">{option.name}</span>
                        {option.price > 0 ? (
                          <span className="text-sm text-muted-foreground">+{formatPrice(option.price)}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Base model</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Display</h3>
                    <p className="text-sm text-muted-foreground">6.7" Super Retina XDR, 120Hz ProMotion</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Processor</h3>
                    <p className="text-sm text-muted-foreground">A18 Pro chip with 6-core CPU</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Camera</h3>
                    <p className="text-sm text-muted-foreground">Triple 12MP Ultra Wide, Wide, and Telephoto</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Battery</h3>
                    <p className="text-sm text-muted-foreground">Up to 23 hours of video playback</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
