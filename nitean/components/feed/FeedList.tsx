'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeSwitcher } from "@/components/theme-switcher";
import PostCard from '../post-card'

type Profile = {
  username?: string
  display_name?: string
  avatar_url?: string
}

type Post = {
  id: string | number
  user_id?: string
  profile?: Profile | null
  content?: string
  body?: string
  cover_image_url?: string
  hashtags?: string[]
  created_at?: string
  replies_count?: number
  boosts_count?: number
  favourites_count?: number
  likes_count?: number
  is_liked?: boolean
  post_likes?: { user_id: string }[]
  published: boolean;
}

export default function FeedList() {
  const [notes, setNotes] = useState<Post[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [supabase])

  useEffect(() => {
    const getData = async () => {
      // Try the joined query first
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profile:profiles (
            username,
            display_name,
            avatar_url
          ),
          post_likes (
            user_id
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load posts (joined query):', error.message, error)
        setLoadError(error.message)

        // Fallback: fetch posts without the profile relationship
        const fallback = await supabase
          .from('posts')
          .select(`
            *,
            post_likes (
              user_id
            )
          `)
          .order('created_at', { ascending: false })

        if (fallback.error) {
          console.error('Failed to load posts (fallback):', fallback.error.message)
          setNotes([])
          return
        }

        setNotes(fallback.data as Post[])
        return
      }

      setNotes(data as Post[])
      setLoadError(null)
    }

    getData()
  }, [supabase])

  return (
    <main className="min-h-screen border-r">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/95 px-5 py-4 backdrop-blur">
        <h1 className="text-base font-semibold">Feed</h1>
        <ThemeSwitcher/>
      </div>

      {loadError && (
        <div className="px-5 py-3 text-xs text-red-500">
          Failed to load with profile join: {loadError}. Showing posts without profile data.
        </div>
      )}

      <div className="divide-y">
        {notes === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 px-5 py-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}

        {notes?.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No posts yet. Check back soon.
          </div>
        )}

        {notes?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            isOwner={Boolean(currentUserId && currentUserId === post.user_id)}
          />
        ))}
      </div>
    </main>
  )
}