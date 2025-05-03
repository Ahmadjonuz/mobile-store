"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Github, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

const translations = {
  en: {
    login: "Login",
    loginDescription: "Enter your email and password to access your account",
    email: "Email",
    emailPlaceholder: "Enter your email",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loginButton: "Sign in",
    noAccount: "Don't have an account?",
    register: "Register",
    or: "OR",
    continueWith: "Continue with",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email",
    passwordRequired: "Password is required",
    passwordShort: "Password must be at least 6 characters",
  },
  ru: {
    login: "Вход",
    loginDescription: "Введите email и пароль для доступа к аккаунту",
    email: "Email",
    emailPlaceholder: "Введите ваш email",
    password: "Пароль",
    passwordPlaceholder: "Введите ваш пароль",
    rememberMe: "Запомнить меня",
    forgotPassword: "Забыли пароль?",
    loginButton: "Войти",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    or: "ИЛИ",
    continueWith: "Продолжить с",
    emailRequired: "Email обязателен",
    emailInvalid: "Пожалуйста, введите корректный email",
    passwordRequired: "Пароль обязателен",
    passwordShort: "Пароль должен содержать минимум 6 символов",
  },
  uz: {
    login: "Kirish",
    loginDescription: "Hisobingizga kirish uchun email va parolingizni kiriting",
    email: "Email",
    emailPlaceholder: "Emailingizni kiriting",
    password: "Parol",
    passwordPlaceholder: "Parolingizni kiriting",
    rememberMe: "Meni eslab qol",
    forgotPassword: "Parolni unutdingizmi?",
    loginButton: "Kirish",
    noAccount: "Hisobingiz yo'qmi?",
    register: "Ro'yxatdan o'tish",
    or: "YOKI",
    continueWith: "Davom etish",
    emailRequired: "Email kiritish shart",
    emailInvalid: "Iltimos, to'g'ri email kiriting",
    passwordRequired: "Parol kiritish shart",
    passwordShort: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
  },
}

export default function LoginPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth() 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when typing
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      rememberMe: checked,
    })
  }

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    }

    let isValid = true

    if (!formData.email) {
      newErrors.email = t.emailRequired
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.emailInvalid
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordShort
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await signIn(formData.email, formData.password)
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        })
        router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
            <CardTitle className="text-3xl font-bold">{t.login}</CardTitle>
            <CardDescription>{t.loginDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t.email}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t.password}
                  </Label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    {t.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    {t.rememberMe}
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    {t.loginButton}...
                  </div>
                ) : (
                  t.loginButton
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t.or}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" type="button">
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="w-full" type="button">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {t.noAccount}{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                {t.register}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
