import BlogClient from '@/components/BlogClient'; // wherever this file actually lives
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { getAllBlogs, getAllCategories } from '@/lib/sanity/queries/blog';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Blog | Coffeel Coder',
    description:
        'Explore practical insights, stories, and ideas from the Coffeel Coder community.',
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'Blog | Coffeel Coder',
        description:
            'Explore practical insights, stories, and ideas from the Coffeel Coder community.',
        type: 'website',
        url: '/blog',
    },
    twitter: {
        card: 'summary',
        title: 'Blog | Coffeel Coder',
        description:
            'Explore practical insights, stories, and ideas from the Coffeel Coder community.',
    },
};

export default async function BlogPage() {
    const [blogs, categories] = await Promise.all([
        getAllBlogs(),
        getAllCategories(),
    ]);

    return (
        <ProtectedLayout>
            <Suspense>
                <BlogClient blogs={blogs} categories={categories} />
            </Suspense>
        </ProtectedLayout>
    );
}
