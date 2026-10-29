// Startinhalt: Texte und Bilder der bisherigen Wix-Seite (web/src/lib/placeholder.ts) nach Sanity übertragen.
// Ausführen (einmalig, nach dem Anlegen des Projekts): npx sanity exec scripts/seed.ts --with-user-token
// Überschreibt nichts: jedes Dokument wird nur angelegt, wenn es noch nicht existiert (createIfNotExists).
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import {placeholderPages, placeholderProducts, placeholderSettings} from '../../web/src/lib/placeholder'
import {privacyDefault} from '../../web/src/lib/privacy-default'

const client = getCliClient({apiVersion: '2026-09-01'})
const dir = path.resolve(process.cwd(), '../material/web')

let n = 0
const key = () => `s${(n++).toString(36)}`

// Reiner Text → Editor-Blöcke («## » = Zwischentitel, «- » = Aufzählung, Leerzeile = neuer Absatz,
// [Text](Adresse) = Link)
function blocks(value: unknown) {
  if (typeof value !== 'string') return value
  return value.split(/\n{2,}/).flatMap((para) => {
    const lines = para.split('\n')
    const out: object[] = []
    if (lines[0].startsWith('## ')) out.push(block(lines.shift()!.slice(3), 'h3'))
    const plain = lines.filter((l) => !l.startsWith('- '))
    if (plain.length) out.push(block(plain.join('\n')))
    for (const b of lines.filter((l) => l.startsWith('- '))) out.push({...block(b.slice(2)), listItem: 'bullet', level: 1})
    return out
  })
}

function block(text: string, style = 'normal') {
  const markDefs: object[] = []
  const children = text
    .split(/(\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (!m) return {_type: 'span', _key: key(), text: part, marks: []}
      const linkKey = key()
      markDefs.push({_type: 'link', _key: linkKey, href: m[2]})
      return {_type: 'span', _key: key(), text: m[1], marks: [linkKey]}
    })
  return {_type: 'block', _key: key(), style, markDefs, children}
}

// Lokale Bilder («image-local-datei.jpg») hochladen, jede Datei nur einmal
const uploaded = new Map<string, string>()
async function upload(file: string) {
  if (!uploaded.has(file)) {
    const full = path.join(dir, file)
    if (!existsSync(full)) throw new Error(`Bild fehlt: ${full}`)
    const asset = await client.assets.upload('image', createReadStream(full), {filename: file})
    console.log('  hochgeladen:', file)
    uploaded.set(file, asset._id)
  }
  return uploaded.get(file)!
}

// Ersetzt alle lokalen Bild-Referenzen in einem Objekt durch hochgeladene Assets
async function withImages(value: unknown): Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map(withImages))
  if (!value || typeof value !== 'object') return value
  const obj = value as Record<string, unknown>
  const ref = (obj.asset as {_ref?: string} | undefined)?._ref
  if (obj._type === 'image' && ref?.startsWith('image-local-')) {
    const {asset: _asset, ...rest} = obj
    return {...rest, asset: {_type: 'reference', _ref: await upload(ref.slice('image-local-'.length))}}
  }
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) out[k] = await withImages(v)
  return out
}

const tx = client.transaction()

console.log('Seiten …')
for (const page of placeholderPages) {
  const {_id, slug, body, ...rest} = page
  tx.createIfNotExists({
    _id,
    _type: 'page',
    ...((await withImages(rest)) as object),
    slug: {_type: 'slug', current: slug},
    body: blocks(body),
    sortOrder: placeholderPages.filter((p) => p.menu === page.menu).indexOf(page) * 10 + 10,
  })
}

console.log('Shop-Angebote …')
for (const [i, product] of placeholderProducts.entries()) {
  const {_id, slug, details, soldOut: _soldOut, ...rest} = product
  tx.createIfNotExists({
    _id,
    _type: 'product',
    ...((await withImages(rest)) as object),
    slug: {_type: 'slug', current: slug},
    details: blocks(details),
    sortOrder: i * 10 + 10,
  })
}

console.log('Website-Einstellungen …')
const pageIdBySlug = new Map(placeholderPages.map((p) => [p.slug, p._id]))
const {offers, introText, aboutText, orderInfo, ...settings} = placeholderSettings
tx.createIfNotExists({
  _id: 'siteSettings',
  _type: 'siteSettings',
  ...((await withImages(settings)) as object),
  offers: await withImages(
    (offers ?? []).map(({slug, ...offer}) => ({...offer, page: {_type: 'reference', _ref: pageIdBySlug.get(slug ?? '')}})),
  ),
  introText: blocks(introText),
  aboutText: blocks(aboutText),
  orderInfo: blocks(orderInfo),
  privacyText: blocks(privacyDefault),
  // Erst einmal im Wartungsmodus, bis Bettina alles geprüft hat
  maintenance: true,
  previewPassword: 'rock',
})

await tx.commit()
console.log(`Fertig: ${placeholderPages.length} Seiten, ${placeholderProducts.length} Angebote, Einstellungen, ${uploaded.size} Bilder.`)
