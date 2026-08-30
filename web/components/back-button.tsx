'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
    const router = useRouter()

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600"
        >
            <ArrowLeft className="h-4 w-4" />
            Back
        </button>
    )
}
