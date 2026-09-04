import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostActions from '@/components/post/post-actions';
import BackButton from '@/components/back-button';
import RenderMd from '@/components/RenderMd';
import ReviewSection from '@/components/post/review-section';

// export const instant = false

interface PageProps {
    params: Promise<{ id: string }>;
}

type Profile = {
    username?: string;
    display_name?: string;
    avatar_url?: string;
};

type Post = {
    id: string | number;
    user_id?: string;
    title?: string;
    profile?: Profile | null;
    content?: string;
    body?: string;
    cover_image_url?: string;
    hashtags?: string[];
    created_at?: string;
    replies_count?: number;
    boosts_count?: number;
    favourites_count?: number;
    likes_count?: number;
    is_liked?: boolean;
    post_likes?: { user_id: string }[];
};

function formatTimestamp(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        timeZone: 'Asia/Phnom_Penh',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

// --- Static shell: this part CAN be prerendered ---
const Page = ({ params }: PageProps) => {
    return (
        <ProtectedLayout>
            <main className="min-h-screen border-x max-w-4xl mx-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-5 py-4 backdrop-blur">
                    <BackButton route="/places" />
                </div>

                <Suspense fallback={<PostSkeleton />}>
                    <PostDetail params={params} />
                </Suspense>
            </main>
        </ProtectedLayout>
    );
};

export default Page;

// --- Dynamic part: params/cookies/fetch happen only in here ---
async function PostDetail({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: post, error } = await supabase
        .from('posts')
        .select(
            `
            *,
            profile:profiles!posts_user_id_profiles_fkey (
                username,
                display_name,
                avatar_url
            ),
            post_likes (
                user_id
            )
        `,
        )
        .eq('id', id)
        .single<Post>();

    if (error || !post) {
        notFound();
    }

    const content = post.content ?? post.body ?? '';
    const displayName =
        post.profile?.display_name ?? post.profile?.username ?? 'Unknown';
    const handle = post.profile?.username ?? 'unknown';

    const isLiked = Boolean(
        user?.id && post.post_likes?.some((l) => l.user_id === user.id),
    );
    const likesCount =
        post.likes_count ??
        post.post_likes?.length ??
        post.favourites_count ??
        0;
    const isOwner = Boolean(user?.id && user.id === post.user_id);

    return (
        <>
            <article className="p-5 ">
                {post.title && (
                    <h1 className="mb-4 text-2xl font-semibold">
                        {post.title}
                    </h1>
                )}
                <div className="flex items-center gap-3">
                    <Link
                        href={`/@${handle}`}
                        className="flex items-center gap-3"
                    >
                        <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage
                                src={post.profile?.avatar_url}
                                alt={displayName}
                                className="object-cover"
                            />
                            <AvatarFallback className="h-12 w-12 rounded-md">
                                {displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold leading-tight">
                                {displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                @{handle}
                            </p>
                        </div>
                    </Link>
                </div>

                {content && (
                    <div className="prose prose-sm dark:prose-invert mt-4 max-w-none leading-relaxed text-md break-words [&_a]:text-indigo-600 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic">
                        <RenderMd content={content} />
                    </div>
                )}

                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{formatTimestamp(post.created_at)}</span>
                </div>
            </article>

            <div className="p-4 border-t">
                <PostActions
                    postId={post.id}
                    likesCount={likesCount}
                    isLiked={isLiked}
                    repliesCount={post.replies_count}
                    isOwner={isOwner}
                />
            </div>

            <ReviewSection postId={String(post.id)} />
        </>
    );
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
    );
}
