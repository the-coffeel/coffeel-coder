import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from './structure'
import {colorInput} from '@sanity/color-input'

export default defineConfig({
  name: 'default',
  title: 'coffeel coder',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'XXXX',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({structure}), visionTool(),  colorInput()],

  schema: {
    types: schemaTypes,
  },
})
