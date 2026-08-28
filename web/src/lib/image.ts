import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    perspective: 'previewDrafts', // This will show drafts with published fallback
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}