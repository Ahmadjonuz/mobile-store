"use client"

import { useLanguage } from "@/contexts/language-context"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TestimonialSection() {
  const { language } = useLanguage()

  const testimonials = [
    {
      id: 1,
      name: {
        uz: "Aziza Karimova",
        ru: "Азиза Каримова",
        en: "Aziza Karimova"
      },
      role: {
        uz: "Texnologiya ishqibozi",
        ru: "Технический энтузиаст",
        en: "Tech Enthusiast"
      },
      content: {
        uz: "Men yangi Galaxy Ultra S25 telefonimni bir oydan beri ishlatayapman va uning kamera sifati meni hayratda qoldirdi. MobileHub'dagi mijozlarga xizmat ko'rsatish ajoyib - ular menga ehtiyojlarimga mos telefonni tanlashda yordam berishdi.",
        ru: "Я использую свой новый Galaxy Ultra S25 уже месяц, и я поражена качеством камеры. Обслуживание клиентов в MobileHub было исключительным - они помогли мне выбрать идеальный телефон для моих нужд.",
        en: "I've been using my new Galaxy Ultra S25 for a month now and I'm blown away by the camera quality. The customer service at MobileHub was exceptional - they helped me choose the perfect phone for my needs."
      },
      rating: 5,
      image: ""
    },
    {
      id: 2,
      name: {
        uz: "Jamshid Alimov",
        ru: "Джамшид Алимов",
        en: "Jamshid Alimov"
      },
      role: {
        uz: "Professional fotograf",
        ru: "Профессиональный фотограф",
        en: "Professional Photographer"
      },
      content: {
        uz: "Fotograf sifatida, ishonchli smartfon kamerasi juda muhim. MobileHub'dan xarid qilgan iPhone 16 Pro kutganlarimdan ham yaxshiroq chiqdi. Ekran sifati ajoyib va batareya quvvati uzoq vaqt yetadi.",
        ru: "Как фотограф, важную роль играет надежная камера смартфона. Мои iPhone 16 Pro, купленные в MobileHub, показали себя лучше, чем мои предыдущие устройства. Экран имеет отличный качество и продолжительное время работы от батареи.",
        en: "As a photographer, a reliable smartphone camera is very important. My iPhone 16 Pro, which I bought from MobileHub, turned out to be better than my previous devices. The screen quality is amazing and the battery life lasts a long time."
      },
      rating: 5,
      image: ""
    },
    {
      id: 3,
      name: {
        uz: "Nilufar Rahimova",
        ru: "Нилуфар Рахимова",
        en: "Nilufar Rahimova"
      },
      role: {
        uz: "Biznes rahbari",
        ru: "Руководитель бизнеса",
        en: "Business Manager"
      },
      content: {
        uz: "MobileHub kompaniyamizning telefonlarini yangilashni juda osonlashtirdi. Ularning ulgurji buyurtma tizimi va biznes qo'llab-quvvatlash jamoasi juda foydali bo'ldi. Telefonlar o'z vaqtida yetkazib berildi va aynan bizga kerak bo'lgan narsalar edi.",
        ru: "Компания MobileHub значительно упростила обновление наших телефонов. Наш системы заказа и команда поддержки бизнеса были чрезвычайно полезными. Телефоны были доставлены вовремя и содержали именно то, что нам нужно.",
        en: "MobileHub made it much easier for us to update our phones. Our ordering system and business support team were extremely helpful. The phones were delivered on time and contained exactly what we needed."
      },
      rating: 4,
      image: ""
    }
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          {language === "uz" && "Mijozlarimiz fikri"}
          {language === "ru" && "Отзывы наших клиентов"}
          {language === "en" && "Our Customers Say"}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {language === "uz" && "Faqat biz emas, butun dunyo mijozlari MobileHub haqida nima deydi?"}
          {language === "ru" && "Не только мы, послушайте, что говорят клиенты по всему миру о MobileHub"}
          {language === "en" && "Not just us, hear what customers worldwide say about MobileHub"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-xl p-6 shadow-md border flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={testimonial.image} alt={testimonial.name[language]} />
                  <AvatarFallback>{testimonial.name[language].charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name[language]}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role[language]}</p>
                </div>
                <Quote className="h-8 w-8 text-primary/20 ml-auto" />
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
