import { ReactNode } from 'react';
import { getServerSession } from '@/lib/auth';
import Header from '../home/Header';
import AnnouncementBanner from '../home/AnnouncementBanner';
import Footer from '../home/Footer';

type ProtectedLayoutProps = {
    children: ReactNode;
};

export default async function ProtectedLayout({
    children,
}: ProtectedLayoutProps) {
    const user = await getServerSession();

    return (
        <div className="min-h-screen bg-background">
                <AnnouncementBanner/>
                <Header user={user}/>
                {children}
                <Footer/>
        </div>
    );
}