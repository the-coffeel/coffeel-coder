'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export default function AboutPage() {

    return (
        <main className="min-h-screen border-r">
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-5 py-4 backdrop-blur">
                <Link
                    href="/feed"
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </div>

            <div className="px-5 py-4 space-y-4">
                <h1 className='hidden'>About</h1>
                <Badge className='mb-6 rounded-none bg-sky-500 hover:bg-sky-700'>Beta</Badge>
                <p>Nitean is one of startup social media that inspired, share, learn from anywhere.</p>
            </div>
        </main>
    );
}