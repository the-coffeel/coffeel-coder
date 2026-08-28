import { groq } from 'next-sanity';
import { client } from '@/sanity/client';

// ---------------------------------------------------------------------------
// Types — mirror the shape returned by the GROQ projections below.
// Adjust these (and the queries) if your schema's field names differ.
// ---------------------------------------------------------------------------

export type SanityCategory = {
    _id: string;
    title: string;
    slug: string;
    /** Optional hex or Tailwind class stored on the category doc, used for the dot indicator */
    color?: string;
};

export type SanityBlog = {
    _id: string;
    ticket: string | null;
    slug: string;
    title: string;
    excerpt: string | null;
    category: {
        title: string;
        slug: string;
        color?: string;
    } | null;
    publishedAt: string;
    authors: {
        name: string;
        avatar: {
            asset: { _ref: string; _id?: string };
            alt?: string;
        } | null;
    }[];
    estimatedReadingTime: number | null;
    mainImage: {
        asset: { _ref: string; _id?: string };
        alt?: string;
    } | null;
    featured: boolean;
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const BLOG_PROJECTION = /* groq */ `{
    _id,
    "slug": slug.current,
    title,
    excerpt,
    "category": categories[0]->{
        _id,
        title,
        "slug": slug.current,
        color
    },
    publishedAt,
    "authors": authors[]->{
        _id,
        "name": fullname,
        avatar
    },
    "mainImage": thumbnail,
    featured
}`;

export const ALL_BLOGS_QUERY = groq`
    *[_type == "blog" && defined(slug.current)] | order(publishedAt desc) ${BLOG_PROJECTION}
`;

export const BLOGS_BY_CATEGORY_QUERY = groq`
    *[_type == "blog" && defined(slug.current) && $categorySlug in categories[]->slug.current]
        | order(publishedAt desc) ${BLOG_PROJECTION}
`;

export const FEATURED_BLOG_QUERY = groq`
    *[_type == "blog" && featured == true] | order(publishedAt desc)[0] ${BLOG_PROJECTION}
`;

export const ALL_CATEGORIES_QUERY = groq`
    *[_type == "blogCategory"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        color
    }
`;

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

export async function getAllBlogs(): Promise<SanityBlog[]> {
    return client.fetch(ALL_BLOGS_QUERY, {}, { next: { revalidate: 60 } });
}

export async function getFeaturedBlog(): Promise<SanityBlog | null> {
    return client.fetch(FEATURED_BLOG_QUERY, {}, { next: { revalidate: 60 } });
}

export async function getAllCategories(): Promise<SanityCategory[]> {
    return client.fetch(
        ALL_CATEGORIES_QUERY,
        {},
        { next: { revalidate: 300 } },
    );
}
