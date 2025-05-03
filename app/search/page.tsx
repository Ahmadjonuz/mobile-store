"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, Filter, ChevronRight, Star, X, SlidersHorizontal } from "lucide-react"

type Language = 'en' | 'es' | 'fr' | 'ru'

interface Product {
  id: number
  name: string
  brand: string
  price: number
  oldPrice: number | null
  image: string
  rating: number
  reviewCount: number
  isNew: boolean
  discount: number | null
  category: string
  tags: string[]
}

// Mock products data - in a real app, this would come from an API
const productsData: Product[] = [
  {
    id: 1,
    name: "PhoneX Pro",
    brand: "TechX",
    price: 999,
    oldPrice: 1099,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviewCount: 128,
    isNew: true,
    discount: 9,
    category: "flagship",
    tags: ["5G", "OLED", "Face ID"],
  },
  {
    id: 2,
    name: "Galaxy Ultra",
    brand: "Samsung",
    price: 1199,
    oldPrice: null,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviewCount: 256,
    isNew: true,
    discount: null,
    category: "flagship",
    tags: ["5G", "AMOLED", "Water Resistant"],
  },
  {
    id: 3,
    name: "Pixel Pro",
    brand: "Google",
    price: 899,
    oldPrice: 999,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviewCount: 192,
    isNew: false,
    discount: 10,
    category: "flagship",
    tags: ["5G", "OLED", "Best Camera"],
  },
  {
    id: 4,
    name: "Mi Ultra",
    brand: "Xiaomi",
    price: 799,
    oldPrice: 899,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    reviewCount: 156,
    isNew: false,
    discount: 11,
    category: "flagship",
    tags: ["5G", "AMOLED", "Fast Charging"],
  },
  {
    id: 5,
    name: "OnePlus Pro",
    brand: "OnePlus",
    price: 899,
    oldPrice: null,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviewCount: 178,
    isNew: true,
    discount: null,
    category: "flagship",
    tags: ["5G", "Fluid AMOLED", "Fast Charging"],
  },
  {
    id: 6,
    name: "PhoneX SE",
    brand: "TechX",
    price: 499,
    oldPrice: null,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    reviewCount: 98,
    isNew: false,
    discount: null,
    category: "mid-range",
    tags: ["5G", "LCD", "Face ID"],
  },
  {
    id: 7,
    name: "Galaxy A",
    brand: "Samsung",
    price: 399,
    oldPrice: 449,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.0,
    reviewCount: 112,
    isNew: false,
    discount: 11,
    category: "mid-range",
    tags: ["5G", "AMOLED", "Triple Camera"],
  },
  {
    id: 8,
    name: "Pixel A",
    brand: "Google",
    price: 449,
    oldPrice: null,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    reviewCount: 87,
    isNew: true,
    discount: null,
    category: "mid-range",
    tags: ["5G", "OLED", "Great Camera"],
  },
]

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    search: "Search",
    searchResults: "Search Results",
    filters: "Filters",
    clearAll: "Clear All",
    price: "Price",
    brand: "Brand",
    category: "Category",
    rating: "Rating",
    features: "Features",
    sort: "Sort By",
    featured: "Featured",
    newest: "Newest",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    bestRated: "Best Rated",
    noResults: "No results found",
    tryDifferent: "Try different keywords or filters",
    min: "Min",
    max: "Max",
    apply: "Apply",
    reset: "Reset",
    andUp: "& Up",
    flagship: "Flagship",
    midRange: "Mid-range",
    budget: "Budget",
    foldable: "Foldable",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    showMore: "Show More",
    showLess: "Show Less",
    resultsFound: "results found",
    resultFound: "result found",
    mobileFilters: "Mobile Filters",
  },
  es: {
    search: "Buscar",
    searchResults: "Resultados de Búsqueda",
    filters: "Filtros",
    clearAll: "Borrar Todo",
    price: "Precio",
    brand: "Marca",
    category: "Categoría",
    rating: "Calificación",
    features: "Características",
    sort: "Ordenar Por",
    featured: "Destacados",
    newest: "Más Nuevos",
    priceLowToHigh: "Precio: Bajo a Alto",
    priceHighToLow: "Precio: Alto a Bajo",
    bestRated: "Mejor Calificados",
    noResults: "No se encontraron resultados",
    tryDifferent: "Intenta con diferentes palabras clave o filtros",
    min: "Mín",
    max: "Máx",
    apply: "Aplicar",
    reset: "Reiniciar",
    andUp: "y más",
    flagship: "Gama Alta",
    midRange: "Gama Media",
    budget: "Económico",
    foldable: "Plegable",
    addToCart: "Añadir al Carrito",
    addToWishlist: "Añadir a Favoritos",
    showMore: "Mostrar Más",
    showLess: "Mostrar Menos",
    resultsFound: "resultados encontrados",
    resultFound: "resultado encontrado",
    mobileFilters: "Filtros Móviles",
  },
  fr: {
    search: "Rechercher",
    searchResults: "Résultats de Recherche",
    filters: "Filtres",
    clearAll: "Tout Effacer",
    price: "Prix",
    brand: "Marque",
    category: "Catégorie",
    rating: "Évaluation",
    features: "Caractéristiques",
    sort: "Trier Par",
    featured: "En Vedette",
    newest: "Plus Récents",
    priceLowToHigh: "Prix: Croissant",
    priceHighToLow: "Prix: Décroissant",
    bestRated: "Mieux Notés",
    noResults: "Aucun résultat trouvé",
    tryDifferent: "Essayez différents mots-clés ou filtres",
    min: "Min",
    max: "Max",
    apply: "Appliquer",
    reset: "Réinitialiser",
    andUp: "et plus",
    flagship: "Haut de Gamme",
    midRange: "Milieu de Gamme",
    budget: "Économique",
    foldable: "Pliable",
    addToCart: "Ajouter au Panier",
    addToWishlist: "Ajouter aux Favoris",
    showMore: "Afficher Plus",
    showLess: "Afficher Moins",
    resultsFound: "résultats trouvés",
    resultFound: "résultat trouvé",
    mobileFilters: "Filtres Mobiles",
  },
  ru: {
    search: "Поиск",
    searchResults: "Результаты поиска",
    filters: "Фильтры",
    clearAll: "Очистить все",
    price: "Цена",
    brand: "Бренд",
    category: "Категория",
    rating: "Рейтинг",
    features: "Характеристики",
    sort: "Сортировать по",
    featured: "Рекомендуемые",
    newest: "Новинки",
    priceLowToHigh: "Цена: по возрастанию",
    priceHighToLow: "Цена: по убыванию",
    bestRated: "Лучшие оценки",
    noResults: "Ничего не найдено",
    tryDifferent: "Попробуйте другие ключевые слова или фильтры",
    min: "Мин",
    max: "Макс",
    apply: "Применить",
    reset: "Сбросить",
    andUp: "и выше",
    flagship: "Флагман",
    midRange: "Средний класс",
    budget: "Бюджетный",
    foldable: "Складной",
    addToCart: "Добавить в корзину",
    addToWishlist: "Добавить в избранное",
    showMore: "Показать больше",
    showLess: "Показать меньше",
    resultsFound: "найдено результатов",
    resultFound: "найден результат",
    mobileFilters: "Мобильные фильтры"
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const { language } = useLanguage()
  const { currency, formatPrice } = useCurrency()
  const t = translations[language as Language] || translations.en
  
  const [searchTerm, setSearchTerm] = useState(query)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  
  // Available filter options
  const brands = [...new Set(productsData.map(product => product.brand))]
  const categories = ["flagship", "mid-range", "budget", "foldable"]
  
  // Filter and sort products
  useEffect(() => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...productsData]
      
      // Filter by search term
      if (searchTerm) {
        results = results.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }
      
      // Filter by price range
      results = results.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      )
      
      // Filter by brands
      if (selectedBrands.length > 0) {
        results = results.filter(product => selectedBrands.includes(product.brand))
      }
      
      // Filter by categories
      if (selectedCategories.length > 0) {
        results = results.filter(product => selectedCategories.includes(product.category))
      }
      
      // Filter by rating
      if (minRating > 0) {
        results = results.filter(product => product.rating >= minRating)
      }
      
      // Sort products
      switch (sortBy) {
        case "newest":
          results = results.filter(product => product.isNew).concat(results.filter(product => !product.isNew))
          break
        case "price-low":
          results.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          results.sort((a, b) => b.price - a.price)
          break
        case "rating":
          results.sort((a, b) => b.rating - a.rating)
          break
        default:
          // Featured - default sorting
          break
      }
      
      setFilteredProducts(results)
      setIsLoading(false)
    }, 500)
  }, [searchTerm, priceRange, selectedBrands, selectedCategories, minRating, sortBy])
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 1500])
    setSelectedBrands([])
    setSelectedCategories([])
    setMinRating(0)
    setSortBy("featured")
  }
  
  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    )
  }
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "flagship": return t.flagship
      case "mid-range": return t.midRange
      case "budget": return t.budget
      case "foldable": return t.foldable
      default: return category
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">{t.searchResults}</h1>
      
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </li>
          <li className="text-foreground font-medium">{t.searchResults}</li>
        </ol>
      </nav>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t.search}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">{t.filters}</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  {t.clearAll}
                </Button>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{t.price}</h3>
                <div className="mb-4">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1500}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">{t.min}:</span>
                    <span className="ml-1 font-medium">{formatPrice(priceRange[0])}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{t.max}:</span>
                    <span className="ml-1 font-medium">{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{t.brand}</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{t.category}</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {getCategoryLabel(category)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Rating */}
              <div>
                <h3 className="font-medium mb-3">{t.rating}</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <span>{t.andUp}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {t.filters}
          </Button>
        </div>
        
        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-background p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">{t.mobileFilters}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Mobile Filters Content - Same as desktop but in a drawer */}
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3">{t.price}</h3>
                    <div className="mb-4">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={1500}
                        step={50}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">{t.min}:</span>
                        <span className="ml-1 font-medium">{formatPrice(priceRange[0])}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.max}:</span>
                        <span className="ml-1 font-medium">{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Brands */}
                  <div>
                    <h3 className="font-medium mb-3">{t.brand}</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <label
                            htmlFor={`mobile-brand-${brand}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">{t.category}</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`mobile-category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {getCategoryLabel(category)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Rating */}
                  <div>
                    <h3 className="font-medium mb-3">{t.rating}</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
                          />
                          <label
                            htmlFor={`mobile-rating-${rating}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <div className="flex mr-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <span>{t.andUp}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={resetFilters}>
                    {t.reset}
                  </Button>
                  <Button onClick={() => setIsMobileFiltersOpen(false)}>
                    {t.apply}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Products */}
        <div className="flex-1">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-muted-foreground mb-4 sm:mb-0">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? t.resultFound : t.resultsFound}
            </p>
            
            <div className="flex items-center">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground mr-2">{t.sort}:</span>
              <select
                className="bg-transparent border-0 focus:ring-0 text-sm font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">{t.featured}</option>
                <option value="newest">{t.newest}</option>
                <option value="price-low">{t.priceLowToHigh}</option>
                <option value="price-high">{t.priceHighToLow}</option>
                <option value="rating">{t.bestRated}</option>
              </select>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-muted animate-pulse" />
                    <div className="p-4">
                      <div className="h-4 bg-muted animate-pulse rounded mb-2 w-3/4" />
                      <div className="h-4 bg-muted animate-pulse rounded mb-4 w-1/2" />
                      <div className="h-6 bg-muted animate-pulse rounded mb-4 w-1/3" />
                      <div className="flex justify-between">
                        <div className="h-8 bg-muted animate-pulse rounded w-24" />
                        <div className="h-8 bg-muted animate-pulse rounded w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h2 className="text-2xl font-bold mb-4">{t.noResults}</h2>
                <p className="text-muted-foreground mb-8">{t.tryDifferent}</p>
                <Button onClick={resetFilters}>{t.clearAll}</Button>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/products/${product.id}`} className="block h-full">
                    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-0">
                        <div className="relative">
                          {product.discount && (
                            <Badge className="absolute top-4 left-4 z-10 bg-red-500 hover:bg-red-600">
                              -{product.discount}%
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge
                              variant="outline"
                              className="absolute top-4 right-4 z-10 bg-black text-white hover:bg-black/90 border-none"
                            >
                              NEW
                            </Badge>
                          )}
                          <div className="h-48 bg-muted/20 flex items-center justify-center">
                            <motion.img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full object-contain"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground mb-1">{product.brand}</div>
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <div className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              {product.price ? formatPrice(product.price) : "Price not available"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.oldPrice && formatPrice(product.oldPrice)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


