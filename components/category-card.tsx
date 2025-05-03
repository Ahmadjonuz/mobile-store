"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface CategoryCardProps {
  category: {
    id: string
    image: string
    color: string
    translations: {
      [key: string]: {
        name: string
        description: string
      }
    }
  }
  index: number
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const { language } = useLanguage()

  return (
    <div className="h-full">
      <Link href={`/categories/${category.id}`} className="block h-full">
        <div className="relative overflow-hidden rounded-xl group h-[250px]">
          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 z-10`} />
          <img
            src={category.image}
            alt={category.translations[language].name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-white p-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="text-center"
            >
              <h3 className="font-bold text-2xl mb-2">{category.translations[language].name}</h3>
              <p className="text-white/90 mb-4">{category.translations[language].description}</p>
              <motion.div className="inline-block" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <span className="px-4 py-2 rounded-full border-2 border-white/80 text-sm font-medium hover:bg-white/20 transition-colors">
                  {language === "en"
                    ? "Browse Collection"
                    : language === "ru"
                      ? "Просмотреть коллекцию"
                      : "Kolleksiyani ko'rish"}
                  <ChevronRight className="inline-block h-4 w-4 ml-1" />
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated corner accents */}
          <div
            className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-white/60 z-20"
          />
          <div
            className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-white/60 z-20"
          />
        </div>
      </Link>
    </div>
  )
}
