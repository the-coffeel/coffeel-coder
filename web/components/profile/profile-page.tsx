'use client';

import { createClient } from '@/lib/supabase/client';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
    MapPin,
    Heart,
    MessageSquare,
    ArrowUpRight,
    Coffee,
    CalendarDays,
    Pencil,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/* ------------------------------- types ------------------------------- */

type Profile = {
    id: string | number;
    display_name?: string;
    username?: string;
    domain?: string;
    avatar_url?: string;
    header_url?: string;
    bio?: string;
    posts_count?: number;
    created_at?: string;
};

type Post = {
    id: string | number;
    user_id?: string;
    title?: string;
    content?: string;
    body?: string;
    created_at?: string;
    replies_count?: number;
    likes_count?: number;
    is_liked?: boolean;
    post_likes?: { user_id: string }[];
    hashtags?: string[];
    cover_image_url?: string;
    profile?: Profile | null;
    published: boolean;
    shop_address?: string | null;
    shop_latitude?: number | null;
    shop_longitude?: number | null;
};

type DateGroup = {
    label: string;
    isoDate: string;
    posts: Post[];
};

/* ------------------------------- helpers ------------------------------ */

function groupPostsByDate(posts: Post[]): DateGroup[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const map = new Map<string, Post[]>();
    const sorted = [...posts].sort(
        (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime(),
    );

    for (const post of sorted) {
        const d = new Date(post.created_at ?? Date.now());
        const iso = d.toISOString().slice(0, 10);
        if (!map.has(iso)) map.set(iso, []);
        map.get(iso)!.push(post);
    }

    return Array.from(map.entries()).map(([iso, ps]) => {
        const d = new Date(iso + 'T00:00:00');
        d.setHours(0, 0, 0, 0);
        let label: string;
        if (d.getTime() === today.getTime()) {
            label =
                'Today \u00b7 ' +
                d.toLocaleDateString('en-US', { weekday: 'long' });
        } else if (d.getTime() === yesterday.getTime()) {
            label =
                'Yesterday \u00b7 ' +
                d.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            label = d.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year:
                    d.getFullYear() !== today.getFullYear()
                        ? 'numeric'
                        : undefined,
            });
        }
        return { label, isoDate: iso, posts: ps };
    });
}

