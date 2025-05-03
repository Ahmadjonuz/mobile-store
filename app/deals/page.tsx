"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Tag, Percent, Gift, Zap } from "lucide-react"

// Mock data for deals
const deals = [
  {
    id: 1,
    title: {
      en: "Flash Sale: 20% Off All Smartphones",
      ru: "Флеш-распродажа: 20% скидка на все смартфоны",
      uz: "Tezkor sotish: Barcha smartfonlarga 20% chegirma",
    },
    description: {
      en: "Limited time offer on all premium smartphones. Grab yours before the deal expires!",
      ru: "Ограниченное по времени предложение на все премиальные смартфоны. Успейте приобрести до истечения срока акции!",
      uz: "Barcha premium smartfonlarga cheklangan vaqt taklifi. Aksiya tugashidan oldin o'zingiznikini oling!",
    },
    discount: 20,
    type: "flash",
    endDate: "2025-05-15",
    image: "/20.png",
    originalPrice: 12000000,
  },
  {
    id: 2,
    title: {
      en: "Buy One Get One Free",
      ru: "Купи один, получи один бесплатно",
      uz: "Birni oling, birni bepul oling",
    },
    description: {
      en: "Purchase any flagship phone and get a budget model absolutely free!",
      ru: "Купите любой флагманский телефон и получите бюджетную модель абсолютно бесплатно!",
      uz: "Istalgan flagman telefonni xarid qiling va byudjet modelini mutlaqo bepul oling!",
    },
    discount: 100,
    type: "bundle",
    endDate: "2025-06-01",
    image: "/bir.png",
    originalPrice: 15000000,
  },
  {
    id: 3,
    title: {
      en: "Trade-in Special: Extra 15% Value",
      ru: "Специальное предложение по обмену: дополнительно 15% стоимости",
      uz: "Almashtirish bo'yicha maxsus taklif: qo'shimcha 15% qiymat",
    },
    description: {
      en: "Trade in your old phone and receive an extra 15% on top of its value towards your new purchase.",
      ru: "Обменяйте свой старый телефон и получите дополнительно 15% сверх его стоимости на новую покупку.",
      uz: "Eski telefoningizni topshiring va yangi xarid uchun uning qiymatidan tashqari qo'shimcha 15% oling.",
    },
    discount: 15,
    type: "trade-in",
    endDate: "2025-05-30",
    image: "15.png",
    originalPrice: 8000000,
  },
  {
    id: 4,
    title: {
      en: "Weekend Special: Free Accessories",
      ru: "Специальное предложение выходного дня: бесплатные аксессуары",
      uz: "Dam olish kunlari maxsus taklif: bepul aksessuarlar",
    },
    description: {
      en: "Purchase any phone this weekend and get a free case, screen protector, and wireless charger.",
      ru: "Купите любой телефон в эти выходные и получите бесплатный чехол, защитное стекло и беспроводное зарядное устройство.",
      uz: "Bu dam olish kunlarida istalgan telefonni xarid qiling va bepul g'ilof, ekran himoyachisi va simsiz zaryadlovchi qurilmasini oling.",
    },
    discount: 0,
    type: "gift",
    endDate: "2025-05-10",
    image: "free.png",
    originalPrice: 10000000,
  },
  {
    id: 5,
    title: {
      en: "Student Discount: 10% Off",
      ru: "Студенческая скидка: 10% скидка",
      uz: "Talabalar uchun chegirma: 10% chegirma",
    },
    description: {
      en: "Students get an exclusive 10% discount on all phones and accessories with valid ID.",
      ru: "Студенты получают эксклюзивную 10% скидку на все телефоны и аксессуары при предъявлении действующего удостоверения.",
      uz: "Talabalar haqiqiy guvohnoma bilan barcha telefonlar va aksessuarlarga eksklyuziv 10% chegirma olishadi.",
    },
    discount: 10,
    type: "special",
    endDate: "2025-12-31",
    image: "student.png",
    originalPrice: 9000000,
  },
  {
    id: 6,
    title: {
      en: "Clearance Sale: Up to 30% Off",
      ru: "Распродажа: скидки до 30%",
      uz: "Tozalash sotishi: 30% gacha chegirma",
    },
    description: {
      en: "Huge discounts on last year's models. Limited stock available!",
      ru: "Огромные скидки на модели прошлого года. Ограниченное количество в наличии!",
      uz: "O'tgan yilgi modellarga katta chegirmalar. Cheklangan miqdorda mavjud!",
    },
    discount: 30,
    type: "clearance",
    endDate: "2025-05-20",
    image: "/30.png",
    originalPrice: 7000000,
  },
]

