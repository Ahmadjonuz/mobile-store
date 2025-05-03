"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export default function NewsletterSection() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const { t } = useLanguage()
  const [circles, setCircles] = useState<{ x: number; y: number; scale: number; opacity: number }[]>([])

  useEffect(() => {
    setCircles(
      Array.from({ length: 5 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * 500,
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      }))
    )
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscription successful!",
        description: "You've been added to our newsletter.",
      })

      setEmail("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 bg-gray-100 dark:bg-gradient-to-r dark:from-primary/90 dark:to-primary"
    >
      {/* Background with animated gradient faqat dark mode uchun */}
      <motion.div
        className="absolute inset-0 hidden dark:block bg-gradient-to-r from-primary/90 to-primary"
        animate={{
          background: [
            "linear-gradient(to right, rgba(var(--primary), 0.9), rgba(var(--primary), 1))",
            "linear-gradient(to right, rgba(var(--primary), 0.8), rgba(var(--primary), 0.9))",
            "linear-gradient(to right, rgba(var(--primary), 0.9), rgba(var(--primary), 1))",
          ],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {circles.map((circle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={circle}
            animate={{
              x: circle.x + Math.random() * 100 - 50,
              y: circle.y + Math.random() * 100 - 50,
              scale: circle.scale,
              opacity: circle.opacity,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Sparkles className="h-10 w-10 text-primary dark:text-white/80" />
            </motion.div>
            <motion.h2
              className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("newsletter.title")}
            </motion.h2>
            <motion.p
              className="mb-8 max-w-xl mx-auto text-lg text-gray-700 dark:text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("newsletter.description")}
            </motion.p>
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Input
                type="email"
                placeholder={t("newsletter.email")}
                className="h-12 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/60 focus-visible:ring-primary/30 dark:focus-visible:ring-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="h-12 px-6 bg-primary text-white dark:bg-white dark:text-primary hover:bg-primary/90 dark:hover:bg-white/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {t("newsletter.subscribe")} <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Animated highlight */}
              <motion.div
                className="absolute -inset-px rounded-md opacity-0 bg-white/20"
                animate={{
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              />
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
