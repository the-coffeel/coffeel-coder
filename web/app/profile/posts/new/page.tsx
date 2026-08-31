import BlogPage from '@/components/articles/article-page'
import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const page = async () => {
      const supabase = await createClient();
  
      const { data, error } = await supabase.auth.getClaims();
  
      if (error || !data?.claims) {
          redirect('/');
      }
  return (
    <ProtectedLayout>
      <BlogPage/>
    </ProtectedLayout>
  )
}

export default page