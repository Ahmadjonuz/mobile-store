"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function HeroSection() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState<any[]>([])

  const slides = [
    {
      title: t("hero.experience"),
      subtitle: t("hero.discover"),
      image: "/phones/iphone-15.jpg",
      bg: "from-[#18171c] to-[#3a2320]",
      alt: "iPhone"
    },
    {
      title: t("hero.premiumSelection"),
      subtitle: t("hero.curatedCollection"),
      image: "/phones/s-25.jpg",
      bg: "from-[#6b7a8f] to-[#bfc6d1]",
      alt: "Samsung"
    },
    {
      title: t("hero.globalShipping"),
      subtitle: t("hero.fastDelivery"),
      image: "/phones/p-9.jpg",
      bg: "from-[#2e2a3a] to-[#6e5fa7]",
      alt: "Google Pixel"
    },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  // Particle data is generated only on the client
  useEffect(() => {
    if (windowSize.width > 0 && windowSize.height > 0) {
      const generated = [...Array(20)].map(() => ({
        initialX: Math.random(),
        initialY: Math.random(),
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 10 + 10,
        width: Math.random() * 40 + 10,
        height: Math.random() * 40 + 10,
        animateX: Math.random(),
        animateY: Math.random(),
      }))
      setParticles(generated)
    }
  }, [windowSize])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <motion.section ref={containerRef} className={`relative h-screen overflow-hidden bg-gradient-to-r ${slides[currentSlide].bg}`} style={{ opacity }}>
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={index}
                className="absolute inset-0 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="particles-container">
                    {particles.map((p, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                        initial={{
                          x: windowSize.width > 0 ? p.initialX * windowSize.width : 0,
                          y: windowSize.height > 0 ? p.initialY * windowSize.height : 0,
                          scale: p.scale,
                          opacity: p.opacity,
                        }}
                        animate={{
                          y: [null, windowSize.height > 0 ? p.animateY * windowSize.height : 0],
                          x: [null, windowSize.width > 0 ? p.animateX * windowSize.width : 0],
                        }}
                        transition={{
                          duration: p.duration,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                        style={{
                          width: `${p.width}px`,
                          height: `${p.height}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                  <div className="text-white p-6">
                    <motion.h1
                      className="text-4xl md:text-7xl font-bold mb-4 leading-tight"
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      {slide.title.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          className="inline-block mr-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.h1>
                    <motion.p
                      className="text-xl md:text-2xl mb-8 max-w-md"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="flex gap-4"
                    >
                      <Link href="/products" passHref legacyBehavior>
                        <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90 group">   
                          <a>
                            {t("hero.shopNow")}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </a>
                        </Button>
                      </Link>
                      <Link href="/compare" passHref legacyBehavior>
                        <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white bg-transparent hover:bg-white/20">
                          <a>
                            {t("hero.compare")}
                          </a>
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                  <motion.div
                    className="flex items-center justify-center w-[280px] h-[580px] relative"
                    initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {/* Phone Frame with brand-specific style and bg-image */}
                    <div
                      className={
                        slide.alt === 'iPhone'
                          ? 'absolute w-full h-full bg-white border-4 border-[#bfa16a] rounded-[40px] shadow-2xl'
                          : slide.alt === 'Samsung'
                          ? 'absolute w-full h-full bg-white border-4 border-[#4a90e2] rounded-[28px] shadow-2xl'
                          : 'absolute w-full h-full bg-white border-4 border-[#7c7ba0] rounded-[16px] shadow-2xl'
                      }
                      style={{
                        zIndex: 2,
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Notch/kamera */}
                      {slide.alt === 'iPhone' && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-[20px] z-20 shadow-md border border-gray-800 flex items-center justify-center">
                          {/* Dynamic Island dots */}
                          <div className="w-2 h-2 bg-gray-700 rounded-full mx-1"></div>
                          <div className="w-3 h-3 bg-gray-800 rounded-full mx-1"></div>
                        </div>
                      )}
                      {slide.alt === 'Samsung' && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-gray-700 rounded-full z-20 border-2 border-white"></div>
                      )}
                      {slide.alt === 'Google Pixel' && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-500 rounded-full z-20 border-2 border-white"></div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                  <button onClick={scrollToContent} className="animate-bounce text-white">
                    <ChevronDown className="w-10 h-10" />
                  </button>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </motion.section>
  )
}