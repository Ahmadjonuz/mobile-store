"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { language } = useLanguage()

  const quickLinks = [
    { name: { uz: "Bosh sahifa", ru: "Главная", en: "Home" }, href: "/" },
    { name: { uz: "Mahsulotlar", ru: "Товары", en: "Products" }, href: "/products" },
    { name: { uz: "Toifalar", ru: "Категории", en: "Categories" }, href: "/categories" },
    { name: { uz: "Aksiyalar", ru: "Акции", en: "Deals" }, href: "/deals" },
    { name: { uz: "Biz haqimizda", ru: "О нас", en: "About Us" }, href: "/about" },
    { name: { uz: "Aloqa", ru: "Контакты", en: "Contact" }, href: "/contact" },
  ]
  const customerService = [
    { name: { uz: "FAQ", ru: "Вопрос-ответ", en: "FAQ" }, href: "/faq" },
    { name: { uz: "Yetkazib berish va qaytarish", ru: "Доставка и возврат", en: "Shipping & Returns" }, href: "/shipping" },
    { name: { uz: "Kafolat haqida", ru: "Гарантия", en: "Warranty Information" }, href: "/warranty" },
    { name: { uz: "Yordam markazi", ru: "Служба поддержки", en: "Support Center" }, href: "/support" },
    { name: { uz: "Foydalanish shartlari", ru: "Условия использования", en: "Terms & Conditions" }, href: "/terms" },
    { name: { uz: "Maxfiylik siyosati", ru: "Политика конфиденциальности", en: "Privacy Policy" }, href: "/privacy" },
  ]

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              MobileHub
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === "uz" && "Dunyo bo'ylab premium smartfonlar va aksessuarlar uchun yagona manzilingiz."}
              {language === "ru" && "Ваш универсальный магазин премиальных смартфонов и аксессуаров со всего мира."}
              {language === "en" && "Your one-stop destination for premium smartphones and accessories from around the world."}
            </p>
            <div className="flex space-x-4">
              {[{ icon: Facebook, label: "Facebook" }, { icon: Instagram, label: "Instagram" }, { icon: Twitter, label: "Twitter" }, { icon: Youtube, label: "YouTube" }].map((social) => (
                <Link key={social.label} href="#" className="text-muted-foreground hover:text-primary transition">
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === "uz" && "Tezkor havolalar"}
              {language === "ru" && "Быстрые ссылки"}
              {language === "en" && "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition">
                    {link.name[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === "uz" && "Mijozlarga xizmat"}
              {language === "ru" && "Служба поддержки"}
              {language === "en" && "Customer Service"}
            </h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition">
                    {link.name[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === "uz" && "Aloqa"}
              {language === "ru" && "Контакты"}
              {language === "en" && "Contact Us"}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {language === "uz" && "123 Texno ko'chasi, Raqamli shahar\nInnovatsiya viloyati, 10101"}
                  {language === "ru" && "123 Техно улица, Цифровой город\nИнновационный регион, 10101"}
                  {language === "en" && "123 Tech Street, Digital City\nInnovation State, 10101"}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">support@mobilehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {language === "uz" && "© 2025 MobileHub. Barcha huquqlar himoyalangan."}
            {language === "ru" && "© 2025 MobileHub. Все права защищены."}
            {language === "en" && "© 2025 MobileHub. All rights reserved."}
          </p>
          <div className="flex space-x-4">
            {[
              { uz: "Shartlar", ru: "Условия", en: "Terms" },
              { uz: "Maxfiylik", ru: "Конфиденциальность", en: "Privacy" },
              { uz: "Cookies", ru: "Cookies", en: "Cookies" },
            ].map((item, index) => (
              <Link
                key={item.en}
                href={`/${item.en.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                {item[language]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
