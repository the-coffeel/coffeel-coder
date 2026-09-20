'use server';

import { createClient } from '@/lib/supabase/server';
import { ArticleEditorValue } from './components/ArticleEditor';

function validatePostData(data: ArticleEditorValue) {
    if (!data.title.trim()) {
        throw new Error('Shop name is required.');
    }

    if (!data.cover_image_url.trim()) {
        throw new Error('A thumbnail is required.');
    }

    if (
        !data.shop_address.trim() ||
        data.shop_latitude === null ||
        data.shop_longitude === null
    ) {
        throw new Error('A shop location is required.');
    }
}

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

    validatePostData(payload.data);

    const { error } = await supabase.from('posts').insert({
        title: payload.data.title,
        content: payload.data.content,
        user_id: user.id,
        published: payload.published ?? false,
        cover_image_url: payload.data.cover_image_url || undefined,
        gallery: payload.data.gallery ?? [],
        shop_address: payload.data.shop_address || null,
        shop_latitude: payload.data.shop_latitude,
        shop_longitude: payload.data.shop_longitude,
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

    validatePostData(payload.data);

    const { error } = await supabase
        .from('posts')
        .update({
            title: payload.data.title,
            content: payload.data.content,
            published: payload.published ?? false,
            cover_image_url: payload.data.cover_image_url || null,
            ...(payload.data.gallery !== undefined
                ? { gallery: payload.data.gallery }
                : {}),
            shop_address: payload.data.shop_address || null,
            shop_latitude: payload.data.shop_latitude,
            shop_longitude: payload.data.shop_longitude,
        })
        .eq('id', postId)
        .eq('user_id', user.id); // ensures only the owner can update

    if (error) {
        throw new Error(error.message);
    }

    return true;
}
