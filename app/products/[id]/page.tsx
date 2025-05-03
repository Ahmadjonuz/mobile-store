"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase' 
import { useCart } from '@/contexts/cart-context'       
import { Button } from '@/components/ui/button' 
import { Input } from '@/components/ui/input' 
import { Textarea } from '@/components/ui/textarea' 
import { Star, Trash2, Edit2, Check, X } from 'lucide-react' 
import Image from 'next/image'
import { Database } from '@/types/supabase'
import ProductRecommendation from '@/components/product-recommendation'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

type Product = Database['public']['Tables']['products']['Row']
type Review = Database['public']['Tables']['reviews']['Row'] & {
  user: Database['public']['Tables']['users']['Row']  
}

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const { addToCart } = useCart()
  const [mainImageIdx, setMainImageIdx] = useState(0)
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(5)

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users(*)
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false })

      setProduct(productData)
      setReviews(reviewsData || [])
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity, {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url ?? '',
        brand: product.brand,
      })
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast({ title: "Xatolik", description: language === "uz" ? "Fikr yozish uchun tizimga kiring." : language === "ru" ? "Чтобы оставить отзыв, войдите в систему." : "Please sign in to write a review.", variant: "destructive" })
      return
    }
    if (!reviewText.trim()) {
      toast({ title: "Xatolik", description: language === "uz" ? "Fikr matni bo'sh bo'lmasligi kerak." : language === "ru" ? "Текст отзыва не должен быть пустым." : "Review text cannot be empty.", variant: "destructive" })
      return
    }
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            product_id: id,
            rating,
            comment: reviewText,
          },
        ])
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" })
        return
      }
      toast({ title: language === "uz" ? "Fikr yuborildi!" : language === "ru" ? "Отзыв отправлен!" : "Review submitted!", description: language === "uz" ? "Fikringiz uchun rahmat!" : language === "ru" ? "Спасибо за ваш отзыв!" : "Thank you for your review!" })
      setReviewText("")
      setRating(5)
      // Refresh reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`*, user:users(*)`)
        .eq('product_id', id)
        .order('created_at', { ascending: false })
      setReviews(reviewsData || [])
    } catch (err: any) {
      toast({ title: "Xatolik", description: err.message, variant: "destructive" })
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
      if (error) {
        toast({ title: 'Xatolik', description: error.message, variant: 'destructive' })
        return
      }
      toast({ title: language === 'uz' ? 'Fikr o‘chirildi!' : language === 'ru' ? 'Отзыв удален!' : 'Review deleted!', description: '' })
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (err: any) {
      toast({ title: 'Xatolik', description: err.message, variant: 'destructive' })
    }
  }

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id)
    setEditText(review.comment || '')
    setEditRating(review.rating)
  }

  const handleSaveEdit = async (reviewId: string) => {
    try {
      const { error } = await supabase.from('reviews').update({ comment: editText, rating: editRating }).eq('id', reviewId)
      if (error) {
        toast({ title: 'Xatolik', description: error.message, variant: 'destructive' })
        return
      }
      toast({ title: language === 'uz' ? 'Fikr tahrirlandi!' : language === 'ru' ? 'Отзыв обновлен!' : 'Review updated!', description: '' })
      setEditingReviewId(null)
      setEditText('')
      setEditRating(5)
      // Refresh reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`*, user:users(*)`)
        .eq('product_id', id)
        .order('created_at', { ascending: false })
      setReviews(reviewsData || [])
    } catch (err: any) {
      toast({ title: 'Xatolik', description: err.message, variant: 'destructive' })
    }
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setEditText('')
    setEditRating(5)
  }

  const handlePrev = () => {
    if (!product?.image_urls) return;
    setMainImageIdx((prev) =>
      prev === 0 ? product.image_urls!.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!product?.image_urls) return;
    setMainImageIdx((prev) =>
      prev === product.image_urls!.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  if (!product) {
    return <div className="container mx-auto py-8">Product not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center">
          {product.image_urls && product.image_urls.length > 0 ? (
            <>
              <div className="relative">
                <Image
                  src={product.image_urls[mainImageIdx]}
                  alt={product.name + " main image"}
                  width={400}
                  height={400}
                  className="rounded-xl object-cover shadow-lg"
                />
                {product.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                      aria-label="Oldingi rasm"
                    >
                      &#60;
                    </button>
                <button
                  onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                      aria-label="Keyingi rasm"
                >
                      &#62;
                </button>
                  </>
                )}
              </div>
              {product.image_urls.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  {product.image_urls.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setMainImageIdx(idx)}
                      className={`border-2 rounded-lg overflow-hidden focus:outline-none transition-all ${mainImageIdx === idx ? 'border-primary ring-2 ring-primary' : 'border-gray-200'}`}
                      style={{ width: 64, height: 64 }}
                      aria-label={`Rasm ${idx + 1}`}
                    >
                  <Image
                    src={img}
                        alt={product.name + ` thumbnail ${idx + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                  />
                    </button>
                ))}
              </div>
              )}
            </>
          ) : (
            product.image_url && (
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={400}
                className="rounded-xl object-cover shadow-lg"
              />
            )
          )}
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold mb-2 text-primary dark:text-primary-foreground">{product.name}</h1>
          <p className="text-2xl font-semibold mb-2 text-foreground">{product.price ? `${product.price.toLocaleString()} so'm` : ""}</p>
          <p className="text-base text-muted-foreground mb-4">{product.description}</p>
          {product.specs && typeof product.specs === "object" && (
            <div className="bg-muted rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2 text-primary">
                {language === "uz" && "Texnik xususiyatlar"}
                {language === "ru" && "Технические характеристики"}
                {language === "en" && "Technical Specifications"}
              </h2>
              <ul className="text-sm text-muted-foreground space-y-1">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              size="lg"
              className="flex-1 text-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              onClick={handleAddToCart}
            >
              <span className="mr-2">🛒</span>
              {language === "uz" && "Savatga qo'shish"}
              {language === "ru" && "В корзину"}
              {language === "en" && "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-lg border-primary text-primary hover:bg-primary/10 transition-colors"
              onClick={e => { e.preventDefault(); /* Add wishlist logic here */ }}
            >
              <span className="mr-2">❤</span>
              {language === "uz" && "Sevimlilar"}
              {language === "ru" && "Избранное"}
              {language === "en" && "Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-primary">
          {language === "uz" && "Fikrlar"}
          {language === "ru" && "Отзывы"}
          {language === "en" && "Reviews"}
        </h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 bg-background/80">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < (editingReviewId === review.id ? editRating : review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={editingReviewId === review.id ? () => setEditRating(i + 1) : undefined}
                      style={{ cursor: editingReviewId === review.id ? 'pointer' : 'default' }}
                    />
                  ))}
                </div>
                <span className="ml-2 font-medium">{review.user.full_name}</span>
                <span className="ml-2 text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                {user && review.user.id === user.id && (
                  <div className="ml-auto flex gap-2">
                    {editingReviewId === review.id ? (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(review.id)} title="Saqlash"><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={handleCancelEdit} title="Bekor qilish"><X className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => handleEditReview(review)} title="Tahrirlash"><Edit2 className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteReview(review.id)} title="O‘chirish"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {editingReviewId === review.id ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Textarea value={editText} onChange={e => setEditText(e.target.value)} />
                </div>
              ) : (
                <p className="text-gray-600">{review.comment}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {language === "uz" && "Fikr yozish"}
            {language === "ru" && "Оставить отзыв"}
            {language === "en" && "Write a Review"}
          </h3>
          {user ? (
            <div className="space-y-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
              <Textarea
                placeholder={
                  language === "uz" ? "Fikringizni yozing..." :
                  language === "ru" ? "Напишите ваш отзыв..." :
                  "Write your review..."
                }
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleSubmitReview}>
                {language === "uz" && "Yuborish"}
                {language === "ru" && "Отправить"}
                {language === "en" && "Submit Review"}
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {language === "uz" && "Fikr yozish uchun tizimga kiring."}
              {language === "ru" && "Чтобы оставить отзыв, войдите в систему."}
              {language === "en" && "Please sign in to write a review."}
              <div className="mt-4">
                <Button asChild>
                  <Link href="/auth/login">
                    {language === "uz" && "Kirish"}
                    {language === "ru" && "Войти"}
                    {language === "en" && "Login"}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* O'xshash mahsulotlar slideri */}
      {product && (
        <ProductRecommendation excludeProductId={product.id} category={product.category_id} />
      )}
    </div>
  )
}
