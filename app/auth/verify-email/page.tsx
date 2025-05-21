"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const translations = {
  en: {
    title: "Verify Your Email",
    description: "We've sent you an email with a verification link. Please check your inbox and click the link to verify your email address.",
    resendButton: "Resend Verification Email",
    checkingToken: "Verifying your email...",
    checkEmail: "Check your email"
  },
  ru: {
    title: "Подтвердите ваш Email",
    description: "Мы отправили вам письмо со ссылкой для подтверждения. Пожалуйста, проверьте вашу почту и нажмите на ссылку для подтверждения email адреса.",
    resendButton: "Отправить письмо повторно",
    checkingToken: "Подтверждаем ваш email...",
    checkEmail: "Проверьте вашу почту"
  },
  uz: {
    title: "Emailingizni tasdiqlang",
    description: "Biz sizga tasdiqlash havolasi bilan xat yubordik. Iltimos, emailingizni tekshiring va havolani bosib emailingizni tasdiqlang.",
    resendButton: "Tasdiqlash xatini qayta yuborish",
    checkingToken: "Emailingiz tasdiqlanmoqda...",
    checkEmail: "Emailingizni tekshiring"
  }
}

export default function VerifyEmailPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const { verifyEmail, resendVerificationEmail } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token, verifyEmail])

  const handleResend = async () => {
    try {
      await resendVerificationEmail()
    } catch (error) {
      // Error handling is done in auth context
    }
  }

  if (token) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <CardTitle>{t.checkingToken}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <RefreshCw className="h-8 w-8 text-primary" />
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleResend}
            >
              {t.resendButton}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 