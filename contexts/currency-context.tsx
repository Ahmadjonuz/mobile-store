"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Currency = "UZS"

type CurrencyInfo = {
  code: Currency
  symbol: string
  name: string
  flag: string
  rate: number // Exchange rate relative to USD
}

const currencies: CurrencyInfo[] = [{ code: "UZS", symbol: "so'm", name: "Uzbek Soum", flag: "🇺🇿", rate: 1 }]

type CurrencyContextType = {
  currency: CurrencyInfo
  setCurrency: (currency: Currency) => void
  formatPrice: (priceInUZS: number) => string
  currencies: CurrencyInfo[]
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(currencies[0])

  // Load currency preference from localStorage on client side
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency
    if (savedCurrency) {
      const currencyInfo = currencies.find((c) => c.code === savedCurrency)
      if (currencyInfo) {
        setCurrencyState(currencyInfo)
      }
    }
  }, [])

  // Save currency preference to localStorage
  const setCurrency = (currencyCode: Currency) => {
    const currencyInfo = currencies.find((c) => c.code === currencyCode)
    if (currencyInfo) {
      setCurrencyState(currencyInfo)
      localStorage.setItem("currency", currencyCode)
    }
  }

  // Format price based on current currency
  const formatPrice = (priceInUZS: number): string => {
    // Format for Uzbek soums - no decimal places
    return `${Math.round(priceInUZS).toLocaleString()} ${currency.symbol}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
