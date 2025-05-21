"use client"

import { useLanguage } from "@/contexts/language-context"
import { CheckCircle } from "lucide-react"

interface OrderSuccessProps {
  isOpen: boolean
  onClose: () => void
}

export function OrderSuccess({ isOpen, onClose }: OrderSuccessProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center gap-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("cart.orderSuccess")}
          </h2>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
} 