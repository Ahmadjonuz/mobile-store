"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    sizeGuide: "Size Guide",
    dimensions: "Dimensions",
    comparison: "Comparison",
    height: "Height",
    width: "Width",
    depth: "Depth",
    weight: "Weight",
    model: "Model",
    screen: "Screen",
  },
  ru: {
    sizeGuide: "Руководство по размерам",
    dimensions: "Размеры",
    comparison: "Сравнение",
    height: "Высота",
    width: "Ширина",
    depth: "Глубина",
    weight: "Вес",
    model: "Модель",
    screen: "Экран",
  },
  uz: {
    sizeGuide: "O'lcham qo'llanmasi",
    dimensions: "O'lchamlar",
    comparison: "Taqqoslash",
    height: "Balandlik",
    width: "Kenglik",
    depth: "Chuqurlik",
    weight: "Og'irlik",
    model: "Model",
    screen: "Ekran",
  },
}

// Mock phone dimensions data
const phoneDimensions = [
  {
    model: "UltraPhone 15 Pro",
    height: "160.7 mm",
    width: "77.6 mm",
    depth: "8.25 mm",
    weight: "221 g",
    screen: '6.7"',
  },
  {
    model: "UltraPhone 15",
    height: "146.7 mm",
    width: "71.5 mm",
    depth: "7.80 mm",
    weight: "171 g",
    screen: '6.1"',
  },
  {
    model: "Galaxy S25 Ultra",
    height: "162.3 mm",
    width: "77.9 mm",
    depth: "8.6 mm",
    weight: "233 g",
    screen: '6.8"',
  },
  {
    model: "Pixel 9 Pro",
    height: "158.8 mm",
    width: "75.2 mm",
    depth: "8.5 mm",
    weight: "210 g",
    screen: '6.5"',
  },
]

interface SizeGuideProps {
  productName?: string
  children?: React.ReactNode
}

export default function SizeGuide({ productName, children }: SizeGuideProps) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const [open, setOpen] = useState(false)

  // Find the current product in the dimensions data
  const currentProduct = phoneDimensions.find((phone) => phone.model === productName) || phoneDimensions[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || <Button variant="link">{t.sizeGuide}</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.sizeGuide}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="dimensions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dimensions">{t.dimensions}</TabsTrigger>
            <TabsTrigger value="comparison">{t.comparison}</TabsTrigger>
          </TabsList>
          <TabsContent value="dimensions" className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border px-4 py-2 text-left">{t.model}</th>
                    <th className="border px-4 py-2 text-left">{t.height}</th>
                    <th className="border px-4 py-2 text-left">{t.width}</th>
                    <th className="border px-4 py-2 text-left">{t.depth}</th>
                    <th className="border px-4 py-2 text-left">{t.weight}</th>
                    <th className="border px-4 py-2 text-left">{t.screen}</th>
                  </tr>
                </thead>
                <tbody>
                  {phoneDimensions.map((phone) => (
                    <tr
                      key={phone.model}
                      className={phone.model === productName ? "bg-primary/10" : "hover:bg-muted/20"}
                    >
                      <td className="border px-4 py-2">{phone.model}</td>
                      <td className="border px-4 py-2">{phone.height}</td>
                      <td className="border px-4 py-2">{phone.width}</td>
                      <td className="border px-4 py-2">{phone.depth}</td>
                      <td className="border px-4 py-2">{phone.weight}</td>
                      <td className="border px-4 py-2">{phone.screen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="comparison" className="pt-4">
            <div className="relative h-[300px] bg-muted/20 rounded-lg p-4">
              {/* Visual comparison of phone sizes */}
              <div className="flex items-end justify-center h-full">
                {phoneDimensions.map((phone) => {
                  // Calculate relative height based on the tallest phone
                  const maxHeight = Math.max(...phoneDimensions.map((p) => Number.parseFloat(p.height)))
                  const relativeHeight = (Number.parseFloat(phone.height) / maxHeight) * 80
                  const relativeWidth = (Number.parseFloat(phone.width) / 80) * 40

                  return (
                    <div key={phone.model} className="flex flex-col items-center mx-2">
                      <div
                        className={`rounded-lg border-2 ${
                          phone.model === productName ? "border-primary bg-primary/10" : "border-muted-foreground/20"
                        }`}
                        style={{
                          height: `${relativeHeight}%`,
                          width: `${relativeWidth}px`,
                          minWidth: "30px",
                        }}
                      />
                      <div className="mt-2 text-xs text-center max-w-[80px] truncate">{phone.model}</div>
                      <div className="text-xs text-muted-foreground">{phone.screen}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
