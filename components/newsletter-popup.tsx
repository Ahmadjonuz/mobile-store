"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Join Our Newsletter",
    subtitle: "Get 10% off your first order",
    description: "Stay updated with the latest products, exclusive offers and tech news.",
    placeholder: "Enter your email",
    subscribe: "Subscribe",
    noThanks: "No, thanks",
    success: "Thank you for subscribing!",
    successMessage: "You've been added to our newsletter list.",
    close: "Close",
  },
  ru: {
    title: "Подпишитесь на нашу рассылку",
    subtitle: "Получите скидку 10% на первый заказ",
    description: "Будьте в курсе последних продуктов, эксклюзивных предложений и технических новостей.",
    placeholder: "Введите ваш email",
    subscribe: "Подписаться",
    noThanks: "Нет, спасибо",
    success: "Спасибо за подписку!",
    successMessage: "Вы добавлены в наш список рассылки.",
    close: "Закрыть",
  },
  uz: {
    title: "Bizning axborot byulletenimizga qo'shiling",
    subtitle: "Birinchi buyurtmangizga 10% chegirma oling",
    description: "Eng so'nggi mahsulotlar, eksklyuziv takliflar va texnik yangiliklar haqida xabardor bo'ling.",
    placeholder: "Emailingizni kiriting",
    subscribe: "Obuna bo'lish",
    noThanks: "Yo'q, rahmat",
    success: "Obuna bo'lganingiz uchun rahmat!",
    successMessage: "Siz bizning axborot byulletenimiz ro'yxatiga qo'shildingiz.",
    close: "Yopish",
  },
}

export default function NewsletterPopup() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenNewsletterPopup")

    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Remember that the user has seen the popup
    localStorage.setItem("hasSeenNewsletterPopup", "true")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send the email to your API
    setIsSubmitted(true)
    // Remember that the user has subscribed
    localStorage.setItem("hasSubscribedNewsletter", "true")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-background rounded-lg shadow-lg max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>

              <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6">
                {!isSubmitted ? (
                  <>
                    <h3 className="text-2xl font-bold mb-1">{t.title}</h3>
                    <p className="text-primary font-medium mb-4">{t.subtitle}</p>
                    <p className="text-muted-foreground mb-6">{t.description}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder={t.placeholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="flex-1">
                          {t.subscribe}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClose}>
                          {t.noThanks}
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 25 }}
                    >
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{t.success}</h3>
                      <p className="text-muted-foreground mb-6">{t.successMessage}</p>
                      <Button onClick={handleClose}>{t.close}</Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
