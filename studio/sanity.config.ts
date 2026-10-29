import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// Project ID kommt nach dem Anlegen des Sanity-Projekts hierher (und in sanity.cli.ts, web/.env.local)
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'TODO'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Einstellungen gibt es genau einmal – kein "Neu erstellen"/"Löschen" dafür
const singletonTypes = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Veganrocks',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalte')
          .items([
            S.listItem()
              .title('Website-Einstellungen')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('page').title('Seiten'),
            S.documentTypeListItem('product').title('Shop-Angebote'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
