"use client"

import { useWishlist } from "@/contexts/wishlist-context"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist()
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart(product.id, 1, product)
    toast({
      title: t('cart.success'),
      description: t('cart.addedToCart')
    })
  }

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id)
    toast({
      title: t('wishlist.success'),
      description: t('wishlist.removed')
    })
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('wishlist.empty')}</h1>
          <p className="text-muted-foreground mb-6">{t('wishlist.emptyDescription')}</p>
          <Link href="/products">
            <Button>{t('wishlist.continueShopping')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('wishlist.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                <p className="font-bold">{formatPrice(item.product.price)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(item.product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('cart.addToCart')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
