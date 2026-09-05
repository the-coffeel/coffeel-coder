'use server';

import { createClient } from '@/lib/supabase/server';

export async function createReviewAction(postId: string, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    const rating = Number(formData.get('rating'));
    const comment = String(formData.get('comment') ?? '').trim();
    const positiveTags = formData.getAll('positive_tags').map(String);
    const improvementTags = formData.getAll('improvement_tags').map(String);
    const featureIds = [...new Set(formData.getAll('feature_ids').map(String))];
    const positiveComment = String(
        formData.get('positive_comment') ?? '',
    ).trim();
    const improvementComment = String(
        formData.get('improvement_comment') ?? '',
    ).trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Please choose a rating from 1 to 5.');
    }

    if (!comment && !positiveComment && !improvementComment) {
        throw new Error('Please write at least one part of your review.');
    }

    const { data: review, error } = await supabase
        .from('reviews')
        .upsert(
            {
                post_id: postId,
                user_id: user.id,
                rating,
                comment,
                positive_tags: positiveTags,
                positive_comment: positiveComment || null,
                improvement_tags: improvementTags,
                improvement_comment: improvementComment || null,
            },
            { onConflict: 'post_id,user_id' },
        )
        .select('id')
        .single();

    if (error) {
        throw new Error(error.message);
    }

    const { error: deleteFeaturesError } = await supabase
        .from('review_features')
        .delete()
        .eq('review_id', review.id);

    if (deleteFeaturesError) {
        throw new Error(deleteFeaturesError.message);
    }

    if (featureIds.length) {
        const { error: insertFeaturesError } = await supabase
            .from('review_features')
            .insert(
                featureIds.map((featureId) => ({
                    review_id: review.id,
                    feature_id: featureId,
                })),
            );

        if (insertFeaturesError) {
            throw new Error(insertFeaturesError.message);
        }
    }
}
