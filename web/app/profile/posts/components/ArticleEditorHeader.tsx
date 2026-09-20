'use client';
import { Button } from '@/components/ui/button';
import { ArticleEditorValue } from '@/app/profile/posts/components/ArticleEditor';

interface ArticleEditorHeaderProps {
    value: ArticleEditorValue;
    isUpdate?: boolean;
    onSaveDraft: () => void;
    onPublish: () => void;
    loading: boolean;
    errorMessage?: string;
}

export function ArticleEditorHeader({
    value,
    onSaveDraft,
    onPublish,
    loading,
    errorMessage,
    isUpdate,
}: ArticleEditorHeaderProps) {
    const missingRequiredFields = [
        !value.title.trim() && 'shop name',
        !value.cover_image_url.trim() && 'thumbnail',
        (!value.shop_address.trim() ||
            value.shop_latitude === null ||
            value.shop_longitude === null) &&
            'location',
    ].filter(Boolean) as string[];
    const hasMissingRequiredFields = missingRequiredFields.length > 0;

    return (
        <>
            <div className="border-b p-4">
                <div className="max-w-6xl mx-auto flex items-center">
                    <h1 className="font-bold grow">
                        {isUpdate ? 'Update Share Place' : 'Share Place'}
                    </h1>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* meaning when create data make published to false */}
                            <Button
                                variant={'secondary'}
                                onClick={onSaveDraft}
                                disabled={loading || hasMissingRequiredFields}
                            >
                                {isUpdate ? 'Save as Draft' : 'Save Draft'}
                            </Button>
                            {/* published to true */}
                            <Button
                                onClick={onPublish}
                                disabled={
                                    value.summary.length > 300 ||
                                    loading ||
                                    hasMissingRequiredFields
                                }
                            >
                                {isUpdate ? 'Save and Publish' : 'Publish'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {hasMissingRequiredFields && (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                    Add a {missingRequiredFields.join(', ')} before saving.
                </p>
            )}
            {errorMessage && (
                <div className="max-w-4xl mx-auto mb-4">
                    <div className="bg-red-100 text-red-800 p-4 rounded">
                        <pre className="text-sm">{errorMessage}</pre>
                    </div>
                </div>
            )}
        </>
    );
}
