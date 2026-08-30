'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, AtSign, Check, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import useDebounce from '@/app/hooks/use-debounce'

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/

export default function Username() {
    const router = useRouter()
    const supabase = createClient()

    const [userId, setUserId] = useState<string | null>(null)
    const [currentUsername, setCurrentUsername] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [initialLoading, setInitialLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [availability, setAvailability] = useState<{
        checked: boolean
        isAvailable: boolean
        message: string
    }>({ checked: false, isAvailable: true, message: '' })

    const debouncedUsername = useDebounce(username.trim().toLowerCase(), 400)

    // 1. Fetch current username on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth/login')
                return
            }

            setUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            const initialName =
                profile?.username ||
                user.user_metadata?.username ||
                user.user_metadata?.user_name ||
                (user.email ? user.email.split('@')[0] : '')

            setCurrentUsername(initialName || '')
            setUsername(initialName || '')
            setInitialLoading(false)
        }

        fetchUserData()
    }, [router, supabase])

    // 2. Check for duplicates / availability when debounced input changes
    useEffect(() => {
        if (initialLoading || !userId) return

        const cleanUsername = debouncedUsername.toLowerCase()

        if (!cleanUsername) {
            setAvailability({
                checked: false,
                isAvailable: false,
                message: 'Username cannot be empty.',
            })
            setIsChecking(false)
            return
        }

        if (!USERNAME_REGEX.test(cleanUsername)) {
            setAvailability({
                checked: true,
                isAvailable: false,
                message:
                    'Username must be 3-30 characters (letters, numbers, underscores only).',
            })
            setIsChecking(false)
            return
        }

        if (cleanUsername === currentUsername.toLowerCase()) {
            setAvailability({
                checked: true,
                isAvailable: true,
                message: 'This is your current username.',
            })
            setIsChecking(false)
            return
        }

        const checkAvailability = async () => {
            setIsChecking(true)
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id')
                    .ilike('username', cleanUsername)
                    .neq('id', userId)
                    .maybeSingle()

                if (error) {
                    console.error('Error checking username:', error)
                    return
                }

                if (data) {
                    setAvailability({
                        checked: true,
                        isAvailable: false,
                        message: 'This username is already taken.',
                    })
                } else {
                    setAvailability({
                        checked: true,
                        isAvailable: true,
                        message: 'Username is available!',
                    })
                }
            } finally {
                setIsChecking(false)
            }
        }

        checkAvailability()
    }, [debouncedUsername, userId, currentUsername, initialLoading, supabase])

    // 3. Save new username
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const cleanUsername = username.trim().toLowerCase()

        if (!cleanUsername) {
            toast.error('Username cannot be empty.')
            return
        }

        if (!USERNAME_REGEX.test(cleanUsername)) {
            toast.error(
                'Username must be 3-30 characters and contain only letters, numbers, or underscores.',
            )
            return
        }

        if (cleanUsername === currentUsername.toLowerCase()) {
            toast.info('No changes made to username.')
            router.push('/profile/setup')
            return
        }

        if (!availability.isAvailable) {
            toast.error(availability.message || 'Username is not available.')
            return
        }

        setIsSaving(true)

        try {
            // Update Supabase profiles table (upsert in case profile row is missing)
            const { data: updatedProfile, error: profileError } = await supabase
                .from('profiles')
                .upsert(
                    { id: userId, username: cleanUsername },
                    { onConflict: 'id' }
                )
                .select('username')
                .single()

            if (profileError) {
                if (profileError.code === '23505') {
                    toast.error('This username is already taken.')
                    setAvailability({
                        checked: true,
                        isAvailable: false,
                        message: 'This username is already taken.',
                    })
                } else {
                    throw profileError
                }
                return
            }

            if (!updatedProfile) {
                throw new Error('Failed to update profile record in database.')
            }

            // Sync with auth user metadata
            await supabase.auth.updateUser({
                data: { username: cleanUsername },
            })

            toast.success('Username updated successfully!')
            router.push('/profile/setup')
            router.refresh()
        } catch (error: unknown) {
            console.error('Failed to update username:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update username. Please try again.'
            toast.error(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    const cleanInput = username.trim().toLowerCase()
    const isUnchanged = cleanInput === currentUsername.toLowerCase()
    const canSave =
        cleanInput.length >= 3 &&
        USERNAME_REGEX.test(cleanInput) &&
        availability.isAvailable &&
        !isChecking &&
        !isSaving &&
        !isUnchanged

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
                <div className="mb-6">
                    <h1 className="text-xl font-bold tracking-tight">Setup Alias</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Choose your unique username alias. It will be used for your
                        profile URL (@handle) and mentions.
                    </p>
                </div>

                {initialLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username Handle</Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                    <AtSign className="h-4 w-4" />
                                </div>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    placeholder="your_username"
                                    className="pl-9 pr-10 font-mono text-sm"
                                    maxLength={30}
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    disabled={isSaving}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {isChecking && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                    {!isChecking && availability.checked && (
                                        <>
                                            {availability.isAvailable ? (
                                                <Check className="h-4 w-4 text-emerald-600" />
                                            ) : (
                                                <X className="h-4 w-4 text-destructive" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Status and feedback message */}
                            {availability.message && (
                                <p
                                    className={`text-xs ${
                                        isUnchanged
                                            ? 'text-muted-foreground'
                                            : availability.isAvailable
                                            ? 'text-emerald-600'
                                            : 'text-destructive'
                                    }`}
                                >
                                    {availability.message}
                                </p>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Public Profile URL:{' '}
                                <span className="font-mono text-foreground font-semibold">
                                    /@{cleanInput || 'username'}
                                </span>
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
                                disabled={!canSave}
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