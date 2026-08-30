import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import StoragePage from '@/components/storage/Storage-page';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const page = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
        redirect('/auth/login');
    }
    return (
        <ProtectedLayout>
            <StoragePage />
        </ProtectedLayout>
    );
};

export default page;
