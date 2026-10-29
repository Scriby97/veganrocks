import {defineField, defineType} from 'sanity'
import {altText} from './altText'

// Angebot im Shop: Gutschein, buchbarer Kochkurs oder Termin mit Datum (z. B. «Yoga & Kochkurs»)
export const product = defineType({
  name: 'product',
  title: 'Shop-Angebot',
  type: 'document',
  groups: [
    {name: 'main', title: 'Angebot', default: true},
    {name: 'event', title: 'Termin'},
    {name: 'order', title: 'Bestellung'},
  ],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Kurzname (für Links)',
      type: 'slug',
      group: 'main',
      options: {source: 'name', maxLength: 64},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Art',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'Gutschein', value: 'voucher'},
          {title: 'Kochkurs (Datum nach Absprache)', value: 'course'},
          {title: 'Termin mit Datum', value: 'event'},
        ],
        layout: 'radio',
      },
      initialValue: 'voucher',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Preis (CHF)',
      type: 'number',
      group: 'main',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'priceNote',
      title: 'Zusatz zum Preis',
      description: 'z. B. «pro Person» oder «für bis zu 5 Personen».',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      description: 'Ein bis zwei Sätze – erscheint im Shop unter dem Angebot.',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
    defineField({
      name: 'details',
      title: 'Ausführliche Beschreibung',
      description: 'Ablauf, was inbegriffen ist, was man mitbringt usw. – erscheint auf der Seite des Angebots.',
      type: 'richText',
      group: 'main',
    }),
    defineField({
      name: 'images',
      title: 'Bilder',
      description: 'Das erste Bild wird als Hauptbild angezeigt.',
      type: 'array',
      group: 'main',
      of: [{type: 'image', options: {hotspot: true}, fields: [altText]}],
    }),

    defineField({
      name: 'date',
      title: 'Datum',
      description: 'Nach diesem Tag verschwindet der Termin automatisch aus dem Shop.',
      type: 'date',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
      validation: (r) =>
        r.custom((date, {document}) => (document?.kind === 'event' && !date ? 'Bitte ein Datum eintragen.' : true)),
    }),
    defineField({
      name: 'time',
      title: 'Zeit',
      description: 'z. B. «11 bis ca. 16 Uhr».',
      type: 'string',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      description: 'z. B. «Sennhütte Effingen, Sennhütten 97, 5078 Effingen».',
      type: 'string',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
    }),
    defineField({
      name: 'seats',
      title: 'Freie Plätze',
      description:
        'Wird bei jeder Buchung automatisch heruntergezählt. Bei 0 steht «Ausgebucht». Leer lassen, wenn die Plätze nicht gezählt werden sollen.',
      type: 'number',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
      validation: (r) => r.min(0).integer(),
    }),

    defineField({
      name: 'giftFields',
      title: 'Felder für Gutscheine',
      description: 'Beim Bestellen kann man den Namen der beschenkten Person und einen Grusstext für den Gutschein angeben.',
      type: 'boolean',
      initialValue: true,
      group: 'order',
      hidden: ({document}) => document?.kind !== 'voucher',
    }),
    defineField({
      name: 'available',
      title: 'Im Shop bestellbar',
      description: 'Ausschalten, um das Angebot vorübergehend auszublenden.',
      type: 'boolean',
      initialValue: true,
      group: 'order',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Reihenfolge',
      description: 'Kleinere Zahl = weiter vorne. Termine stehen immer nach Datum sortiert zuoberst.',
      type: 'number',
      initialValue: 10,
      group: 'order',
    }),
  ],
  orderings: [{title: 'Reihenfolge', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', price: 'price', media: 'images.0', available: 'available', kind: 'kind', date: 'date'},
    prepare: ({title, price, media, available, kind, date}) => ({
      title,
      subtitle: [
        ({voucher: 'Gutschein', course: 'Kochkurs', event: 'Termin'} as Record<string, string>)[kind],
        kind === 'event' && date && new Date(date).toLocaleDateString('de-CH'),
        `CHF ${price ?? '–'}`,
        available === false && 'ausgeblendet',
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
