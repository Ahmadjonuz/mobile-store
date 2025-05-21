"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "ru" | "uz"

interface Translations {
  auth: {
    success: string
    error: string
    verificationEmailSent: string
    passwordTooShort: string
    passwordNeedsUppercase: string
    passwordNeedsLowercase: string
    passwordNeedsNumber: string
    passwordNeedsSpecial: string
    emailVerificationRequired: string
    emailVerified: string
    emailVerificationFailed: string
    passwordResetEmailSent: string
    passwordResetSuccess: string
    invalidResetToken: string
    accountCreated: string
    accountNotFound: string
    invalidCredentials: string
    tooManyAttempts: string
    sessionExpired: string
    signOut: string
  }
  account: {
    title: string
    notLoggedIn: string
    tabs: {
      profile: string
      orders: string
      wishlist: string
      password: string
    }
    profile: {
      name: string
      email: string
      save: string
      saving: string
      success: string
      error: string
      updated: string
    }
    orders: {
      title: string
      empty: string
      loading: string
      status: {
        pending: string
        processing: string
        shipped: string
        delivered: string
        cancelled: string
      }
    }
    wishlist: {
      title: string
      empty: string
      loading: string
      removed: string
    }
    password: {
      title: string
      current: string
      new: string
      confirm: string
      change: string
      changing: string
      success: string
      error: string
      mismatch: string
    }
  }
  nav: {
    home: string
    products: string
    categories: string
    deals: string
    about: string
    contact: string
  }
  hero: {
    title: string
    description: string
    button: string
    image: string
    buttonText: string
    buttonLink: string
    buttonLinkText: string
    experience: string
    discover: string
    shopNow: string
    compare: string
    premiumSelection: string
    curatedCollection: string
    globalShipping: string
    fastDelivery: string
  }
  featured: {
    title: string
    viewAll: string
    new: string
  }
  categories: {
    title: string
  }
  newsletter: {
    title: string
    description: string
    email: string
    subscribe: string
  }
  wishlist: {
    title: string
    empty: string
    loading: string
    removed: string
  }
  cart: {
    title: string
    empty: string
    emptyDescription: string
    continueShopping: string
    summary: string
    subtotal: string
    shipping: string
    shippingFree: string
    total: string
    checkout: string
    payment: {
      title: string
      card: string
      cash: string
      cardNumber: string
      expiryDate: string
      cvv: string
    }
    orderSuccess: string
  }
}

