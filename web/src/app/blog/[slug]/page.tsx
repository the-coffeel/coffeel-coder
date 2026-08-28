import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getBlogBySlug } from '@/lib/queries/blog';
import { urlFor } from '@/lib/image';
import Link from 'next/link';
import type { Metadata } from 'next';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Blog post not found | Coffeel Coder',
            robots: { index: false, follow: false },
        };
    }

    const title = `${blog.title} | Coffeel Coder`;
    const description = blog.excerpt ?? `Read ${blog.title} on Coffeel Coder.`;
    const canonicalUrl = `${siteUrl}/blog/${blog.slug}`;
    const imageUrl = blog.mainImage
        ? urlFor(blog.mainImage).width(1200).height(630).url()
        : undefined;

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        authors: blog.authors.map((author) => ({ name: author.name })),
        keywords: blog.categories.map((category) => category.title),
        openGraph: {
            title,
            description,
            type: 'article',
            url: canonicalUrl,
            publishedTime: blog.publishedAt,
            authors: blog.authors.map((author) => author.name),
            section: blog.categories[0]?.title,
            images: imageUrl
                ? [
                      {
                          url: imageUrl,
                          width: 1200,
                          height: 630,
                          alt: blog.mainImage?.alt ?? blog.title,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: imageUrl ? 'summary_large_image' : 'summary',
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

function BlogContent({
    content,
}: {
    content?: {
        _key: string;
        _type: string;
        style?: string;
        children?: { text?: string }[];
        listItem?: string;
    }[];
}) {
    return (
        <div className="space-y-5 text-lg leading-8">
            {(content ?? []).map((block) => {
                if (block._type !== 'block') return null;
                const text = block.children
                    ?.map((child) => child.text ?? '')
                    .join('');
                if (!text) return null;
                if (block.listItem) {
                    return (
                        <li key={block._key} className="ml-6 list-disc">
                            {text}
                        </li>
                    );
                }
                if (block.style === 'h2' || block.style === 'h3') {
                    const Heading = block.style;
                    return (
                        <Heading
                            key={block._key}
                            className="pt-5 text-2xl text-[#F4ECDD]"
                        >
                            {text}
                        </Heading>
                    );
                }
                return <p key={block._key}>{text}</p>;
            })}
        </div>
    );
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return (
            <>
                <Header />
                <main className="mx-auto max-w-6xl px-6 py-32 text-center text-[#F4ECDD]">
                    <h1 className="text-3xl">Blog not found</h1>
                    <Link
                        href="/blog"
                        className="mt-6 inline-block text-[#D6F24B] cursor-pointer"
                    >
                        Back to blog
                    </Link>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: blog.title,
                        description: blog.excerpt,
                        datePublished: blog.publishedAt,
                        url: `${siteUrl}/blog/${blog.slug}`,
                        author: blog.authors.map((author) => ({
                            '@type': 'Person',
                            name: author.name,
                        })),
                        image: blog.mainImage
                            ? [
                                  urlFor(blog.mainImage)
                                      .width(1200)
                                      .height(630)
                                      .url(),
                              ]
                            : undefined,
                        publisher: {
                            '@type': 'Organization',
                            name: 'Coffeel Coder',
                            url: siteUrl,
                        },
                    }),
                }}
            />
            <main className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
                <Link
                    href="/blog"
                    className="text-xs uppercase tracking-[0.12em] text-[#C9A876] hover:text-[#D6F24B]"
                >
                    Back to blog
                </Link>
                <p className="mt-10 text-xs uppercase tracking-[0.12em] text-[#C9A876]">
                    {blog.categories
                        ?.map((category) => category.title)
                        .join(' / ') || 'Uncategorized'}
                </p>
                <h1 className="mt-4 text-4xl leading-tight text-[#F4ECDD] sm:text-6xl">
                    {blog.title}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-[#C9A876]">
                    {blog.excerpt}
                </p>
                {blog.mainImage && (
                    <img
                        src={urlFor(blog.mainImage)
                            .width(1400)
                            .height(800)
                            .url()}
                        alt={blog.mainImage.alt ?? blog.title}
                        className="mt-10 max-h-128 w-full object-cover"
                    />
                )}
                <div className="mt-10 border-b border-[#3A2A1A] pb-8">
                    <div className="grid gap-8 sm:grid-cols-2">
                        {blog.authors.map((author) => (
                            <div
                                key={author.name}
                                className="flex items-center gap-4"
                            >
                                {author.avatar ? (
                                    <img
                                        src={urlFor(author.avatar)
                                            .width(160)
                                            .height(160)
                                            .fit('crop')
                                            .url()}
                                        alt={author.avatar.alt ?? author.name}
                                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3A2A1A] text-xl text-[#F4ECDD]">
                                        {author.name.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm uppercase tracking-[0.08em] text-[#F4ECDD]">
                                        {author.name}
                                    </p>
                                    {author.position && (
                                        <p className="mt-1 text-sm leading-5 text-[#C9A876]">
                                            {author.position}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-md text-[#8B5E34]">
                        Published{' '}
                        {new Date(blog.publishedAt).toLocaleDateString(
                            'en-US',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            },
                        )}
                    </p>
                </div>
                <article className="mt-10">
                    <BlogContent content={blog.content} />
                </article>
            </main>
            <Footer />
        </>
    );
}
