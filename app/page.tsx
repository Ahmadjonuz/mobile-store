"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import FeaturedPhones from "@/components/featured-phones"
import HeroSection from "@/components/hero-section"
import CategorySection from "@/components/category-section"
import NewsletterSection from "@/components/newsletter-section"
import TestimonialSection from "@/components/testimonial-section"
import { useLanguage } from "@/contexts/language-context"
import Testimonials from "@/components/testimonials"

export default function Home() {
  const { t } = useLanguage()
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Featured Products */}
      <section className="container py-16 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("featured.title")}</h2>
          <Link href="/products" className="flex items-center text-primary group text-gray-700 dark:text-gray-300">
            {t("featured.viewAll")} <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <FeaturedPhones />
      </section>

      {/* Categories */}
      <section className="bg-muted py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">{t("categories.title")}</h2>
          <CategorySection />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />


      {/* Newsletter */}
      <NewsletterSection />
    </main>
  )
}
