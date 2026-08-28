'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { urlFor } from '@/lib/image';
import type { SanityCategory, SanityBlog } from '@/lib/queries/blog';
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarImage,
} from '@/components/ui/avatar';

// ---------------------------------------------------------------------------
// Fallback dot colors, used when a category doc doesn't set its own `color`.
// Cycles through this palette in category order.
// ---------------------------------------------------------------------------

const FALLBACK_DOTS = [
    'bg-[#D6F24B]',
    'bg-[#C0472E]',
    'bg-[#C9A876]',
    'bg-[#F4ECDD]',
    'bg-[#8B5E34]',
];

function dotClassFor(
    categorySlug: string | undefined,
    categories: SanityCategory[],
) {
    const idx = categories.findIndex((c) => c.slug === categorySlug);
    const cat = categories[idx];
    if (cat?.color) {
        // Support either a raw Tailwind class or a hex value stored in Sanity.
        return cat.color.startsWith('#') ? '' : cat.color;
    }
    return FALLBACK_DOTS[idx >= 0 ? idx % FALLBACK_DOTS.length : 0];
}

function dotStyleFor(
    categorySlug: string | undefined,
    categories: SanityCategory[],
) {
    const cat = categories.find((c) => c.slug === categorySlug);
    if (cat?.color?.startsWith('#')) return { backgroundColor: cat.color };
    return undefined;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

function PourLink({ children }: { children: React.ReactNode }) {
    return (
        <span className="group relative inline-block cursor-pointer">
            {children}
            <motion.span
                className="absolute -bottom-0.5 left-0 w-full origin-left bg-[#D6F24B]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
            />
        </span>
    );
}

function Steam() {
    return (
        <svg
            width="46"
            height="70"
            viewBox="0 0 46 70"
            fill="none"
            className="absolute -top-10 right-8 opacity-70 hidden sm:block"
            aria-hidden
        >
            {[0, 1, 2].map((i) => (
                <motion.path
                    key={i}
                    d="M8 68C8 68 18 54 8 42C-2 30 8 16 8 2"
                    transform={`translate(${i * 14}, 0)`}
                    stroke="#F4ECDD"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.6, 0.4, 0.6] }}
                    transition={{
                        pathLength: {
                            duration: 1.6,
                            delay: 0.4 + i * 0.15,
                            ease: 'easeOut',
                        },
                        opacity: {
                            duration: 4,
                            delay: 1.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        },
                    }}
                />
            ))}
        </svg>
    );
}

function Ticket({
    blog,
    categories,
}: {
    blog: SanityBlog;
    categories: SanityCategory[];
}) {
    const dotClass = dotClassFor(blog.category?.slug, categories);
    const dotStyle = dotStyleFor(blog.category?.slug, categories);
    return (
        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#C9A876]">
            {blog.ticket && (
                <span className="text-[#8B5E34]">{blog.ticket}</span>
            )}
            {blog.ticket && <span className="text-[#4A3826]">·</span>}
            <span className="flex items-center gap-1.5">
                <span
                    className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
                    style={dotStyle}
                />
                {blog.category?.title ?? 'Uncategorized'}
            </span>
            <span className="text-[#4A3826]">·</span>
            <span>{formatDate(blog.publishedAt)}</span>
        </span>
    );
}

