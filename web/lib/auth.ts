// lib/auth.ts
import { createClient } from '@/lib/supabase/server'

export type ProfileData = {
  id?: string
  username?: string | null
  display_name?: string | null
  avatar_url?: string | null
  bio?: string | null
  created_at?: string
}

export type AuthUser = {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    display_name?: string
    name?: string
    avatar_url?: string
    picture?: string
    username?: string
    user_name?: string
    preferred_username?: string
    [key: string]: unknown
  }
  profile?: ProfileData | null
  [key: string]: unknown
}

export async function getServerSession(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile: profile ?? null,
  } as AuthUser
}