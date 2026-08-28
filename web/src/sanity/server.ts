import { createClient } from 'next-sanity';

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.NEXT_WRITE_DATA_TO_SANITY_API,
  perspective: 'previewDrafts',
});
