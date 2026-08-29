import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import SetupPage from '@/components/profile/setup/setup-page';
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
            <SetupPage />
        </ProtectedLayout>
    );
};

export default page;
