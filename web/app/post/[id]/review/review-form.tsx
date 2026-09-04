'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createReviewAction } from './actions';

interface ReviewFormProps {
    postId: string;
    initialReview?: { rating: number; comment: string } | null;
}

export default function ReviewForm({ postId, initialReview }: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(initialReview?.rating ?? 0);
    const [comment, setComment] = useState(initialReview?.comment ?? '');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                await createReviewAction(postId, formData);
                router.push(`/post/${postId}`);
                router.refresh();
            } catch (actionError) {
                setError(
                    actionError instanceof Error
                        ? actionError.message
                        : 'Unable to save your review.',
                );
            }
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div>
                <label className="text-sm font-medium">
                    How would you rate this place?
                </label>
                <div
                    className="mt-3 flex gap-1"
                    role="radiogroup"
                    aria-label="Rating"
                >
                    {Array.from({ length: 5 }, (_, index) => {
                        const value = index + 1;
                        return (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={rating === value}
                                aria-label={`${value} star${value === 1 ? '' : 's'}`}
                                className="rounded p-1 text-muted-foreground transition-colors hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                onClick={() => setRating(value)}
                            >
                                <Star
                                    className={`h-8 w-8 ${rating >= value ? 'fill-amber-500 text-amber-500' : ''}`}
                                />
                            </button>
                        );
                    })}
                </div>
                <input type="hidden" name="rating" value={rating} />
            </div>

            <div className="space-y-2">
                <label htmlFor="review-comment" className="text-sm font-medium">
                    Tell the community about your experience
                </label>
                <Textarea
                    id="review-comment"
                    name="comment"
                    required
                    minLength={1}
                    rows={7}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="What did you like, and what could be improved?"
                />
            </div>

            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending || rating === 0}>
                    {isPending
                        ? 'Saving...'
                        : initialReview
                          ? 'Update review'
                          : 'Publish review'}
                </Button>
            </div>
        </form>
    );
}
