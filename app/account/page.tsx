"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, User as UserIcon, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const tabs = [
  { key: "profile", labelKey: "account.tabs.profile" },
  { key: "orders", labelKey: "account.tabs.orders" },
  { key: "wishlist", labelKey: "account.tabs.wishlist" },
  { key: "password", labelKey: "account.tabs.password" },
]

export default function AccountPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  // For avatar, you can extend this to upload and save avatar url in the future

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">{t('account.notLoggedIn')}</div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")
    const { error } = await supabase
      .from("users")
      .update({ name: form.name, email: form.email })
      .eq("id", user.id)
    setLoading(false)
    if (error) {
      setError(t("account.profile.error"))
    } else {
      setMessage(t("account.profile.success"))
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">{t('account.title')}</h1>
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
      <Card className="bg-white dark:bg-gray-900 shadow-md">
        {activeTab === "profile" && (
          <CardContent className="p-8 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarFallback>{form.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {/* <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Avatarni o'zgartirish</Button> */}
              {/* <input ref={fileInputRef} type="file" className="hidden" /> */}
              <div className="text-lg font-semibold mt-2">{form.name}</div>
              <div className="text-gray-500 text-sm">{form.email}</div>
            </div>
            <form onSubmit={handleSave} className="w-full max-w-md space-y-4">
              <div>
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> {t('account.profile.name')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {t('account.profile.email')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center"><Loader2 className="animate-spin h-4 w-4 mr-2" /> {t('account.profile.saving')}</span>
                ) : (
                  t('account.profile.save')
                )}
              </Button>
              {message && (
                <Alert variant="default">
                  <AlertTitle>{t('account.profile.success')}</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>{t('account.profile.error')}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        )}
        {activeTab === "orders" && (
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">{t('account.orders.title')}</h2>
            <OrdersList userId={user.id} />
          </CardContent>
        )}
        {activeTab === "wishlist" && (
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">{t('account.wishlist.title')}</h2>
            <WishlistList userId={user.id} />
          </CardContent>
        )}
        {activeTab === "password" && (
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">{t('account.password.title')}</h2>
            <ChangePasswordForm email={user.email} />
          </CardContent>
        )}
      </Card>
    </div>
  )
}

function OrdersList({ userId }: { userId: string }) {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (!error && data) {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [userId])

  if (loading) return <div>{t('account.orders.loading')}</div>
  if (!orders.length) return <div>{t('account.orders.empty')}</div>

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="border p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Buyurtma #{order.id.slice(0, 8)}</CardTitle>
            <Badge>{order.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 mb-2">{new Date(order.created_at).toLocaleString()}</div>
            <div className="mb-2 font-semibold">Mahsulotlar:</div>
            <ul className="mb-2 list-disc list-inside">
              {Array.isArray(order.items)
                ? order.items.map((item: any, idx: number) => (
                    <li key={idx}>{item.name} x{item.quantity} — {item.price} so'm</li>
                  ))
                : null}
            </ul>
            <div className="font-bold">Jami: {order.total} so'm</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function WishlistList({ userId }: { userId: string }) {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWishlist() {
      setLoading(true)
      // Join wishlist with products
      const { data, error } = await supabase
        .from("wishlist")
        .select("id, created_at, product:product_id (id, name, price, image)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (!error && data) {
        setWishlist(data)
      }
      setLoading(false)
    }
    fetchWishlist()
  }, [userId])

  if (loading) return <div>Yuklanmoqda...</div>
  if (!wishlist.length) return <div>Sizda hali saqlangan mahsulotlar yo'q.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {wishlist.map((item) => (
        <Card key={item.id} className="border p-4 flex flex-col items-center">
          {item.product?.image && (
            <img src={item.product.image} alt={item.product.name} className="h-32 w-32 object-cover rounded mb-2" />
          )}
          <div className="font-semibold text-lg mb-1">{item.product?.name}</div>
          <div className="text-primary font-bold mb-2">{item.product?.price} so'm</div>
          <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
        </Card>
      ))}
    </div>
  )
}

function ChangePasswordForm({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    if (newPassword !== confirmPassword) {
      setError("Yangi parollar mos emas!")
      return
    }
    setLoading(true)
    // Supabase: re-authenticate and update password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })
    if (signInError) {
      setError("Joriy parol noto'g'ri!")
      setLoading(false)
      return
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (updateError) {
      setError("Parolni o'zgartirishda xatolik: " + updateError.message)
    } else {
      setMessage("Parol muvaffaqiyatli o'zgartirildi!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <Label htmlFor="currentPassword">Joriy parol</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">Yangi parol</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Yangi parolni tasdiqlang</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center"><Loader2 className="animate-spin h-4 w-4 mr-2" /> O'zgartirilmoqda...</span>
        ) : (
          "Parolni o'zgartirish"
        )}
      </Button>
      {message && (
        <Alert variant="default">
          <AlertTitle>Muvaffaqiyatli</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Xatolik</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}