export default function DealsPage() {
  const { t, language } = useLanguage()
  const { formatPrice } = useCurrency()
  const [activeTab, setActiveTab] = useState("all")

  // Filter deals based on active tab
  const filteredDeals = activeTab === "all" ? deals : deals.filter((deal) => deal.type === activeTab)

  // Get icon based on deal type
  const getDealIcon = (type: string) => {
    switch (type) {
      case "flash":
        return <Zap className="h-5 w-5" />
      case "bundle":
        return <Gift className="h-5 w-5" />
      case "trade-in":
        return <Tag className="h-5 w-5" />
      case "gift":
        return <Gift className="h-5 w-5" />
      case "special":
        return <Badge className="h-5 w-5" />
      case "clearance":
        return <Percent className="h-5 w-5" />
      default:
        return <Percent className="h-5 w-5" />
    }
  }

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate discounted price
  const getDiscountedPrice = (originalPrice: number, discount: number) => {
    return originalPrice - originalPrice * (discount / 100)
  }

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{t("nav.deals")}</h1>
        <p className="text-muted-foreground max-w-[700px]">
          {language === "en" &&
            "Discover our latest promotions, discounts, and special offers on smartphones and accessories."}
          {language === "ru" &&
            "Откройте для себя наши последние акции, скидки и специальные предложения на смартфоны и аксессуары."}
          {language === "uz" &&
            "Smartfonlar va aksessuarlar bo'yicha eng so'nggi aksiyalar, chegirmalar va maxsus takliflarni kashf eting."}
        </p>
      </motion.div>

      <div className="mt-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">
              {language === "en" && "All Deals"}
              {language === "ru" && "Все акции"}
              {language === "uz" && "Barcha aksiyalar"}
            </TabsTrigger>
            <TabsTrigger value="flash">
              {language === "en" && "Flash Sales"}
              {language === "ru" && "Флеш-распродажи"}
              {language === "uz" && "Tezkor sotishlar"}
            </TabsTrigger>
            <TabsTrigger value="bundle">
              {language === "en" && "Bundles"}
              {language === "ru" && "Комплекты"}
              {language === "uz" && "To'plamlar"}
            </TabsTrigger>
            <TabsTrigger value="clearance">
              {language === "en" && "Clearance"}
              {language === "ru" && "Распродажа"}
              {language === "uz" && "Tozalash sotishi"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden">
                    <div className="relative">
                      <img
                        src={deal.image || "/placeholder.svg"}
                        alt={deal.title[language]}
                        className="w-full h-48 object-cover"
                      />
                      {deal.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md font-bold">
                          -{deal.discount}%
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        {getDealIcon(deal.type)}
                        <Badge variant="outline" className="text-xs">
                          {deal.type === "flash" &&
                            (language === "en"
                              ? "Flash Sale"
                              : language === "ru"
                                ? "Флеш-распродажа"
                                : "Tezkor sotish")}
                          {deal.type === "bundle" &&
                            (language === "en" ? "Bundle" : language === "ru" ? "Комплект" : "To'plam")}
                          {deal.type === "trade-in" &&
                            (language === "en" ? "Trade-in" : language === "ru" ? "Обмен" : "Almashtirish")}
                          {deal.type === "gift" &&
                            (language === "en"
                              ? "Free Gift"
                              : language === "ru"
                                ? "Бесплатный подарок"
                                : "Bepul sovg'a")}
                          {deal.type === "special" &&
                            (language === "en"
                              ? "Special Offer"
                              : language === "ru"
                                ? "Специальное предложение"
                                : "Maxsus taklif")}
                          {deal.type === "clearance" &&
                            (language === "en" ? "Clearance" : language === "ru" ? "Распродажа" : "Tozalash sotishi")}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{deal.title[language]}</h3>
                      <p className="text-muted-foreground mt-2">{deal.description[language]}</p>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {language === "en" && `Ends: ${new Date(deal.endDate).toLocaleDateString()}`}
                            {language === "ru" && `Заканчивается: ${new Date(deal.endDate).toLocaleDateString()}`}
                            {language === "uz" && `Tugaydi: ${new Date(deal.endDate).toLocaleDateString()}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {language === "en" && `${getDaysRemaining(deal.endDate)} days remaining`}
                            {language === "ru" && `Осталось ${getDaysRemaining(deal.endDate)} дней`}
                            {language === "uz" && `${getDaysRemaining(deal.endDate)} kun qoldi`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start pt-0">
                      <div className="flex items-center gap-2 mt-2">
                        {deal.discount > 0 && (
                          <span className="text-muted-foreground line-through">{formatPrice(deal.originalPrice)}</span>
                        )}
                        <span className="text-xl font-bold">
                          {formatPrice(getDiscountedPrice(deal.originalPrice, deal.discount))}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-md font-medium"
                      >
                        {language === "en" && "View Deal"}
                        {language === "ru" && "Посмотреть акцию"}
                        {language === "uz" && "Aksiyani ko'rish"}
                      </motion.button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
