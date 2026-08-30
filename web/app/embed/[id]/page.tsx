import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// export const instant = false

interface PageProps {
    params: Promise<{ id: string }>
}

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
}

function formatTimestamp(dateString?: string) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

// --- Static shell: this part CAN be prerendered ---
const Page = ({ params }: PageProps) => {
    return (
        <main className="min-h-screen border-r max-w-xl">
            <Suspense fallback={<PostSkeleton />}>
                <PostDetail params={params} />
            </Suspense>
        </main>
    )
}

export default Page

// --- Dynamic part: params/cookies/fetch happen only in here ---
async function PostDetail({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            *,
            profile:profiles!posts_user_id_profiles_fkey (
                username,
                display_name,
                avatar_url
            )
        `)
        .eq('id', id)
        .single<Post>()

    if (error || !post) {
        notFound()
    }

    const content = post.content ?? post.body ?? ''
    const displayName = post.profile?.display_name ?? post.profile?.username ?? 'Unknown'
    const handle = post.profile?.username ?? 'unknown'

    return (
        <>
            <article className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <Link href={`/@${handle}`} className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage src={post.profile?.avatar_url} alt={displayName} />
                            <AvatarFallback className="h-12 w-12 rounded-md">
                                {displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold leading-tight">{displayName}</p>
                            <p className="text-xs text-muted-foreground">@{handle}</p>
                        </div>
                    </Link>
                    <Link href={`/`} className='hover:underline hover:text-sky-500'>
                        <p className='text-xl'>Nitean</p>
                    </Link>
                </div>

                {content && (
                    <div className="prose prose-sm dark:prose-invert mt-4 max-w-none leading-relaxed text-md break-words [&_a]:text-indigo-600 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({ href, children, ...props }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                        className='hover:underline'
                                    >
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}

                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{formatTimestamp(post.created_at)}</span>
                </div>
            </article>
        </>
    )
}

function PostSkeleton() {
    return (
        <div className="p-5 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-muted" />
                <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-4/6 rounded bg-muted" />
            </div>
        </div>
    )
}