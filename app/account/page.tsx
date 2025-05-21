"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Package, Heart, Lock } from "lucide-react"

export default function AccountPage() {
  const { user, loading, updateProfile, signOut } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [name, setName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (user) {
      setName(user.name)
    }
  }, [user, loading, router])

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true)
      await updateProfile(name)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("account.notLoggedIn")}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("account.title")}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("account.tabs.profile")}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t("account.tabs.orders")}
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {t("account.tabs.wishlist")}
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t("account.tabs.password")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("account.profile.name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("account.profile.email")}</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  readOnly
                />
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t("account.profile.saving")}
                    </>
                  ) : (
                    t("account.profile.save")
                  )}
                </Button>
                <Button variant="destructive" onClick={signOut}>
                  {t("auth.signOut")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-4">
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-4 text-lg font-medium">{t("account.orders.title")}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t("account.orders.empty")}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-4">
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-4 text-lg font-medium">{t("wishlist.title")}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t("wishlist.empty")}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="password" className="mt-4">
              <div className="text-center py-8">
                <Lock className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-4 text-lg font-medium">{t("account.password.title")}</h3>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/auth/reset-password")}
                >
                  {t("account.password.title")}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
