"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, ThumbsUp, ThumbsDown, Flag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

// Mock phone data
const phones = [
  {
    id: "1",
    name: "UltraPhone 15 Pro",
    model: "ultraphone-15-pro",
    price: 999,
    image: "/placeholder.svg?height=400&width=200",
    rating: 4.7,
    reviewCount: 1243,
  },
  {
    id: "2",
    name: "UltraPhone 15",
    model: "ultraphone-15",
    price: 799,
    image: "/placeholder.svg?height=400&width=200",
    rating: 4.5,
    reviewCount: 987,
  },
  {
    id: "3",
    name: "UltraPhone SE",
    model: "ultraphone-se",
    price: 499,
    image: "/placeholder.svg?height=400&width=200",
    rating: 4.3,
    reviewCount: 756,
  },
]

// Mock reviews data
const mockReviews = [
  {
    id: "r1",
    userId: "u1",
    userName: "Alex Johnson",
    userImage: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Best phone I've ever owned",
    content:
      "This phone exceeds all my expectations. The camera quality is outstanding, battery life is impressive, and the performance is lightning fast. Highly recommend!",
    date: "2023-10-15",
    helpful: 124,
    unhelpful: 12,
    verified: true,
  },
  {
    id: "r2",
    userId: "u2",
    userName: "Sam Rodriguez",
    userImage: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Great phone but battery could be better",
    content:
      "I love almost everything about this phone. The display is gorgeous, and it's super fast. My only complaint is that the battery life isn't as good as advertised, especially when using demanding apps.",
    date: "2023-09-28",
    helpful: 98,
    unhelpful: 15,
    verified: true,
  },
  {
    id: "r3",
    userId: "u3",
    userName: "Taylor Kim",
    userImage: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Camera quality is unbelievable",
    content:
      "As a photography enthusiast, I'm blown away by the camera on this phone. The night mode is particularly impressive, and the zoom capabilities are better than any phone I've used before.",
    date: "2023-10-02",
    helpful: 156,
    unhelpful: 8,
    verified: true,
  },
  {
    id: "r4",
    userId: "u4",
    userName: "Jordan Lee",
    userImage: "/placeholder.svg?height=40&width=40",
    rating: 3,
    title: "Good but overpriced",
    content:
      "It's a good phone with nice features, but I don't think it justifies the high price tag. There are competitors offering similar specs for less money.",
    date: "2023-09-20",
    helpful: 87,
    unhelpful: 32,
    verified: true,
  },
  {
    id: "r5",
    userId: "u5",
    userName: "Casey Morgan",
    userImage: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Worth every penny",
    content:
      "After using this phone for a month, I can confidently say it's worth the investment. The user experience is seamless, and the build quality is exceptional.",
    date: "2023-10-10",
    helpful: 112,
    unhelpful: 7,
    verified: true,
  },
]

const translations = {
  en: {
    reviews: "Reviews",
    customerReviews: "Customer Reviews",
    verified: "Verified Purchase",
    helpful: "Helpful",
    unhelpful: "Unhelpful",
    report: "Report",
    filterBy: "Filter by",
    all: "All Stars",
    stars: "Stars",
    sortBy: "Sort by",
    newest: "Newest",
    helpful: "Most Helpful",
    highest: "Highest Rating",
    lowest: "Lowest Rating",
    writeReview: "Write a Review",
    backToProduct: "Back to Product",
    outOf5: "out of 5",
    basedOn: "based on",
    ratings: "ratings",
  },
  es: {
    reviews: "Reseñas",
    customerReviews: "Opiniones de clientes",
    verified: "Compra verificada",
    helpful: "Útil",
    unhelpful: "No útil",
    report: "Reportar",
    filterBy: "Filtrar por",
    all: "Todas las estrellas",
    stars: "Estrellas",
    sortBy: "Ordenar por",
    newest: "Más recientes",
    helpful: "Más útiles",
    highest: "Mayor puntuación",
    lowest: "Menor puntuación",
    writeReview: "Escribir una reseña",
    backToProduct: "Volver al producto",
    outOf5: "de 5",
    basedOn: "basado en",
    ratings: "calificaciones",
  },
  fr: {
    reviews: "Avis",
    customerReviews: "Avis des clients",
    verified: "Achat vérifié",
    helpful: "Utile",
    unhelpful: "Inutile",
    report: "Signaler",
    filterBy: "Filtrer par",
    all: "Toutes les étoiles",
    stars: "Étoiles",
    sortBy: "Trier par",
    newest: "Plus récents",
    helpful: "Plus utiles",
    highest: "Note la plus élevée",
    lowest: "Note la plus basse",
    writeReview: "Écrire un avis",
    backToProduct: "Retour au produit",
    outOf5: "sur 5",
    basedOn: "basé sur",
    ratings: "évaluations",
  },
}

