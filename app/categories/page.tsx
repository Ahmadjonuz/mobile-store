"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Category = {
  id: string
  name: string
  description: string
  slug: string
  image_url?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')

        if (error) {
          setError(error.message)
          return
        }

        if (data) {
          setCategories(data)
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
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        Toifalar
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.id}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer h-full flex flex-col items-center group">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-20 h-20 object-cover rounded-full mb-4 border group-hover:scale-105 transition"
                />
              )}
              <h2 className="text-lg font-semibold mb-2 text-center">{category.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}