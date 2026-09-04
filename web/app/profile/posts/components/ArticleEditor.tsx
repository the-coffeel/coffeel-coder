'use client';

import { Button } from '@/components/ui/button';
import { MarkdownEditor } from '@/components/markdown-editor';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import StoragePage from '@/components/storage/Storage-page';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

export interface ArticleEditorValue {
    title: string;
    slug: string;
    cover_image_url: string;
    summary: string;
    content: string;
}

interface ArticleEditorProps {
    value: ArticleEditorValue;
    onChange: Dispatch<SetStateAction<ArticleEditorValue>>;
}

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
    const handleContentChange = useCallback(
        (newContent: string) => {
            onChange((prev) => ({ ...prev, content: newContent }));
        },
        [onChange],
    );

    const handleImageChange = useCallback(
        (newImage: string) => {
            onChange((prev) => ({ ...prev, cover_image_url: newImage }));
        },
        [onChange],
    );

    return (
        <div>
            <div className="flex flex-col gap-4">
                <ArticleEditorImageInput
                    value={value.cover_image_url}
                    onChange={handleImageChange}
                />

                <Input
                    placeholder="Article Title"
                    value={value.title}
                    onChange={(e) => onChange((prev) => ({ ...prev, title: e.target.value }))}
                />

                <MarkdownEditor
                    value={value.content}
                    onChange={handleContentChange}
                />
            </div>
        </div>
    );
}

type DialogTab = 'Photos' | 'Upload';

function ArticleEditorImageInput({
    onChange,
    value,
}: {
    value?: string;
    onChange: (value: string) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTab, setDialogTab] = useState<DialogTab>('Photos');

    const openBrowse = () => {
        setDialogTab('Photos');
        setDialogOpen(true);
    };

    const openUpload = () => {
        setDialogTab('Upload');
        setDialogOpen(true);
    };

    const handleSelect = (url: string) => {
        onChange(url);
        setDialogOpen(false);
    };

    return (
        <>
            {/* File Manager Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-full !max-w-3xl max-h-[85vh] overflow-y-auto border border-sky-800 p-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>File Manager</DialogTitle>
                    </DialogHeader>
                    <StoragePage
                        pickerMode
                        initialTab={dialogTab}
                        onSelect={handleSelect}
                    />
                </DialogContent>
            </Dialog>

            {value ? (
                <div className="relative h-96 overflow-hidden">
                    <Image
                        src={value}
                        alt="Article Image"
                        className="w-full h-full object-cover"
                        width={500}
                        height={300}
                    />
                    <Button
                        className="absolute top-2 right-2 shadow-md"
                        variant={'secondary'}
                        onClick={() => onChange('')}
                    >
                        Remove
                    </Button>
                    <Button
                        className="absolute bottom-2 right-2 shadow-md"
                        variant={'default'}
                        onClick={openBrowse}
                    >
                        Change Image
                    </Button>
                </div>
            ) : (
                <div className="h-64 items-center justify-center flex-col gap-2">
                    <div className="text-gray-500 text-sm">
                        Upload your image or browse existing uploaded file
                    </div>
                    <div className="flex gap-2">
                        <Button variant={'secondary'} onClick={openUpload}>Upload</Button>
                        <Button variant={'secondary'} onClick={openBrowse}>Browse Your Storage</Button>
                    </div>
                </div>
            )}
        </>
    );
}
