"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const phones = [
  {
    id: 1,
    name: "Galaxy Ultra S25",
    brand: "Samsung",
    price: 1199,
    image: "/placeholder.svg?height=400&width=300",
    specs: {
      display: '6.8" AMOLED, 120Hz',
      camera: "108MP + 12MP + 10MP",
      battery: "5000mAh",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "256GB",
      os: "Android 15",
    },
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 1099,
    image: "/placeholder.svg?height=400&width=300",
    specs: {
      display: '6.1" Super Retina XDR, 120Hz',
      camera: "48MP + 12MP + 12MP",
      battery: "4400mAh",
      processor: "A18 Bionic",
      ram: "8GB",
      storage: "128GB",
      os: "iOS 18",
    },
  },
  {
    id: 3,
    name: "Pixel 9 Pro",
    brand: "Google",
    price: 899,
    image: "/placeholder.svg?height=400&width=300",
    specs: {
      display: '6.3" OLED, 120Hz',
      camera: "50MP + 48MP + 12MP",
      battery: "4800mAh",
      processor: "Tensor G4",
      ram: "12GB",
      storage: "256GB",
      os: "Android 15",
    },
  },
]

export default function PhoneComparisonSection() {
  const [selectedPhones, setSelectedPhones] = useState([phones[0], phones[1]])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const handlePhoneChange = (index: number, phoneId: number) => {
    const newSelectedPhones = [...selectedPhones]
    newSelectedPhones[index] = phones.find((phone) => phone.id === phoneId) || phones[0]
    setSelectedPhones(newSelectedPhones)
  }

  return (
    <section ref={ref} className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Compare Phones</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not sure which phone is right for you? Compare the specs and features of our most popular models side by
            side.
          </p>
        </motion.div>

        <Tabs defaultValue="specs" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Headers */}
              <div className="col-span-1">
                <div className="h-[200px] flex items-end pb-4">
                  <motion.h3
                    className="text-lg font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    Specifications
                  </motion.h3>
                </div>
                {Object.keys(phones[0].specs).map((spec, index) => (
                  <motion.div
                    key={spec}
                    className="py-4 border-t flex items-center font-medium capitalize"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    {spec}
                  </motion.div>
                ))}
                <motion.div
                  className="py-4 border-t font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  Price
                </motion.div>
              </div>

              {/* Phone columns */}
              {[0, 1].map((index) => (
                <div key={index} className="col-span-1">
                  <motion.div
                    className="h-[200px] flex flex-col items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  >
                    <select
                      className="w-full p-2 rounded-md border mb-4"
                      value={selectedPhones[index].id}
                      onChange={(e) => handlePhoneChange(index, Number(e.target.value))}
                    >
                      {phones.map((phone) => (
                        <option key={phone.id} value={phone.id}>
                          {phone.brand} {phone.name}
                        </option>
                      ))}
                    </select>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <img
                        src={selectedPhones[index].image || "/placeholder.svg"}
                        alt={selectedPhones[index].name}
                        className="h-[120px] object-contain"
                      />
                    </motion.div>
                  </motion.div>

                  {Object.entries(selectedPhones[index].specs).map(([key, value], specIndex) => (
                    <motion.div
                      key={key}
                      className="py-4 border-t text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.4 + specIndex * 0.1 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                  <motion.div
                    className="py-4 border-t text-center font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                  >
                    ${selectedPhones[index].price}
                  </motion.div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="features" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Headers */}
              <div className="col-span-1">
                <div className="h-[200px] flex items-end pb-4">
                  <motion.h3
                    className="text-lg font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    Features
                  </motion.h3>
                </div>
                {[
                  "Water Resistance",
                  "Wireless Charging",
                  "5G Support",
                  "Face Recognition",
                  "Fingerprint Sensor",
                  "Fast Charging",
                  "Expandable Storage",
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="py-4 border-t flex items-center font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>

              {/* Phone columns */}
              {[0, 1].map((index) => (
                <div key={index} className="col-span-1">
                  <motion.div
                    className="h-[200px] flex flex-col items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  >
                    <select
                      className="w-full p-2 rounded-md border mb-4"
                      value={selectedPhones[index].id}
                      onChange={(e) => handlePhoneChange(index, Number(e.target.value))}
                    >
                      {phones.map((phone) => (
                        <option key={phone.id} value={phone.id}>
                          {phone.brand} {phone.name}
                        </option>
                      ))}
                    </select>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <img
                        src={selectedPhones[index].image || "/placeholder.svg"}
                        alt={selectedPhones[index].name}
                        className="h-[120px] object-contain"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Feature checks - these would normally come from data */}
                  {[
                    index === 0 ? true : true,
                    index === 0 ? true : true,
                    index === 0 ? true : true,
                    index === 0 ? true : index === 1,
                    index === 0 ? true : true,
                    index === 0 ? true : true,
                    index === 0 ? false : false,
                  ].map((hasFeature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="py-4 border-t text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.4 + featureIndex * 0.1 }}
                    >
                      {hasFeature ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Button className="group">
            View Full Comparison
            <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
