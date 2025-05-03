"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, ShoppingCart, User, ChevronDown, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"
import LanguageSelector from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import SearchBar from "@/components/search-bar"
import { DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlistItems.length
  const { t, language } = useLanguage()
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.products"), href: "/products" },
    {
      name: t("nav.categories"),
      href: "/categories",
      children: [
        { name: { uz: "Flagman", ru: "Флагман", en: "Flagship" }, href: "/categories/flagship" },
        { name: { uz: "O'rta daraja", ru: "Средний класс", en: "Mid-range" }, href: "/categories/mid-range" },
        { name: { uz: "Iqtisodiy", ru: "Бюджетный", en: "Budget" }, href: "/categories/budget" },
        { name: { uz: "Katlanadigan", ru: "Складной", en: "Foldable" }, href: "/categories/foldable" },
      ],
    },
    { name: t("nav.deals"), href: "/deals" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        scrolled ? "bg-background/95 shadow-sm" : "bg-background/80"
      }`}
    >
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">
                {language === "uz" && "Menyu"}
                {language === "ru" && "Меню"}
                {language === "en" && "Menu"}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium transition-colors hover:text-primary">
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-2 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block text-foreground/60 hover:text-primary"
                          >
                            {language === "uz" && child.name.uz}
                            {language === "ru" && child.name.ru}
                            {language === "en" && child.name.en}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link href={item.href} className="text-lg font-medium transition-colors hover:text-primary">
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            {/* Mobile Login/Register links */}
            {!user && (
              <div className="flex flex-col gap-2 mt-8">
                <Link href="/auth/login">
                  <Button variant="default" className="w-full">
                    {language === "uz" && "Kirish"}
                    {language === "ru" && "Войти"}
                    {language === "en" && "Login"}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    {language === "uz" && "Ro'yxatdan o'tish"}
                    {language === "ru" && "Регистрация"}
                    {language === "en" && "Register"}
                  </Button>
                </Link>
              </div>
            )}
            {/* Mobile Profile Menu */}
            {user && (
              <div className="mt-8 space-y-2">
                <Link href="/account">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    {language === "uz" && "Profil"}
                    {language === "ru" && "Профиль"}
                    {language === "en" && "Profile"}
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {language === "uz" && "Buyurtmalar"}
                    {language === "ru" && "Заказы"}
                    {language === "en" && "Orders"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={async () => {
                    await signOut()
                    router.push("/auth/login")
                  }}
                >
                  {language === "uz" && "Chiqish"}
                  {language === "ru" && "Выйти"}
                  {language === "en" && "Logout"}
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">MobileHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link href={child.href}>
                            {language === "uz" && child.name.uz}
                            {language === "ru" && child.name.ru}
                            {language === "en" && child.name.en}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Search className="h-5 w-5" />
                <VisuallyHidden>
                  {language === "uz" && "Qidirish"}
                  {language === "ru" && "Поиск"}
                  {language === "en" && "Search"}
                </VisuallyHidden>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-8 pb-8 flex justify-center items-start bg-background/95">
              <VisuallyHidden>
                <DialogTitle>
                  {language === "uz" && "Qidirish"}
                  {language === "ru" && "Поиск"}
                  {language === "en" && "Search"}
                </DialogTitle>
              </VisuallyHidden>
              <div className="w-full max-w-xl mx-auto">
                <SearchBar />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {wishlistCount}
                </Badge>
              )}
              <VisuallyHidden>
                {language === "uz" && "Yoqtirganlar"}
                {language === "ru" && "Избранное"}
                {language === "en" && "Wishlist"}
              </VisuallyHidden>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {cartCount}
                </Badge>
              )}
              <VisuallyHidden>
                {language === "uz" && "Savat"}
                {language === "ru" && "Корзина"}
                {language === "en" && "Cart"}
              </VisuallyHidden>
            </Button>
          </Link>

          <ModeToggle />

          <LanguageSelector />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <VisuallyHidden>
                    {language === "uz" && "Profil"}
                    {language === "ru" && "Профиль"}
                    {language === "en" && "Profile"}
                  </VisuallyHidden>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    {language === "uz" && "Profil"}
                    {language === "ru" && "Профиль"}
                    {language === "en" && "Profile"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    {language === "uz" && "Buyurtmalar"}
                    {language === "ru" && "Заказы"}
                    {language === "en" && "Orders"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut()
                    router.push("/auth/login")
                  }}
                  className="text-destructive cursor-pointer"
                >
                  {language === "uz" && "Chiqish"}
                  {language === "ru" && "Выйти"}
                  {language === "en" && "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">
                  {language === "uz" && "Kirish"}
                  {language === "ru" && "Войти"}
                  {language === "en" && "Login"}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button>
                  {language === "uz" && "Ro'yxatdan o'tish"}
                  {language === "ru" && "Регистрация"}
                  {language === "en" && "Register"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
