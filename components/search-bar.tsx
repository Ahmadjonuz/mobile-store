"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/contexts/currency-context"
import { supabase } from "@/lib/supabase"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const { formatPrice } = useCurrency()

  // Debounce va Supabase'dan qidiruv
  useEffect(() => {
    if (!query) {
      setResults([])
      setShowDropdown(false)
      return
    }
    setLoading(true)
    const timeout = setTimeout(async () => {
      // Supabase'dan mahsulotlarni qidirish
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .ilike("name", `%${query}%`)
        .limit(10)
      if (!error && data) {
        setResults(data)
      } else {
        setResults([])
      }
      setShowDropdown(true)
      setLoading(false)
      setActiveIndex(-1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [query])

  // Klaviatura boshqaruvi
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!showDropdown) return
      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
        window.location.href = `/products/${results[activeIndex].id}`
      } else if (e.key === "Escape") {
        setShowDropdown(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [showDropdown, results, activeIndex])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Mahsulotlarni qidirish..."
          className="w-full pl-10 pr-4 py-2 rounded-md border bg-white dark:bg-background text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-primary/30 dark:focus-visible:ring-white/30"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />}
      </div>
      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {results.length === 0 && !loading ? (
              <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center select-none">Hech narsa topilmadi</li>
            ) : (
              results.map((product, idx) => (
                <li
                  key={product.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors ${activeIndex === idx ? "bg-primary/10 dark:bg-primary/20" : ""}`}
                  onMouseDown={() => (window.location.href = `/products/${product.id}`)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{
                      typeof product.price === "number" && !isNaN(product.price)
                        ? formatPrice(product.price)
                        : "-"
                    }</div>
                  </div>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
} 