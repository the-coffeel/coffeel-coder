'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PostGalleryProps {
    images: string[];
    title?: string;
}

export default function PostGallery({
    images,
    title = 'Post',
}: PostGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const ignoreNextClick = useRef(false);

    const imageCount = images.length;
    const hasMultipleImages = imageCount > 1;

    const showPrevious = () => {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
    };

    const showNext = () => {
        setActiveIndex((index) => (index + 1) % images.length);
    };

    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsFullscreen(false);
            if (event.key === 'ArrowLeft' && hasMultipleImages) {
                setActiveIndex(
                    (index) => (index - 1 + imageCount) % imageCount,
                );
            }
            if (event.key === 'ArrowRight' && hasMultipleImages) {
                setActiveIndex((index) => (index + 1) % imageCount);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, hasMultipleImages, imageCount]);

    if (images.length === 0) return null;

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || !hasMultipleImages) return;

        const touchEndX = event.changedTouches[0]?.clientX;
        if (touchEndX === undefined) return;

        const distance = touchStartX.current - touchEndX;
        ignoreNextClick.current = true;
        if (Math.abs(distance) > 50) {
            if (distance > 0) showNext();
            else showPrevious();
        } else {
            showNext();
        }
        touchStartX.current = null;
        window.setTimeout(() => {
            ignoreNextClick.current = false;
        }, 500);
    };

    const handleImageClick = () => {
        if (ignoreNextClick.current) {
            ignoreNextClick.current = false;
            return;
        }
        if (hasMultipleImages) showNext();
    };

    return (
        <section className="mt-6" aria-label="Post gallery">
            <div className="relative overflow-hidden rounded-lg bg-black">
                <div
                    className="aspect-[16/10]"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={handleImageClick}
                >
                    <Image
                        src={images[activeIndex]}
                        alt={`${title} image ${activeIndex + 1}`}
                        fill
                        priority={activeIndex === 0}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 768px"
                    />
                </div>

                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            onClick={showPrevious}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={showNext}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    aria-label="View gallery full screen"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                    <Maximize2 className="h-4 w-4" />
                </button>

                {hasMultipleImages && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                        {activeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {hasMultipleImages && (
                <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`View image ${index + 1}`}
                            aria-current={activeIndex === index}
                            className={`relative h-16 w-20 shrink-0 snap-start overflow-hidden rounded-md border-2 ${
                                activeIndex === index
                                    ? 'border-primary'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                        >
                            <Image
                                src={image}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {isFullscreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(false)}
                        aria-label="Close full screen gallery"
                        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div
                        className="relative h-full w-full max-w-6xl"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onClick={handleImageClick}
                    >
                        <Image
                            src={images[activeIndex]}
                            alt={`${title} image ${activeIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                        {hasMultipleImages && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPrevious}
                                    aria-label="Previous image"
                                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={showNext}
                                    aria-label="Next image"
                                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
