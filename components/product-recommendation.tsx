"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import Link from "next/link"

type Product = Database['public']['Tables']['products']['Row']

const translations = {
  en: {
    recommended: "Recommended for You",
    basedOn: "Based on your browsing history",
    viewAll: "View All",
  },
  ru: {
    recommended: "Рекомендуем вам",
    basedOn: "На основе вашей истории просмотров",
    viewAll: "Посмотреть все",
  },
  uz: {
    recommended: "Siz uchun tavsiya etiladi",
    basedOn: "Ko'rish tarixingizga asoslangan",
    viewAll: "Hammasini ko'rish",
  },
}

interface ProductRecommendationProps {
  excludeProductId?: string
  category?: string
  limit?: number
}

export default function ProductRecommendation({ excludeProductId, category, limit = 4 }: ProductRecommendationProps) {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [loading, setLoading] = useState(true)

  // Determine how many items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2)
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(3)
      } else {
        setItemsPerPage(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch recommended products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase
          .from('products')
          .select('*')
          .limit(limit)

        if (excludeProductId) {
          query = query.neq('id', excludeProductId)
        }

        if (category) {
          query = query.eq('category_id', category)
        }

        const { data, error } = await query
        if (error) throw error

        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching recommended products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [excludeProductId, category, limit])

  // Update visible products when products or currentIndex changes
  useEffect(() => {
    setVisibleProducts(products.slice(currentIndex, currentIndex + itemsPerPage))
  }, [products, currentIndex, itemsPerPage])

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(Math.max(0, products.length - itemsPerPage))
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t.recommended}</h2>
          <p className="text-muted-foreground text-sm">{t.basedOn}</p>
        </div>
        <Link href="/products" passHref legacyBehavior>
          <Button asChild variant="ghost" className="hidden sm:flex">
            <a>{t.viewAll}</a>
          </Button>
        </Link>
      </div>

      <div className="relative">
        {products.length > itemsPerPage && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={nextSlide}
              disabled={currentIndex + itemsPerPage >= products.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            initial={{ x: 0 }}
            animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {visibleProducts.map((product) => (
              <motion.div
                key={product.id}
                className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        {products.length > itemsPerPage && (
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
              <Button
                key={index}
                variant={Math.floor(currentIndex / itemsPerPage) === index ? "default" : "outline"}
                size="icon"
                className="w-2 h-2 rounded-full p-0"
                onClick={() => setCurrentIndex(index * itemsPerPage)}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
