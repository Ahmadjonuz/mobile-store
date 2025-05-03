"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import ProductCard from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { supabase } from "@/lib/supabase"
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'

// Category data with translations
const categoryData: Record<string, {
  translations: {
    en: { name: string; description: string }
    ru: { name: string; description: string }
    uz: { name: string; description: string }
  },
  brands: string[],
  priceRange: number[],
  features: string[],
}> = {
  flagship: {
    translations: {
      en: {
        name: "Flagship Phones",
        description: "Premium smartphones with cutting-edge technology",
      },
      ru: {
        name: "Флагманские телефоны",
        description: "Премиальные смартфоны с передовыми технологиями",
      },
      uz: {
        name: "Flagman telefonlar",
        description: "Eng ilg'or texnologiyali premium smartfonlar",
      },
    },
    brands: ["Apple", "Samsung", "Google", "Xiaomi"],
    priceRange: [800, 2000],
    features: ["5G", "Wireless Charging", "Water Resistant", "OLED Display", "High Refresh Rate"],
  },
  "mid-range": {
    translations: {
      en: {
        name: "Mid-range Phones",
        description: "Great performance at reasonable prices",
      },
      ru: {
        name: "Телефоны среднего класса",
        description: "Отличная производительность по разумным ценам",
      },
      uz: {
        name: "O'rta narxdagi telefonlar",
        description: "Qulay narxlarda ajoyib ishlash",
      },
    },
    brands: ["Samsung", "Xiaomi", "OnePlus", "Realme", "Oppo"],
    priceRange: [300, 800],
    features: ["5G", "Fast Charging", "High Resolution Camera", "Large Battery"],
  },
  budget: {
    translations: {
      en: {
        name: "Budget Phones",
        description: "Affordable options without compromising quality",
      },
      ru: {
        name: "Бюджетные телефоны",
        description: "Доступные варианты без ущерба для качества",
      },
      uz: {
        name: "Arzon telefonlar",
        description: "Sifatdan voz kechmasdan arzon variantlar",
      },
    },
    brands: ["Xiaomi", "Realme", "Poco", "Infinix", "Tecno"],
    priceRange: [100, 300],
    features: ["Large Battery", "Dual SIM", "Expandable Storage"],
  },
  foldable: {
    translations: {
      en: {
        name: "Foldable Phones",
        description: "Innovative designs with flexible displays",
      },
      ru: {
        name: "Складные телефоны",
        description: "Инновационные дизайны с гибкими дисплеями",
      },
      uz: {
        name: "Bukiladigan telefonlar",
        description: "Egiluvchan displeylar bilan innovatsion dizaynlar",
      },
    },
    brands: ["Samsung", "Huawei", "Motorola", "Xiaomi", "Oppo"],
    priceRange: [1000, 2500],
    features: ["Foldable Display", "Multi-window", "S Pen Support", "High-end Processor"],
  },
  gaming: {
    translations: {
      en: {
        name: "Gaming Phones",
        description: "High-performance devices optimized for mobile gaming",
      },
      ru: {
        name: "Игровые телефоны",
        description: "Высокопроизводительные устройства для мобильных игр",
      },
      uz: {
        name: "O'yin telefonlari",
        description: "Mobil o'yinlar uchun moslashtirilgan yuqori samarali qurilmalar",
      },
    },
    brands: ["ASUS ROG", "Nubia RedMagic", "Black Shark", "OnePlus", "Xiaomi"],
    priceRange: [500, 1500],
    features: ["High Refresh Rate", "Cooling System", "Gaming Triggers", "Large Battery", "RGB Lighting"],
  },
  camera: {
    translations: {
      en: {
        name: "Camera Phones",
        description: "Exceptional photography capabilities for content creators",
      },
      ru: {
        name: "Камерофоны",
        description: "Исключительные возможности фотографии для создателей контента",
      },
      uz: {
        name: "Kamera telefonlari",
        description: "Kontent yaratuvchilar uchun ajoyib suratga olish imkoniyatlari",
      },
    },
    brands: ["Google Pixel", "iPhone", "Samsung", "Vivo", "Xiaomi"],
    priceRange: [600, 1800],
    features: ["Multiple Cameras", "Optical Zoom", "Night Mode", "Pro Camera Controls", "8K Video"],
  },
}

