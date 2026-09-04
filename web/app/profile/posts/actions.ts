'use server';

import { createClient } from '@/lib/supabase/server';
import { ArticleEditorValue } from './components/ArticleEditor';

export async function createPostAction(payload: {
    data: ArticleEditorValue;
    published?: boolean;
}) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('posts').insert({
        title: payload.data.title,
        content: payload.data.content,
        user_id: user.id,
        published: payload.published ?? false,
        cover_image_url: payload.data.cover_image_url || undefined,
    });

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function updatePostAction(
    postId: string,
    payload: { data: ArticleEditorValue; published?: boolean },
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('posts')
        .update({
            title: payload.data.title,
            content: payload.data.content,
            published: payload.published ?? false,
            cover_image_url: payload.data.cover_image_url || null,
        })
        .eq('id', postId)
        .eq('user_id', user.id); // ensures only the owner can update

    if (error) {
        throw new Error(error.message);
    }

    return true;
}
