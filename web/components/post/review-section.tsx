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
    positive_tags?: string[];
    positive_comment?: string | null;
    improvement_tags?: string[];
    improvement_comment?: string | null;
    feature_names?: string[];
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
        .select(
            'id, user_id, rating, comment, positive_tags, positive_comment, improvement_tags, improvement_comment, created_at',
        )
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
    const reviewIds = reviews.map((review) => review.id);
    const { data: reviewFeatureRows } = reviewIds.length
        ? await supabase
              .from('review_features')
              .select('review_id, feature_id')
              .in('review_id', reviewIds)
        : { data: [] };
    const featureIds = (reviewFeatureRows ?? []).map((row) => row.feature_id);
    const { data: featureRows } = featureIds.length
        ? await supabase
              .from('features')
              .select('id, name')
              .in('id', featureIds)
        : { data: [] };
    const featureNamesById = new Map(
        (featureRows ?? []).map((feature) => [feature.id, feature.name]),
    );
    const featureCounts = new Map<string, number>();
    const featureNamesByReview = new Map<string, string[]>();
    for (const row of reviewFeatureRows ?? []) {
        const name = featureNamesById.get(row.feature_id);
        if (name) {
            featureCounts.set(name, (featureCounts.get(name) ?? 0) + 1);
            featureNamesByReview.set(row.review_id, [
                ...(featureNamesByReview.get(row.review_id) ?? []),
                name,
            ]);
        }
    }
    const reviewsWithFeatures = reviewsWithProfiles.map((review) => ({
        ...review,
        feature_names: featureNamesByReview.get(review.id) ?? [],
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
                        {reviewsWithFeatures.map((review) => {
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
                                            {review.comment && (
                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            )}
                                            {(review.positive_comment ||
                                                review.positive_tags
                                                    ?.length) && (
                                                <section className="mt-3">
                                                    <h3 className="font-medium">
                                                        What is great
                                                    </h3>
                                                    {review.positive_comment && (
                                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                                                            {
                                                                review.positive_comment
                                                            }
                                                        </p>
                                                    )}
                                                    {review.positive_tags
                                                        ?.length ? (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {review.positive_tags.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={`positive-${review.id}-${tag}`}
                                                                        className="rounded-full border border-emerald-200 px-2 py-1 text-xs text-emerald-700"
                                                                    >
                                                                        + {tag}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </section>
                                            )}
                                            {(review.improvement_comment ||
                                                review.improvement_tags
                                                    ?.length) && (
                                                <section className="mt-4">
                                                    <h3 className="font-medium">
                                                        What needs improvement
                                                    </h3>
                                                    {review.improvement_comment && (
                                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                                                            {
                                                                review.improvement_comment
                                                            }
                                                        </p>
                                                    )}
                                                    {review.improvement_tags
                                                        ?.length ? (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {review.improvement_tags.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={`improvement-${review.id}-${tag}`}
                                                                        className="rounded-full border border-red-200 px-2 py-1 text-xs text-red-700"
                                                                    >
                                                                        - {tag}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </section>
                                            )}
                                            {review.feature_names.length >
                                                0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {review.feature_names.map(
                                                        (feature) => (
                                                            <span
                                                                key={`${review.id}-${feature}`}
                                                                className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
                                                            >
                                                                + {feature} (
                                                                {featureCounts.get(
                                                                    feature,
                                                                ) ?? 0}
                                                                )
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
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
