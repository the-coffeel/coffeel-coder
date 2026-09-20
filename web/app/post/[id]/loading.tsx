export default function Loading() {
    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100">
            <div className="h-14 border-b border-white/[0.08] bg-[#09090b]/90">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="h-5 w-24 animate-pulse rounded bg-white/[0.08]" />
                    <div className="hidden items-center gap-6 md:flex">
                        <div className="h-3 w-14 animate-pulse rounded bg-white/[0.06]" />
                        <div className="h-3 w-10 animate-pulse rounded bg-white/[0.06]" />
                    </div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-white/[0.08]" />
                </div>
            </div>

            <main className="mx-auto min-h-screen max-w-4xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                    <div className="h-5 w-16 animate-pulse rounded bg-white/[0.08]" />
                    <div className="h-4 w-20 animate-pulse rounded bg-white/[0.05]" />
                </div>

                <div className="animate-pulse p-5 sm:p-8">
                    <div className="h-8 w-4/5 rounded-lg bg-white/[0.1] sm:h-10 sm:w-3/5" />

                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-white/[0.1]" />
                        <div className="space-y-2">
                            <div className="h-3 w-28 rounded bg-white/[0.1]" />
                            <div className="h-3 w-20 rounded bg-white/[0.06]" />
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        <div className="h-4 w-full rounded bg-white/[0.08]" />
                        <div className="h-4 w-[94%] rounded bg-white/[0.08]" />
                        <div className="h-4 w-4/5 rounded bg-white/[0.08]" />
                        <div className="h-4 w-2/5 rounded bg-white/[0.06]" />
                    </div>

                    <div className="mt-8 h-64 rounded-xl border border-white/[0.08] bg-white/[0.04] sm:h-72" />

                    <div className="mt-6 flex items-center justify-between border-y border-white/[0.06] py-4">
                        <div className="h-8 w-24 rounded-lg bg-white/[0.08]" />
                        <div className="h-8 w-20 rounded-lg bg-white/[0.06]" />
                        <div className="h-8 w-16 rounded-lg bg-white/[0.06]" />
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="h-6 w-32 rounded bg-white/[0.1]" />
                        <div className="h-28 rounded-xl border border-white/[0.08] bg-white/[0.04]" />
                    </div>
                </div>
            </main>
        </div>
    );
}
