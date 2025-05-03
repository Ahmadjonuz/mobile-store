"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Users, History, Award, Briefcase, MapPin, Phone, Clock } from "lucide-react"

export default function AboutPage() {
  const { language } = useLanguage()

  // Content based on selected language
  const content = {
    title: {
      en: "About MobileHub",
      ru: "О MobileHub",
      uz: "MobileHub haqida",
    },
    subtitle: {
      en: "Your Trusted Mobile Phone Retailer Since 2010",
      ru: "Ваш надежный продавец мобильных телефонов с 2010 года",
      uz: "2010 yildan beri ishonchli mobil telefon sotuvchingiz",
    },
    description: {
      en: "MobileHub is Uzbekistan's premier destination for mobile phones and accessories. We pride ourselves on offering the latest technology, exceptional customer service, and competitive prices.",
      ru: "MobileHub — главное место в Узбекистане для покупки мобильных телефонов и аксессуаров. Мы гордимся тем, что предлагаем новейшие технологии, исключительное обслуживание клиентов и конкурентоспособные цены.",
      uz: "MobileHub — O'zbekistondagi mobil telefonlar va aksessuarlar uchun asosiy manzil. Biz eng so'nggi texnologiyalarni, ajoyib mijozlarga xizmat ko'rsatishni va raqobatbardosh narxlarni taklif etishdan faxrlanamiz.",
    },
    mission: {
      title: {
        en: "Our Mission",
        ru: "Наша миссия",
        uz: "Bizning vazifamiz",
      },
      content: {
        en: "To provide our customers with the best mobile technology experience through quality products, expert advice, and outstanding service.",
        ru: "Предоставить нашим клиентам лучший опыт использования мобильных технологий благодаря качественным продуктам, экспертным советам и выдающемуся сервису.",
        uz: "Mijozlarimizga sifatli mahsulotlar, ekspert maslahatlari va ajoyib xizmat orqali eng yaxshi mobil texnologiya tajribasini taqdim etish.",
      },
    },
    vision: {
      title: {
        en: "Our Vision",
        ru: "Наше видение",
        uz: "Bizning ko'rinishimiz",
      },
      content: {
        en: "To be the leading mobile technology retailer in Central Asia, recognized for innovation, reliability, and customer satisfaction.",
        ru: "Стать ведущим продавцом мобильных технологий в Центральной Азии, признанным за инновации, надежность и удовлетворенность клиентов.",
        uz: "Markaziy Osiyoda innovatsiyalar, ishonchlilik va mijozlarning mamnuniyati bilan tan olingan yetakchi mobil texnologiyalar sotuvchisi bo'lish.",
      },
    },
    history: {
      title: {
        en: "Our History",
        ru: "Наша история",
        uz: "Bizning tarixmiz",
      },
      timeline: [
        {
          year: "2010",
          en: "Founded as a small mobile phone repair shop in Tashkent",
          ru: "Основан как небольшой магазин по ремонту мобильных телефонов в Ташкенте",
          uz: "Toshkentda kichik mobil telefon ta'mirlash do'koni sifatida tashkil etilgan",
        },
        {
          year: "2013",
          en: "Expanded to selling mobile phones and accessories",
          ru: "Расширился до продажи мобильных телефонов и аксессуаров",
          uz: "Mobil telefonlar va aksessuarlarni sotishgacha kengaytirildi",
        },
        {
          year: "2015",
          en: "Opened our flagship store in Tashkent City Mall",
          ru: "Открыт наш флагманский магазин в Tashkent City Mall",
          uz: "Toshkent City Mall'da bizning asosiy do'konimiz ochildi",
        },
        {
          year: "2018",
          en: "Launched our online store and expanded to 5 locations across Uzbekistan",
          ru: "Запущен наш интернет-магазин и расширен до 5 точек по всему Узбекистану",
          uz: "Onlayn do'konimiz ishga tushirildi va O'zbekiston bo'ylab 5 ta joyga kengaytirildi",
        },
        {
          year: "2020",
          en: "Celebrated 10 years with 10 stores nationwide",
          ru: "Отпраздновали 10 лет с 10 магазинами по всей стране",
          uz: "Butun mamlakat bo'ylab 10 ta do'kon bilan 10 yillikni nishonladik",
        },
        {
          year: "2023",
          en: "Became the official distributor for major global phone brands in Uzbekistan",
          ru: "Стали официальным дистрибьютором крупных мировых брендов телефонов в Узбекистане",
          uz: "O'zbekistonda yirik global telefon brendlarining rasmiy distribyutori bo'ldi",
        },
      ],
    },
    team: {
      title: {
        en: "Our Team",
        ru: "Наша команда",
        uz: "Bizning jamoa",
      },
      description: {
        en: "We are a team of passionate technology enthusiasts dedicated to providing the best mobile experience for our customers.",
        ru: "Мы — команда увлеченных технологиями энтузиастов, стремящихся обеспечить лучший мобильный опыт для наших клиентов.",
        uz: "Biz mijozlarimizga eng yaxshi mobil tajribani taqdim etishga bag'ishlangan texnologiya ishqibozlari jamoasimiz.",
      },
      members: [
        {
          name: "Avalboyev Javohir",
          position: {
            en: "Founder & CEO",
            ru: "Основатель и генеральный директор",
            uz: "Asoschisi va bosh direktori",
          },
          image: "/owner.jpg",
        },
        {
          name: "Dilnoza Karimova",
          position: {
            en: "Chief Operating Officer",
            ru: "Операционный директор",
            uz: "Operatsion direktor",
          },
          image: "/girl.jpg",
        },
        {
          name: "Timur Ibragimov",
          position: {
            en: "Chief Technology Officer",
            ru: "Технический директор",
            uz: "Texnologiya bo'yicha direktor",
          },
          image: "/boy-1.jpg",
        },
        {
          name: "Nodira Azimova",
          position: {
            en: "Head of Customer Experience",
            ru: "Руководитель клиентского опыта",
            uz: "Mijozlar tajribasi bo'yicha rahbar",
          },
          image: "/boy-3.jpg",
        },
      ],
    },
    locations: {
      title: {
        en: "Our Locations",
        ru: "Наши местоположения",
        uz: "Bizning manzillarimiz",
      },
      stores: [
        {
          name: "Tashkent City Mall",
          address: {
            en: "15 Navoi Street, Tashkent",
            ru: "ул. Навои 15, Ташкент",
            uz: "Navoiy ko'chasi 15, Toshkent",
          },
          hours: {
            en: "Mon-Sun: 10:00 - 22:00",
            ru: "Пн-Вс: 10:00 - 22:00",
            uz: "Du-Ya: 10:00 - 22:00",
          },
          phone: "+998 71 123 4567",
        },
        {
          name: "Samarkand Plaza",
          address: {
            en: "45 Registan Square, Samarkand",
            ru: "Площадь Регистан 45, Самарканд",
            uz: "Registon maydoni 45, Samarqand",
          },
          hours: {
            en: "Mon-Sun: 09:00 - 21:00",
            ru: "Пн-Вс: 09:00 - 21:00",
            uz: "Du-Ya: 09:00 - 21:00",
          },
          phone: "+998 66 123 4567",
        },
        {
          name: "Bukhara Center",
          address: {
            en: "12 Lyabi-Hauz Street, Bukhara",
            ru: "ул. Ляби-Хауз 12, Бухара",
            uz: "Labi-Hovuz ko'chasi 12, Buxoro",
          },
          hours: {
            en: "Mon-Sun: 09:00 - 20:00",
            ru: "Пн-Вс: 09:00 - 20:00",
            uz: "Du-Ya: 09:00 - 20:00",
          },
          phone: "+998 65 123 4567",
        },
      ],
    },
  }

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center mb-12"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{content.title[language]}</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">{content.subtitle[language]}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        <div>
          <img
            src="/about.png"
            alt="MobileHub Store"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-lg mb-6">{content.description[language]}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{content.mission.title[language]}</h3>
                </div>
                <p className="text-muted-foreground">{content.mission.content[language]}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{content.vision.title[language]}</h3>
                </div>
                <p className="text-muted-foreground">{content.vision.content[language]}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="history" className="mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            {content.history.title[language]}
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            {content.team.title[language]}
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="h-4 w-4 mr-2" />
            {content.locations.title[language]}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-8">
            {content.history.timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{item.year}</span>
                </div>
                <div className="flex-grow pt-4">
                  <p className="text-lg">{item[language]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <p className="text-lg mb-8">{content.team.description[language]}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {content.team.members.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 mx-auto rounded-full overflow-hidden w-32 h-32">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.position[language]}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.locations.stores.map((store, index) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">{store.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                        <span>{store.address[language]}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                        <span>{store.hours[language]}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                        <span>{store.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
