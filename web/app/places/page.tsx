import FeedList from "@/components/feed/FeedList"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Places | Coffeel Coder',
    description:
        'Discover interesting places and experiences from the Coffeel Coder community.',
    alternates: {
        canonical: '/places',
    },
    openGraph: {
        title: 'Places | Coffeel Coder',
        description:
            'Discover interesting places and experiences from the Coffeel Coder community.',
        type: 'website',
        url: '/places',
    },
    twitter: {
        card: 'summary',
        title: 'Places | Coffeel Coder',
        description:
            'Discover interesting places and experiences from the Coffeel Coder community.',
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