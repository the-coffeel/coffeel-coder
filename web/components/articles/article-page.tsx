'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ArticleEditor,
    ArticleEditorValue,
} from '@/app/profile/articles/components/ArticleEditor';
import { useMutation } from '@tanstack/react-query';
import { ArticleEditorHeader } from '@/app/profile/articles/components/ArticleEditorHeader';
import { createPostAction } from '@/app/profile/articles/actions';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
    const [value, setValue] = useState<ArticleEditorValue>({
        title: '',
        slug: '',
        cover_image_url: '',
        summary: '',
        content: '',
    });

    const router = useRouter();

    const hasUnsavedChangesRef = useRef(false);

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

    const {
        mutate: saveArticle,
        isPending,
        error,
    } = useMutation({
        mutationFn: async (payload: {
            data: ArticleEditorValue;
            published?: boolean;
        }) => {
            return await createPostAction(payload);
        },
        onSuccess: (data) => {
            router.back();
            console.log('Article created successfully:', data);
        },
    });

    const handleSaveDraft = useCallback(() => {
        saveArticle({ data: value, published: false });
    }, [value, saveArticle]);

    const handlePublish = useCallback(() => {
        saveArticle({ data: value, published: true });
    }, [value, saveArticle]);

    return (
        <main className='border-r'>
            <ArticleEditorHeader
                value={value}
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
                loading={isPending}
                errorMessage={error?.message}
            />

            <div className="p-4">
                <ArticleEditor onChange={setValue} value={value} />
            </div>
        </main>
    );
}
