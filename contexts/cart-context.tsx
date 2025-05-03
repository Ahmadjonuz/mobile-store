"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-context"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string
    brand: string
  }
}

interface CartItemFromDB {
  product_id: string
  quantity: number
  product_name: string
  product_price: number
  product_image_url: string
  product_brand: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (id: string, quantity: number, product: CartItem['product']) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      const loadCart = async () => {
        const { data } = await supabase
          .from('user_cart')
          .select('*')
          .eq('user_id', user.id)

        if (data) {
          setItems(data.map((item: CartItemFromDB) => ({
            id: item.product_id,
            quantity: item.quantity,
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

      loadCart()
    }
  }, [user])

  const addToCart = async (id: string, quantity: number, product: CartItem['product']) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === id)
      if (existingItem) {
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { id, quantity, product }]
    })

    if (user) {
      await supabase
        .from('user_cart')
        .upsert({
          user_id: user.id,
          product_id: id,
          quantity,
          product_name: product.name,
          product_price: product.price,
          product_image_url: product.image_url,
          product_brand: product.brand
        })
    }
  }

  const removeFromCart = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))

    if (user) {
      await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    )

    if (user) {
      await supabase
        .from('user_cart')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', id)
    }
  }

  const clearCart = async () => {
    setItems([])

    if (user) {
      await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', user.id)
    }
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 