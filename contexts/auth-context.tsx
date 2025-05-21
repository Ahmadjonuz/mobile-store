"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { Session, User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name: string
  email_verified: boolean
}

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

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    image_url: string
    brand: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_TIMEOUT_MINUTES = 30

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [loginLockedUntil, setLoginLockedUntil] = useState<Date | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  // Sessiyani tekshirish
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || '',
            email_verified: session.user.email_confirmed_at ? true : false
          })
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Auth statusini kuzatish
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || '',
          email_verified: session.user.email_confirmed_at ? true : false
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Password validation
  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (password.length < 8) {
      return { isValid: false, error: t('auth.passwordTooShort') }
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: t('auth.passwordNeedsUppercase') }
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: t('auth.passwordNeedsLowercase') }
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: t('auth.passwordNeedsNumber') }
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { isValid: false, error: t('auth.passwordNeedsSpecial') }
    }
    return { isValid: true, error: '' }
  }

  const saveSession = (userData: User, expiresIn: number = 3600) => {
    const session = {
      user: userData,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    }
    localStorage.setItem('session', JSON.stringify(session))
    setUser(userData)
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      
      // Parolni tekshirish
      if (password.length < 8) {
        throw new Error(t('auth.passwordTooShort'))
      }
      if (!/[A-Z]/.test(password)) {
        throw new Error(t('auth.passwordNeedsUppercase'))
      }
      if (!/[a-z]/.test(password)) {
        throw new Error(t('auth.passwordNeedsLowercase'))
      }
      if (!/[0-9]/.test(password)) {
        throw new Error(t('auth.passwordNeedsNumber'))
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        throw new Error(t('auth.passwordNeedsSpecial'))
      }

      // Supabase orqali ro'yxatdan o'tish
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      })

      if (error) throw error

      if (data.user) {
        // Profil yaratish
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            email_verified: false
          })

        // Muvaffaqiyatli xabar
        toast({
          title: t('auth.success'),
          description: t('auth.verificationEmailSent'),
          duration: 5000
        })

        // Email tasdiqlash sahifasiga yo'naltirish
        router.push('/auth/verify-email')
      }
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive",
        duration: 5000
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Check login attempts
      if (loginLockedUntil && loginLockedUntil > new Date()) {
        const minutesLeft = Math.ceil((loginLockedUntil.getTime() - Date.now()) / 60000)
        throw new Error(t('auth.tooManyAttempts').replace('{{minutes}}', String(minutesLeft)))
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setLoginAttempts(prev => {
          const newAttempts = prev + 1
          if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            const lockUntil = new Date(Date.now() + LOGIN_TIMEOUT_MINUTES * 60000)
            setLoginLockedUntil(lockUntil)
            throw new Error(t('auth.accountLocked').replace('{{minutes}}', String(LOGIN_TIMEOUT_MINUTES)))
          }
          return newAttempts
        })

        if (error.message.includes('Invalid login credentials')) {
          throw new Error(t('auth.invalidCredentials'))
        }
        if (error.message.includes('Email not confirmed')) {
          router.push('/auth/verify-email')
          throw new Error(t('auth.emailNotVerified'))
        }
        throw error
      }

      // Reset login attempts on successful login
      setLoginAttempts(0)
      setLoginLockedUntil(null)

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || '',
          email_verified: data.user.email_confirmed_at ? true : false
        }

        // Save session with appropriate expiration
        saveSession(userData, rememberMe ? 30 * 24 * 3600 : 3600) // 30 days or 1 hour

        toast({
          title: t('auth.success'),
          description: t('auth.signInSuccess')
        })
        router.push("/account")
      }
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      toast({
        title: t('auth.success'),
        description: t('auth.signOutSuccess')
      })
      router.push('/')
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const updateProfile = async (name: string) => {
    try {
      if (!user) throw new Error('User not found')

      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id)

      if (error) throw error

      setUser(prev => prev ? { ...prev, name } : null)
      toast({
        title: t('auth.success'),
        description: t('auth.profileUpdated')
      })
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`
      })

      if (error) throw error

      toast({
        title: t('auth.success'),
        description: t('auth.resetPasswordEmailSent')
      })
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error)
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) throw error

      toast({
        title: t('auth.success'),
        description: t('auth.passwordUpdated')
      })
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      if (error) throw error

      // Update profile
      if (user) {
        await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', user.id)
      }

      toast({
        title: t('auth.success'),
        description: t('auth.emailVerified')
      })
      router.push('/auth/login')
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const resendVerificationEmail = async () => {
    try {
      if (!user?.email) throw new Error('No email address found')

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      })

      if (error) throw error

      toast({
        title: t('auth.success'),
        description: t('auth.verificationEmailResent')
      })
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      resetPassword,
      updatePassword,
      verifyEmail,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 