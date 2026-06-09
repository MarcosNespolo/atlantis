import { useEffect } from 'react'
import Router from 'next/router'
import { useAuthContext } from '../../contexts/AuthContext'
import type { UserRole } from '../../services/auth'

// ⚠ Estes guards são SÓ UX (escondem/redirecionam telas). A imposição REAL de
// permissão é a RLS no banco (por auth.uid()/papel). Nunca confie só nisto.

export function useRequireAuth(redirectTo = '/login') {
  const { session, loading } = useAuthContext()
  useEffect(() => {
    if (!loading && !session) Router.replace(redirectTo)
  }, [loading, session, redirectTo])
  return { session, loading }
}

export function useRequireRole(allowed: UserRole[], redirectTo = '/') {
  const { session, role, loading } = useAuthContext()
  const key = allowed.join(',')
  useEffect(() => {
    if (loading) return
    if (!session) {
      Router.replace('/login')
      return
    }
    if (!role || !allowed.includes(role)) Router.replace(redirectTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session, role, key, redirectTo])
  return { allowed: !!role && allowed.includes(role), loading, role }
}
