"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export function ModeToggle() {
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
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t.toggleTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 text-foreground">
          <Sun className="h-4 w-4" />
          {t.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 text-foreground">
          <Moon className="h-4 w-4" />
          {t.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 text-foreground">
          <Monitor className="h-4 w-4" />
          {t.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
