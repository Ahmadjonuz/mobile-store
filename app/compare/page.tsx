"use client"

import { useLanguage } from "@/contexts/language-context"

export default function ComparePage() {
  const { language } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">
        {language === "uz" && "Tez orada!"}
        {language === "ru" && "Скоро будет!"}
        {language === "en" && "Coming Soon!"}
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        {language === "uz" && "Telefonlarni taqqoslash sahifasi tez orada ishga tushiriladi."}
        {language === "ru" && "Страница сравнения телефонов скоро будет доступна."}
        {language === "en" && "The phone comparison page will be available soon."}
      </p>
      <span className="rounded-full bg-muted px-4 py-2 text-muted-foreground">
        {language === "uz" && "Yangi imkoniyatlar ustida ishlayapmiz"}
        {language === "ru" && "Мы работаем над новыми возможностями"}
        {language === "en" && "We are working on new features"}
      </span>
    </div>
  )
} 