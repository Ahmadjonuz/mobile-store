"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    light: "Light",
    dark: "Dark",
    system: "System",
    toggleTheme: "Toggle theme",
  },
  ru: {
    light: "Светлая",
    dark: "Темная",
    system: "Системная",
    toggleTheme: "Переключить тему",
  },
  uz: {
    light: "Yorug'",
    dark: "Qorong'i",
    system: "Tizim",
    toggleTheme: "Mavzuni o'zgartirish",
  },
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
            />
            <Moon
              className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "light" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
            />
          </motion.div>
          <span className="sr-only">{t.toggleTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          {t.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          {t.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          {t.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
