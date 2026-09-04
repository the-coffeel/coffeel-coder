'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
    route?: string
}

export default function BackButton({ route }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        if (route) {
            router.push(route)
        } else {
            router.back()
        }
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600"
        >
            <ArrowLeft className="h-4 w-4" />
            Back
        </button>
    )
}