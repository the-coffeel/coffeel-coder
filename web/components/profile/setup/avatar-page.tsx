'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const AvatarPage = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [oldAvatar, setOldAvatar] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();
    const canSave = !!file && !error && !isSaving;
    const validateAndSet = useCallback((selected: File | undefined) => {
        if (!selected) return;

        if (!ACCEPTED_TYPES.includes(selected.type)) {
            setError('Unsupported format. Please use JPG, PNG, WebP, or GIF.');
            return;
        }
        if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
            return;
        }

        setError(null);
        setFile(selected);
        const objectUrl = URL.createObjectURL(selected);
        setPreview((prev) => {
            if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
            return objectUrl;
        });
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single();

                const initialAvatar =
                    profile?.avatar_url ||
                    user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture ||
                    null;

                if (initialAvatar) {
                    setPreview(initialAvatar);
                    setOldAvatar(initialAvatar);
                }
            } catch (err) {
                console.error('Failed to load profile details:', err);
            }
        };

        fetchUserData();
    }, [router, supabase]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateAndSet(e.target.files?.[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || 'Upload failed');
            }

            const avatarUrl = uploadData.data.secure_url;

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error('User not found');

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);

            if (profileError) throw profileError;

            await supabase.auth.updateUser({
                data: {
                    avatar_url: avatarUrl,
                },
            });

            if (oldAvatar && oldAvatar.includes('res.cloudinary.com')) {
                fetch('/api/cloudinary/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: oldAvatar }),
                }).catch((err) => console.error('Failed to delete old avatar:', err));
            }

            toast.success('Avatar updated successfully!');
            router.push('/profile/setup');
            router.refresh();
        } catch (err: unknown) {
            console.error('Upload error:', err);
            const message = err instanceof Error ? err.message : 'Failed to update avatar';
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen border-r">
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-5 py-4 backdrop-blur">
                <Link
                    href="/profile/setup"
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to setup
                </Link>
            </div>
            <div className="flex flex-col items-center gap-6 mt-10">
                <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-sky-500 bg-gradient-to-b from-sky-400 to-sky-200">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Avatar preview"
                            className="h-full w-full object-cover"
                            width={100}
                            height={100}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            No image
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        Select Image
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED_TYPES.join(',')}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <p className="text-xs text-neutral-500">
                        Supported formats: JPG, PNG, WebP, GIF. Max size:{' '}
                        {MAX_SIZE_MB}MB.
                    </p>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
                <div className="flex items-end justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/profile/setup')}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={!canSave}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default AvatarPage;