function formatTime(dateStr?: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function joinedDayMonthYear(dateStr?: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/* ------------------------------- page entry --------------------------- */

export default function ProfilePage() {
    return (
        <Suspense fallback={<ProfilePageSkeleton />}>
            <ProfilePageContent />
        </Suspense>
    );
}

/* ------------------------------- main content ------------------------- */

function ProfilePageContent() {
    const { username } = useParams<{ username: string }>();
    const handle = username
        ? decodeURIComponent(username).replace(/^@/, '')
        : undefined;
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [postToDelete, setPostToDelete] = useState<string | number | null>(
        null,
    );

    const supabase = createClient();

    const isOwnProfile =
        currentUserId != null &&
        profile != null &&
        String(currentUserId) === String(profile.id);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id ?? null);
        });
    }, [supabase]);

    useEffect(() => {
        const getData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', handle)
                .single();

            if (profileError) {
                console.error(profileError);
                return;
            }

            setProfile(profileData);

            let postsQuery = supabase
                .from('posts')
                .select(
                    `*,
                    profile:profiles!posts_user_id_profiles_fkey (
                        id, display_name, username, avatar_url
                    ),
                    post_likes ( user_id )`,
                )
                .eq('user_id', profileData.id);

            if (user?.id !== profileData.id) {
                postsQuery = postsQuery.eq('published', true);
            }

            const { data: postsData, error: postsError } =
                await postsQuery.order('created_at', {
                    ascending: false,
                });

            if (postsError) {
                console.error(postsError);
                return;
            }

            setPosts(postsData);
        };

        if (handle) getData();
    }, [handle, supabase]);

    const handleDeletePost = useCallback(
        async (postId: string | number) => {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);
            if (error) {
                console.error('Failed to delete post:', error);
                return;
            }
            setPosts((prev) => prev?.filter((p) => p.id !== postId) ?? null);
        },
        [supabase],
    );

    const handleEditPost = useCallback(
        (postId: string | number) => {
            router.push(`/profile/posts/edit/${postId}`);
        },
        [router],
    );

    const dateGroups = posts ? groupPostsByDate(posts) : [];

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            {/* Banner */}
            <div className="relative h-52 sm:h-64 w-full bg-[#18181b] overflow-hidden">
                {profile?.header_url ? (
                    <Image
                        src={profile.header_url}
                        alt="Profile banner"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-[#18181b] to-[#09090b]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
            </div>

            {/* Profile Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="relative -mt-16 flex flex-col sm:flex-row sm:items-end sm:gap-6 pb-6 border-b border-white/[0.08]">
                    {/* Avatar */}
                    <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                        {profile?.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt={
                                    profile.display_name ??
                                    profile.username ??
                                    'Avatar'
                                }
                                fill
                                className="object-cover rounded-2xl border-4 border-[#09090b] shadow-xl"
                            />
                        ) : (
                            <div className="w-full h-full rounded-2xl border-4 border-[#09090b] bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
                                <span className="text-3xl font-bold text-white select-none">
                                    {(
                                        profile?.display_name ??
                                        profile?.username ??
                                        '?'
                                    )
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Name / meta */}
                    <div className="flex-1 mt-3 sm:mt-0 sm:mb-1 min-w-0">
                        {profile === null ? (
                            <>
                                <Skeleton className="h-6 w-40 mb-2 bg-white/10" />
                                <Skeleton className="h-4 w-24 bg-white/10" />
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold leading-tight truncate">
                                    {profile.display_name ?? profile.username}
                                </h1>
                                <p className="text-sm text-white/50 mt-0.5">
                                    @{profile.username}
                                    {profile.domain ? `@${profile.domain}` : ''}
                                </p>
                                {profile.bio && (
                                    <p className="mt-2 text-sm text-white/70 leading-relaxed max-w-lg">
                                        {profile.bio}
                                    </p>
                                )}
                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/50">
                                    <span>
                                        <span className="font-semibold text-white">
                                            {posts?.length ?? 0}
                                        </span>{' '}
                                        Posts
                                    </span>
                                    {profile.created_at && (
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            Joined{' '}
                                            {joinedDayMonthYear(
                                                profile.created_at,
                                            )}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action button */}
                    {profile && (
                        <div className="mt-4 sm:mt-0 sm:mb-2 shrink-0">
                            {isOwnProfile && (
                                <Link
                                    href="/profile/setup"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </Link>
                            ) }
                        </div>
                    )}
                </div>

                {/* Posts Timeline */}
                <div className="py-8">
                    <h2 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-6">
                        Places &amp; Reviews
                    </h2>

                    {posts === null && (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-24 flex-1 rounded-2xl bg-white/10" />
                                </div>
                            ))}
                        </div>
                    )}

                    {posts?.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-20 text-white/30">
                            <Coffee className="h-10 w-10 opacity-40" />
                            <p className="text-sm">No posts yet.</p>
                        </div>
                    )}

                    {dateGroups.map((group) => (
                        <div key={group.isoDate} className="mb-10">
                            {/* Date header */}
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-sm font-semibold text-white/80">
                                    {group.label}
                                </span>
                                <div className="flex-1 h-px bg-white/[0.08]" />
                                <span className="text-xs text-white/30">
                                    {group.posts.length} post
                                    {group.posts.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Posts */}
                            <div className="relative pl-20 space-y-4">
                                {/* timeline vertical line */}
                                <div className="absolute left-7 top-0 bottom-0 w-px bg-white/[0.06]" />

                                {group.posts.map((post) => (
                                    <TimelinePostCard
                                        key={post.id}
                                        post={post}
                                        isOwner={
                                            currentUserId != null &&
                                            (currentUserId === post.user_id ||
                                                currentUserId ===
                                                    String(
                                                        (
                                                            post.profile as Profile & {
                                                                id: string;
                                                            }
                                                        )?.id,
                                                    ))
                                        }
                                        onEdit={handleEditPost}
                                        onDelete={setPostToDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AlertDialog
                open={postToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPostToDelete(null);
                }}
            >
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The post will be
                            permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={async (event) => {
                                event.preventDefault();
                                if (postToDelete === null) return;

                                await handleDeletePost(postToDelete);
                                setPostToDelete(null);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

/* ------------------------------- timeline card ------------------------ */

type TimelinePostCardProps = {
    post: Post;
    isOwner: boolean;
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
};

function TimelinePostCard({
    post,
    isOwner,
    onEdit,
    onDelete,
}: TimelinePostCardProps) {
    const timeLabel = formatTime(post.created_at);
    const likeCount = post.likes_count ?? post.post_likes?.length ?? 0;
    const replyCount = post.replies_count ?? 0;
    const isDraft = !post.published;

    return (
        <div className="relative flex gap-4 group">
            {/* Time + dot */}
            <div className="absolute -left-20 top-4 flex flex-col items-end w-16">
                <span className="text-xs text-white/40 font-mono">
                    {timeLabel}
                </span>
                <div className="mt-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#09090b] self-end" />
            </div>

            {/* Card */}
            <Link
                href={`/post/${post.id}`}
                className="flex-1 min-w-0 flex gap-4 bg-[#18181b] hover:bg-[#1f1f23] border border-white/[0.06] hover:border-amber-500/30 rounded-2xl p-4 transition-all duration-200 group/card"
            >
                {post.cover_image_url && (
                    <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#27272a]">
                        <Image
                            src={post.cover_image_url}
                            alt={post.title ?? ''}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {isDraft && (
                        <span className="inline-block text-[10px] font-semibold tracking-wider uppercase bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full mb-1">
                            Draft
                        </span>
                    )}

                    <h3 className="font-semibold text-sm leading-snug text-white line-clamp-2 group-hover/card:text-amber-400 transition-colors">
                        {post.title ?? post.content?.slice(0, 80) ?? 'Untitled'}
                    </h3>

                    {post.shop_address && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                                {post.shop_address}
                            </span>
                        </p>
                    )}

                    {post.hashtags && post.hashtags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {post.hashtags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            {likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {replyCount}
                        </span>
                        {isOwner && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onEdit(post.id);
                                    }}
                                    className="ml-auto text-white/30 hover:text-amber-400 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(post.id);
                                    }}
                                    className="text-white/30 hover:text-red-400 transition-colors"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <ArrowUpRight className="shrink-0 h-4 w-4 text-white/20 group-hover/card:text-amber-400 transition-colors mt-1" />
            </Link>
        </div>
    );
}

/* ------------------------------- skeleton ----------------------------- */

function ProfilePageSkeleton() {
    return (
        <div className="min-h-screen bg-[#09090b]">
            <Skeleton className="h-52 sm:h-64 w-full rounded-none bg-white/5" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16">
                <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-white/[0.08]">
                    <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white/10" />
                    <div className="flex-1 space-y-3 mt-2">
                        <Skeleton className="h-6 w-48 bg-white/10" />
                        <Skeleton className="h-4 w-28 bg-white/10" />
                        <Skeleton className="h-4 w-64 bg-white/10" />
                    </div>
                </div>
                <div className="py-8 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton
                            key={i}
                            className="h-24 w-full rounded-2xl bg-white/10"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
