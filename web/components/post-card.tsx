'use client';

import { useState } from 'react';
import { Hourglass, MapPin, Star, ArrowUpRight, Coffee } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostActions from './post/post-actions';
import Image from 'next/image';

export type Profile = {
    username?: string;
    display_name?: string;
    avatar_url?: string;
};

export type Post = {
    id: string | number;
    title?: string;
    user_id?: string;
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
    published: boolean;
    shop_address?: string | null;
    shop_latitude?: number | null;
    shop_longitude?: number | null;
};

type PostCardProps = {
    post: Post;
    isOwner?: boolean;
    currentUserId?: string | null;
    onDelete?: (id: string | number) => void;
    onEdit?: (id: string | number) => void;
};

function timeAgo(dateStr?: string) {
    if (!dateStr) return '';

    const diffMs = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diffMs / 3_600_000);

    if (h < 1) {
        return `${Math.max(1, Math.floor(diffMs / 60_000))}m ago`;
    }

    if (h < 24) {
        return `${h}h ago`;
    }

    return `${Math.floor(h / 24)}d ago`;
}

function extractHashtags(text = '') {
    return Array.from(text.matchAll(/#\w+/g)).map((m) => m[0]);
}

export default function PostCard({
    post,
    isOwner = false,
    currentUserId,
    onDelete,
    onEdit,
}: PostCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const name =
        post.profile?.display_name ?? post.profile?.username ?? 'Community Member';

    const handle = post.profile?.username ?? 'user';

    const text = post.content ?? post.body ?? '';

    const tags = post.hashtags ?? extractHashtags(text);

    const isLiked =
        post.is_liked ??
        Boolean(
            currentUserId &&
                post.post_likes?.some((l) => l.user_id === currentUserId),
        );

    const likesCount =
        post.likes_count ??
        post.post_likes?.length ??
        post.favourites_count ??
        0;

    const location = post.shop_address || 'Phnom Penh';

    return (
        <article className="group rounded-2xl border border-white/[0.08] bg-[#18181b] hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-black/40">
            {/* Cover Image / Visual Header */}
            <div
                className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 cursor-pointer"
                onClick={() => router.push(`/post/${post.id}`)}
            >
                {post.cover_image_url ? (
                    <Image
                        src={post.cover_image_url}
                        alt={post.title || 'Coffee shop'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-[#121214] flex items-center justify-center">
                        <Coffee className="w-12 h-12 text-zinc-700 group-hover:scale-110 transition-transform" />
                    </div>
                )}

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/60 via-transparent to-transparent pointer-events-none" />

                {/* Only Draft Badge if unpublished */}
                {!post.published && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-[10px] font-semibold text-sky-300 backdrop-blur-sm">
                            Draft
                        </span>
                    </div>
                )}

                {/* Hover arrow indicator */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div className="space-y-2.5">
                    {/* Location & Rating row (Clean & beautiful, no awkward overlay) */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-medium truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>4.8</span>
                        </div>
                    </div>

                    {/* Title */}
                    {post.title && (
                        <h2
                            onClick={() => router.push(`/post/${post.id}`)}
                            className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight line-clamp-1 cursor-pointer"
                        >
                            {post.title}
                        </h2>
                    )}

                    {/* Markdown snippet (if present) */}
                    {text && (
                        <div
                            className="cursor-pointer"
                            onClick={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.tagName.toLowerCase() === 'a' || target.closest('a')) return;
                                router.push(`/post/${post.id}`);
                            }}
                        >
                            <div
                                className={`text-xs sm:text-sm text-zinc-400 leading-relaxed break-words [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_a]:text-amber-400 [&_a:hover]:underline ${
                                    !isExpanded ? 'line-clamp-2' : ''
                                }`}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {(text.length > 180 || text.split('\n').length > 3) && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline inline-block"
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                    )}

                    {/* Hashtags as Luma pill tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-zinc-300 hover:text-amber-300 hover:border-amber-400/30 transition-colors cursor-pointer"
                                >
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 4 && (
                                <span className="text-[10px] text-zinc-500 self-center">
                                    +{tags.length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Author & Timestamp */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        <Link
                            href={`/@${handle}`}
                            className="flex items-center gap-2 group/author min-w-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Avatar className="h-5 w-5 rounded-full border border-white/10 flex-shrink-0">
                                <AvatarImage
                                    src={post.profile?.avatar_url}
                                    alt={name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-[9px] bg-zinc-800 text-zinc-300">
                                    {name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-zinc-400 group-hover/author:text-white truncate transition-colors">
                                {name}
                            </span>
                        </Link>

                        <span className="text-[11px] text-zinc-500 flex-shrink-0 flex items-center gap-1">
                            <Hourglass className="w-3 h-3 text-zinc-600" />
                            {timeAgo(post.created_at)}
                        </span>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <PostActions
                        postId={post.id}
                        likesCount={likesCount}
                        isLiked={isLiked}
                        repliesCount={post.replies_count}
                        isOwner={isOwner}
                        onDelete={onDelete ? () => onDelete(post.id) : undefined}
                        onEdit={onEdit ? () => onEdit(post.id) : undefined}
                    />

                    <Link
                        href={`/post/${post.id}/review`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex-shrink-0"
                    >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>Vote & Review</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