const translations: Record<Language, Translations> = {
  uz: {
    auth: {
      success: "Muvaffaqiyatli!",
      error: "Xatolik yuz berdi",
      verificationEmailSent: "Tasdiqlash xati yuborildi. Iltimos, emailingizni tekshiring",
      passwordTooShort: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
      passwordNeedsUppercase: "Parolda kamida 1 ta katta harf bo'lishi kerak",
      passwordNeedsLowercase: "Parolda kamida 1 ta kichik harf bo'lishi kerak",
      passwordNeedsNumber: "Parolda kamida 1 ta raqam bo'lishi kerak",
      passwordNeedsSpecial: "Parolda kamida 1 ta maxsus belgi bo'lishi kerak (!@#$%^&*)",
      emailVerificationRequired: "Iltimos, emailingizni tasdiqlang",
      emailVerified: "Email muvaffaqiyatli tasdiqlandi",
      emailVerificationFailed: "Email tasdiqlash muvaffaqiyatsiz yakunlandi",
      passwordResetEmailSent: "Parolni tiklash bo'yicha ko'rsatmalar emailingizga yuborildi",
      passwordResetSuccess: "Parolingiz muvaffaqiyatli o'zgartirildi",
      invalidResetToken: "Yaroqsiz yoki muddati o'tgan tiklash havolasi",
      accountCreated: "Hisobingiz yaratildi! Iltimos, emailingizni tasdiqlang",
      accountNotFound: "Hisob topilmadi",
      invalidCredentials: "Email yoki parol noto'g'ri",
      tooManyAttempts: "Juda ko'p urinish. Iltimos, {{minutes}} daqiqadan keyin qayta urinib ko'ring",
      sessionExpired: "Sessiya muddati tugadi. Iltimos, qayta kiring",
      signOut: "Chiqish"
    },
    account: {
      title: "Mening profilim",
      notLoggedIn: "Iltimos, profilni ko'rish uchun tizimga kiring",
      tabs: {
        profile: "Profil",
        orders: "Buyurtmalar",
        wishlist: "Sevimlilar",
        password: "Parolni o'zgartirish"
      },
      profile: {
        name: "To'liq ism",
        email: "Email manzil",
        save: "Saqlash",
        saving: "Saqlanmoqda...",
        success: "Muvaffaqiyatli saqlandi",
        error: "Xatolik yuz berdi",
        updated: "Profil yangilandi"
      },
      orders: {
        title: "Mening buyurtmalarim",
        empty: "Sizda hali buyurtmalar yo'q",
        loading: "Yuklanmoqda...",
        status: {
          pending: "Kutilmoqda",
          processing: "Jarayonda",
          shipped: "Yuborildi",
          delivered: "Yetkazildi",
          cancelled: "Bekor qilindi"
        }
      },
      wishlist: {
        title: "Sevimli mahsulotlar",
        empty: "Sizda hali saqlangan mahsulotlar yo'q",
        loading: "Yuklanmoqda...",
        removed: "Mahsulot sevimlilardan o'chirildi"
      },
      password: {
        title: "Parolni o'zgartirish",
        current: "Joriy parol",
        new: "Yangi parol",
        confirm: "Yangi parolni tasdiqlang",
        change: "Parolni o'zgartirish",
        changing: "O'zgartirilmoqda...",
        success: "Parol muvaffaqiyatli o'zgartirildi",
        error: "Parolni o'zgartirishda xatolik yuz berdi",
        mismatch: "Parollar mos kelmaydi"
      }
    },
    nav: {
      home: "Bosh sahifa",
      products: "Mahsulotlar",
      categories: "Toifalar",
      deals: "Aksiyalar",
      about: "Biz haqimizda",
      contact: "Biz bilan bog'lanish"
    },
    hero: {
      title: "Mobil texnologiyalar dunyosiga xush kelibsiz",
      description: "Eng so'nggi smartfonlar va aksessuarlarni kashf eting",
      button: "Xarid qilish",
      image: "Smartfon tasviri",
      buttonText: "Hoziroq xarid qiling",
      buttonLink: "/products",
      buttonLinkText: "Mahsulotlarni ko'rish",
      experience: "Kelajakni his qiling",
      discover: "Eng so'nggi mobil texnologiyalarni kashf eting",
      shopNow: "Hoziroq xarid qiling",
      compare: "Modellarni taqqoslash",
      premiumSelection: "Premium tanlov",
      curatedCollection: "Maxsus to'plam",
      globalShipping: "Butun dunyo bo'ylab yetkazib berish",
      fastDelivery: "Tezkor yetkazib berish"
    },
    featured: {
      title: "Tavsiya etilgan telefonlar",
      viewAll: "Hammasini ko'rish",
      new: "YANGI"
    },
    categories: {
      title: "Toifalar bo'yicha ko'rish"
    },
    newsletter: {
      title: "Yangiliklar va aksiyalardan xabardor bo'ling",
      description: "Yangi mahsulotlar, maxsus takliflar va eksklyuziv aksiyalar haqida birinchilardan bo'lib xabardor bo'ling",
      email: "Email manzilingizni kiriting",
      subscribe: "Obuna bo'lish"
    },
    wishlist: {
      title: "Sevimlilar ro'yxati",
      empty: "Sevimlilar ro'yxati bo'sh",
      loading: "Yuklanmoqda...",
      removed: "Mahsulot sevimlilardan o'chirildi"
    },
    cart: {
      title: "Xarid savati",
      empty: "Savatchangiz bo'sh",
      emptyDescription: "Siz hali hech qanday mahsulot qo'shmagansiz",
      continueShopping: "Xarid qilishni davom ettirish",
      summary: "Buyurtma ma'lumotlari",
      subtotal: "Jami",
      shipping: "Yetkazib berish",
      shippingFree: "Bepul",
      total: "Umumiy summa",
      checkout: "Buyurtma berish",
      payment: {
        title: "To'lov usuli",
        card: "Karta orqali to'lov",
        cash: "Naqd pul orqali to'lov",
        cardNumber: "Karta raqami",
        expiryDate: "Amal qilish muddati",
        cvv: "CVV"
      },
      orderSuccess: "Buyurtmangiz muvaffaqiyatli yaratildi!"
    }
  },
  ru: {
    auth: {
      success: "Успешно!",
      error: "Произошла ошибка",
      verificationEmailSent: "Письмо с подтверждением отправлено. Проверьте вашу почту",
      passwordTooShort: "Пароль должен содержать минимум 8 символов",
      passwordNeedsUppercase: "Пароль должен содержать хотя бы 1 заглавную букву",
      passwordNeedsLowercase: "Пароль должен содержать хотя бы 1 строчную букву",
      passwordNeedsNumber: "Пароль должен содержать хотя бы 1 цифру",
      passwordNeedsSpecial: "Пароль должен содержать хотя бы 1 специальный символ (!@#$%^&*)",
      emailVerificationRequired: "Пожалуйста, подтвердите ваш email",
      emailVerified: "Email успешно подтвержден",
      emailVerificationFailed: "Не удалось подтвердить email",
      passwordResetEmailSent: "Инструкции по сбросу пароля отправлены на вашу почту",
      passwordResetSuccess: "Ваш пароль успешно изменен",
      invalidResetToken: "Недействительная или просроченная ссылка для сброса",
      accountCreated: "Аккаунт создан! Пожалуйста, подтвердите ваш email",
      accountNotFound: "Аккаунт не найден",
      invalidCredentials: "Неверный email или пароль",
      tooManyAttempts: "Слишком много попыток. Попробуйте через {{minutes}} минут",
      sessionExpired: "Сессия истекла. Пожалуйста, войдите снова",
      signOut: "Выйти"
    },
    account: {
      title: "Мой профиль",
      notLoggedIn: "Пожалуйста, войдите для просмотра профиля",
      tabs: {
        profile: "Профиль",
        orders: "Заказы",
        wishlist: "Избранное",
        password: "Изменить пароль"
      },
      profile: {
        name: "Полное имя",
        email: "Email адрес",
        save: "Сохранить",
        saving: "Сохранение...",
        success: "Успешно сохранено",
        error: "Произошла ошибка",
        updated: "Профиль обновлен"
      },
      orders: {
        title: "Мои заказы",
        empty: "У вас пока нет заказов",
        loading: "Загрузка...",
        status: {
          pending: "Ожидает",
          processing: "В обработке",
          shipped: "Отправлен",
          delivered: "Доставлен",
          cancelled: "Отменен"
        }
      },
      wishlist: {
        title: "Список желаний",
        empty: "Список желаний пуст",
        loading: "Загрузка...",
        removed: "Товар удален из избранного"
      },
      password: {
        title: "Изменить пароль",
        current: "Текущий пароль",
        new: "Новый пароль",
        confirm: "Подтвердите новый пароль",
        change: "Изменить пароль",
        changing: "Изменение...",
        success: "Пароль успешно изменен",
        error: "Ошибка при изменении пароля",
        mismatch: "Пароли не совпадают"
      }
    },
    nav: {
      home: "Главная",
      products: "Продукты",
      categories: "Категории",
      deals: "Акции",
      about: "О нас",
      contact: "Свяжитесь с нами"
    },
    hero: {
      title: "Добро пожаловать в мир мобильных технологий",
      description: "Откройте для себя новейшие смартфоны и аксессуары",
      button: "Купить",
      image: "Изображение смартфона",
      buttonText: "Купить сейчас",
      buttonLink: "/products",
      buttonLinkText: "Посмотреть продукты",
      experience: "Испытайте будущее",
      discover: "Откройте для себя новейшие мобильные технологии",
      shopNow: "Купить сейчас",
      compare: "Сравнить модели",
      premiumSelection: "Премиум выбор",
      curatedCollection: "Специальная коллекция",
      globalShipping: "Доставка по всему миру",
      fastDelivery: "Быстрая доставка"
    },
    featured: {
      title: "Рекомендуемые телефоны",
      viewAll: "Смотреть все",
      new: "НОВИНКА"
    },
    categories: {
      title: "Просмотр по категориям"
    },
    newsletter: {
      title: "Будьте в курсе новостей и акций",
      description: "Подпишитесь на нашу рассылку, чтобы первыми узнавать о новых поступлениях, специальных предложениях и эксклюзивных акциях",
      email: "Введите ваш email адрес",
      subscribe: "Подписаться"
    },
    wishlist: {
      title: "Список желаний",
      empty: "Список желаний пуст",
      loading: "Загрузка...",
      removed: "Товар удален из избранного"
    },
    cart: {
      title: "Корзина",
      empty: "Ваша корзина пуста",
      emptyDescription: "Вы еще не добавили товары в корзину",
      continueShopping: "Продолжить покупки",
      summary: "Детали заказа",
      subtotal: "Подытог",
      shipping: "Доставка",
      shippingFree: "Бесплатно",
      total: "Итого",
      checkout: "Оформить заказ",
      payment: {
        title: "Способ оплаты",
        card: "Оплата картой",
        cash: "Оплата наличными",
        cardNumber: "Номер карты",
        expiryDate: "Срок действия",
        cvv: "CVV"
      },
      orderSuccess: "Ваш заказ успешно создан!"
    }
  },
  en: {
    auth: {
      success: "Success!",
      error: "An error occurred",
      verificationEmailSent: "Verification email sent. Please check your inbox",
      passwordTooShort: "Password must be at least 8 characters long",
      passwordNeedsUppercase: "Password must contain at least 1 uppercase letter",
      passwordNeedsLowercase: "Password must contain at least 1 lowercase letter",
      passwordNeedsNumber: "Password must contain at least 1 number",
      passwordNeedsSpecial: "Password must contain at least 1 special character (!@#$%^&*)",
      emailVerificationRequired: "Please verify your email",
      emailVerified: "Email successfully verified",
      emailVerificationFailed: "Failed to verify email",
      passwordResetEmailSent: "Password reset instructions sent to your email",
      passwordResetSuccess: "Your password has been successfully changed",
      invalidResetToken: "Invalid or expired reset link",
      accountCreated: "Account created! Please verify your email",
      accountNotFound: "Account not found",
      invalidCredentials: "Invalid email or password",
      tooManyAttempts: "Too many attempts. Please try again in {{minutes}} minutes",
      sessionExpired: "Session expired. Please sign in again",
      signOut: "Sign Out"
    },
    account: {
      title: "My Profile",
      notLoggedIn: "Please sign in to view your profile",
      tabs: {
        profile: "Profile",
        orders: "Orders",
        wishlist: "Wishlist",
        password: "Change Password"
      },
      profile: {
        name: "Full Name",
        email: "Email Address",
        save: "Save",
        saving: "Saving...",
        success: "Successfully saved",
        error: "An error occurred",
        updated: "Profile updated"
      },
      orders: {
        title: "My Orders",
        empty: "You don't have any orders yet",
        loading: "Loading...",
        status: {
          pending: "Pending",
          processing: "Processing",
          shipped: "Shipped",
          delivered: "Delivered",
          cancelled: "Cancelled"
        }
      },
      wishlist: {
        title: "Wishlist",
        empty: "Your wishlist is empty",
        loading: "Loading...",
        removed: "Product removed from wishlist"
      },
      password: {
        title: "Change Password",
        current: "Current Password",
        new: "New Password",
        confirm: "Confirm New Password",
        change: "Change Password",
        changing: "Changing...",
        success: "Password successfully changed",
        error: "Failed to change password",
        mismatch: "Passwords do not match"
      }
    },
    nav: {
      home: "Home",
      products: "Products",
      categories: "Categories",
      deals: "Deals",
      about: "About",
      contact: "Contact"
    },
    hero: {
      title: "Welcome to the World of Mobile Technology",
      description: "Discover the latest smartphones and accessories",
      button: "Shop Now",
      image: "Smartphone image",
      buttonText: "Shop Now",
      buttonLink: "/products",
      buttonLinkText: "View Products",
      experience: "Experience the Future",
      discover: "Discover the latest mobile technology",
      shopNow: "Shop Now",
      compare: "Compare Models",
      premiumSelection: "Premium Selection",
      curatedCollection: "Curated Collection",
      globalShipping: "Global Shipping",
      fastDelivery: "Fast Delivery"
    },
    featured: {
      title: "Featured Phones",
      viewAll: "View All",
      new: "NEW"
    },
    categories: {
      title: "Browse by Category"
    },
    newsletter: {
      title: "Stay Updated",
      description: "Subscribe to our newsletter to be the first to know about new arrivals, special offers and exclusive deals",
      email: "Enter your email address",
      subscribe: "Subscribe"
    },
    wishlist: {
      title: "Wishlist",
      empty: "Your wishlist is empty",
      loading: "Loading...",
      removed: "Product removed from wishlist"
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyDescription: "You haven't added any products to your cart yet",
      continueShopping: "Continue Shopping",
      summary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingFree: "Free",
      total: "Total",
      checkout: "Checkout",
      payment: {
        title: "Payment Method",
        card: "Pay with Card",
        cash: "Pay with Cash",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV"
      },
      orderSuccess: "Your order has been successfully created!"
    }
  }
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  availableLanguages: { code: Language; name: string; flag: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const availableLanguages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ru" as Language, name: "Русский", flag: "🇷🇺" },
  { code: "uz" as Language, name: "O'zbek", flag: "🇺🇿" },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && availableLanguages.some((lang) => lang.code === savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
    // Set HTML lang attribute
    document.documentElement.lang = language
    // Always LTR for en, ru, uz
    document.documentElement.dir = "ltr"
  }, [language])

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k]
      } else {
        return key
      }
    }
    
    return value || key
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
