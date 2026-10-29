import {defineArrayMember, defineField} from 'sanity'

// Kurze Kennzahlen wie «5–25 / Teilnehmende» – erscheinen als Leiste mit grossen Werten
export const facts = (name = 'facts', title = 'Eckdaten', group?: string) =>
  defineField({
    name,
    title,
    description:
      'Kurze Angaben mit grossem Wert und kleiner Beschreibung, z. B. «3–4 Std.» / «Kochen & Geniessen». Ideal sind 3 oder 4.',
    type: 'array',
    group,
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'value', title: 'Wert (gross)', type: 'string', validation: (r) => r.required().max(24)}),
          defineField({name: 'label', title: 'Beschreibung (klein)', type: 'string', validation: (r) => r.max(60)}),
        ],
        preview: {select: {title: 'value', subtitle: 'label'}},
      }),
    ],
    validation: (r) => r.max(6),
  })
