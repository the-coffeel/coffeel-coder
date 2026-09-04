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

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Please choose a rating from 1 to 5.');
    }

    if (!comment) {
        throw new Error('Please write a review.');
    }

    const { error } = await supabase.from('reviews').upsert(
        {
            post_id: postId,
            user_id: user.id,
            rating,
            comment,
        },
        { onConflict: 'post_id,user_id' },
    );

    if (error) {
        throw new Error(error.message);
    }
}
