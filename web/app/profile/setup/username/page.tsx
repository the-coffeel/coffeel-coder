import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import UserName from "@/components/profile/setup/username/page"
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
        <UserName/>
    </ProtectedLayout>
  )
}

export default page