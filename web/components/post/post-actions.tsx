'use client'

import { useEffect, useState } from 'react'
import {
    Bookmark,
    Eye,
    Rocket,
    Link2,
    MessageSquareQuote,
    MoreHorizontal,
    Pencil,
    Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface PostActionsProps {
    postId: string | number
    favouritesCount?: number
    likesCount?: number
    isLiked?: boolean
    repliesCount?: number
    isOwner?: boolean
    onDelete?: () => void
    onEdit?: () => void
}

export default function PostActions({
    postId,
    favouritesCount = 0,
    likesCount,
    isLiked: initialIsLiked = false,
    repliesCount = 0,
    isOwner = false,
    onDelete,
    onEdit,
}: PostActionsProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [likeCount, setLikeCount] = useState(likesCount ?? favouritesCount)
    const [isTogglingLike, setIsTogglingLike] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setIsLiked(initialIsLiked)
    }, [initialIsLiked])

    useEffect(() => {
        setLikeCount(likesCount ?? favouritesCount)
    }, [likesCount, favouritesCount])

    const handleToggleLike = async () => {
        if (isTogglingLike) return

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            toast.error('Please log in to like posts')
            return
        }

        const nextIsLiked = !isLiked
        const nextLikeCount = nextIsLiked
            ? likeCount + 1
            : Math.max(0, likeCount - 1)

        // Optimistic UI update
        setIsLiked(nextIsLiked)
        setLikeCount(nextLikeCount)
        setIsTogglingLike(true)

        try {
            if (nextIsLiked) {
                const { error } = await supabase.from('post_likes').insert({
                    post_id: postId,
                    user_id: user.id,
                })

                if (error && error.code !== '23505') {
                    throw error
                }
            } else {
                const { error } = await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id)

                if (error) {
                    throw error
                }
            }
        } catch (error: unknown) {
            console.error('Failed to toggle like:', error)
            // Revert optimistic update
            setIsLiked(!nextIsLiked)
            setLikeCount(likeCount)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.'
            toast.error('Failed to update like', {
                description: errorMessage,
            })
        } finally {
            setIsTogglingLike(false)
        }
    }

    const handleCopyLink = async () => {
        const url = `${window.location.origin}/post/${postId}`

        try {
            await navigator.clipboard.writeText(url)

            toast.success('Link copied', {
                description: 'The post link has been copied to your clipboard.',
            })
        } catch (error) {
            console.error('Failed to copy post link:', error)

            toast.error('Failed to copy link', {
                description: 'Something went wrong. Please try again.',
            })
        }
    }

    const handleGetEmbed = async () => {
        const embedUrl = `${window.location.origin}/embed/${postId}`

        const embedCode = `<iframe
  src="${embedUrl}"
  width="500"
  height="300"
  frameborder="0"
  loading="lazy"
  title="Embedded post"
></iframe>`

        try {
            await navigator.clipboard.writeText(embedCode)

            toast.success('Embed code copied', {
                description: 'The embed code has been copied to your clipboard.',
            })
        } catch (error) {
            console.error('Failed to copy embed code:', error)

            toast.error('Failed to copy embed code', {
                description: 'Something went wrong. Please try again.',
            })
        }
    }

    return (
        <>
            <div className="flex items-center justify-between text-muted-foreground">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 transition-colors ${
                        isLiked
                            ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                            : 'text-muted-foreground hover:text-rose-600'
                    }`}
                    onClick={handleToggleLike}
                    disabled={isTogglingLike}
                    title={isLiked ? 'Unlike' : 'Like'}
                >
                    <Rocket
                        className={`h-5 w-5 transition-transform active:scale-125 ${
                            isLiked ? 'fill-rose-600 text-rose-600' : ''
                        }`}
                    />
                    <span className="text-xs">{likeCount}</span>
                </Button>

                <Button variant="ghost" size="sm" className="gap-2" disabled>
                    <MessageSquareQuote className="h-6 w-6" />
                    <span className="text-xs">{repliesCount}</span>
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <Bookmark className="h-6 w-6" />
                </Button>

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <MoreHorizontal className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        style={{ width: '180px' }}
                    >
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/post/${postId}`}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View post
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleCopyLink}
                            className="cursor-pointer"
                        >
                            <Link2 className="mr-2 h-4 w-4" />
                            Copy link
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleGetEmbed}
                            className="cursor-pointer"
                        >
                            <Link2 className="mr-2 h-4 w-4" />
                            Get embed code
                        </DropdownMenuItem>

                        {isOwner && (
                            <>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={onEdit}
                                    className="cursor-pointer"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit post
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete post
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                            onClick={() => {
                                setDeleteDialogOpen(false)
                                onDelete?.()
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

