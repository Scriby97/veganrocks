import {defineArrayMember, defineField, defineType} from 'sanity'
import {altText} from './altText'
import {facts} from './facts'
import {video} from './video'

const image = (name: string, title: string, group: string, description?: string) =>
  defineField({name, title, description, type: 'image', options: {hotspot: true}, fields: [altText], group})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  groups: [
    {name: 'launch', title: 'Wartung'},
    {name: 'home', title: 'Startseite', default: true},
    {name: 'voices', title: 'Kundenstimmen & Videos'},
    {name: 'gallery', title: 'Galerie'},
    {name: 'about', title: 'Über mich'},
    {name: 'shop', title: 'Shop & Bestellung'},
    {name: 'legal', title: 'Kontakt & Rechtliches'},
  ],
  fields: [
    defineField({
      name: 'maintenance',
      title: 'Website vorübergehend sperren (Wartungsmodus)',
      description:
        'Eingeschaltet: Besucherinnen und Besucher sehen nur die Wartungsseite mit deinem Text. Mit dem Passwort kommst du trotzdem auf die Website und kannst deine Änderungen prüfen. Danach ausschalten und Publish – nach 3–5 Minuten ist die Seite wieder für alle offen.',
      type: 'boolean',
      initialValue: false,
      group: 'launch',
    }),
    defineField({
      name: 'maintenanceText',
      title: 'Text auf der Wartungsseite',
      type: 'text',
      rows: 3,
      group: 'launch',
    }),
    defineField({
      name: 'previewPassword',
      title: 'Passwort, um trotzdem auf die Website zu kommen',
      description: 'Für dich (und wer es kennt), solange der Wartungsmodus an ist. Gross-/Kleinschreibung egal.',
      type: 'string',
      group: 'launch',
      validation: (r) =>
        r.custom((pw, {document}) =>
          document?.maintenance && !pw ? 'Bitte ein Passwort eintragen, sonst kommst du selbst nicht mehr auf die Seite.' : true,
        ),
    }),

    defineField({name: 'siteName', title: 'Name der Website', type: 'string', group: 'home'}),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'PNG mit transparentem Hintergrund.',
      type: 'image',
      group: 'home',
    }),
    defineField({
      name: 'shareImage',
      title: 'Bild beim Teilen',
      description:
        'Erscheint, wenn jemand die Website z. B. per WhatsApp teilt. Querformat 1200 × 630 Pixel, unter 300 KB (sonst zeigt WhatsApp kein Bild). Seiten von Shop-Angeboten zeigen stattdessen das Bild des Angebots.',
      type: 'image',
      group: 'home',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Kleine Überzeile',
      description: 'z. B. «Vegane Kochkurse & Events im Aargau».',
      type: 'string',
      group: 'home',
    }),
    defineField({name: 'heroTitle', title: 'Grosser Titel', type: 'string', group: 'home'}),
    defineField({name: 'heroText', title: 'Text unter dem Titel', type: 'text', rows: 3, group: 'home'}),
    image('heroImage', 'Titelbild', 'home', 'Gross im Hintergrund, eher dunkel wirkt am besten (der Titel steht in Weiss darauf).'),
    facts('heroFacts', 'Eckdaten unter dem Titelbild', 'home'),
    defineField({name: 'offersTitle', title: 'Titel über dem Angebot', type: 'string', group: 'home'}),
    defineField({
      name: 'offers',
      title: 'Angebot (Kacheln)',
      description: 'Die wichtigsten Angebote als Kacheln mit Bild, verlinkt auf die passende Seite. Ideal sind 4.',
      type: 'array',
      group: 'home',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
            defineField({name: 'image', title: 'Bild', type: 'image', options: {hotspot: true}, fields: [altText]}),
            defineField({
              name: 'page',
              title: 'Verlinkt auf',
              type: 'reference',
              to: [{type: 'page'}],
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'title', media: 'image', subtitle: 'page.title'}},
        }),
      ],
      validation: (r) => r.max(8),
    }),
    defineField({name: 'introTitle', title: 'Titel Vorstellung', type: 'string', group: 'home'}),
    defineField({name: 'introText', title: 'Text Vorstellung', type: 'richText', group: 'home'}),
    image('introImage', 'Bild Vorstellung', 'home'),
    defineField({
      name: 'ctaTitle',
      title: 'Titel im farbigen Block am Schluss',
      description: 'Erscheint auf der Startseite und auf allen Seiten ohne eigenen Aufruf.',
      type: 'string',
      group: 'home',
    }),
    defineField({name: 'ctaText', title: 'Text im farbigen Block', type: 'text', rows: 2, group: 'home'}),

    defineField({
      name: 'testimonials',
      title: 'Kundenstimmen',
      type: 'array',
      group: 'voices',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'quote', title: 'Zitat', type: 'text', rows: 4, validation: (r) => r.required()}),
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'context', title: 'Anlass', description: 'z. B. «Geburtstag», «Teamevent».', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'quote'}},
        }),
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos auf der Startseite',
      description: 'YouTube-Links. Das erste Video erscheint gross.',
      type: 'array',
      group: 'voices',
      of: [video],
    }),

    defineField({name: 'galleryTitle', title: 'Titel', type: 'string', group: 'gallery'}),
    defineField({name: 'galleryIntro', title: 'Einleitung', type: 'text', rows: 2, group: 'gallery'}),
    defineField({
      name: 'gallery',
      title: 'Bilder',
      description: 'Reihenfolge per Ziehen ändern. Viele Bilder auf einmal: Dateien direkt auf das Feld ziehen.',
      type: 'array',
      group: 'gallery',
      of: [{type: 'image', options: {hotspot: true}, fields: [altText]}],
      options: {layout: 'grid'},
    }),

    defineField({name: 'aboutTitle', title: 'Titel', type: 'string', group: 'about'}),
    defineField({name: 'aboutLead', title: 'Einleitung', type: 'text', rows: 3, group: 'about'}),
    defineField({name: 'aboutText', title: 'Text', type: 'richText', group: 'about'}),
    image('aboutImage', 'Bild', 'about'),
    defineField({
      name: 'qualifications',
      title: 'Ausbildungen & Erfahrung',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'aboutImages',
      title: 'Weitere Bilder',
      description: 'Erscheinen als Bildreihe. Ideal sind 3.',
      type: 'array',
      group: 'about',
      of: [{type: 'image', options: {hotspot: true}, fields: [altText]}],
    }),

    defineField({
      name: 'shopIntro',
      title: 'Einleitung im Shop',
      type: 'text',
      rows: 3,
      group: 'shop',
    }),
    defineField({
      name: 'orderInfo',
      title: 'So funktioniert die Bestellung',
      description: 'Erscheint unten im Shop und im Warenkorb.',
      type: 'richText',
      group: 'shop',
    }),
    defineField({
      name: 'twintQr',
      title: 'TWINT-QR-Code',
      description:
        'Dein Firmen-QR-Code. Ist er hinterlegt, kann man im Warenkorb «TWINT» wählen. Leer lassen = nur Rechnung per E-Mail.',
      type: 'image',
      group: 'shop',
    }),

    defineField({name: 'ownerName', title: 'Name (Inhaberin)', type: 'string', group: 'legal'}),
    defineField({name: 'company', title: 'Firma', description: 'Wie im Handelsregister, falls eingetragen.', type: 'string', group: 'legal'}),
    defineField({name: 'address', title: 'Adresse', type: 'text', rows: 3, group: 'legal'}),
    defineField({name: 'email', title: 'E-Mail', type: 'string', group: 'legal'}),
    defineField({name: 'phone', title: 'Telefon', description: 'Optional – erscheint auf der Kontaktseite.', type: 'string', group: 'legal'}),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp-Nummer',
      description: 'Optional, mit Ländervorwahl, z. B. 41791234567 (ohne + und Leerzeichen).',
      type: 'string',
      group: 'legal',
      validation: (r) => r.regex(/^\d{8,15}$/, {name: 'Nummer'}),
    }),
    defineField({name: 'instagram', title: 'Instagram-Link', type: 'url', group: 'legal'}),
    defineField({name: 'facebook', title: 'Facebook-Link', type: 'url', group: 'legal'}),
    defineField({
      name: 'newsletterUrl',
      title: 'Newsletter-Anmeldung (Link)',
      description: 'Link zur Anmeldung, z. B. von Mailchimp. Leer lassen = kein Newsletter-Hinweis.',
      type: 'url',
      group: 'legal',
    }),
    defineField({
      name: 'agbText',
      title: 'AGB',
      description: 'Leer lassen = keine AGB-Seite. Zwischentitel mit «Gross» formatieren.',
      type: 'richText',
      group: 'legal',
    }),
    defineField({
      name: 'privacyText',
      title: 'Datenschutzerklärung',
      description:
        'Der Abschnitt «Verantwortliche Stelle» wird automatisch aus Name, Adresse und E-Mail erzeugt. Bitte aktuell halten, wenn neue Dienste dazukommen.',
      type: 'richText',
      group: 'legal',
    }),
  ],
  preview: {prepare: () => ({title: 'Website-Einstellungen'})},
})
