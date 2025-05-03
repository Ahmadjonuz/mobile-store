"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Star, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/contexts/currency-context"
import { Database } from '@/types/supabase'
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { cn } from "@/lib/utils"

type Product = Database['public']['Tables']['products']['Row']

export default function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const { formatPrice } = useCurrency()
  const { t, language } = useLanguage()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product.id, 1, {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '/placeholder.png',
      brand: product.brand
    })
    toast({
      title: t("configurator.addToCart"),
      description: `${product.name} ${language === "ru" ? "добавлен в корзину" : language === "uz" ? "savatga qo'shildi" : "has been added to your cart."}`,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: language === "ru" ? "Удалено из избранного" : language === "uz" ? "Sevimlilardan o'chirildi" : "Removed from wishlist",
        description: `${product.name} ${language === "ru" ? "удален из избранного" : language === "uz" ? "sevimlilardan o'chirildi" : "has been removed from your wishlist."}`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || '/placeholder.png',
        brand: product.brand
      })
      toast({
        title: language === "ru" ? "Добавлено в избранное" : language === "uz" ? "Sevimlilarga qo'shildi" : "Added to wishlist",
        description: `${product.name} ${language === "ru" ? "добавлен в избранное" : language === "uz" ? "sevimlilarga qo'shildi" : "has been added to your wishlist."}`,
      })
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="overflow-hidden h-full border-0 shadow-lg transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
        <CardContent className="p-0">
          <div className="relative">
            <div className="hover:scale-105 transition">
              <img
                src={product.image_url || '/placeholder.png'}
                alt={product.name}
                className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {product.rating > 4 && (
              <Badge className="absolute top-2 right-2 bg-green-500 text-white">New</Badge>
            )}
          </div>
          <div className="p-4 flex flex-col h-full">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.brand}</p>

            <div className="flex items-center justify-between mt-2 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1 text-sm">{product.rating}</span>
                <span className="ml-1 text-xs text-gray-500">({product.reviews_count})</span>
              </div>
              <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={e => { e.preventDefault(); handleAddToCart(e); }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
              </Button>
              <Button
                variant={isWishlisted ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-1",
                  isWishlisted && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                )}
                onClick={e => { e.preventDefault(); handleWishlistToggle(e); }}
              >
                <Heart className={cn("h-4 w-4 mr-1", isWishlisted && "fill-current")} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
