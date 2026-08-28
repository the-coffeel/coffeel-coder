import BlogClient from '@/components/BlogClient' // wherever this file actually lives
import { getAllBlogs, getAllCategories } from '@/lib/queries/blog'

export default async function BlogPage() {
    const [blogs, categories] = await Promise.all([
        getAllBlogs(),
        getAllCategories(),
    ])

    return <BlogClient blogs={blogs} categories={categories} />
}