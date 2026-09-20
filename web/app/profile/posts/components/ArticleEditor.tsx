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
import ShopLocationPicker from '@/components/places/ShopLocationPicker';

export interface ArticleEditorValue {
    title: string;
    slug: string;
    cover_image_url: string;
    summary: string;
    content: string;
    shop_address: string;
    shop_latitude: number | null;
    shop_longitude: number | null;
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
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Thumbnail <span className="text-destructive">*</span>
                    </p>
                    <ArticleEditorImageInput
                        value={value.cover_image_url}
                        alt={value.title || 'Shop thumbnail'}
                        onChange={handleImageChange}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="shop-name" className="text-sm font-medium">
                        Shop name <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="shop-name"
                        placeholder="Shop name"
                        aria-label="Shop name"
                        required
                        value={value.title}
                        onChange={(e) =>
                            onChange((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                </div>

                <MarkdownEditor
                    value={value.content}
                    onChange={handleContentChange}
                />

                <ShopLocationPicker
                    value={{
                        address: value.shop_address,
                        latitude: value.shop_latitude,
                        longitude: value.shop_longitude,
                    }}
                    onChange={(location) =>
                        onChange((prev) => ({
                            ...prev,
                            shop_address: location.address,
                            shop_latitude: location.latitude,
                            shop_longitude: location.longitude,
                        }))
                    }
                />
            </div>
        </div>
    );
}

type DialogTab = 'Photos' | 'Upload';

function ArticleEditorImageInput({
    onChange,
    value,
    alt,
}: {
    value?: string;
    alt: string;
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
                <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                    <Image
                        src={value}
                        alt={alt}
                        className="h-full w-full object-contain"
                        width={1200}
                        height={675}
                        unoptimized
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
                        <Button variant={'secondary'} onClick={openUpload}>
                            Upload
                        </Button>
                        <Button variant={'secondary'} onClick={openBrowse}>
                            Browse Your Storage
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
