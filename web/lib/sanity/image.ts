import { createImageUrlBuilder } from '@sanity/image-url'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  perspective: 'previewDrafts',
})

const builder = createImageUrlBuilder(client)

type ImageSource = Parameters<typeof builder.image>[0]

export function urlFor(source: ImageSource) {
  return builder.image(source)
}