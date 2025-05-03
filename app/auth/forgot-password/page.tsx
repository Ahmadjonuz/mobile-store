"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const translations = {
  en: {
    forgotPassword: "Forgot Password",
    forgotPasswordDescription: "Enter your email and we'll send you a link to reset your password",
    email: "Email",
    emailPlaceholder: "Enter your email",
    resetPassword: "Reset Password",
    backToLogin: "Back to Login",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email",
    resetLinkSent: "Reset link sent",
    resetLinkDescription: "We've sent a password reset link to your email",
    checkEmail: "Check your email",
  },
  ru: {
    forgotPassword: "Забыли пароль",
    forgotPasswordDescription: "Введите ваш email, и мы отправим вам ссылку для сброса пароля",
    email: "Email",
    emailPlaceholder: "Введите ваш email",
    resetPassword: "Сбросить пароль",
    backToLogin: "Вернуться к входу",
    emailRequired: "Email обязателен",
    emailInvalid: "Пожалуйста, введите корректный email",
    resetLinkSent: "Ссылка отправлена",
    resetLinkDescription: "Мы отправили ссылку для сброса пароля на ваш email",
    checkEmail: "Проверьте ваш email",
  },
  uz: {
    forgotPassword: "Parolni unutdingizmi",
    forgotPasswordDescription: "Emailingizni kiriting va biz sizga parolni tiklash uchun havola yuboramiz",
    email: "Email",
    emailPlaceholder: "Emailingizni kiriting",
    resetPassword: "Parolni tiklash",
    backToLogin: "Kirishga qaytish",
    emailRequired: "Email kiritish shart",
    emailInvalid: "Iltimos, to'g'ri email kiriting",
    resetLinkSent: "Havola yuborildi",
    resetLinkDescription: "Parolni tiklash havolasini emailingizga yubordik",
    checkEmail: "Emailingizni tekshiring",
  },
}

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError("")
  }

  const validateForm = () => {
    if (!email) {
      setError(t.emailRequired)
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t.emailInvalid)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful password reset request
      toast({
        title: t.resetLinkSent,
        description: t.resetLinkDescription,
      })

      setIsSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      })
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
            <CardTitle className="text-3xl font-bold">{t.forgotPassword}</CardTitle>
            <CardDescription>{t.forgotPasswordDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
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
                    onChange={handleChange}
                    className={error ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      {t.resetPassword}...
                    </div>
                  ) : (
                    t.resetPassword
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="h-8 w-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{t.resetLinkSent}</h3>
                <p className="text-muted-foreground">{t.checkEmail}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" asChild>
              <Link href="/auth/login" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToLogin}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
