"use client"

import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCurrency } from '@/contexts/currency-context'
import { useLanguage } from '@/contexts/language-context'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">{t('cart.empty')}</h2>
          <p className="text-gray-600 mb-6">{t('cart.emptyDescription')}</p>
          <Link href="/products">
            <Button>{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  {item.product.image_url && (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`} className="font-semibold text-lg hover:underline line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-1">{item.product.brand}</p>
                    <p className="font-bold mt-1">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label={t('cart.decrease')}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold select-none">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={t('cart.increase')}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-end min-w-[80px]">
                    <span className="font-semibold text-base">{formatPrice(item.product.price * item.quantity)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-2 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={t('cart.remove')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-xl p-6 bg-background shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t('cart.summary')}</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span>{t('cart.shippingFree')}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>{t('cart.total')}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => router.push('/checkout')}>
                  {t('cart.checkout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
