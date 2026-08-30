import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import DetailsPage from "@/components/profile/setup/details/page"
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const page = async() => {
      const supabase = await createClient();
  
      const { data, error } = await supabase.auth.getClaims();
  
      if (error || !data?.claims) {
          redirect('/auth/login');
      }
  return (
    <ProtectedLayout>
        <DetailsPage/>
    </ProtectedLayout>
  )
}

export default page