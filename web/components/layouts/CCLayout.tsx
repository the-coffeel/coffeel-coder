import { ReactNode } from 'react';
// import { getServerSession } from '@/lib/auth';

type ProtectedLayoutProps = {
    children: ReactNode;
};

export default async function CCLayout({
    children,
}: ProtectedLayoutProps) {
    // const user = await getServerSession();

    // const username =
    //     user?.profile?.username ||
    //     user?.user_metadata?.username ||
    //     user?.user_metadata?.user_name ||
    //     user?.user_metadata?.preferred_username ||
    //     (user?.email ? user.email.split('@')[0] : 'user');

    // const displayName =
    //     user?.profile?.display_name ||
    //     user?.user_metadata?.display_name ||
    //     user?.user_metadata?.full_name ||
    //     user?.user_metadata?.name ||
    //     username ||
    //     user?.email ||
    //     'User';

    return (
        <div className="min-h-screen bg-background">
                {children}
        </div>
    );
}