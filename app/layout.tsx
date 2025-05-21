import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { Providers } from "./providers"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MobileHub - Premium Mobile Phones",
  description: "Discover the latest smartphones and accessories at MobileHub",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <CurrencyProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <div className="relative flex min-h-screen flex-col">
                      <Navbar />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