export default function ProductReviews() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations]

  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("newest")
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({})
  const [unhelpfulClicked, setUnhelpfulClicked] = useState<Record<string, boolean>>({})

  const phone = phones.find((p) => p.id === id) || phones[0]

  // Filter and sort reviews
  let filteredReviews = [...mockReviews]

  if (filter !== "all") {
    const ratingFilter = Number.parseInt(filter)
    filteredReviews = filteredReviews.filter((review) => review.rating === ratingFilter)
  }

  switch (sort) {
    case "helpful":
      filteredReviews.sort((a, b) => b.helpful - a.helpful)
      break
    case "highest":
      filteredReviews.sort((a, b) => b.rating - a.rating)
      break
    case "lowest":
      filteredReviews.sort((a, b) => a.rating - b.rating)
      break
    default: // newest
      filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 5, 4, 3, 2, 1 stars
  mockReviews.forEach((review) => {
    ratingCounts[5 - review.rating]++
  })

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))

    if (unhelpfulClicked[reviewId]) {
      setUnhelpfulClicked((prev) => ({
        ...prev,
        [reviewId]: false,
      }))
    }
  }

  const handleUnhelpful = (reviewId: string) => {
    setUnhelpfulClicked((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))

    if (helpfulClicked[reviewId]) {
      setHelpfulClicked((prev) => ({
        ...prev,
        [reviewId]: false,
      }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-6">
          <Link href={`/products/${id}`}>
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {t.backToProduct}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.reviews}</h1>
          <Button>{t.writeReview}</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-4xl font-bold">{phone.rating}</h2>
              <div className="flex items-center my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(phone.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {phone.rating} {t.outOf5} • {t.basedOn} {phone.reviewCount} {t.ratings}
              </p>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="w-12 text-sm">
                    {stars} {stars === 1 ? t.stars.slice(0, -1) : t.stars}
                  </div>
                  <Progress value={(ratingCounts[5 - stars] / mockReviews.length) * 100} className="h-2 flex-1" />
                  <div className="w-10 text-right text-sm">{ratingCounts[5 - stars]}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews List */}
          <div className="md:col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">{t.filterBy}:</p>
                  <TabsList>
                    <TabsTrigger
                      value="all"
                      onClick={() => setFilter("all")}
                      className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {t.all}
                    </TabsTrigger>
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <TabsTrigger
                        key={stars}
                        value={stars.toString()}
                        onClick={() => setFilter(stars.toString())}
                        className={filter === stars.toString() ? "bg-primary text-primary-foreground" : ""}
                      >
                        {stars}★
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">{t.sortBy}:</p>
                  <TabsList>
                    <TabsTrigger
                      value="newest"
                      onClick={() => setSort("newest")}
                      className={sort === "newest" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {t.newest}
                    </TabsTrigger>
                    <TabsTrigger
                      value="helpful"
                      onClick={() => setSort("helpful")}
                      className={sort === "helpful" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {t.helpful}
                    </TabsTrigger>
                    <TabsTrigger
                      value="highest"
                      onClick={() => setSort("highest")}
                      className={sort === "highest" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {t.highest}
                    </TabsTrigger>
                    <TabsTrigger
                      value="lowest"
                      onClick={() => setSort("lowest")}
                      className={sort === "lowest" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {t.lowest}
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </Card>

            {filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.userImage || "/placeholder.svg"} alt={review.userName} />
                            <AvatarFallback>{review.userName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  {t.verified}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-semibold mb-2">{review.title}</h3>
                      <p className="text-muted-foreground mb-4">{review.content}</p>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-1 ${helpfulClicked[review.id] ? "bg-primary/10" : ""}`}
                          onClick={() => handleHelpful(review.id)}
                        >
                          <ThumbsUp size={14} />
                          <span>
                            {t.helpful} ({review.helpful + (helpfulClicked[review.id] ? 1 : 0)})
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-1 ${unhelpfulClicked[review.id] ? "bg-primary/10" : ""}`}
                          onClick={() => handleUnhelpful(review.id)}
                        >
                          <ThumbsDown size={14} />
                          <span>
                            {t.unhelpful} ({review.unhelpful + (unhelpfulClicked[review.id] ? 1 : 0)})
                          </span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Flag size={14} />
                          <span>{t.report}</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p>No reviews match your current filter.</p>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
