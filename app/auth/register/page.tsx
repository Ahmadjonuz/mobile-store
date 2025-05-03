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
import { Eye, EyeOff, Mail, Lock, User, Github, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

const translations = {
  en: {
    register: "Register",
    registerDescription: "Create an account to start shopping",
    firstName: "First Name",
    firstNamePlaceholder: "Enter your first name",
    lastName: "Last Name",
    lastNamePlaceholder: "Enter your last name",
    email: "Email",
    emailPlaceholder: "Enter your email",
    password: "Password",
    passwordPlaceholder: "Create a password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    termsAndConditions: "I agree to the Terms and Conditions",
    registerButton: "Create Account",
    haveAccount: "Already have an account?",
    login: "Login",
    or: "OR",
    continueWith: "Continue with",
    firstNameRequired: "First name is required",
    lastNameRequired: "Last name is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email",
    passwordRequired: "Password is required",
    passwordShort: "Password must be at least 6 characters",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match",
    termsRequired: "You must agree to the Terms and Conditions",
  },
  ru: {
    register: "Регистрация",
    registerDescription: "Создайте аккаунт, чтобы начать покупки",
    firstName: "Имя",
    firstNamePlaceholder: "Введите ваше имя",
    lastName: "Фамилия",
    lastNamePlaceholder: "Введите вашу фамилию",
    email: "Email",
    emailPlaceholder: "Введите ваш email",
    password: "Пароль",
    passwordPlaceholder: "Создайте пароль",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Подтвердите ваш пароль",
    termsAndConditions: "Я согласен с Условиями использования",
    registerButton: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    or: "ИЛИ",
    continueWith: "Продолжить с",
    firstNameRequired: "Имя обязательно",
    lastNameRequired: "Фамилия обязательна",
    emailRequired: "Email обязателен",
    emailInvalid: "Пожалуйста, введите корректный email",
    passwordRequired: "Пароль обязателен",
    passwordShort: "Пароль должен содержать минимум 6 символов",
    confirmPasswordRequired: "Пожалуйста, подтвердите пароль",
    passwordsDoNotMatch: "Пароли не совпадают",
    termsRequired: "Вы должны согласиться с Условиями использования",
  },
  uz: {
    register: "Ro'yxatdan o'tish",
    registerDescription: "Xarid qilishni boshlash uchun hisob yarating",
    firstName: "Ism",
    firstNamePlaceholder: "Ismingizni kiriting",
    lastName: "Familiya",
    lastNamePlaceholder: "Familiyangizni kiriting",
    email: "Email",
    emailPlaceholder: "Emailingizni kiriting",
    password: "Parol",
    passwordPlaceholder: "Parol yarating",
    confirmPassword: "Parolni tasdiqlang",
    confirmPasswordPlaceholder: "Parolingizni tasdiqlang",
    termsAndConditions: "Foydalanish shartlariga roziman",
    registerButton: "Hisob yaratish",
    haveAccount: "Hisobingiz bormi?",
    login: "Kirish",
    or: "YOKI",
    continueWith: "Davom etish",
    firstNameRequired: "Ism kiritish shart",
    lastNameRequired: "Familiya kiritish shart",
    emailRequired: "Email kiritish shart",
    emailInvalid: "Iltimos, to'g'ri email kiriting",
    passwordRequired: "Parol kiritish shart",
    passwordShort: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    confirmPasswordRequired: "Iltimos, parolni tasdiqlang",
    passwordsDoNotMatch: "Parollar mos kelmaydi",
    termsRequired: "Foydalanish shartlariga rozilik bildirishingiz kerak",
  },
}

export default function RegisterPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      termsAccepted: checked,
    })

    if (errors.termsAccepted) {
      setErrors({
        ...errors,
        termsAccepted: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: "",
    }

    let isValid = true

    if (!formData.firstName.trim()) {
      newErrors.firstName = t.firstNameRequired
      isValid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t.lastNameRequired
      isValid = false
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.confirmPasswordRequired
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordsDoNotMatch
      isValid = false
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t.termsRequired
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`
      await signUp(formData.email, formData.password, fullName)
        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
        })
        router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
            <CardTitle className="text-3xl font-bold">{t.register}</CardTitle>
            <CardDescription>{t.registerDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder={t.firstNamePlaceholder}
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.lastName}
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder={t.lastNamePlaceholder}
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t.email}
                </Label>
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
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t.password}
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t.confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  {t.termsAndConditions}
                </Label>
              </div>
              {errors.termsAccepted && <p className="text-sm text-red-500">{errors.termsAccepted}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    {t.registerButton}...
                  </div>
                ) : (
                  t.registerButton
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
              {t.haveAccount}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.login}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
