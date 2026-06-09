import Router from 'next/router'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabaseBrowser } from '../lib/supabase/browser'
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
  fetchProfile,
  translateAuthError,
  type ProfileRow,
  type UserRole,
} from '../services/auth'

type AuthContextProviderProps = { children: ReactNode }

type AuthContextType = {
  session: Session | null
  user: User | null
  profile: ProfileRow | null
  role: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | void>
  register: (name: string, email: string, password: string) => Promise<string | void>
  logout: () => Promise<void>
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let active = true

    // sessão inicial + carga do profile
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) {
        const p = await fetchProfile(data.session.user.id)
        if (active) setProfile(p)
      }
      if (active) setLoading(false)
    })

    // mudanças de sessão (login/logout/refresh)
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      // defere a chamada ao banco para fora do callback (evita deadlock do supabase-js)
      setTimeout(async () => {
        if (!active) return
        if (newSession?.user) {
          const p = await fetchProfile(newSession.user.id)
          if (active) setProfile(p)
        } else {
          setProfile(null)
        }
      }, 0)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function login(email: string, password: string) {
    const { error } = await signInRequest(email, password)
    if (error) return translateAuthError(error.message)
    Router.push('/newAquarium')
  }

  async function register(name: string, email: string, password: string) {
    const { data, error } = await signUpRequest(name, email, password)
    if (error) return translateAuthError(error.message)
    // Sem sessão = projeto exige confirmação de e-mail.
    if (!data.session) {
      Router.push('/login')
      return
    }
    Router.push('/newAquarium')
  }

  async function logout() {
    await signOutRequest()
    setProfile(null)
    Router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        role: profile?.role ?? null,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)

export const AuthContext = createContext({} as AuthContextType)
