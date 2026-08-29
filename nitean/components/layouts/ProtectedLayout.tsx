import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getServerSession } from '@/lib/auth';
import { UserProfileMenu } from '@/components/UserProfileMenu';
import Image from 'next/image';
import { Badge } from '../ui/badge';

type ProtectedLayoutProps = {
    children: ReactNode;
    hide_right_bar?: boolean;
    is_full_width?: boolean;
};

export default async function ProtectedLayout({
    children,
    hide_right_bar = false,
    is_full_width = false
}: ProtectedLayoutProps) {
    const user = await getServerSession();

    const username =
        user?.profile?.username ||
        user?.user_metadata?.username ||
        user?.user_metadata?.user_name ||
        user?.user_metadata?.preferred_username ||
        (user?.email ? user.email.split('@')[0] : 'user');

    const displayName =
        user?.profile?.display_name ||
        user?.user_metadata?.display_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        username ||
        user?.email ||
        'User';

    return (
        <div className="min-h-screen bg-background">
            {/* <div
                className={`mx-auto grid max-w-6xl grid-cols-1 ${
                    hide_right_bar ? 'lg:grid-cols-[280px_minmax(0,700px)]' : 'lg:grid-cols-[280px_minmax(0,600px)_320px]'
                    }`}
            > */}
<div
    className={`mx-auto grid max-w-6xl grid-cols-1 ${
        is_full_width
            ? 'lg:grid-cols-[280px_minmax(0,1fr)]'
            : hide_right_bar
              ? 'lg:grid-cols-[280px_minmax(0,700px)]'
              : 'lg:grid-cols-[280px_minmax(0,600px)_320px]'
    }`}
>
                {/* Left sidebar */}
                <aside className="hidden border-r px-6 py-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
                    <Badge className='mb-6 rounded-none bg-sky-500 hover:bg-sky-700'>Beta</Badge>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            placeholder="Search"
                            className="h-10 w-full rounded-md border bg-muted/40 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      
                            <Link href={`/`} className='font-semibold text-foreground hover:underline hover:text-sky-400'>
                            Nitean
                            </Link>{" "}
                        is one of startup social media that inspired, share,
                        learn from anywhere.
                    </p>

                    <div className="my-6 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-sky-400 to-sky-200">
                        <Image
                            src="/logo.svg"
                            alt='Nitean Logo'
                            width={100}
                            height={100}
                        />
                    </div>

                    <Separator className="my-6" />

                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            Home
                        </Link>

                        <Link
                            href="/members"
                            className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            Members
                        </Link>

                        <Link
                            href="/about"
                            className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            About
                        </Link>
                    </div>

                    {/* <Separator className="my-6" /> */}

                    {/* <div className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Members on Website
                            </p>

                            <p className="font-semibold">00</p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Members on Telegram
                            </p>

                            <p className="font-semibold">123</p>
                        </div>
                    </div> */}
                </aside>

                {/* Main content */}
                {children}

                {/* Right sidebar */}
                 {!hide_right_bar && <aside className="hidden px-6 py-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
                    <Card className="border-none p-0 shadow-none">
                        {user ? (
                            <div className="flex flex-col items-start text-start w-full">
                                <div className="mb-3">
                                    <UserProfileMenu user={user} showDetailsInTrigger={false} />
                                </div>

                                <p className="font-semibold">
                                    {displayName}
                                </p>
                                <p className="mb-2 text-sm text-muted-foreground">
                                    @{username}
                                </p>

                                {user.profile?.bio ? (
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {user.profile.bio}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <>
                                <h2 className="mb-3 text-base font-semibold leading-snug">
                                    Nitean is a community for developer sharing knowledge
                                </h2>

                                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                                    Follow anyone across the fediverse and see it all
                                    in chronological order. No algorithms, ads, or
                                    clickbait in sight.
                                </p>

                                <Button className="mb-2 w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                                    <Link href="/auth/sign-up">Create account</Link>
                                </Button>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/auth/login">Login</Link>
                                </Button>
                            </>
                        )}
                    </Card>
                </aside>
                }
            </div>
        </div>
    );
}