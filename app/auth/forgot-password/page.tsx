"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

const translations = {
  en: {
    title: "Reset Password",
    description: "Enter your email address and we'll send you instructions to reset your password.",
    email: "Email",
    emailPlaceholder: "Enter your email",
    resetButton: "Send Reset Instructions",
    backToLogin: "Back to Login",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email"
  },
  ru: {
    title: "Сброс пароля",
    description: "Введите ваш email и мы отправим вам инструкции по сбросу пароля.",
    email: "Email",
    emailPlaceholder: "Введите ваш email",
    resetButton: "Отправить инструкции",
    backToLogin: "Вернуться к входу",
    emailRequired: "Email обязателен",
    emailInvalid: "Пожалуйста, введите корректный email"
  },
  uz: {
    title: "Parolni tiklash",
    description: "Email manzilingizni kiriting va biz sizga parolni tiklash bo'yicha ko'rsatmalar yuboramiz.",
    email: "Email",
    emailPlaceholder: "Emailingizni kiriting",
    resetButton: "Ko'rsatmalarni yuborish",
    backToLogin: "Kirishga qaytish",
    emailRequired: "Email kiritish shart",
    emailInvalid: "Iltimos, to'g'ri email kiriting"
  }
}

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!email) {
      setError(t.emailRequired)
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t.emailInvalid)
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(email)
    } catch (error) {
      // Error handling is done in auth context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className={error ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    {t.resetButton}...
                  </div>
                ) : (
                  t.resetButton
                )}
              </Button>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:underline">
                  {t.backToLogin}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
