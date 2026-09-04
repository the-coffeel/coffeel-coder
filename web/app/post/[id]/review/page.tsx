import { notFound } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import BackButton from '@/components/back-button';
import ReviewForm from './review-form';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: post, error } = await supabase
        .from('posts')
        .select('id, title')
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data: existingReview } = user
        ? await supabase
              .from('reviews')
              .select('rating, comment')
              .eq('post_id', id)
              .eq('user_id', user.id)
              .maybeSingle()
        : { data: null };

    return (
        <ProtectedLayout>
            <main className="min-h-screen border-x max-w-3xl mx-auto">
                <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background/95 px-5 py-4 backdrop-blur">
                    <BackButton />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Review this place/shop
                        </p>
                    </div>
                </div>
                <div className="p-5">
                    <ReviewForm postId={id} initialReview={existingReview} />
                </div>
            </main>
        </ProtectedLayout>
    );
}
