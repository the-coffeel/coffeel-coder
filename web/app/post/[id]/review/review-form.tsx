'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createReviewAction } from './actions';

interface ReviewFormProps {
    postId: string;
    questions: ReviewQuestion[];
    initialReview?: {
        rating: number;
        comment: string;
        positive_tags?: string[];
        positive_comment?: string | null;
        improvement_tags?: string[];
        improvement_comment?: string | null;
        feature_ids?: string[];
    } | null;
}

interface ReviewFeature {
    id: string;
    name: string;
    slug: string;
}

export interface ReviewQuestion {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    features: ReviewFeature[];
}

function TagPicker({
    features,
    selected,
    onChange,
    tagName,
}: {
    features: ReviewFeature[];
    selected: string[];
    onChange: (tags: string[]) => void;
    tagName?: 'positive_tags' | 'improvement_tags';
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {features.map((feature) => {
                const isSelected = selected.includes(feature.id);
                return (
                    <label
                        key={feature.id}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${isSelected ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                    >
                        <input
                            type="checkbox"
                            name="feature_ids"
                            value={feature.id}
                            checked={isSelected}
                            onChange={() =>
                                onChange(
                                    isSelected
                                        ? selected.filter(
                                              (id) => id !== feature.id,
                                          )
                                        : [...selected, feature.id],
                                )
                            }
                            className="sr-only"
                        />
                        {isSelected && tagName && (
                            <input
                                type="hidden"
                                name={tagName}
                                value={feature.name}
                            />
                        )}
                        {feature.name}
                    </label>
                );
            })}
        </div>
    );
}

export default function ReviewForm({
    postId,
    questions,
    initialReview,
}: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(initialReview?.rating ?? 0);
    const [comment, setComment] = useState(initialReview?.comment ?? '');
    const [selectedFeatureIds, setSelectedFeatureIds] = useState(
        initialReview?.feature_ids ?? [],
    );
    const [positiveComment, setPositiveComment] = useState(
        initialReview?.positive_comment ?? '',
    );
    const [improvementComment, setImprovementComment] = useState(
        initialReview?.improvement_comment ?? '',
    );
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
        <form onSubmit={handleSubmit} className="space-y-8">
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

            {questions.map((question) => (
                <section key={question.id} className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {question.title}
                        </h2>
                        {question.description && (
                            <p className="text-sm text-muted-foreground">
                                {question.description}
                            </p>
                        )}
                    </div>
                    <TagPicker
                        features={question.features}
                        selected={selectedFeatureIds}
                        onChange={setSelectedFeatureIds}
                        tagName={
                            question.slug === 'why-is-it-fantastic'
                                ? 'positive_tags'
                                : question.slug === 'what-could-be-improved'
                                  ? 'improvement_tags'
                                  : undefined
                        }
                    />
                    {question.slug === 'why-is-it-fantastic' && (
                        <Textarea
                            name="positive_comment"
                            rows={7}
                            value={positiveComment}
                            onChange={(event) =>
                                setPositiveComment(event.target.value)
                            }
                            placeholder="Tell us why this place is fantastic..."
                        />
                    )}
                    {question.slug === 'what-could-be-improved' && (
                        <Textarea
                            name="improvement_comment"
                            rows={7}
                            value={improvementComment}
                            onChange={(event) =>
                                setImprovementComment(event.target.value)
                            }
                            placeholder="Tell us what could be improved..."
                        />
                    )}
                </section>
            ))}

            <input type="hidden" name="comment" value={comment} readOnly />

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
