'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    File,
    Image as ImageIcon,
    X,
    Search,
    Upload as UploadIcon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Edit,
    Trash,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from "sonner"

interface MediaRecord {
    id: string;
    user_id: string;
    cloudinary_public_id: string;
    cloudinary_secure_url: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    format: string;
    width: number;
    height: number;
    folder: string;
    alt_text?: string;
    created_at: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadItem {
    id: string;
    file: File;
    status: UploadStatus;
    progress: number;
    error?: string;
    result?: MediaRecord;
}

const TABS = ["Files", "Photos", "Upload"] as const;
type Tab = (typeof TABS)[number];

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-0 focus-visible:ring-offset-black";

function FileTypeIcon({ mimeType }: { mimeType?: string }) {
    if (!mimeType?.startsWith("image/")) {
        return (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400">
                <File className="h-4 w-4" strokeWidth={1.75} />
            </div>
        );
    }

    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <ImageIcon className="h-6 w-6" strokeWidth={1.75} />
        </div>
    );
}

interface StoragePageProps {
    /** When true, the component acts as an image picker (hides nav link, enables onSelect). */
    pickerMode?: boolean;
    /** Initial active tab when used as a picker. */
    initialTab?: Tab;
    /** Called with the selected image URL when pickerMode is true. */
    onSelect?: (url: string) => void;
}

