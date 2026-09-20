'use client';

import {
    Hourglass,
    MapPin,
    Star,
    ArrowUpRight,
    Coffee,
    MessageSquare,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export default function PostCard({ post }: PostCardProps) {
    const router = useRouter();
    const name =
        post.profile?.display_name ??
        post.profile?.username ??
        'Community Member';

    const handle = post.profile?.username ?? 'user';

    const location = post.shop_address || 'Phnom Penh';

    return (
        <div
            key={post.id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/post/${post.id}`)}
            onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(`/post/${post.id}`);
                }
            }}
            className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#18181b] hover:border-white/20 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60"
        >
            {/* Media container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                {post.cover_image_url ? (
                    <Image
                        src={post.cover_image_url}
                        alt={post.title || 'N/A'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-[#121214] flex items-center justify-center">
                        <Coffee className="w-12 h-12 text-zinc-700" />
                    </div>
                )}

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* Card Details */}
            <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                    {/* Location & Rating row (Clean & beautiful) */}
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-medium truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>4.9</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1 tracking-tight">
                        {post.title || 'N/A'}
                    </h3>

                    {/* Coffee & Workspace Amenities Chips (SVG icons only) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-300">
                            <Coffee className="w-3 h-3 text-amber-400" />
                            Specialty
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-300">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            Outlets
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-300">
                            <MessageSquare className="w-3 h-3 text-blue-400" />
                            Reviewed
                        </span>
                    </div>
                    {/* Author & Timestamp */}
                    <div className="flex items-center justify-between gap-2 pt-1 mt-2.5">
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

                {/* Author footer */}
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-end text-xs text-zinc-400">
                    <span className="text-amber-400 font-medium text-[11px] group-hover:underline">
                        View Space & Vote →
                    </span>
                </div>
            </div>
        </div>
    );
}
