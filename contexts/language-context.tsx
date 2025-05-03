"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ru" | "uz"

type Translations = {
  [key: string]: {
    [key in Language]?: string
  }
}

// Define translations
const translations: Translations = {
  "nav.home": {
    en: "Home",
    ru: "Главная",
    uz: "Bosh sahifa",
  },
  "nav.products": {
    en: "Products",
    ru: "Продукты",
    uz: "Mahsulotlar",
  },
  "nav.categories": {
    en: "Categories",
    ru: "Категории",
    uz: "Toifalar",
  },
  "nav.deals": {
    en: "Deals",
    ru: "Акции",
    uz: "Aksiyalar",
  },
  "nav.about": {
    en: "About",
    ru: "О нас",
    uz: "Biz haqimizda",
  },
  "nav.contact": {
    en: "Contact",
    ru: "Контакты",
    uz: "Aloqa",
  },
  "hero.experience": {
    en: "Experience the Future",
    ru: "Испытайте будущее",
    uz: "Kelajakni his qiling",
  },
  "hero.discover": {
    en: "Discover the latest mobile technology",
    ru: "Откройте для себя новейшие мобильные технологии",
    uz: "Eng so'nggi mobil texnologiyalarni kashf eting",
  },
  "hero.shopNow": {
    en: "Shop Now",
    ru: "Купить сейчас",
    uz: "Hozir xarid qiling",
  },
  "hero.compare": {
    en: "Compare Models",
    ru: "Сравнить модели",
    uz: "Modellarni taqqoslash",
  },
  "featured.title": {
    en: "Featured Phones",
    ru: "Рекомендуемые телефоны",
    uz: "Tavsiya etilgan telefonlar",
  },
  "featured.viewAll": {
    en: "View all",
    ru: "Посмотреть все",
    uz: "Hammasini ko'rish",
  },
  "categories.title": {
    en: "Browse by Category",
    ru: "Просмотр по категориям",
    uz: "Toifalar bo'yicha ko'rish",
  },
  "newsletter.title": {
    en: "Stay Updated",
    ru: "Будьте в курсе",
    uz: "Yangilanib turing",
  },
  "newsletter.description": {
    en: "Subscribe to our newsletter to receive updates on new arrivals, special offers, and exclusive deals.",
    ru: "Подпишитесь на нашу рассылку, чтобы получать обновления о новых поступлениях, специальных предложениях и эксклюзивных акциях.",
    uz: "Yangi kelgan mahsulotlar, maxsus takliflar va eksklyuziv aksiyalar haqida yangilanishlarni olish uchun bizning axborot byulletenimizga obuna bo'ling.",
  },
  "newsletter.subscribe": {
    en: "Subscribe",
    ru: "Подписаться",
    uz: "Obuna bo'lish",
  },
  "newsletter.email": {
    en: "Enter your email",
    ru: "Введите ваш email",
    uz: "Emailingizni kiriting",
  },
  "checkout.title": {
    en: "Checkout",
    ru: "Оформление заказа",
    uz: "Buyurtma berish",
  },
  "checkout.shipping": {
    en: "Shipping",
    ru: "Доставка",
    uz: "Yetkazib berish",
  },
  "checkout.payment": {
    en: "Payment",
    ru: "Оплата",
    uz: "To'lov",
  },
  "checkout.review": {
    en: "Review",
    ru: "Обзор",
    uz: "Ko'rib chiqish",
  },
  "checkout.confirmation": {
    en: "Confirmation",
    ru: "Подтверждение",
    uz: "Tasdiqlash",
  },
  "checkout.next": {
    en: "Next",
    ru: "Далее",
    uz: "Keyingi",
  },
  "checkout.back": {
    en: "Back",
    ru: "Назад",
    uz: "Orqaga",
  },
  "checkout.placeOrder": {
    en: "Place Order",
    ru: "Разместить заказ",
    uz: "Buyurtma berish",
  },
  "configurator.title": {
    en: "Customize Your Phone",
    ru: "Настройте свой телефон",
    uz: "Telefoningizni sozlang",
  },
  "configurator.color": {
    en: "Color",
    ru: "Цвет",
    uz: "Rang",
  },
  "configurator.storage": {
    en: "Storage",
    ru: "Память",
    uz: "Xotira",
  },
  "configurator.addToCart": {
    en: "Add to Cart",
    ru: "Добавить в корзину",
    uz: "Savatga qo'shish",
  },
  "hero.premiumSelection": {
    en: "Premium Selection",
    ru: "Премиум выбор",
    uz: "Premium tanlash",
  },
  "hero.curatedCollection": {
    en: "Curated Collection",
    ru: "Коллекция",
    uz: "Tayyorlangan to'plam",
  },
  "hero.globalShipping": {
    en: "Global Shipping",  
    ru: "Международные доставки",
    uz: "Xaridlarni yetakchilik",
  },
  "hero.fastDelivery": {
    en: "Fast Delivery",
    ru: "Быстрая доставка",
    uz: "Tez yetakchilik",
  },
  "category.flagship": {
    en: "Flagship Phones",
    ru: "Флагманские телефоны",
    uz: "Flagman telefonlar",
  },
  "category.midrange": {
    en: "Mid-range Phones",
    ru: "Средний сегмент",
    uz: "O'rta narx toifasi",
  },
  "category.budget": {
    en: "Budget Phones",
    ru: "Бюджетные телефоны",
    uz: "Byudjet telefonlar",
  },
  "category.foldable": {
    en: "Foldable Phones",
    ru: "Складные телефоны",
    uz: "Bukiladigan telefonlar",
  },
  "category.products": {
    en: "products",
    ru: "товаров",
    uz: "ta mahsulot",
  },
  "category.browse": {
    en: "Browse Collection",
    ru: "Смотреть коллекцию",
    uz: "To'plamni ko'rish",
  },
  "featured.addedToCartTitle": {
    en: "Added to cart",
    ru: "Добавлено в корзину",
    uz: "Savatga qo'shildi",
  },
  "featured.addedToCartDesc": {
    en: "{{name}} has been added to your cart.",
    ru: "{{name}} корзинага қўшилди.",
    uz: "{{name}} savatga qo'shildi.",
  },
  "featured.addedToWishlistTitle": {
    en: "Added to wishlist",
    ru: "Добавлено в избранное",
    uz: "Sevimlilarga qo'shildi",
  },
  "featured.addedToWishlistDesc": {
    en: "{{name}} has been added to your wishlist.",
    ru: "{{name}} избранноега қўшилди.",
    uz: "{{name}} sevimlilarga qo'shildi.",
  },
  "featured.new": {
    en: "NEW",
    ru: "НОВИНКА",
    uz: "YANGI",
  },
  "featured.addToCart": {
    en: "Add to cart",
    ru: "В корзину",
    uz: "Savatga qo'shish",
  },
  "featured.addToWishlist": {
    en: "Add to wishlist",
    ru: "В избранное",
    uz: "Sevimlilarga qo'shish",
  },
  "testimonials.title": {
    en: "What Our Customers Say",
    ru: "Отзывы наших клиентов",
    uz: "Mijozlarimiz fikri",
  },
  "testimonials.subtitle": {
    en: "Don't just take our word for it. Here's what customers around the world think about MobileHub.",
    ru: "Не только мы так думаем. Вот что говорят клиенты о MobileHub.",
    uz: "Faqat biz emas, butun dunyo mijozlari MobileHub haqida nima deydi?",
  },
  "testimonials.prev": {
    en: "Previous testimonial",
    ru: "Предыдущий отзыв",
    uz: "Oldingi izoh",
  },
  "testimonials.next": {
    en: "Next testimonial",
    ru: "Следующий отзыв",
    uz: "Keyingi izoh",
  },
  "testimonials.goto": {
    en: "Go to testimonial {n}",
    ru: "Перейти к отзыву {n}",
    uz: "{n}-izohga o'tish",
  },
  "wishlist.empty": {
    en: "Your wishlist is empty",
    ru: "Ваш список желаемого пуст",
    uz: "Yoqtirganlar ro'yxati bo'sh",
  },
  "wishlist.emptyDescription": {
    en: "You haven't added any products to your wishlist yet.",
    ru: "Вы еще не добавили товары в список желаемого.",
    uz: "Siz hali hech qanday mahsulotni yoqtirganlarga qo'shmadingiz.",
  },
  "wishlist.continueShopping": {
    en: "Continue shopping",
    ru: "Продолжить покупки",
    uz: "Xaridni davom etish",
  },
  "wishlist.title": {
    en: "My Wishlist",
    ru: "Избранное",
    uz: "Yoqtirganlarim",
  },
  "wishlist.success": {
    en: "Success",
    ru: "Успешно",
    uz: "Muvaffaqiyatli",
  },
  "wishlist.removed": {
    en: "Removed from wishlist",
    ru: "Удалено из избранного",
    uz: "Yoqtirganlardan o'chirildi",
  },
  "cart.title": {
    en: "Shopping Cart",
    ru: "Корзина",
    uz: "Savat"
  },
  "cart.empty": {
    en: "Your cart is empty",
    ru: "Ваша корзина пуста",
    uz: "Savat bo'sh"
  },
  "cart.emptyDescription": {
    en: "Looks like you haven't added any items to your cart yet.",
    ru: "Похоже, вы еще не добавили товары в корзину.",
    uz: "Siz hali savatga hech narsa qo'shmadingiz."
  },
  "cart.continueShopping": {
    en: "Continue Shopping",
    ru: "Продолжить покупки",
    uz: "Xaridni davom etish"
  },
  "cart.decrease": {
    en: "Decrease quantity",
    ru: "Уменьшить количество",
    uz: "Miqdorni kamaytirish"
  },
  "cart.increase": {
    en: "Increase quantity",
    ru: "Увеличить количество",
    uz: "Miqdorni oshirish"
  },
  "cart.remove": {
    en: "Remove from cart",
    ru: "Удалить из корзины",
    uz: "Savatdan o'chirish"
  },
  "cart.summary": {
    en: "Order Summary",
    ru: "Сводка заказа",
    uz: "Buyurtma yakuni"
  },
  "cart.subtotal": {
    en: "Subtotal",
    ru: "Промежуточный итог",
    uz: "Oraliq summa"
  },
  "cart.shipping": {
    en: "Shipping",
    ru: "Доставка",
    uz: "Yetkazib berish"
  },
  "cart.shippingFree": {
    en: "Free",
    ru: "Бесплатно",
    uz: "Bepul"
  },
  "cart.total": {
    en: "Total",
    ru: "Итого",
    uz: "Jami"
  },
  "cart.checkout": {
    en: "Proceed to Checkout",
    ru: "Перейти к оформлению",
    uz: "Buyurtmaga o'tish"
  },
  "account.title": {
    en: "Account",
    ru: "Аккаунт",
    uz: "Akkaunt"
  },
  "account.tabs.profile": {
    en: "Profile",
    ru: "Профиль",
    uz: "Profil"
  },
  "account.tabs.orders": {
    en: "Orders",
    ru: "Заказы",
    uz: "Buyurtmalar"
  },
  "account.tabs.wishlist": {
    en: "Wishlist",
    ru: "Избранное",
    uz: "Yoqtirganlar"
  },
  "account.tabs.password": {
    en: "Change Password",
    ru: "Сменить пароль",
    uz: "Parolni o'zgartirish"
  },
  "account.profile.name": {
    en: "Full Name",
    ru: "Полное имя",
    uz: "Ism"
  },
  "account.profile.email": {
    en: "Email",
    ru: "Email",
    uz: "Email"
  },
  "account.profile.save": {
    en: "Save",
    ru: "Сохранить",
    uz: "Saqlash"
  },
  "account.profile.saving": {
    en: "Saving...",
    ru: "Сохраняется...",
    uz: "Saqlanmoqda..."
  },
  "account.profile.success": {
    en: "Profile updated successfully!",
    ru: "Профиль успешно обновлен!",
    uz: "Profil muvaffaqiyatli yangilandi!"
  },
  "account.profile.error": {
    en: "An error occurred!",
    ru: "Произошла ошибка!",
    uz: "Xatolik yuz berdi!"
  },
  "account.orders.title": {
    en: "Order History",
    ru: "История заказов",
    uz: "Buyurtmalar tarixi"
  },
  "account.orders.empty": {
    en: "You have no orders yet.",
    ru: "У вас пока нет заказов.",
    uz: "Sizda hali buyurtmalar yo'q."
  },
  "account.orders.loading": {
    en: "Loading...",
    ru: "Загрузка...",
    uz: "Yuklanmoqda..."
  },
  "account.wishlist.title": {
    en: "Wishlist",
    ru: "Избранное",
    uz: "Yoqtirganlar"
  },
  "account.password.title": {
    en: "Change Password",
    ru: "Сменить пароль",
    uz: "Parolni o'zgartirish"
  },
  "account.notLoggedIn": {
    en: "Please sign in to view your account.",
    ru: "Пожалуйста, войдите в систему, чтобы просмотреть свой аккаунт.",
    uz: "Akkauntingizni ko'rish uchun tizimga kiring."
  },
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

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
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language] || translations[key].en || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
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
