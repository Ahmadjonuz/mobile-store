"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from '@/lib/supabase'

type Category = {
  id: string
  name: string
  image_url: string
  color: string
  product_count: number
}

export default function CategorySection() {
  const ref = useRef(null)
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            id,
            name,
            image_url,
            color
          `)

        if (error) {
          setError(error.message)
          return
        }
        if (data) {
          const categoriesWithCount = await Promise.all(
            data.map(async (category) => {
              const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', category.id)
              return {
                ...category,
                product_count: count || 0
              }
            })
          )
          setCategories(categoriesWithCount)
        }
      } catch (error) {
        setError('Kategoriyalarni yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[250px] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Hozircha kategoriyalar mavjud emas</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.id} className="h-full">
          <Link href={`/category/${category.id}`} className="block h-full">
            <div className="relative overflow-hidden rounded-xl group h-[250px] bg-white dark:bg-gray-900 shadow transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 z-10`} />
              <img
                src={category.image_url || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-white p-6 text-center">
                <h3 className="font-bold text-2xl mb-2">{category.name}</h3>
                <p className="text-white/90 mb-4">
                  {language === "uz" && `${category.product_count} ta mahsulot`}
                  {language === "ru" && `${category.product_count} товаров`}
                  {language === "en" && `${category.product_count} products`}
                </p>
                <span className="inline-block px-4 py-2 rounded-full border-2 border-white/80 text-sm font-medium hover:bg-white/20 transition-colors">
                  {language === "uz" && "Kolleksiyani ko‘rish"}
                  {language === "ru" && "Посмотреть коллекцию"}
                  {language === "en" && "Browse Collection"}
                </span>
              </div>
              {/* Burchaklar */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-white/60 z-20" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-white/60 z-20" />
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