// UI translations
const uiTranslations = {
  en: {
    filters: "Filters",
    clearAll: "Clear all",
    priceRange: "Price Range",
    min: "Min",
    max: "Max",
    brands: "Brands",
    features: "Features",
    sortBy: "Sort by",
    featured: "Featured",
    newest: "Newest",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    highestRated: "Highest Rated",
    products: "products",
    noProducts: "No products found. Try adjusting your filters.",
    loading: "Loading...",
  },
  ru: {
    filters: "Фильтры",
    clearAll: "Очистить все",
    priceRange: "Ценовой диапазон",
    min: "Мин",
    max: "Макс",
    brands: "Бренды",
    features: "Функции",
    sortBy: "Сортировать по",
    featured: "Рекомендуемые",
    newest: "Новейшие",
    priceLowToHigh: "Цена: от низкой к высокой",
    priceHighToLow: "Цена: от высокой к низкой",
    highestRated: "Самый высокий рейтинг",
    products: "товаров",
    noProducts: "Товары не найдены. Попробуйте изменить фильтры.",
    loading: "Загрузка...",
  },
  uz: {
    filters: "Filtrlar",
    clearAll: "Hammasini tozalash",
    priceRange: "Narx diapazoni",
    min: "Min",
    max: "Maks",
    brands: "Brendlar",
    features: "Xususiyatlar",
    sortBy: "Saralash",
    featured: "Tavsiya etilgan",
    newest: "Eng yangi",
    priceLowToHigh: "Narx: pastdan yuqoriga",
    priceHighToLow: "Narx: yuqoridan pastga",
    highestRated: "Eng yuqori baholangan",
    products: "mahsulotlar",
    noProducts: "Mahsulotlar topilmadi. Filtrlarni o'zgartirib ko'ring.",
    loading: "Yuklanmoqda...",
  },
}

type Product = {
  id: string
  name: string
  description: string
  image_url?: string
  price: number
  category: string
  brand?: string
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const { language } = useLanguage()
  const { formatPrice } = useCurrency()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  // Get category info or default to flagship if not found
  const categoryInfo = categoryData[category] || categoryData.flagship
  const t = uiTranslations[language]

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        // First get the category ID using the slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('slug', category)
          .single()

        console.log('Category data:', categoryData)
        console.log('Category error:', categoryError)

        if (categoryError) {
          setError(categoryError.message)
          setLoading(false)
          return
        }

        if (!categoryData) {
          setError('Kategoriya topilmadi')
          setLoading(false)
          return
        }

        // Then fetch products using the category ID
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryData.id)

        console.log('Products data:', data)
        console.log('Products error:', error)

        if (error) setError(error.message)
        else setProducts(data || [])
      } catch (err) {
        console.error('Error in fetchProducts:', err)
        setError('Xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category])

  useEffect(() => {
    toast({ title: "Test toast", description: "Toast ishlayapti!" })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
      <div className="text-lg text-muted-foreground">{t.loading || 'Yuklanmoqda...'}</div>
    </div>
  )
  if (error) return <div className="text-center text-red-500 py-10">Xatolik: {error}</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-primary/90 to-primary/60 p-8 text-white shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">{categoryInfo.translations[language].name}</h1>
        <p className="text-white">{categoryInfo.translations[language].description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[30vh]">
              <img src="/empty-box.svg" alt="No products" className="w-32 h-32 mb-4 opacity-60" />
              <p className="text-muted-foreground text-lg">{t.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border border-transparent hover:border-primary group flex flex-col">
                  <div className="relative w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-t-2xl overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="object-contain h-40 w-full transition-transform duration-200 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col px-5 py-4">
                    <h2 className="font-semibold text-lg mb-2 text-center line-clamp-1">{product.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center line-clamp-2">{product.description}</p>
                    <div className="font-bold text-primary text-xl mb-4 mt-auto text-center">{product.price.toLocaleString()} so'm</div>
                    <button
                      className="w-full py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition-colors mt-auto"
                      onClick={() => {
                        addToCart(product.id, 1, {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image_url: product.image_url || '',
                          brand: product.brand || ''  
                        })
                        toast({
                          title: "Savatga qo'shildi!",
                          description: `${product.name} savatga qo'shildi.`
                        })
                      }}
                    >
                      Savatga qo'shish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
