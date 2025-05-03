"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Star, Eye, Plus, Minus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"

const translations = {
  en: {
    quickView: "Quick View",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    viewDetails: "View Details",
    description: "Description",
    specifications: "Specifications",
    reviews: "Reviews",
    quantity: "Quantity",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    color: "Color",
    storage: "Storage",
  },
  ru: {
    quickView: "Быстрый просмотр",
    addToCart: "В корзину",
    addToWishlist: "В избранное",
    viewDetails: "Подробнее",
    description: "Описание",
    specifications: "Характеристики",
    reviews: "Отзывы",
    quantity: "Количество",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    color: "Цвет",
    storage: "Память",
  },
  uz: {
    quickView: "Tezkor ko'rish",
    addToCart: "Savatga qo'shish",
    addToWishlist: "Sevimlilar ro'yxatiga qo'shish",
    viewDetails: "Batafsil ma'lumot",
    description: "Tavsif",
    specifications: "Xususiyatlar",
    reviews: "Sharhlar",
    quantity: "Miqdori",
    inStock: "Mavjud",
    outOfStock: "Mavjud emas",
    color: "Rang",
    storage: "Xotira",
  },
}

interface QuickViewDialogProps {
  product: {
    id: number | string
    name: string
    brand: string
    price: number
    oldPrice?: number | null
    image: string
    rating?: number
    reviewCount?: number
    isNew?: boolean
    discount?: number | null
    description?: string
    specifications?: Record<string, string>
    colors?: Array<{ name: string; value: string }>
    storage?: Array<{ size: string; priceModifier: number }>
    inStock?: boolean
  }
  children?: React.ReactNode
}

export default function QuickViewDialog({ product, children }: QuickViewDialogProps) {
  const { language } = useLanguage()
  const { formatPrice } = useCurrency()
  const t = translations[language] || translations.en

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.value || "")
  const [selectedStorage, setSelectedStorage] = useState(product.storage?.[0]?.size || "")
  const [open, setOpen] = useState(false)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Calculate final price based on selected storage
  const getPrice = () => {
    const basePrice = product.price
    if (product.storage && selectedStorage) {
      const storageOption = product.storage.find((option) => option.size === selectedStorage)
      if (storageOption) {
        return basePrice + storageOption.priceModifier
      }
    }
    return basePrice
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="rounded-full" title={t.quickView}>
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative bg-muted/20 flex items-center justify-center p-8">
            {product.discount && (
              <Badge className="absolute top-4 left-4 z-10 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
            )}
            {product.isNew && (
              <Badge
                variant="outline"
                className="absolute top-4 right-4 z-10 bg-black text-white hover:bg-black/90 border-none"
              >
                NEW
              </Badge>
            )}
            <motion.img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="max-h-[300px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="mb-2 text-sm text-muted-foreground">{product.brand}</div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold">{formatPrice(getPrice())}</span>
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through ml-3">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <Tabs defaultValue="description" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">{t.description}</TabsTrigger>
                <TabsTrigger value="specifications">{t.specifications}</TabsTrigger>
                <TabsTrigger value="reviews">{t.reviews}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4 h-[120px] overflow-y-auto">
                <p className="text-sm text-muted-foreground">
                  {product.description ||
                    "Experience the future with this cutting-edge smartphone featuring the latest technology, stunning display, and powerful performance. Perfect for photography enthusiasts and mobile gamers alike."}
                </p>
              </TabsContent>
              <TabsContent value="specifications" className="pt-4 h-[120px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <span className="font-medium">Display:</span> 6.7" AMOLED
                      </div>
                      <div>
                        <span className="font-medium">Processor:</span> Octa-core
                      </div>
                      <div>
                        <span className="font-medium">RAM:</span> 8GB
                      </div>
                      <div>
                        <span className="font-medium">Camera:</span> 50MP + 12MP + 8MP
                      </div>
                      <div>
                        <span className="font-medium">Battery:</span> 5000mAh
                      </div>
                      <div>
                        <span className="font-medium">OS:</span> Android 14
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4 h-[120px] overflow-y-auto">
                <p className="text-sm text-center text-muted-foreground">
                  {product.reviewCount ? `${product.reviewCount} reviews available.` : "No reviews yet."}
                </p>
              </TabsContent>
            </Tabs>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">{t.color}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color.value
                          ? "border-primary ring-2 ring-primary ring-opacity-50"
                          : "border-muted-foreground border-opacity-20"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.storage && product.storage.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">{t.storage}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.storage.map((option) => (
                    <Button
                      key={option.size}
                      variant={selectedStorage === option.size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStorage(option.size)}
                      className="min-w-[60px]"
                    >
                      {option.size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">{t.quantity}</h3>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={increaseQuantity}>
                  <Plus className="h-3 w-3" />
                </Button>
                <span className="ml-4 text-sm">
                  {product.inStock !== false ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {t.inStock}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {t.outOfStock}
                    </Badge>
                  )}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" disabled={product.inStock === false}>
                <ShoppingCart className="mr-2 h-4 w-4" /> {t.addToCart}
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" /> {t.addToWishlist}
              </Button>
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <a href={`/products/${product.id}`}>{t.viewDetails}</a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
