'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PostCard, { Post } from '../post-card';
import DiscoverHero from '../discover/DiscoverHero';
import CategoryGrid from '../discover/CategoryGrid';
import FeaturedCarousel from '../discover/FeaturedCarousel';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Compass,
    Coffee,
    RefreshCw,
    Star,
} from 'lucide-react';

type TabType = 'all' | 'top-voted' | 'highest-rated' | 'recent';
const PLACES_PER_PAGE = 9;

export default function FeedList() {
    const [notes, setNotes] = useState<Post[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Discovery Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All Locations');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id ?? null);
        });
    }, [supabase]);

    useEffect(() => {
        const getData = async () => {
            // Try the joined query first
            const { data, error } = await supabase
                .from('posts')
                .select(
                    `
          *,
          profile:profiles (
            username,
            display_name,
            avatar_url
          ),
          post_likes (
            user_id
                    ),
                    reviews (
                        rating
          )
        `,
                )
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error(
                    'Failed to load posts (joined query):',
                    error.message,
                    error,
                );
                setLoadError(error.message);

                // Fallback: fetch posts without the profile relationship
                const fallback = await supabase
                    .from('posts')
                    .select(
                        `
            *,
            post_likes (
              user_id
                        ),
                        reviews (
                            rating
            )
          `,
                    )
                    .order('created_at', { ascending: false });

                if (fallback.error) {
                    console.error(
                        'Failed to load posts (fallback):',
                        fallback.error.message,
                    );
                    setNotes([]);
                    return;
                }

                setNotes(fallback.data as Post[]);
                return;
            }

            setNotes(data as Post[]);
            setLoadError(null);
        };

        getData();
    }, [supabase]);

    // Dynamic category place counts
    const categoryCounts = useMemo(() => {
        if (!notes) return {};
        const counts: Record<string, number> = {
            all: notes.length,
            'specialty-coffee': 0,
            'tech-code': 0,
            'power-outlets': 0,
            'quiet-focus': 0,
            'books-study': 0,
            'food-bakery': 0,
            'fast-wi-fi': 0,
            'open-late': 0,
            outdoor: 0,
            'coffee-vote': 0,
            'cozy-vibe': 0,
            budget: 0,
        };

        notes.forEach((post) => {
            const text =
                `${post.title || ''} ${post.content || ''} ${post.body || ''} ${(post.hashtags || []).join(' ')}`.toLowerCase();
            if (
                text.includes('coffee') ||
                text.includes('espresso') ||
                text.includes('roast') ||
                text.includes('brew')
            )
                counts['specialty-coffee']++;
            if (
                text.includes('code') ||
                text.includes('dev') ||
                text.includes('work') ||
                text.includes('laptop')
            )
                counts['tech-code']++;
            if (
                text.includes('outlet') ||
                text.includes('plug') ||
                text.includes('power') ||
                text.includes('socket')
            )
                counts['power-outlets']++;
            if (
                text.includes('quiet') ||
                text.includes('silent') ||
                text.includes('focus') ||
                text.includes('calm')
            )
                counts['quiet-focus']++;
            if (
                text.includes('study') ||
                text.includes('book') ||
                text.includes('read') ||
                text.includes('desk')
            )
                counts['books-study']++;
            if (
                text.includes('food') ||
                text.includes('bakery') ||
                text.includes('croissant') ||
                text.includes('pastry') ||
                text.includes('meal')
            )
                counts['food-bakery']++;
            if (
                text.includes('wifi') ||
                text.includes('wi-fi') ||
                text.includes('internet') ||
                text.includes('fiber') ||
                text.includes('mbps')
            )
                counts['fast-wi-fi']++;
            if (
                text.includes('night') ||
                text.includes('late') ||
                text.includes('24')
            )
                counts['open-late']++;
            if (
                text.includes('garden') ||
                text.includes('outdoor') ||
                text.includes('terrace') ||
                text.includes('patio')
            )
                counts['outdoor']++;
            if ((post.likes_count ?? post.post_likes?.length ?? 0) > 0)
                counts['coffee-vote']++;
            if (
                text.includes('cozy') ||
                text.includes('vibe') ||
                text.includes('chill')
            )
                counts['cozy-vibe']++;
            if (
                text.includes('budget') ||
                text.includes('cheap') ||
                text.includes('affordable')
            )
                counts['budget']++;
        });

        return counts;
    }, [notes]);

    // Filtering & Sorting
    const filteredPosts = useMemo(() => {
        if (!notes) return [];

        let result = [...notes];

        // 1. Location Filter
        if (selectedCity && selectedCity !== 'All Locations') {
            const cityKeyword = selectedCity.toLowerCase().split('/')[0].trim();
            result = result.filter((post) => {
                const address = (post.shop_address || '').toLowerCase();
                const content = (post.content || post.body || '').toLowerCase();
                return (
                    address.includes(cityKeyword) ||
                    content.includes(cityKeyword)
                );
            });
        }

        // 2. Category Filter
        if (selectedCategory && selectedCategory !== 'all') {
            result = result.filter((post) => {
                const title = (post.title || '').toLowerCase();
                const content = (post.content || post.body || '').toLowerCase();
                const tags = (post.hashtags || []).map((t) => t.toLowerCase());

                switch (selectedCategory) {
                    case 'specialty-coffee':
                        return (
                            title.includes('coffee') ||
                            content.includes('coffee') ||
                            content.includes('espresso') ||
                            content.includes('brew') ||
                            tags.some(
                                (t) =>
                                    t.includes('coffee') ||
                                    t.includes('specialty'),
                            )
                        );
                    case 'tech-code':
                        return (
                            title.includes('code') ||
                            content.includes('code') ||
                            content.includes('dev') ||
                            content.includes('laptop') ||
                            tags.some(
                                (t) => t.includes('code') || t.includes('tech'),
                            )
                        );
                    case 'fast-wi-fi':
                        return (
                            content.includes('wifi') ||
                            content.includes('wi-fi') ||
                            content.includes('internet') ||
                            content.includes('fiber') ||
                            tags.some((t) => t.includes('wifi'))
                        );
                    case 'power-outlets':
                        return (
                            content.includes('outlet') ||
                            content.includes('plug') ||
                            content.includes('power') ||
                            content.includes('socket') ||
                            tags.some(
                                (t) =>
                                    t.includes('outlet') || t.includes('plug'),
                            )
                        );
                    case 'quiet-focus':
                        return (
                            content.includes('quiet') ||
                            content.includes('silent') ||
                            content.includes('focus') ||
                            tags.some(
                                (t) =>
                                    t.includes('quiet') || t.includes('focus'),
                            )
                        );
                    case 'books-study':
                        return (
                            content.includes('study') ||
                            content.includes('book') ||
                            content.includes('read') ||
                            tags.some((t) => t.includes('study'))
                        );
                    case 'food-bakery':
                        return (
                            content.includes('food') ||
                            content.includes('bakery') ||
                            content.includes('pastry') ||
                            content.includes('croissant') ||
                            tags.some((t) => t.includes('food'))
                        );
                    case 'open-late':
                        return (
                            content.includes('night') ||
                            content.includes('late') ||
                            content.includes('24') ||
                            tags.some(
                                (t) =>
                                    t.includes('late') || t.includes('night'),
                            )
                        );
                    case 'outdoor':
                        return (
                            content.includes('garden') ||
                            content.includes('outdoor') ||
                            content.includes('terrace') ||
                            content.includes('patio') ||
                            tags.some(
                                (t) =>
                                    t.includes('garden') ||
                                    t.includes('outdoor'),
                            )
                        );
                    case 'coffee-vote':
                        return (
                            (post.likes_count ?? post.post_likes?.length ?? 0) >
                            0
                        );
                    default:
                        return true;
                }
            });
        }

        // 3. Text Search Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter((post) => {
                const title = (post.title || '').toLowerCase();
                const text = (post.content || post.body || '').toLowerCase();
                const address = (post.shop_address || '').toLowerCase();
                const tags = (post.hashtags || []).join(' ').toLowerCase();
                return (
                    title.includes(q) ||
                    text.includes(q) ||
                    address.includes(q) ||
                    tags.includes(q)
                );
            });
        }

        // 4. Tab Sorting (Focus on Coffee Vote & Review)
        if (activeTab === 'top-voted') {
            result.sort((a, b) => {
                const aLikes = a.likes_count ?? a.post_likes?.length ?? 0;
                const bLikes = b.likes_count ?? b.post_likes?.length ?? 0;
                return bLikes - aLikes;
            });
        } else if (activeTab === 'highest-rated') {
            result.sort((a, b) => {
                const aReplies = a.replies_count ?? 0;
                const bReplies = b.replies_count ?? 0;
                return bReplies - aReplies;
            });
        } else if (activeTab === 'recent') {
            result.sort((a, b) => {
                return (
                    new Date(b.created_at || '').getTime() -
                    new Date(a.created_at || '').getTime()
                );
            });
        }

        return result;
    }, [notes, selectedCity, selectedCategory, searchQuery, activeTab]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCity, selectedCategory, searchQuery, activeTab]);

    const totalPages = Math.ceil(filteredPosts.length / PLACES_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * PLACES_PER_PAGE,
        currentPage * PLACES_PER_PAGE,
    );
    const firstVisiblePlace = (currentPage - 1) * PLACES_PER_PAGE + 1;
    const lastVisiblePlace = Math.min(
        currentPage * PLACES_PER_PAGE,
        filteredPosts.length,
    );

    return (
        <div className="w-full pb-12">
            {/* 1. Discover Hero with Location & Search */}
            <DiscoverHero
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 2. Curated Categories (3 columns with SVG icons) */}
                <CategoryGrid
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    postCounts={categoryCounts}
                />

                {/* 3. Featured Spotlight */}
                {notes &&
                    notes.length > 0 &&
                    !searchQuery &&
                    selectedCategory === 'all' && (
                        <FeaturedCarousel posts={notes} />
                    )}

                {/* 4. Filter Tabs Bar */}
                <div className="pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] mb-6">
                    {/* Segmented Tabs focused on Coffee Vote and Reviews */}
                    <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] self-start sm:self-auto">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                activeTab === 'all'
                                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span>All Places</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('top-voted')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                activeTab === 'top-voted'
                                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Coffee className="w-3.5 h-3.5 text-amber-500" />
                            <span>Top Voted Coffee</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('highest-rated')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                activeTab === 'highest-rated'
                                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                            <span>Most Reviewed</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                activeTab === 'recent'
                                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span>Newest</span>
                        </button>
                    </div>

                    {/* Results count & Active filters info */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        {filteredPosts.length > 0 && (
                            <span>
                                Showing{' '}
                                <strong className="text-white">
                                    {firstVisiblePlace}-{lastVisiblePlace}
                                </strong>{' '}
                                of {filteredPosts.length} places
                            </span>
                        )}
                        {(searchQuery ||
                            selectedCategory !== 'all' ||
                            selectedCity !== 'All Locations') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedCity('All Locations');
                                }}
                                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium ml-2 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* 5. Error banner if any */}
                {loadError && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                        {loadError}
                    </div>
                )}

                {/* 6. Loading Skeletons Grid */}
                {notes === null && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-white/[0.08] bg-[#18181b] p-4 space-y-4"
                            >
                                <Skeleton className="aspect-[16/9] w-full rounded-xl bg-zinc-800/60" />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-6 rounded-full bg-zinc-800" />
                                        <Skeleton className="h-3 w-24 bg-zinc-800" />
                                    </div>
                                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                                    <Skeleton className="h-3 w-full bg-zinc-800/60" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 7. Empty State (SVG only, no emojis) */}
                {notes !== null && filteredPosts.length === 0 && (
                    <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/10 bg-[#18181b]/40 my-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#202024] border border-white/10 flex items-center justify-center mx-auto mb-4 text-amber-400">
                            <Coffee className="w-7 h-7 stroke-[1.8]" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            No places found
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
                            We couldn’t find any spaces matching your criteria.
                            Try adjusting your filters or search keywords.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedCity('All Locations');
                            }}
                            className="px-5 py-2 rounded-full bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shadow-sm"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* 8. Main Cards Grid */}
                {filteredPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
                        {paginatedPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUserId={currentUserId}
                                isOwner={Boolean(
                                    currentUserId &&
                                    currentUserId === post.user_id,
                                )}
                            />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <nav
                        className="flex items-center justify-center gap-3 pt-8"
                        aria-label="Places pagination"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-zinc-400">
                            Page{' '}
                            <strong className="text-white">
                                {currentPage}
                            </strong>{' '}
                            of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(totalPages, page + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
}
