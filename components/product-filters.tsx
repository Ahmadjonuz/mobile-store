"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"

const translations = {
  en: {
    filters: "Filters",
    clearAll: "Clear All",
    priceRange: "Price Range",
    min: "Min",
    max: "Max",
    brands: "Brands",
    features: "Features",
    colors: "Colors",
    storage: "Storage",
    apply: "Apply Filters",
    reset: "Reset",
    mobileFilters: "Mobile Filters",
  },
  ru: {
    filters: "Фильтры",
    clearAll: "Очистить все",
    priceRange: "Ценовой диапазон",
    min: "Мин",
    max: "Макс",
    brands: "Бренды",
    features: "Функции",
    colors: "Цвета",
    storage: "Память",
    apply: "Применить фильтры",
    reset: "Сбросить",
    mobileFilters: "Мобильные фильтры",
  },
  uz: {
    filters: "Filtrlar",
    clearAll: "Hammasini tozalash",
    priceRange: "Narx diapazoni",
    min: "Min",
    max: "Maks",
    brands: "Brendlar",
    features: "Xususiyatlar",
    colors: "Ranglar",
    storage: "Xotira",
    apply: "Filtrlarni qo'llash",
    reset: "Qayta o'rnatish",
    mobileFilters: "Mobil filtrlar",
  },
}

interface FilterOption {
  id: string
  label: string
}

interface ProductFiltersProps {
  brands: FilterOption[]
  features: FilterOption[]
  colors?: FilterOption[]
  storage?: FilterOption[]
  priceRange: [number, number]
  onFilterChange: (filters: {
    brands: string[]
    features: string[]
    colors?: string[]
    storage?: string[]
    priceRange: [number, number]
  }) => void
  className?: string
}

export default function ProductFilters({
  brands,
  features,
  colors = [],
  storage = [],
  priceRange: initialPriceRange,
  onFilterChange,
  className = "",
}: ProductFiltersProps) {
  const { language } = useLanguage()
  const { formatPrice } = useCurrency()
  const t = translations[language] || translations.en

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedStorage, setSelectedStorage] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Apply filters when selections change
  useEffect(() => {
    onFilterChange({
      brands: selectedBrands,
      features: selectedFeatures,
      colors: selectedColors,
      storage: selectedStorage,
      priceRange,
    })
  }, [selectedBrands, selectedFeatures, selectedColors, selectedStorage, priceRange, onFilterChange])

  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  // Toggle color selection
  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]))
  }

  // Toggle storage selection
  const toggleStorage = (storageId: string) => {
    setSelectedStorage((prev) =>
      prev.includes(storageId) ? prev.filter((id) => id !== storageId) : [...prev, storageId],
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedBrands([])
    setSelectedFeatures([])
    setSelectedColors([])
    setSelectedStorage([])
    setPriceRange(initialPriceRange)
  }

  // Filter content component to avoid duplication
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">{t.priceRange}</h3>
        <div className="px-2">
          <Slider
            defaultValue={priceRange}
            min={initialPriceRange[0]}
            max={initialPriceRange[1]}
            step={10000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-6"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center border rounded-md px-3 py-1">
            <span className="text-sm text-muted-foreground mr-2">{t.min}:</span>
            <span className="font-medium">{formatPrice(priceRange[0])}</span>
          </div>
          <div className="flex items-center border rounded-md px-3 py-1">
            <span className="text-sm text-muted-foreground mr-2">{t.max}:</span>
            <span className="font-medium">{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-medium mb-3">{t.brands}</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
              />
              <label
                htmlFor={`brand-${brand.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {brand.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <h3 className="font-medium mb-3">{t.features}</h3>
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${feature.id}`}
                checked={selectedFeatures.includes(feature.id)}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
              <label
                htmlFor={`feature-${feature.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors (if available) */}
      {colors.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-medium mb-3">{t.colors}</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <motion.button
                  key={color.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleColor(color.id)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColors.includes(color.id)
                      ? "border-primary ring-2 ring-primary ring-opacity-50"
                      : "border-muted-foreground border-opacity-20"
                  }`}
                  style={{ backgroundColor: color.id }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Storage (if available) */}
      {storage.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-medium mb-3">{t.storage}</h3>
            <div className="space-y-2">
              {storage.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`storage-${option.id}`}
                    checked={selectedStorage.includes(option.id)}
                    onCheckedChange={() => toggleStorage(option.id)}
                  />
                  <label
                    htmlFor={`storage-${option.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{t.filters}</h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={resetFilters}>
              {t.clearAll}
            </Button>
          </div>

          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Filter className="mr-2 h-4 w-4" />
              {t.filters}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{t.mobileFilters}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <FilterContent />

              <div className="mt-8 grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={resetFilters}>
                  {t.reset}
                </Button>
                <Button onClick={() => setIsMobileFiltersOpen(false)}>{t.apply}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
