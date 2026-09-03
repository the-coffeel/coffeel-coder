'use client';

import { useState } from 'react';
import { Hourglass } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PostActions from './post/post-actions';

export type Profile = {
    username?: string;
    display_name?: string;
    avatar_url?: string;
};

export type Post = {
    id: string | number;
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
        return `${Math.max(1, Math.floor(diffMs / 60_000))}m`;
    }

    if (h < 24) {
        return `${h}h`;
    }

    return `${Math.floor(h / 24)}d`;
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
        post.profile?.display_name ?? post.profile?.username ?? 'Unknown';

    const handle = post.profile?.username ?? 'unknown';

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

    return (
        <article className="px-5 py-5">
            <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/@${handle}`}
                        className="flex items-center gap-3"
                    >
                        <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage
                                src={post.profile?.avatar_url}
                                alt={name}
                                className='object-cover'
                            />

                            <AvatarFallback className="h-12 w-12 rounded-md">
                                {name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="text-sm font-semibold leading-tight">
                                {name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                @{handle}
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Hourglass className="h-3 w-3" />
                        {timeAgo(post.created_at)}
                    </div>
                    {!post.published && <Badge className='bg-sky-300 hover:bg-sky-400 shadow-none rounded-none'>Draft</Badge>}

                </div>

            </div>

            <div
                className="cursor-pointer"
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName.toLowerCase() === 'a' || target.closest('a')) return;
                    router.push(`/post/${post.id}`);
                }}
            >
                <div className={`text-md leading-relaxed wrap-break-word [&_a]:text-indigo-600 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:float-left [&_img]:mr-4 [&_img]:mb-2 [&_img]:w-24 [&_img]:h-24 [&_img]:sm:w-32 [&_img]:sm:h-32 [&_img]:object-cover [&_img]:rounded-md ${!isExpanded ? 'line-clamp-3' : ''}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ href, children, ...props }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='hover:underline'
                                    {...props}
                                >
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {text}
                    </ReactMarkdown>
                </div>
            </div>

            {(text.length > 300 || text.split('\n').length > 6) && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-indigo-600 hover:underline"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </button>
            )}

            {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer bg-transparent px-0 font-normal text-indigo-600 hover:underline"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}

            <div className="pt-2">
                <PostActions
                    postId={post.id}
                    likesCount={likesCount}
                    isLiked={isLiked}
                    repliesCount={post.replies_count}
                    isOwner={isOwner}
                    onDelete={onDelete ? () => onDelete(post.id) : undefined}
                    onEdit={onEdit ? () => onEdit(post.id) : undefined}
                />
            </div>
        </article>
    );
}
