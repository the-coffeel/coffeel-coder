import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'coffeel coder',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'libqpizv',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
