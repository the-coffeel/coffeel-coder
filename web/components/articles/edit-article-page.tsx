'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import {
    ArticleEditor,
    ArticleEditorValue,
} from '@/app/profile/posts/components/ArticleEditor';
import { ArticleEditorHeader } from '@/app/profile/posts/components/ArticleEditorHeader';
import { updatePostAction } from '@/app/profile/posts/actions';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface EditArticlePageProps {
    postId: string;
}

export default function EditArticlePage({ postId }: EditArticlePageProps) {
    const router = useRouter();
    const [value, setValue] = useState<ArticleEditorValue>({
        title: '',
        slug: '',
        cover_image_url: '',
        summary: '',
        content: '',
        shop_address: '',
        shop_latitude: null,
        shop_longitude: null,
    });
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const hasUnsavedChangesRef = useRef(false);

    // Track unsaved changes
    useEffect(() => {
        const hasContent = !!(
            value.title.trim() ||
            value.slug.trim() ||
            value.cover_image_url.trim() ||
            value.summary.trim() ||
            value.content.trim()
        );
        hasUnsavedChangesRef.current = hasContent;
    }, [value]);

    // Fetch existing post and pre-fill editor
    useEffect(() => {
        const supabase = createClient();
        const fetchPost = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error || !data) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setValue({
                title: data.title ?? '',
                slug: data.slug ?? '',
                cover_image_url: data.cover_image_url ?? '',
                summary: data.summary ?? '',
                content: data.content ?? '',
                shop_address: data.shop_address ?? '',
                shop_latitude: data.shop_latitude ?? null,
                shop_longitude: data.shop_longitude ?? null,
            });
            setLoading(false);
        };

        fetchPost();
    }, [postId]);

    const {
        mutate: saveArticle,
        isPending,
        error,
    } = useMutation({
        mutationFn: async (payload: {
            data: ArticleEditorValue;
            published?: boolean;
        }) => {
            return await updatePostAction(postId, payload);
        },
        onSuccess: () => {
            router.back();
        },
    });

    const handleSave = useCallback(() => {
        saveArticle({ data: value, published: false });
    }, [value, saveArticle]);

    const handleSaveAndPublish = useCallback(() => {
        saveArticle({ data: value, published: true });
    }, [value, saveArticle]);

    if (notFound) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Post not found.</p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </main>
        );
    }

    return (
        <main className="border-r">
            <ArticleEditorHeader
                value={value}
                isUpdate
                onSaveDraft={handleSave}
                onPublish={handleSaveAndPublish}
                loading={isPending}
                errorMessage={error?.message}
            />

            <div className="p-4">
                <ArticleEditor onChange={setValue} value={value} />
            </div>
        </main>
    );
}
