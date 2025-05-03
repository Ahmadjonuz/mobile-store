"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import SearchBar from '@/components/search-bar'     
import { Slider } from '@/components/ui/slider'
import { useLanguage } from "@/contexts/language-context"

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 20000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('created_at')
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
        setCategories(categoriesData || [])

        let query = supabase.from('products').select('*')
        const searchQuery = searchParams.get('q') || ''
        const categoryQuery = searchParams.get('category') || ''
        const minPrice = searchParams.get('minPrice') || '0'
        const maxPrice = searchParams.get('maxPrice') || '20000000'
        const sort = searchParams.get('sort') || 'created_at'

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`)
        }
        if (categoryQuery) {
          const uuids = categoryQuery.split(',').filter(id => /^[0-9a-fA-F-]{36}$/.test(id));
          if (uuids.length > 0) {
            query = query.in('category_id', uuids)
          }
        }
        query = query
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .order(sort, { ascending: sort === 'price' })

        const { data: productsData, error: productsError } = await query
        if (productsError) throw new Error(productsError.message)
        setProducts(productsData || [])
        setError(null)
      } catch (err: any) {
        setError(err?.message || JSON.stringify(err) || String(err))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchParams, sortBy])

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    setSelectedCategories(newCategories)
    updateUrl({ category: newCategories.join(',') })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    updateUrl({
      minPrice: values[0].toString(),
      maxPrice: values[1].toString(),
    })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateUrl({ sort: value })
  }

  const updateUrl = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    window.history.pushState(null, '', `?${newParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg text-muted-foreground">
          {language === "uz" && "Yuklanmoqda..."}
          {language === "ru" && "Загрузка..."}
          {language === "en" && "Loading..."}
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "uz" && "Xatolik"}
            {language === "ru" && "Ошибка"}
            {language === "en" && "Error"}
          </h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "uz" && "Mahsulotlar topilmadi"}
            {language === "ru" && "Товары не найдены"}
            {language === "en" && "No products found"}
          </h2>
          <p className="text-gray-600">
            {language === "uz" && "Qidiruv yoki filtrlarni o'zgartirib ko'ring"}
            {language === "ru" && "Попробуйте изменить поиск или фильтры"}
            {language === "en" && "Try changing your search or filters"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Hero */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-primary/90 to-primary/60 p-8 text-white shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {language === "uz" && "Mahsulotlar katalogi"}
          {language === "ru" && "Каталог товаров"}
          {language === "en" && "Products Catalog"}
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          {language === "uz" && "Eng so'nggi va zamonaviy smartfonlar, planshetlar va aksessuarlar — hammasi bir joyda!"}
          {language === "ru" && "Самые современные смартфоны, планшеты и аксессуары — все в одном месте!"}
          {language === "en" && "The latest and most modern smartphones, tablets, and accessories — all in one place!"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-background rounded-2xl shadow-lg p-6 mb-8 md:mb-0 flex-shrink-0">
          <SearchBar />
          <Separator className="my-6" />
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {language === "uz" && "Kategoriyalar"}
              {language === "ru" && "Категории"}
              {language === "en" && "Categories"}
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                    className="mr-2"
                  />
                  <label htmlFor={category.id} className="text-sm cursor-pointer">
                    {typeof category.name === 'object' ? category.name[language] : category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {language === "uz" && "Narx oralig'i"}
              {language === "ru" && "Диапазон цен"}
              {language === "en" && "Price Range"}
            </h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={handlePriceChange}
              min={0}
              max={20000000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{priceRange[0].toLocaleString()} so'm</span>
              <span>{priceRange[1].toLocaleString()} so'm</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="font-semibold mb-4">
              {language === "uz" && "Saralash"}
              {language === "ru" && "Сортировка"}
              {language === "en" && "Sort By"}
            </h3>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">
                  {language === "uz" && "Yangi"}
                  {language === "ru" && "Новые"}
                  {language === "en" && "Newest"}
                </SelectItem>
                <SelectItem value="price">
                  {language === "uz" && "Narx"}
                  {language === "ru" && "Цена"}
                  {language === "en" && "Price"}
                </SelectItem>
                <SelectItem value="rating">
                  {language === "uz" && "Reyting"}
                  {language === "ru" && "Рейтинг"}
                  {language === "en" && "Rating"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
