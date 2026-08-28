import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'libqpizv',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
