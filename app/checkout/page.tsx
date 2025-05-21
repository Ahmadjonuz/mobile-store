"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useCurrency } from "@/contexts/currency-context"
import { Check, CreditCard, ArrowRight, ArrowLeft, ShoppingCart, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import confetti from "canvas-confetti"
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { OrderSuccess } from "@/components/OrderSuccess"

const translations = {
  en: {
    checkout: "Checkout",
    cart: "Your Cart",
    shipping: "Shipping",
    payment: "Payment",
    confirmation: "Confirmation",
    next: "Next",
    back: "Back",
    placeOrder: "Place Order",
    orderComplete: "Order Complete!",
    orderNumber: "Order Number",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    shippingAddress: "Shipping Address",
    fullName: "Full Name",
    address: "Address",
    city: "City",
    zipCode: "ZIP Code",
    country: "Country",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
    paypal: "PayPal",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    nameOnCard: "Name on Card",
    standard: "Standard Shipping",
    express: "Express Shipping",
    overnight: "Overnight Shipping",
    free: "Free",
    orderSummary: "Order Summary",
    thankYou: "Thank you for your order!",
    orderConfirmation: "Your order has been confirmed. You will receive an email confirmation shortly.",
    remove: "Remove",
    loginRequired: "You need to be logged in to place an order",
    fillShippingDetails: "Please fill in all shipping details",
    orderError: "Error creating order",
    unknownError: "Unknown error",
    emptyCart: "Your cart is empty",
    goToProducts: "Go to products page to add items to your cart",
    goToProductsButton: "Go to Products",
    cashPayment: "Cash Payment",
  },
  es: {
    checkout: "Pago",
    cart: "Tu Carrito",
    shipping: "Envío",
    payment: "Pago",
    confirmation: "Confirmación",
    next: "Siguiente",
    back: "Atrás",
    placeOrder: "Realizar Pedido",
    orderComplete: "¡Pedido Completado!",
    orderNumber: "Número de Pedido",
    continueShopping: "Continuar Comprando",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",
    shippingAddress: "Dirección de Envío",
    fullName: "Nombre Completo",
    address: "Dirección",
    city: "Ciudad",
    zipCode: "Código Postal",
    country: "País",
    paymentMethod: "Método de Pago",
    creditCard: "Tarjeta de Crédito",
    paypal: "PayPal",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    cardNumber: "Número de Tarjeta",
    expiryDate: "Fecha de Expiración",
    cvv: "CVV",
    nameOnCard: "Nombre en la Tarjeta",
    standard: "Envío Estándar",
    express: "Envío Express",
    overnight: "Envío Nocturno",
    free: "Gratis",
    orderSummary: "Resumen del Pedido",
    thankYou: "¡Gracias por tu pedido!",
    orderConfirmation: "Tu pedido ha sido confirmado. Recibirás un correo electrónico de confirmación en breve.",
    remove: "Eliminar",
    loginRequired: "Debe iniciar sesión para realizar un pedido",
    fillShippingDetails: "Por favor complete todos los datos de envío",
    orderError: "Error al crear el pedido",
    unknownError: "Error desconocido",
    emptyCart: "Su carrito está vacío",
    goToProducts: "Vaya a la página de productos para agregar artículos a su carrito",
    goToProductsButton: "Ir a Productos",
    cashPayment: "Pago en efectivo",
  },
  fr: {
    checkout: "Paiement",
    cart: "Votre Panier",
    shipping: "Livraison",
    payment: "Paiement",
    confirmation: "Confirmation",
    next: "Suivant",
    back: "Retour",
    placeOrder: "Passer la Commande",
    orderComplete: "Commande Terminée!",
    orderNumber: "Numéro de Commande",
    continueShopping: "Continuer vos Achats",
    subtotal: "Sous-total",
    tax: "Taxe",
    total: "Total",
    shippingAddress: "Adresse de Livraison",
    fullName: "Nom Complet",
    address: "Adresse",
    city: "Ville",
    zipCode: "Code Postal",
    country: "Pays",
    paymentMethod: "Méthode de Paiement",
    creditCard: "Carte de Crédit",
    paypal: "PayPal",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    cardNumber: "Numéro de Carte",
    expiryDate: "Date d'Expiration",
    cvv: "CVV",
    nameOnCard: "Nom sur la Carte",
    standard: "Livraison Standard",
    express: "Livraison Express",
    overnight: "Livraison le Lendemain",
    free: "Gratuit",
    orderSummary: "Résumé de la Commande",
    thankYou: "Merci pour votre commande!",
    orderConfirmation: "Votre commande a été confirmée. Vous recevrez un email de confirmation sous peu.",
    remove: "Supprimer",
    loginRequired: "Vous devez être connecté pour passer une commande",
    fillShippingDetails: "Veuillez remplir tous les détails de livraison",
    orderError: "Erreur lors de la création de la commande",
    unknownError: "Erreur inconnue",
    emptyCart: "Votre panier est vide",
    goToProducts: "Accédez à la page des produits pour ajouter des articles à votre panier",
    goToProductsButton: "Voir les Produits",
    cashPayment: "Paiement en espèces",
  },
  uz: {
    checkout: "To'lov",
    cart: "Savatingiz",
    shipping: "Yetkazib berish",
    payment: "To'lov",
    confirmation: "Tasdiqlash",
    next: "Keyingisi",
    back: "Orqaga",
    placeOrder: "Buyurtma berish",
    orderComplete: "Buyurtma yakunlandi!",
    orderNumber: "Buyurtma raqami",
    continueShopping: "Xarid qilishni davom ettirish",
    subtotal: "Oraliq summa",
    tax: "Soliq",
    total: "Jami",
    shippingAddress: "Yetkazib berish manzili",
    fullName: "To'liq ism",
    address: "Manzil",
    city: "Shahar",
    zipCode: "Pochta indeksi",
    country: "Mamlakat",
    paymentMethod: "To'lov usuli",
    creditCard: "Kredit karta",
    paypal: "PayPal",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    cardNumber: "Karta raqami",
    expiryDate: "Amal qilish muddati",
    cvv: "CVV",
    nameOnCard: "Kartadagi ism",
    standard: "Standart yetkazib berish",
    express: "Tezkor yetkazib berish",
    overnight: "Bir kunlik yetkazib berish",
    free: "Bepul",
    orderSummary: "Buyurtma tafsilotlari",
    thankYou: "Buyurtmangiz uchun rahmat!",
    orderConfirmation: "Buyurtmangiz tasdiqlandi. Tez orada tasdiqlash xabari elektron pochtangizga yuboriladi.",
    remove: "O'chirish",
    loginRequired: "Buyurtma berish uchun tizimga kirishingiz kerak",
    fillShippingDetails: "Iltimos, yetkazib berish ma'lumotlarini to'ldiring",
    orderError: "Buyurtma yaratishda xatolik",
    unknownError: "Noma'lum xatolik",
    emptyCart: "Savat bo'sh",
    goToProducts: "Savatga mahsulot qo'shish uchun mahsulotlar sahifasiga o'ting",
    goToProductsButton: "Mahsulotlar sahifasiga o'tish",
    cashPayment: "Naqd pul orqali to'lov",
  },
  ru: {
    checkout: "Оплата",
    cart: "Ваша корзина",
    shipping: "Доставка",
    payment: "Оплата",
    confirmation: "Подтверждение",
    next: "Далее",
    back: "Назад",
    placeOrder: "Оформить заказ",
    orderComplete: "Заказ оформлен!",
    orderNumber: "Номер заказа",
    continueShopping: "Продолжить покупки",
    subtotal: "Подытог",
    tax: "Налог",
    total: "Итого",
    shippingAddress: "Адрес доставки",
    fullName: "Полное имя",
    address: "Адрес",
    city: "Город",
    zipCode: "Почтовый индекс",
    country: "Страна",
    paymentMethod: "Способ оплаты",
    creditCard: "Кредитная карта",
    paypal: "PayPal",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    cardNumber: "Номер карты",
    expiryDate: "Срок действия",
    cvv: "CVV",
    nameOnCard: "Имя на карте",
    standard: "Стандартная доставка",
    express: "Экспресс доставка",
    overnight: "Доставка за сутки",
    free: "Бесплатно",
    orderSummary: "Сводка заказа",
    thankYou: "Спасибо за ваш заказ!",
    orderConfirmation: "Ваш заказ подтвержден. Вы получите подтверждение по электронной почте в ближайшее время.",
    remove: "Удалить",
    loginRequired: "Для оформления заказа необходимо войти в систему",
    fillShippingDetails: "Пожалуйста, заполните все данные о доставке",
    orderError: "Ошибка при создании заказа",
    unknownError: "Неизвестная ошибка",
    emptyCart: "Корзина пуста",
    goToProducts: "Перейдите на страницу товаров, чтобы добавить товары в корзину",
    goToProductsButton: "Перейти к товарам",
    cashPayment: "Оплата наличными",
  }
}

type Translation = typeof translations['en']
type LanguageKey = keyof typeof translations
function getTranslation(language: string): Translation {
  if (language in translations) {
    return translations[language as LanguageKey]
  }
  return translations.en
}

function CheckoutStepper({ step, t }: { step: number, t: Translation }) {
  const steps = [t.cart, t.shipping, t.payment, t.confirmation]
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full font-bold border-2 transition-all duration-300",
              idx <= step 
                ? "bg-primary text-white border-primary shadow-lg" 
                : "bg-muted text-muted-foreground border-muted"
            )}
          >
            {idx < step ? <Check className="w-5 h-5" /> : idx + 1}
          </div>
          <span className={cn(
            "text-sm font-medium transition-colors duration-300",
            idx === step ? "text-primary font-semibold" : "text-muted-foreground"
          )}>{label}</span>
          {idx < steps.length - 1 && (
            <div className={cn(
              "w-16 h-1 rounded-full transition-colors duration-300",
              idx < step ? "bg-primary" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [orderNumber, setOrderNumber] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [shippingData, setShippingData] = useState({
    full_name: "",
    address: "",
    city: "",
    zip_code: "",
    country: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const { language } = useLanguage()
  const { currency, formatPrice } = useCurrency()
  const t = getTranslation(language)
  const { user } = useAuth();
  const { items, clearCart, updateQuantity, removeFromCart } = useCart();

  const steps = [t.cart, t.shipping, t.payment, t.confirmation]

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      if (step === 2) {
        try {
          if (!user) {
            alert(t.loginRequired);
            return;
          }

          console.log("Current user:", user);

          if (!shippingData.full_name || !shippingData.address || !shippingData.city || !shippingData.zip_code || !shippingData.country) {
            alert(t.fillShippingDetails);
            return;
          }

          const newOrder = {
            user_id: user.id,
            items: items.map(item => ({
              product_id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
            total: total,
            status: 'pending',
            shipping_details: shippingData,
            payment_details: {
              method: paymentMethod,
              status: 'pending',
              payment_time: null,
              transaction_id: null
            }
          };

          console.log("Order details:", newOrder);

          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([newOrder])
            .select('id')
            .single();

          if (orderError) {
            console.error("Error creating order:", orderError);
            throw new Error(orderError.message);
          }

          const newOrderNumber = `ORD-${orderData?.id || Math.floor(100000 + Math.random() * 900000)}`;
          setOrderNumber(newOrderNumber);
          
          setShowSuccess(true);
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          clearCart();
          setStep(step + 1);
        } catch (error) {
          console.error("Error creating order:", error);
          alert(t.orderError + ": " + (error instanceof Error ? error.message : t.unknownError));
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  // Calculate totals using real cart items
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const shippingCost = step >= 1 ? (step === 1 ? 10 : 0) : 10 // Default to standard shipping
  const total = subtotal + tax + shippingCost

  return (
    <div className="container mx-auto py-8 px-2 md:px-0">
      <CheckoutStepper step={step} t={t} />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Panel */}
        <div className="flex-1 space-y-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Step Content */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">{t.cart}</h2>
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t.emptyCart}</h3>
                      <p className="text-muted-foreground mb-6">{t.goToProducts}</p>
                      <Button asChild>
                        <Link href="/products">{t.goToProductsButton}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <img
                            src={item.product.image_url || '/placeholder.png'}
                            alt={item.product.name}
                            className="w-20 h-20 object-contain rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                            <p className="font-semibold">{formatPrice(item.product.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value)
                                  if (!isNaN(value) && value >= 1) {
                                    updateQuantity(item.id, value)
                                  }
                                }}
                                className="w-12 h-8 text-center border-0 focus-visible:ring-0"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">{t.shippingAddress}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">{t.fullName}</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={shippingData.full_name}
                        onChange={handleShippingChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t.address}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t.city}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">{t.zipCode}</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        value={shippingData.zip_code}
                        onChange={handleShippingChange}
                        placeholder="10001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t.country}</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">{t.paymentMethod}</h2>
                  <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={handlePaymentChange} className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="w-5 h-5" />
                        {t.creditCard}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                        <Banknote className="w-5 h-5" />
                        {t.cashPayment}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">{t.orderComplete}</h2>
                  <p className="text-muted-foreground">{t.orderConfirmation}</p>
                  <div className="bg-muted p-4 rounded-lg inline-block">
                    <p className="text-sm text-muted-foreground">{t.orderNumber}</p>
                    <p className="font-bold">{orderNumber}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 space-y-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">{t.orderSummary}</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.tax}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {step >= 1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.shipping}</span>
                    <span>{shippingCost === 0 ? t.free : formatPrice(shippingCost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t.total}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            {step > 0 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleNext}
              disabled={step === 3}
            >
              {step === 3 ? t.continueShopping : (
                <>
                  {step === 2 ? t.placeOrder : t.next}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <OrderSuccess 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </div>
  )
}
