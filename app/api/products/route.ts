import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Mahsulotlarni olish
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_specifications (*),
        product_category_junction (
          product_categories (
            name,
            slug
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Mahsulotlarni olishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
