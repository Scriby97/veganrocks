import {defineArrayMember, defineField, defineType} from 'sanity'
import {altText} from './altText'
import {facts} from './facts'
import {video} from './video'

// Adressen, die die Website selbst braucht – eine Seite darf sie nicht belegen
const reservedSlugs = ['shop', 'warenkorb', 'galerie', 'ueber-mich', 'kontakt', 'impressum', 'datenschutz', 'agb', 'api', 'preview']

// Inhaltsseite wie «Kochkurse», «Team-Events» oder «Einkaufstipps». Neue Seiten erscheinen automatisch im Menü.
export const page = defineType({
  name: 'page',
  title: 'Seite',
  type: 'document',
  groups: [
    {name: 'main', title: 'Inhalt', default: true},
    {name: 'more', title: 'Weitere Bausteine'},
    {name: 'settings', title: 'Menü & Google'},
  ],
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Adresse (für Links)',
      description:
        'Erscheint in der Adresszeile, z. B. veganrocks.ch/kochkurse. Nach dem Start nicht mehr ändern, sonst funktionieren alte Links nicht mehr.',
      type: 'slug',
      group: 'main',
      options: {source: 'title', maxLength: 48},
      validation: (r) =>
        r.required().custom((slug) => (reservedSlugs.includes(slug?.current ?? '') ? 'Diese Adresse ist schon vergeben.' : true)),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Kleine Überzeile',
      description: 'Steht klein über dem Titel, z. B. «Für Firmen».',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'intro',
      title: 'Einleitung',
      description: 'Ein bis drei Sätze, gross unter dem Titel.',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
    defineField({
      name: 'heroImage',
      title: 'Titelbild',
      description: 'Querformat wirkt am schönsten. Mit dem Stift-Symbol wählst du den wichtigsten Bildteil.',
      type: 'image',
      options: {hotspot: true},
      fields: [altText],
      group: 'main',
    }),
    facts('facts', 'Eckdaten', 'main'),
    defineField({
      name: 'body',
      title: 'Text',
      description: 'Zwischentitel mit «Gross» formatieren, Aufzählungen mit dem Listen-Knopf.',
      type: 'richText',
      group: 'main',
    }),
    defineField({name: 'cardsTitle', title: 'Titel über den Karten', type: 'string', group: 'more'}),
    defineField({
      name: 'cards',
      title: 'Karten',
      description: 'Kurze Blöcke nebeneinander, z. B. «Teambuilding», «Ernährungswissen». Ideal sind 3 oder 6.',
      type: 'array',
      group: 'more',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Bilder',
      description: 'Erscheinen als Bildreihe unter dem Text. Ideal sind 2 oder 3.',
      type: 'array',
      group: 'more',
      of: [{type: 'image', options: {hotspot: true}, fields: [altText]}],
    }),
    defineField({
      name: 'videos',
      title: 'YouTube-Videos',
      type: 'array',
      group: 'more',
      of: [video],
    }),
    defineField({
      name: 'showTestimonials',
      title: 'Kundenstimmen anzeigen',
      description: 'Zeigt die Kundenstimmen aus den Website-Einstellungen auf dieser Seite.',
      type: 'boolean',
      initialValue: false,
      group: 'more',
    }),
    defineField({
      name: 'cta',
      title: 'Aufruf am Schluss',
      description: 'Farbiger Block am Ende der Seite. Leer lassen = Standardtext mit Knopf zum Kontakt.',
      type: 'object',
      group: 'more',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
        defineField({
          name: 'link',
          title: 'Knopf führt zu',
          type: 'string',
          options: {
            list: [
              {title: 'Kontakt', value: '/kontakt'},
              {title: 'Shop', value: '/shop'},
            ],
            layout: 'radio',
          },
          initialValue: '/kontakt',
        }),
        defineField({name: 'buttonLabel', title: 'Beschriftung des Knopfs', type: 'string'}),
      ],
    }),

    defineField({
      name: 'menu',
      title: 'Im Menü unter',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Angebot', value: 'angebot'},
          {title: 'Tipps & Rezepte', value: 'tipps'},
          {title: 'Nur in der Fusszeile', value: 'footer'},
        ],
        layout: 'radio',
      },
      initialValue: 'angebot',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'menuTitle',
      title: 'Kurzer Name im Menü',
      description: 'Leer = Titel der Seite.',
      type: 'string',
      group: 'settings',
    }),
    defineField({
      name: 'teaser',
      title: 'Kurzbeschreibung',
      description: 'Für Google und für Kacheln auf anderen Seiten. Ein Satz, höchstens 160 Zeichen.',
      type: 'text',
      rows: 2,
      group: 'settings',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Reihenfolge im Menü',
      description: 'Kleinere Zahl = weiter vorne.',
      type: 'number',
      initialValue: 10,
      group: 'settings',
    }),
  ],
  orderings: [
    {
      title: 'Menü-Reihenfolge',
      name: 'menuOrder',
      by: [
        {field: 'menu', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', media: 'heroImage', menu: 'menu'},
    prepare: ({title, slug, media, menu}) => ({
      title,
      subtitle: [`/${slug ?? ''}`, ({angebot: 'Angebot', tipps: 'Tipps & Rezepte', footer: 'Fusszeile'} as Record<string, string>)[menu]]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
