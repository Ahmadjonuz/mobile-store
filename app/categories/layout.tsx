import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Categories | MobileHub",
  description: "Browse our wide range of smartphone categories",
}

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {children}
    </div>
  )
}
