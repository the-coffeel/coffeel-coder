import { ReactNode } from 'react';
import { getServerSession } from '@/lib/auth';
import Header from '../home/Header';
// import AnnouncementBanner from '../home/AnnouncementBanner';
import Footer from '../home/Footer';

type ProtectedLayoutProps = {
    children: ReactNode;
};

export default async function ProtectedLayout({
    children,
}: ProtectedLayoutProps) {
    const user = await getServerSession();

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-200">
            <div>
                <Header user={user}/>
                <main id="main-content" className="flex-1">
                    {children}
                </main>
            </div>
            <Footer/>
        </div>
    );
}