'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'

const DetailsPage = () => {
    const router = useRouter()
    const supabase = createClient()

    const [userId, setUserId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [position, setposition] = useState('')
    const [bio, setBio] = useState('')
    const [initialLoading, setInitialLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                if (!user) {
                    router.push('/auth/login')
                    return
                }

                setUserId(user.id)

                // Fetch existing profile data where name is stored in display_name
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error)
                }

                const initialDisplayName =
                    profile?.display_name ||
                    user.user_metadata?.display_name ||
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    ''

                const initialposition =
                    profile?.position ||
                    user.user_metadata?.position ||
                    ''

                const initialBio =
                    profile?.bio ||
                    user.user_metadata?.bio ||
                    ''

                setName(initialDisplayName)
                setposition(initialposition)
                setBio(initialBio)
            } catch (err) {
                console.error('Failed to load profile details:', err)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchUserData()
    }, [router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) return

        setIsSaving(true)
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(
                    {
                        id: userId,
                        display_name: name.trim(),
                        position: position.trim(),
                        bio: bio.trim(),
                    },
                    { onConflict: 'id' }
                )

            if (profileError) {
                throw profileError
            }

            // Sync with auth user metadata
            await supabase.auth.updateUser({
                data: {
                    display_name: name.trim(),
                    full_name: name.trim(),
                    name: name.trim(),
                    position: position.trim(),
                    bio: bio.trim(),
                },
            })

            toast.success('Profile details updated successfully!')
            router.push('/profile/setup')
            router.refresh()
        } catch (error: unknown) {
            console.error('Failed to update details:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update details. Please try again.'
            toast.error(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-2xl bg-background border-r min-h-screen">
            <div className="border-b px-4 py-4">
                <Link
                    href="/profile/setup"
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Setup
                </Link>
            </div>

            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Complete Your Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tell us more about yourself. This information will be displayed on
                    your public profile.
                </p>

                {initialLoading ? (
                    <div className="mt-8 space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-11 w-full" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-11 w-full" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base font-semibold">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name or display name"
                                className="h-11"
                                disabled={isSaving}
                            />
                            <p className="text-sm text-muted-foreground">
                                This is your public display name.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position" className="text-base font-semibold">
                                Professional position
                            </Label>
                            <Input
                                id="position"
                                value={position}
                                onChange={(e) => setposition(e.target.value)}
                                placeholder="Software Engineer, Designer, Writer..."
                                className="h-11"
                                disabled={isSaving}
                            />
                            <p className="text-sm text-muted-foreground">
                                Your professional position or current position.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-base font-semibold">
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us a little bit about yourself..."
                                className="min-h-[140px] resize-y"
                                disabled={isSaving}
                            />
                            <p className="text-sm text-muted-foreground">
                                A summary introduction about yourself. 
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/profile/setup')}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default DetailsPage