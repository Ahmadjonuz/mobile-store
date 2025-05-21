"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Order {
  id: number
  created_at: string
  status: string
  total: number
  items: Array<{
    product_id: string
    name: string
    price: number
    quantity: number
  }>
  shipping_details: {
    full_name: string
    address: string
    city: string
    zip_code: string
    country: string
  }
  payment_details: {
    method: string
    status: string
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setOrders(data || [])
      } catch (error) {
        console.error("Buyurtmalarni yuklashda xatolik:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("account.notLoggedIn")}
          </h2>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t("account.orders.title")}</h1>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">{t("account.orders.empty")}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Buyurtma #{order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    order.status === 'pending' ? 'default' :
                    order.status === 'processing' ? 'secondary' :
                    order.status === 'shipped' ? 'secondary' :
                    order.status === 'delivered' ? 'default' :
                    'destructive'
                  }>
                    {t(`account.orders.status.${order.status}`)}
                  </Badge>
                  <p className="font-semibold">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Buyurtma mahsulotlari */}
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Yetkazib berish ma'lumotlari */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-2">{t("cart.shipping")}</h3>
                  <p>{order.shipping_details.full_name}</p>
                  <p>{order.shipping_details.address}</p>
                  <p>{order.shipping_details.city}, {order.shipping_details.zip_code}</p>
                  <p>{order.shipping_details.country}</p>
                </div>

                {/* To'lov ma'lumotlari */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-2">{t("cart.payment.title")}</h3>
                  <p>
                    {order.payment_details.method === 'card' 
                      ? t("cart.payment.card") 
                      : t("cart.payment.cash")}
                  </p>
                  <Badge variant={
                    order.payment_details.status === 'pending' ? 'default' :
                    order.payment_details.status === 'paid' ? 'secondary' :
                    'destructive'
                  }>
                    {order.payment_details.status === 'pending' 
                      ? t("account.orders.status.pending")
                      : t("account.orders.status.paid")}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 