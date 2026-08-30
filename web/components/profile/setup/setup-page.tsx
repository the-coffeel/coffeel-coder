import React from 'react'
import Link from 'next/link'
import { ChevronRight, AtSign, User, Image as ImageIcon } from 'lucide-react'
import BackButton from '@/components/back-button'

const menuItems = [
    {
        href: '/profile/setup/username',
        icon: AtSign,
        title: 'Setup Alias',
        description: 'Choose your unique username alias',
    }, 
    {
        href: '/profile/setup/avatar',
        icon: ImageIcon,
        title: 'Profile Picture',
        description: 'Upload or update your profile photo',
    },
    {
        href: '/profile/setup/details',
        icon: User,
        title: 'Profile Details',
        description: 'Update your personal information',
    },

]

const SetupPage = () => {
    return (
        <div className="mx-auto w-full max-w-2xl bg-background border-r">
            <div className="border-b px-4 py-4">
                <BackButton/>
            </div>

            <nav className="flex flex-col">
                {menuItems.map(({ href, icon: Icon, title, description }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-4 border-b px-4 py-5 transition-colors hover:bg-muted/50"
                    >
                        <Icon className="h-6 w-6 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                        <div className="flex-1">
                            <p className="text-base font-semibold text-foreground">{title}</p>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default SetupPage