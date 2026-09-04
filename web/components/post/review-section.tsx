import Link from 'next/link';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type Review = {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profile?: {
        username?: string;
        display_name?: string;
        avatar_url?: string;
    } | null;
};

function Stars({ rating }: { rating: number }) {
    return (
        <div
            className="flex gap-0.5 text-amber-500"
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    className="h-4 w-4"
                    fill={index < rating ? 'currentColor' : 'none'}
                />
            ))}
        </div>
    );
}

export default async function ReviewSection({ postId }: { postId: string }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('reviews')
        .select('id, user_id, rating, comment, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

    const reviews = error ? [] : (data as Review[]);
    const userIds = reviews.map((review) => review.user_id);
    const { data: profiles } = userIds.length
        ? await supabase
              .from('profiles')
              .select('id, username, display_name, avatar_url')
              .in('id', userIds)
        : { data: [] };
    const profilesById = new Map(
        (profiles ?? []).map((profile) => [profile.id, profile]),
    );
    const reviewsWithProfiles = reviews.map((review) => ({
        ...review,
        profile: profilesById.get(review.user_id) ?? null,
    }));
    const hasUserReview = Boolean(
        user?.id && reviews.some((review) => review.user_id === user.id),
    );
    const total = reviews.length;
    const average = total
        ? reviewsWithProfiles.reduce((sum, review) => sum + review.rating, 0) /
          total
        : 0;
    const counts = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((review) => review.rating === rating).length,
    }));

    return (
        <section className="border-t p-5" aria-labelledby="reviews-heading">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2
                            id="reviews-heading"
                            className="text-xl font-semibold"
                        >
                            Reviews
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            What the community thinks about this place.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={`/post/${postId}/review`}>
                            {hasUserReview
                                ? 'Edit your review'
                                : 'Leave a review'}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-5 rounded-lg border bg-muted/20 p-5 sm:grid-cols-[180px_1fr]">
                    <div className="text-center sm:text-left">
                        <div className="text-4xl font-semibold">
                            {average ? average.toFixed(1) : '0.0'}
                        </div>
                        <Stars rating={Math.round(average)} />
                        <p className="mt-1 text-sm text-muted-foreground">
                            Based on {total}{' '}
                            {total === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        {counts.map(({ rating, count }) => (
                            <div
                                key={rating}
                                className="flex items-center gap-2 text-sm"
                            >
                                <span className="w-3">{rating}</span>
                                <Star
                                    className="h-3.5 w-3.5 text-amber-500"
                                    fill="currentColor"
                                />
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full bg-amber-500"
                                        style={{
                                            width: `${total ? (count / total) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                                <span className="w-6 text-right text-muted-foreground">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {reviews.length > 0 ? (
                    <div className="divide-y rounded-lg border">
                        {reviewsWithProfiles.map((review) => {
                            const name =
                                review.profile?.display_name ??
                                review.profile?.username ??
                                'Community member';
                            return (
                                <article key={review.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-9 w-9 rounded-md">
                                            <AvatarImage
                                                src={review.profile?.avatar_url}
                                                alt={name}
                                            />
                                            <AvatarFallback className="rounded-md">
                                                {name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="font-medium">
                                                    {name}
                                                </p>
                                                <time
                                                    className="text-xs text-muted-foreground"
                                                    dateTime={review.created_at}
                                                >
                                                    {new Date(
                                                        review.created_at,
                                                    ).toLocaleDateString()}
                                                </time>
                                            </div>
                                            <Stars rating={review.rating} />
                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No reviews yet.
                    </p>
                )}
            </div>
        </section>
    );
}
