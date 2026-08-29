import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import EditArticlePage from '@/components/articles/edit-article-page'
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: PageProps) => {
    const { id } = await params
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
        redirect('/');
    }
    return (
        <ProtectedLayout hide_right_bar={true} is_full_width={true}>
            <EditArticlePage postId={id} />
        </ProtectedLayout>
    )
}

export default Page
