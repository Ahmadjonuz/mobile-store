export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          price: number
          description: string | null
          image_url: string | null
          image_urls: string[] | null
          brand: string
          model: string
          specs: Json
          category_id: string
          stock: number
          rating: number
          reviews_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          image_urls?: string[] | null
          brand: string
          model: string
          specs?: Json
          category_id: string
          stock: number
          rating?: number
          reviews_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          image_urls?: string[] | null
          brand?: string
          model?: string
          specs?: Json
          category_id?: string
          stock?: number
          rating?: number
          reviews_count?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image_url?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image_url?: string | null
          description?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
} 
