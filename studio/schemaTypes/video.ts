import {defineArrayMember, defineField} from 'sanity'

// YouTube-Video für Startseite und Seiten. Das Vorschaubild liegt in Sanity, damit vor dem Klick
// keine Verbindung zu YouTube nötig ist (Datenschutz, kein Cookie-Banner).
export const video = defineArrayMember({
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'url',
      title: 'YouTube-Link',
      description: 'Link aus YouTube kopieren, z. B. https://youtu.be/AOAsuqhk4PI',
      type: 'url',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Vorschaubild',
      description:
        'Wird angezeigt, bis jemand auf «Abspielen» klickt. Querformat (16:9), z. B. ein Bildschirmfoto aus dem Video. Leer = farbige Fläche mit Titel.',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'url', media: 'thumbnail'}},
})
