'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/types'
import ProductCard from './product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductsList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })

  // Mahsulotlarni yuklash
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        // Filtrlarni URL ga qo'shish
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value)
        })
        params.set('page', currentPage.toString())
        
        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Mahsulotlarni yuklab olishda xatolik yuz berdi')
        }
        
        const data = await response.json()
        setProducts(data.products)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Noma\'lum xatolik')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters, currentPage])

  // URL ni yangilash
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`?${params.toString()}`)
  }, [filters, router])

  // Filtrlarni o'zgartirish
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Filtrlarni o'zgartirganda 1-sahifaga qaytish
  }

  // Sahifalarni almashtirish
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Yuklanmoqda...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Xatolik: {error}</div>
  }

  return (
    <div className="space-y-8">
      {/* Filtrlar va qidirish */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mahsulotlarni qidirish..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategoriya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Barcha kategoriyalar</SelectItem>
            <SelectItem value="flagship">Flagship</SelectItem>
            <SelectItem value="mid-range">Mid-range</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="foldable">Foldable</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.brand}
          onValueChange={(value) => handleFilterChange('brand', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Brend" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Barcha brendlar</SelectItem>
            <SelectItem value="Apple">Apple</SelectItem>
            <SelectItem value="Samsung">Samsung</SelectItem>
            <SelectItem value="Google">Google</SelectItem>
            <SelectItem value="Xiaomi">Xiaomi</SelectItem>
            <SelectItem value="OnePlus">OnePlus</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saralash" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Yangi</SelectItem>
            <SelectItem value="price">Narx</SelectItem>
            <SelectItem value="rating">Reyting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mahsulotlar ro'yxati */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
