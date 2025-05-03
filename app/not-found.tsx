"use client"

import { useLanguage } from "@/contexts/language-context"

export default function NotFound() {
  const { language } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-destructive">404</h1>
      <h2 className="text-2xl font-semibold mb-2">
        {language === "uz" && "Sahifa topilmadi"}
        {language === "ru" && "Страница не найдена"}
        {language === "en" && "Page Not Found"}
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        {language === "uz" && "Kechirasiz, bunday sahifa mavjud emas."}
        {language === "ru" && "Извините, такой страницы не существует."}
        {language === "en" && "Sorry, this page does not exist."}
      </p>
      <a href="/" className="inline-block px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition">
        {language === "uz" && "Bosh sahifaga qaytish"}
        {language === "ru" && "На главную"}
        {language === "en" && "Go to Home"}
      </a>
    </div>
  )
} 