export default function StoragePage({ pickerMode = false, initialTab = "Files", onSelect }: StoragePageProps) {
    const [activeTab, setActiveTab] = useState<Tab>(pickerMode ? initialTab : "Files");
    const [query, setQuery] = useState("");

    const [mediaFiles, setMediaFiles] = useState<MediaRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [editingAltTextId, setEditingAltTextId] = useState<string | null>(null);
    const [editingAltTextValue, setEditingAltTextValue] = useState("");
    const [isSavingAltText, setIsSavingAltText] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchMedia = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("media")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Failed to fetch media", error);
            } else if (data) {
                setMediaFiles(data as MediaRecord[]);
            }
            setIsLoading(false);
        };

        fetchMedia();
    }, [supabase]);

    const TOTAL_MB = 500;
    const TOTAL_BYTES = TOTAL_MB * 1024 * 1024;

    const USED_BYTES = mediaFiles.reduce((acc, f) => acc + (f.file_size || 0), 0);
    const USED_MB = (USED_BYTES / (1024 * 1024)).toFixed(2);
    const USAGE_PERCENT = Math.min(Math.max((USED_BYTES / TOTAL_BYTES) * 100, 0), 100);
    const USAGE_PERCENT_DISPLAY = USAGE_PERCENT.toFixed(1);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<MediaRecord| undefined>(undefined);

    const filteredMedia = mediaFiles.filter((f) =>
        (f.file_name || "").toLowerCase().includes(query.toLowerCase())
    );

    const photoMedia = filteredMedia.filter((f) => f.mime_type?.startsWith("image/"));

    const focusTab = (index: number) => {
        const next = (index + TABS.length) % TABS.length;
        setActiveTab(TABS[next]);
        tabRefs.current[next]?.focus();
    };

    const handleEditAltText = (id: string, currentAltText: string | null) => {
        setEditingAltTextId(id);
        setEditingAltTextValue(currentAltText || "");
    };

    const handleSaveAltText = async (id: string) => {
        setIsSavingAltText(true);
        const { error } = await supabase
            .from("media")
            .update({ alt_text: editingAltTextValue })
            .eq("id", id);
            
        if (!error) {
            setMediaFiles((prev) => 
                prev.map((f) => f.id === id ? { ...f, alt_text: editingAltTextValue } : f)
            );
        } else {
            console.error("Failed to update alt text", error);
        }
        setIsSavingAltText(false);
        setEditingAltTextId(null);
    };

    const handleDeleteMedia = async (file: MediaRecord) => {        
        setIsDeletingId(file.id);
        try {
            const res = await fetch("/api/cloudinary/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ public_id: file.cloudinary_public_id }),
            });

            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");

            setMediaFiles((prev) => prev.filter((f) => f.id !== file.id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete file");
        } finally {
            setIsDeletingId(null);
        }
    };

    const uploadFile = useCallback(async (uploadItem: UploadItem) => {
        setUploadItems((prev) =>
            prev.map((item) =>
                item.id === uploadItem.id ? { ...item, status: "uploading" } : item
            )
        );

        try {
            const formData = new FormData();
            formData.append("file", uploadItem.file);

            const res = await fetch("/api/cloudinary/upload", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.error || "Upload failed");
            }

            const mediaData = json.data as MediaRecord;

            setUploadItems((prev) =>
                prev.map((item) =>
                    item.id === uploadItem.id
                        ? { ...item, status: "success", result: mediaData }
                        : item
                )
            );

            setMediaFiles((prev) => [mediaData, ...prev]);

            if (pickerMode && onSelect) {
                onSelect(mediaData.cloudinary_secure_url);
            }
        } catch (err) {
            setUploadItems((prev) =>
                prev.map((item) =>
                    item.id === uploadItem.id
                        ? { ...item, status: "error", error: String(err) }
                        : item
                )
            );
        }
    }, [pickerMode, onSelect]);

    const addFiles = useCallback(
        (files: FileList | File[]) => {
            const newItems: UploadItem[] = Array.from(files).map((file) => ({
                id: crypto.randomUUID(),
                file,
                status: "idle",
                progress: 0,
            }));
            setUploadItems((prev) => [...prev, ...newItems]);
            newItems.forEach((item) => uploadFile(item));
        },
        [uploadFile]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files.length > 0) {
                addFiles(e.dataTransfer.files);
            }
        },
        [addFiles]
    );

    const removeUploadItem = (id: string) => {
        setUploadItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleTabKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                focusTab(index + 1);
                break;
            case "ArrowLeft":
                e.preventDefault();
                focusTab(index - 1);
                break;
            case "Home":
                e.preventDefault();
                focusTab(0);
                break;
            case "End":
                e.preventDefault();
                focusTab(TABS.length - 1);
                break;
            default:
                break;
        }
    };

    const handleCopyUrl = async (file: MediaRecord) => {
        try {
            await navigator.clipboard.writeText(file.cloudinary_secure_url);
            toast.success("Image URL copied!");
        } catch (error) {
            console.error("Failed to copy URL:", error);

            toast.error("Failed to copy image URL.");
        }
    };

    return (
        <div className="border-r">
            <div className="w-full maxw-6xl overflow-hidden backdrop-blur">
                {/* Header */}
                <div className="relative border-b border-neutral-800/80 px-6 pb-5 pt-6">
                    <h1 className="text-xl font-semibold tracking-tight">
                        File Manager
                    </h1>
                    <p className="mt-1 text-sm">
                        Manage your files and uploads here.
                    </p>
                    {!pickerMode && (
                        <Link
                            href="/feed"
                            className={`absolute right-5 top-5 rounded-full p-1.5 transition-colors hover:text-neutral-200 ${FOCUS_RING}`}
                        >
                            <X className="h-4 w-4" />
                        </Link>
                    )}

                    <div className="w-full mt-6">
                        <p className="text-lg font-semibold">
                            {USED_MB} MB
                            <span className="text-neutral-500">/</span> {TOTAL_MB} MB
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                            Storage usage
                        </p>

                        <div
                            role="progressbar"
                            aria-valuenow={USED_BYTES}
                            aria-valuemin={0}
                            aria-valuemax={TOTAL_BYTES}
                            aria-label="Storage usage"
                            className="mt-4 h-2 w-full overflow-hidden bg-black dark:bg-sky-500"
                        >
                            <div
                                className="h-full bg-sky-500 dark:bg-sky-900 transition-all duration-300"
                                style={{ width: `${USAGE_PERCENT}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-neutral-500">
                            {USAGE_PERCENT_DISPLAY}% used
                        </p>
                    </div>

                    {/* Tabs */}
                    <div
                        role="tablist"
                        aria-label="File manager sections"
                        className="mt-5 flex gap-1 border-b border-neutral-800/80"
                    >
                        {TABS.map((tab, index) => {
                            const selected = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    ref={(el) => void (tabRefs.current[index] = el)}
                                    role="tab"
                                    id={`tab-${tab}`}
                                    aria-selected={selected}
                                    aria-controls={`panel-${tab}`}
                                    tabIndex={selected ? 0 : -1}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                                    className={`relative -mb-px rounded-t-md px-3 pb-3 pt-1.5 text-sm font-medium transition-colors ${FOCUS_RING} ${selected
                                            ? ""
                                            : "text-neutral-500 hover:text-neutral-300"
                                        }`}
                                >
                                    {tab}
                                    <span
                                        className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-sky-500 transition-all duration-200 ${selected ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                >
                    {activeTab === "Upload" && (
                        <div className="px-6 py-8 space-y-6">
                            {/* Drop Zone */}
                            <label
                                tabIndex={0}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-6 py-12 text-center transition-all ${FOCUS_RING} ${isDragging
                                        ? "border-sky-500/60 bg-sky-500/5"
                                        : "border-sky-700 bg-sky-900/30"
                                    }`}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800">
                                    <UploadIcon className="h-5 w-5 text-neutral-400" />
                                </div>
                                <div>
                                    <span className="text-sm font-medium">
                                        Drop files here or{" "}
                                        <span className="text-sky-400 underline-offset-2 hover:underline">
                                            click to browse
                                        </span>
                                    </span>
                                    <p className="mt-1 text-xs">
                                        Supports PNG, JPG, GIF, and WebP up to 10 MB
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="sr-only"
                                    multiple
                                    accept="image/png,image/jpeg,image/gif,image/webp"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            addFiles(e.target.files);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </label>

                            {/* Upload Queue */}
                            {uploadItems.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Upload Queue
                                    </h3>
                                    <ul className="space-y-2">
                                        {uploadItems.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex items-center gap-3 border border-neutral-800 bg-neutral-900/40 px-4 py-3"
                                            >
                                                {/* Status Icon */}
                                                <div className="shrink-0">
                                                    {item.status === "uploading" && (
                                                        <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                                                    )}
                                                    {item.status === "success" && (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                    )}
                                                    {item.status === "error" && (
                                                        <AlertCircle className="h-4 w-4 text-red-400" />
                                                    )}
                                                    {item.status === "idle" && (
                                                        <div className="h-4 w-4 rounded-full border border-neutral-700" />
                                                    )}
                                                </div>

                                                {/* File name */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm text-neutral-200">
                                                        {item.file.name}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {(item.file.size / 1024).toFixed(1)} KB
                                                        {item.status === "uploading" && " · Uploading…"}
                                                        {item.status === "success" && " · Uploaded"}
                                                        {item.status === "error" && (
                                                            <span className="text-red-400"> · {item.error}</span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Remove */}
                                                {item.status !== "uploading" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeUploadItem(item.id)}
                                                        className={`shrink-0 rounded p-1 text-neutral-500 hover:text-neutral-200 ${FOCUS_RING}`}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Photos" && (
                        <div className="px-6 py-6 space-y-4">
                            <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Photos Gallery ({photoMedia.length})
                            </h3>

                            {isLoading ? (
                                <div className="py-10 text-center text-neutral-500 flex flex-col items-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Loading photos...</span>
                                </div>
                            ) : photoMedia.length === 0 ? (
                                <div className="py-10 text-center text-neutral-500">
                                    No photos found. Upload some in the Upload tab!
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {photoMedia.map((f) => (
                                        <div
                                            key={f.id}
                                            className="group relative overflow-hidden rounded-none border bg-sky-600"
                                        >
                                            <div className="aspect-square relative">
                                                <Image
                                                    src={f.cloudinary_secure_url}
                                                    alt={f.alt_text || f.file_name}
                                                    fill
                                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 50vw, 25vw"
                                                />
                                            </div>
                                            <div className="px-2 py-1.5">
                                                <p className="truncate text-xs">
                                                    {f.file_name}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {((f.file_size || 0) / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                            {/* Action button: Select (picker) or Copy URL (normal) */}
                                            {pickerMode ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onSelect?.(f.cloudinary_secure_url)}
                                                    className={`absolute inset-0 hidden items-center justify-center rounded bg-black/40 text-sm font-medium text-white group-hover:flex ${FOCUS_RING}`}
                                                    title="Select this image"
                                                >
                                                    Select
                                                </button>
                                            ) : (
                                                <div className="absolute right-1.5 top-1.5 hidden gap-1 group-hover:flex">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDeleteDialogOpen(true);
                                                            setFileToDelete(f);
                                                        }}
                                                        disabled={isDeletingId === f.id}
                                                        className={`rounded bg-black/60 p-1 text-red-400 backdrop-blur hover:text-red-300 ${FOCUS_RING}`}
                                                        title="Delete Media"
                                                    >
                                                        {isDeletingId === f.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash className="h-3.5 w-3.5" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditAltText(f.id, f.alt_text || null)}
                                                        className={`rounded bg-black/60 p-1 text-neutral-300 backdrop-blur hover:text-white ${FOCUS_RING}`}
                                                        title="Edit Alt Text"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyUrl(f)}
                                                        className={`rounded bg-black/60 px-1.5 py-0.5 text-xs text-neutral-300 backdrop-blur hover:text-white ${FOCUS_RING}`}
                                                        title="Copy URL"
                                                    >
                                                        Copy URL
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Files" && (
                        <>
                            {/* Search */}
                            <div className="px-6 pt-4">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search files..."
                                        className={`h-10 w-full border pl-9 pr-3 text-sm text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 hover:border-sky-700 focus:border-sky-500/50 ${FOCUS_RING}`}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="mt-4 overflow-x-auto border">
                                <table className="w-full min-w-[640px] border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs uppercase tracking-wide">
                                            <th className="px-6 py-3 font-medium">File description</th>
                                            <th className="px-6 py-3 font-medium">Type</th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">Alt Text</th>
                                            <th className="px-6 py-3 text-right font-medium whitespace-nowrap">Size</th>
                                            <th className="px-6 py-3 text-right font-medium whitespace-nowrap">Created at</th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" /> Loading files...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredMedia.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-10 text-center text-neutral-500"
                                                >
                                                    {query ? (
                                                        <>No files match &ldquo;{query}&rdquo;.</>
                                                    ) : (
                                                        <>No files found. Upload some in the Upload tab!</>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMedia.map((file) => (
                                                <tr
                                                    key={file.id}
                                                    tabIndex={0}
                                                    className={`border-t transition-colors hover:bg-sky-500 dark:hover:bg-sky-900 ${FOCUS_RING}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <FileTypeIcon mimeType={file.mime_type} />
                                                            <span className="max-w-md truncate">
                                                                {file.file_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {file.mime_type}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="group flex items-center justify-between gap-2">
                                                            <span className="truncate text-neutral-400">
                                                                {file.alt_text || "—"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                                                        {((file.file_size || 0) / 1024).toFixed(1)} KB
                                                    </td>
                                                    <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                                                        {new Date(file.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center justify-evenly">
                                                            <button
                                                                className="rounded-full p-1.5 transition-colors hover:text-neutral-200"
                                                                onClick={() => handleEditAltText(file.id, file.alt_text || null)}
                                                                title="Edit Alt Text"
                                                            >
                                                                <Edit className="w-4 h-4"/>
                                                            </button>
                                                            <button
                                                                className="rounded-full p-1.5 transition-colors text-red-500 hover:text-red-400 disabled:opacity-50"
                                                                onClick={() => {
                                                                    setDeleteDialogOpen(true);
                                                                    setFileToDelete(file);
                                                                }}
                                                                disabled={isDeletingId === file.id}
                                                                title="Delete File"
                                                            >
                                                                {isDeletingId === file.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4"/>}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="h-4" />
                        </>
                    )}
                </div>
            </div>

            <Dialog open={!!editingAltTextId} onOpenChange={(open) => {
                if (!open) setEditingAltTextId(null);
            }}
            >
                <DialogContent className="w-full !max-w-4xl min-h-screen">
                    <DialogHeader>
                        <DialogTitle>Edit Alt Text</DialogTitle>
                        <DialogDescription>
                            Provide descriptive alt text for this media. This improves accessibility and SEO.
                        </DialogDescription>
                    </DialogHeader>
                    {(() => {
                        const editingFile = editingAltTextId ? mediaFiles.find(f => f.id === editingAltTextId) : null;
                        return (
                            <div className="py-4 space-y-4">
                                {editingFile?.mime_type?.startsWith("image/") && (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-neutral-900/50">
                                        <Image
                                            src={editingFile.cloudinary_secure_url}
                                            alt={editingFile.file_name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <Input
                                    value={editingAltTextValue}
                                    onChange={(e) => setEditingAltTextValue(e.target.value)}
                                    placeholder="Enter alt text..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && editingAltTextId) handleSaveAltText(editingAltTextId);
                                    }}
                                />
                            </div>
                        );
                    })()}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAltTextId(null)} disabled={isSavingAltText}>
                            Cancel
                        </Button>
                        <Button onClick={() => editingAltTextId && handleSaveAltText(editingAltTextId)} disabled={isSavingAltText}>
                            {isSavingAltText ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete media?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The media will be
                            permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={async (e) => {
                                e.preventDefault();

                                if (!fileToDelete) return;

                                await handleDeleteMedia(fileToDelete);

                                setDeleteDialogOpen(false);
                                setFileToDelete(undefined);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
