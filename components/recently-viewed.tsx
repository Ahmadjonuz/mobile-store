"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import ProductCard from "@/components/product-card"
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']

interface RecentlyViewedProps {
  excludeProductId?: string
  limit?: number
}

export default function RecentlyViewed({ excludeProductId, limit = 3 }: RecentlyViewedProps) {
  const { language } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

        const { data, error } = await query
        if (error) throw error

        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching recently viewed products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [excludeProductId, limit])

  if (loading) {
    return <div>Loading...</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
