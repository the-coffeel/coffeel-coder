'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
// import { ThemeSwitcher } from "@/components/theme-switcher";
import PostCard from '../post-card'
import Link from 'next/link'

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
    <section className="border-b border-[#6f4e37]/30 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full border-x border-[#6f4e37]/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-r py-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto grid-1">
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-[#f5f0e8] px-4">Category</h2>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <Link href="#community" className="text-sm text-[#c4b49a] hover:text-[#f5f0e8] hover:bg-[#6f4e37]/20 px-4 py-1 rounded transition-colors">Best places to code</Link>
                <Link href="/places" className="text-sm text-[#c4b49a] hover:text-[#f5f0e8] hover:bg-[#6f4e37]/20 px-4 py-1 rounded transition-colors">Best places to study</Link>
                <Link href="/projects" className="text-sm text-[#c4b49a] hover:text-[#f5f0e8] hover:bg-[#6f4e37]/20 px-4 py-1 rounded transition-colors">Developer-friendly locations</Link>
                <Link href="#events" className="text-sm text-[#c4b49a] hover:text-[#f5f0e8] hover:bg-[#6f4e37]/20 px-4 py-1 rounded transition-colors">Introvert Place</Link>
              </div>
            </div>
          </div>
        </aside>

        <aside className="lg:sticky lg:top-0 lg:overflow-y-auto grid-2">
          {loadError && (
            <div className="px-5 py-3 text-xs text-red-500">
              Failed to load with profile join: {loadError}. Showing posts without profile data.
            </div>
          )}

          <div className="divide-y border-b">
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
        </aside>
      </div>

    </section>

  )
}