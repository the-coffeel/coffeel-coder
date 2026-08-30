'use client';

import { createClient } from '@/lib/supabase/client';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { ArrowLeft } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import PostCard from '../post-card';

type Profile = {
    id: string | number;
    display_name?: string;
    username?: string;
    domain?: string;
    avatar_url?: string;
    header_url?: string;
    bio?: string;
    followers_count?: number;
    following_count?: number;
    posts_count?: number;
    created_at?: string;
    is_following?: boolean;
};

type Post = {
    id: string | number;
    user_id?: string;
    content?: string;
    body?: string;
    created_at?: string;
    replies_count?: number;
    boosts_count?: number;
    favourites_count?: number;
    likes_count?: number;
    is_liked?: boolean;
    post_likes?: { user_id: string }[];
    hashtags?: string[];
    cover_image_url?: string;
    profile?: Profile | null;
    published: boolean;
};

function joinedMonthYear(dateStr?: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const TABS = ['Activity', 'Media', 'Featured'] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
    return (
        <Suspense fallback={<ProfilePageSkeleton />}>
            <ProfilePageContent />
        </Suspense>
    );
}

function ProfilePageContent() {
    const { username } = useParams<{ username: string }>();
    const handle = username
        ? decodeURIComponent(username).replace(/^@/, '')
        : undefined;
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('Activity');
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id ?? null);
        });
    }, [supabase]);

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

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
            setIsFollowing(Boolean(profileData?.is_following));

            let postsQuery = supabase
                .from('posts')
                .select(
                    `
                    *,
                    profile:profiles!posts_user_id_profiles_fkey (
                        id,
                        display_name,
                        username,
                        avatar_url
                    ),
                    post_likes (
                        user_id
                    )
                `,
                )
                .eq('user_id', profileData.id);

            // Owner can see drafts/unpublished posts.
            // Everyone else can only see published posts.
            if (user?.id !== profileData.id) {
                postsQuery = postsQuery.eq('published', true);
            }

            const { data: postsData, error: postsError } = await postsQuery.order('created_at', { ascending: false });

            if (postsError) {
                console.error(postsError);
                return;
            }

            setPosts(postsData);
        };

        if (handle) getData();
    }, [handle, supabase]);

    const handleDeletePost = useCallback(async (postId: string | number) => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            console.error('Failed to delete post:', error);
            return;
        }
        setPosts((prev) => prev?.filter((p) => p.id !== postId) ?? null);
    }, [supabase]);

    const handleEditPost = useCallback((postId: string | number) => {
        router.push(`/profile/articles/edit/${postId}`);
    }, [router]);

    const toggleFollow = async () => {
        setIsFollowing((prev) => !prev);

        const { error } = await supabase
            .from('follows')
            .upsert({ handle, following: !isFollowing });

        if (error) {
            console.error(error);
            setIsFollowing((prev) => !prev);
        }
    };

    return (
        <section className="border-b border-[#6f4e37]/30 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
                    <div className="h-full border-x border-[#6f4e37]/20" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 grid lg:grid-cols-1">
                {profile === null && (
                    <div className="space-y-4 px-5 py-5">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-24 w-24 rounded-md" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                )}

                {profile && (
                    <>
                        <div className="relative h-40 w-full bg-muted">
                            {profile.header_url && (
                                <Image
                                    src={profile.header_url}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="px-5 pb-4 pt-0">
                            <div className="-mt-10 flex items-start justify-between">
                                <Avatar className="h-24 w-24 rounded-md border-4 border-background shadow-sm">
                                    <AvatarImage
                                        src={profile.avatar_url}
                                        alt={
                                            profile.display_name ?? profile.username
                                        }
                                        className='object-cover'
                                    />

                                    <AvatarFallback className="h-24 w-24 rounded-md text-lg">
                                        {(
                                            profile.display_name ??
                                            profile.username ??
                                            '?'
                                        )
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="mt-12 flex items-center gap-2">
                                    <Button
                                        variant={
                                            isFollowing ? 'outline' : 'default'
                                        }
                                        className={
                                            isFollowing
                                                ? ''
                                                : 'bg-sky-600 hover:bg-sky-700'
                                        }
                                        onClick={toggleFollow}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h1 className="text-xl font-bold leading-tight">
                                    {profile.display_name ?? profile.username}
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    @{profile.username}
                                    {profile.domain ? `@${profile.domain}` : ''}
                                </p>
                            </div>

                            <div className="mt-4 flex gap-6 text-sm">
                                <div className="flex flex-col items-center">
                                    <p className="text-muted-foreground">
                                        Followers
                                    </p>
                                    <p className="font-semibold">
                                        {profile.followers_count ?? 0}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <p className="text-muted-foreground">
                                        Following
                                    </p>
                                    <p className="font-semibold">
                                        {profile.following_count ?? 0}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <p className="text-muted-foreground">Posts</p>
                                    <p className="font-semibold">
                                        {posts?.length ?? 0}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <p className="text-muted-foreground">Joined</p>
                                    <p className="font-semibold">
                                        {joinedMonthYear(profile.created_at)}
                                    </p>
                                </div>
                            </div>

                            {profile.bio && (
                                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                        <div className="border-b">
                            <div className="px-4 flex gap-6 text-sm">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`-mb-px border-b-2 pb-2 font-medium transition-colors ${activeTab === tab
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'Activity' && (
                            <div className="">
                                <p className="px-5 py-2 text-sm font-semibold">
                                    Posts
                                </p>

                                {posts === null &&
                                    Array.from({ length: 2 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="space-y-3 px-5 py-5"
                                        >
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    ))}

                                {posts?.length === 0 && (
                                    <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                                        No posts yet.
                                    </div>
                                )}

                                <div className="divide-y">
                                    {posts?.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            currentUserId={currentUserId}
                                            isOwner={
                                                Boolean(
                                                    currentUserId &&
                                                    (currentUserId ===
                                                        post.user_id ||
                                                        currentUserId ===
                                                        (
                                                            post.profile as Profile & {
                                                                id: string;
                                                            }
                                                        )?.id),
                                                )
                                            }
                                            onDelete={handleDeletePost}
                                            onEdit={handleEditPost}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Media' && (
                            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                                No media yet.
                            </div>
                        )}

                        {activeTab === 'Featured' && (
                            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                                No featured posts yet.
                            </div>
                        )}
                    </>
                )}
            </main>
        </section>
    );
}

function ProfilePageSkeleton() {
    return (
        <main className="min-h-screen border-r">
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-5 py-4 backdrop-blur">
                <Link
                    href="/feed"
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </div>

            <div className="space-y-4 px-5 py-5">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-24 w-24 rounded-md" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
            </div>
        </main>
    );
}
