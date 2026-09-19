import FeedList from "@/components/feed/FeedList"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Discover Places & Cafes | Coffeel Coder',
    description:
        'Discover developer-curated coffee shops, high-speed study workspaces, and tech hubs.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Discover Places & Cafes | Coffeel Coder',
        description:
            'Discover developer-curated coffee shops, high-speed study workspaces, and tech hubs.',
        type: 'website',
        url: '/',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Discover Places & Cafes | Coffeel Coder',
        description:
            'Discover developer-curated coffee shops, high-speed study workspaces, and tech hubs.',
    },
};

const page = () => {
  return (
    <ProtectedLayout>
      <FeedList/>
    </ProtectedLayout>
  )
}

export default page