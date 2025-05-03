"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-context"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    image_url: string
    brand: string
  }
}

interface WishlistItemFromDB {
  product_id: string
  product_name: string
  product_price: number
  product_image_url: string
  product_brand: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (product: WishlistItem['product']) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { user } = useAuth()

  // Load wishlist from database when user logs in
  useEffect(() => {
    if (user) {
      const loadWishlist = async () => {
        const { data } = await supabase
          .from('user_wishlist')
          .select('*')
          .eq('user_id', user.id)

        if (data) {
          setItems(data.map((item: WishlistItemFromDB) => ({
            id: item.product_id,
            product: {
              id: item.product_id,
              name: item.product_name,
              price: item.product_price,
              image_url: item.product_image_url,
              brand: item.product_brand
            }
          })))
        }
      }

      loadWishlist()
    }
  }, [user])

  const addToWishlist = async (product: WishlistItem['product']) => {
    setItems(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev
      }
      return [...prev, { id: product.id, product }]
    })

    if (user) {
      await supabase
        .from('user_wishlist')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image_url: product.image_url,
          product_brand: product.brand
        })
    }
  }

  const removeFromWishlist = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))

    if (user) {
      await supabase
        .from('user_wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id)
    }
  }

  const clearWishlist = async () => {
    setItems([])

    if (user) {
      await supabase
        .from('user_wishlist')
        .delete()
        .eq('user_id', user.id)
    }
  }

  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id)
  }

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 