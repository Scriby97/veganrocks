import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'fcu12z7m',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio ist nach `npm run deploy` unter https://veganrocks.sanity.studio erreichbar
  studioHost: 'veganrocks',
  deployment: {
    appId: 'mauycg7mb7anmeazb8b7y8vi',
  },
})
