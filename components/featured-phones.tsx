"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { supabase } from '@/lib/supabase'
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

type Phone = {
  id: string
  name: string
  brand: string
  price: number
  image_url: string
  specs: Record<string, string>
  description: string
  discount?: number
  old_price?: number
  is_new?: boolean
}

export default function FeaturedPhones() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [phones, setPhones] = useState<Phone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  useEffect(() => {
    async function fetchFeatured() {
      try {
        console.log('Fetching featured phones...')
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4)

        if (error) {
          console.error('Supabase error:', error)
          setError(error.message)
          return
        }

        console.log('Raw data from Supabase:', data)
        
        if (data && data.length > 0) {
          const phonesWithImages = data.map(phone => ({
            ...phone,
            image_url: phone.image_url || "/images/placeholder-phone.png"
          }))
          console.log('Processed phones data:', phonesWithImages)
          setPhones(phonesWithImages)
        } else {
          console.log('No phones data received')
          setError('Hozircha telefonlar mavjud emas')
        }
      } catch (error) {
        console.error('Error:', error)
        setError('Telefonlarni yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[400px] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <p className="text-sm mt-2">Debug info: {JSON.stringify({ phones, error }, null, 2)}</p>
      </div>
    )
  }

  if (phones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Hozircha telefonlar mavjud emas</p>
        <p className="text-sm mt-2">Debug info: {JSON.stringify({ phones, error }, null, 2)}</p>
      </div>
    )
  }

  const handleAddToCart = (id: string) => {
    const phone = phones.find((p) => p.id === id)
    if (phone) {
      addToCart(phone.id, 1, {
        id: phone.id,
        name: phone.name,
        price: phone.price,
        image_url: phone.image_url,
        brand: phone.brand,
      })
      
      toast({
        title: t("featured.addedToCartTitle"),
        description: `${phone.name} ${t("featured.addedToCartDesc")}`,
      })
    }
  }

  const handleAddToWishlist = (phone: Phone) => {
    addToWishlist({
      id: phone.id,
      name: phone.name,
      price: phone.price,
      image_url: phone.image_url,
      brand: phone.brand
    })
    toast({
      title: t("featured.addedToWishlistTitle"),
      description: t("featured.addedToWishlistDesc"), 
    })
  }

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 1 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
    >
      {phones.map((phone) => (
        <motion.div
          key={phone.id}
          variants={item}
          onMouseEnter={() => setHoveredId(phone.id)}
          onMouseLeave={() => setHoveredId(null)}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
          className="w-full"
        >
          <Card className="overflow-hidden h-full border-0 shadow-lg bg-background">
            <div className="relative pt-4 px-4">
              {phone.discount && (
                <Badge className="absolute top-6 left-6 z-10 bg-red-500 hover:bg-red-600">-{phone.discount}%</Badge>
              )}
              {phone.is_new && (
                <Badge
                  variant="outline"
                  className="absolute top-6 right-6 z-10 bg-black text-white hover:bg-black/90 border-none"
                >
                  {t("featured.new")}
                </Badge>
              )}
              <div className="relative h-[220px] w-full flex items-center justify-center group bg-background rounded-lg">
                <img
                  src={phone.image_url}
                  alt={phone.name}
                  className="h-[180px] w-auto object-contain"
                />
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white text-black hover:bg-white/90"
                    onClick={() => handleAddToCart(phone.id)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">{t("featured.addToCart")}</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white text-black hover:bg-white/90 border-none"
                    onClick={() => handleAddToWishlist(phone)}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">{t("featured.addToWishlist")}</span>
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4 relative">
              <div className="text-sm text-muted-foreground mb-1">{phone.brand}</div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{phone.name}</h3>
              {phone.specs && typeof phone.specs === "object" && (
                <ul className="text-muted-foreground text-xs mb-4 space-y-1">
                  {Object.entries(phone.specs as Record<string, string>).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-1">
                      <span className="font-medium">{key}:</span> 
                      <span className="line-clamp-1">{value}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{formatPrice(phone.price)}</span>
                  {phone.old_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(phone.old_price)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