function AuthorByline({
    blog,
    featured = false,
}: {
    blog: SanityBlog;
    featured?: boolean;
}) {
    const authors = blog.authors?.length
        ? blog.authors
        : [{ name: 'Coffeel', avatar: null }];

    return (
        <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${featured ? 'text-xs' : 'text-[11px]'} text-[#8B5E34]`}
        >
            <AvatarGroup className="flex items-center">
                {authors.map((author, index) => (
                    <Avatar key={`${author.name}-${index}`} size="lg">
                        {author.avatar && (
                            <AvatarImage
                                src={urlFor(author.avatar)
                                    .width(100)
                                    .height(100)
                                    .fit('crop')
                                    .url()}
                                alt={author.name}
                            />
                        )}
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </AvatarGroup>
            <span className="text-[#F4ECDD]">
                {authors.map((author) => author.name).join(', ')}
            </span>
            {blog.estimatedReadingTime && (
                <span>
                    · {blog.estimatedReadingTime} min{featured ? ' read' : ''}
                </span>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Props = {
    blogs: SanityBlog[];
    categories: SanityCategory[];
};

export default function BlogClient({ blogs, categories }: Props) {
    const [active, setActive] = useState<string>('All');

    // Guard against undefined/null props (e.g. Sanity fetch not resolved yet)
    const safeBlogs = blogs ?? [];
    const safeCategories = categories ?? [];

    const featured = useMemo(
        () => safeBlogs.find((b) => b.featured) ?? safeBlogs[0],
        [safeBlogs],
    );

    const rest = useMemo(() => {
        const withoutFeatured = safeBlogs.filter(
            (b) => b._id !== featured?._id,
        );
        if (active === 'All') return withoutFeatured;
        return withoutFeatured.filter((b) => b.category?.slug === active);
    }, [active, safeBlogs, featured?._id]);

    const filterOptions = useMemo(
        () => [
            { slug: 'All', title: 'All' },
            ...safeCategories.map((c) => ({ slug: c.slug, title: c.title })),
        ],
        [safeCategories],
    );

    return (
        <>
            <Header />

            {featured && (
                <section className="relative mx-auto max-w-6xl px-6 pt-14 sm:px-10">
                    <Steam />
                    <motion.article
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="grid gap-8 border-b border-[#3A2A1A] pb-14 sm:grid-cols-5"
                    >
                        <div className="overflow-hidden sm:col-span-3">
                            {featured.mainImage && (
                                <img
                                    src={urlFor(featured.mainImage)
                                        .width(1200)
                                        .height(900)
                                        .url()}
                                    alt={featured.mainImage.alt ?? ''}
                                    className="h-64 w-full object-cover sm:h-full"
                                />
                            )}
                        </div>
                        <div className="flex flex-col justify-center gap-4 sm:col-span-2">
                            <Ticket
                                blog={featured}
                                categories={safeCategories}
                            />
                            <h2 className="text-2xl leading-tight text-[#F4ECDD] sm:text-3xl">
                                <PourLink>{featured.title}</PourLink>
                            </h2>
                            <p className="text-sm leading-relaxed text-[#C9A876]">
                                {featured.excerpt}
                            </p>
                            <AuthorByline blog={featured} featured />
                        </div>
                    </motion.article>
                </section>
            )}

            <div className="mx-auto max-w-6xl px-6 pt-10 sm:px-10">
                <div className="flex gap-2">
                    {filterOptions.map((cat) => {
                        const isActive = cat.slug === active;
                        return (
                            <button
                                key={cat.slug}
                                onClick={() => setActive(cat.slug)}
                                className={`rounded-full border px-3.5 py-1.5 text-xs uppercase transition-colors cursor-pointer ${
                                    isActive
                                        ? 'border-[#D6F24B] bg-[#D6F24B] text-[#1B120B]'
                                        : 'border-[#3A2A1A] text-[#C9A876] hover:border-[#C9A876]'
                                }`}
                            >
                                {cat.title}
                            </button>
                        );
                    })}
                </div>
            </div>

            <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {rest.map((blog, i) => (
                            <motion.article
                                key={blog._id}
                                layout
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{
                                    duration: 0.35,
                                    delay: i * 0.04,
                                    ease: 'easeOut',
                                }}
                                className="group flex flex-col"
                            >
                                <div className="overflow-hidden">
                                    {blog.mainImage && (
                                        <motion.img
                                            src={urlFor(blog.mainImage)
                                                .width(900)
                                                .height(700)
                                                .url()}
                                            alt={blog.mainImage.alt ?? ''}
                                            className="h-44 w-full object-cover"
                                            whileHover={{ scale: 1.04 }}
                                            transition={{
                                                duration: 0.4,
                                                ease: 'easeOut',
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-3 border-b border-dashed border-[#3A2A1A] pb-6 pt-4">
                                    <Ticket
                                        blog={blog}
                                        categories={safeCategories}
                                    />
                                    <h3 className="text-lg leading-snug text-[#F4ECDD]">
                                        <PourLink>{blog.title}</PourLink>
                                    </h3>
                                    <p className="line-clamp-2 text-sm leading-relaxed text-[#A8926F]">
                                        {blog.excerpt}
                                    </p>
                                    <AuthorByline blog={blog} />
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {rest.length === 0 && (
                    <p className="py-16 text-center text-sm text-[#C9A876]">
                        No Blog found under "{active}" category.
                    </p>
                )}
            </section>

            <Footer />
        </>
    );
}
