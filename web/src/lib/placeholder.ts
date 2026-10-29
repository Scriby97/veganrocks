import type { Page, Product, SiteSettings } from "./sanity";

// Inhalte der bisherigen Wix-Seite (veganrocks.com, Stand Oktober 2026), aufgeteilt auf die neue Struktur.
// Sie erscheinen, solange keine Sanity-Project-ID gesetzt ist, und sind der Startinhalt für das Studio
// (studio/scripts/seed.ts). Bilder «image-local-…» liegen in public/preview (nicht im Repo, Kopie von
// material/web) und werden beim Seed nach Sanity hochgeladen.
// Texte: «## » = Zwischentitel, «- » = Aufzählung, Leerzeile = neuer Absatz.

let keyCount = 0;
const key = () => `p${(keyCount++).toString(36)}`;

export const img = (file: string, alt: string) => ({
  _type: "image" as const,
  _key: key(),
  asset: { _type: "reference" as const, _ref: `image-local-${file}` },
  alt,
});

const items = <T extends object>(list: T[]) => list.map((item) => ({ ...item, _key: key() }));

export const placeholderSettings: SiteSettings = {
  maintenance: false,
  maintenanceText: "Hier wird gerade umgebaut – bald geht’s weiter. Let’s rock the kitchen!",
  siteName: "Veganrocks",
  logo: img("logo.png", "Veganrocks, est. 2014"),
  shareImage: img("teilen.jpg", "Veganrocks – vegane Kochkurse & Events im Aargau"),
  heroEyebrow: "Vegane Kochkurse & Events · Aargau und ganze Schweiz",
  heroTitle: "Vegan kochen mit einer Prise Rock ’n’ Roll",
  heroText:
    "Kreative Kochkurse, Team-Events und Coachings rund um die nachhaltige, pflanzliche Küche – bei dir daheim, in deiner Eventlocation oder im Kochstudio in Othmarsingen.",
  heroImage: img("hero-grill.jpg", "Gemüse und Pilze auf einem runden Feuergrill, von oben fotografiert"),
  heroFacts: items([
    { value: "seit 2014", label: "vegane Kochkurse & Events" },
    { value: "5–25", label: "Personen pro Event" },
    { value: "100 %", label: "pflanzlich & nachhaltig" },
    { value: "überall", label: "bei dir, in der Location oder im Kochstudio" },
  ]),
  offersTitle: "Massgeschneidert für jeden Anlass",
  offers: items([
    {
      title: "Private Kochkurse",
      text: "Mit Freunden, der Familie oder als Geburtstagsüberraschung – bei dir daheim oder im Kochstudio.",
      image: img("kochkurs-zubereitung.jpg", "Gruppe beim gemeinsamen Zubereiten an einem langen Tisch"),
      slug: "kochkurse",
    },
    {
      title: "Team-Events",
      text: "Teambuilding, Spass und Genuss: gemeinsam kochen, lachen und ein mehrgängiges Menü geniessen.",
      image: img("team-jubel.jpg", "Jubelndes Team nach einem Koch-Event in der Küche"),
      slug: "team-events",
    },
    {
      title: "Gastro-Coaching",
      text: "Vegane Rezepturen für Ihre Karte – Schulung für Küche und Service direkt bei Ihnen vor Ort.",
      image: img("gastro-kueche.jpg", "Bettina in einer Profiküche"),
      slug: "gastro-coaching",
    },
    {
      title: "Social Cooking",
      text: "Gemeinsam kochen verbindet – für Heime, Kliniken, Schulen und Gruppen mit besonderen Bedürfnissen.",
      image: img("social-cooking.jpg", "Zwei Frauen kochen lachend gemeinsam"),
      slug: "social-cooking",
    },
  ]),
  introTitle: "Dein individueller Kochkurs",
  introText: `Veganrocks bringt dir die ganze Vielfalt der nachhaltigen, veganen Küche direkt nach Hause oder in deine Eventlocation. Mit rein pflanzlichen Gerichten geniesst du nicht nur umwelt- und tierfreundlich, sondern auch gesund.

Ob Kochen mit Freunden, Familienfeier, Geburtstagsüberraschung, Polterabend oder Teamausflug: Wir sind flexibel und passen uns deinen Wünschen an. Egal, welche Idee du hast – wir freuen uns darauf.

Seit über zehn Jahren zeigt Bettina, wie einfach, kreativ und genussvoll die vegane Küche ist. Es wird improvisiert, gelacht und natürlich gekocht.`,
  introImage: img("bettina-kueche.jpg", "Bettina Pfiffner lachend in der Küche"),
  ctaTitle: "Let’s rock your kitchen!",
  ctaText:
    "Erzähl mir von deinem Anlass – Datum, Anzahl Personen und Wünsche. Ich melde mich mit einem Vorschlag für deinen Kochkurs oder Event.",

  testimonials: items([
    {
      quote:
        "Wir hatten einen gelungenen Abend in guter Atmosphäre und haben uns bei dir sehr wohl gefühlt. Wir durften neue Gerichte kennenlernen und haben fein gegessen. Ich glaube, es haben es alle genossen. Vielen Dank für diese tolle Erfahrung!",
      name: "Verena",
      context: "Kochabend",
    },
    {
      quote:
        "Everyone said they have had a great day and are very inspired to try out some more recipes. Thank you for making it such a success – it was a great way to celebrate my birthday.",
      name: "Maryanne",
      context: "Geburtstag",
    },
    {
      quote:
        "Es hat wirklich so viel Spass gemacht, ich bin sehr froh, dass wir diesen Event machen konnten. Alle haben etwas gelernt, und es war wirklich ein toller Nachmittag.",
      name: "Ana",
      context: "Team-Event",
    },
  ]),
  videos: items([
    { title: "10 Jahre Veganrocks – Kochschule & Events", url: "https://youtu.be/ofx2UaHCnEw" },
    { title: "Veganer Kochkurs by Veganrocks", url: "https://youtu.be/l_wJAr9K5oA" },
    { title: "Vegane Grill-Rezepte auf dem Ofyr: Auberginen und Blumenkohlsteak", url: "https://youtu.be/TVBD1RgnXEs" },
    { title: "Vegan grilling für Outdoor-Fans", url: "https://youtu.be/AOAsuqhk4PI" },
  ]),

  galleryTitle: "Kochevents, Fotos & Impressionen",
  galleryIntro: "Ein paar Eindrücke aus den Kochkursen, Team-Events und Coachings – und was dabei auf den Tellern landet.",
  gallery: [
    img("food-00.jpg", "Angerichteter Teller mit Gemüse auf Holztisch"),
    img("team-tafel.jpg", "Fröhliche Gruppe an einer langen Tafel nach dem Kochen"),
    img("food-01.jpg", "Salat mit essbaren Blüten in einer Schale"),
    img("food-02.jpg", "Vegane Vorspeise auf weissem Teller"),
    img("kochkurs-camera.jpg", "Gäste fotografieren den gedeckten Tisch: the camera eats first"),
    img("food-03.jpg", "Grüne Suppe mit roten Tupfen"),
    img("food-04.jpg", "Dessert mit Sternfrucht auf weissem Teller"),
    img("food-05.jpg", "Bunte Bowl mit Gemüse und Tomaten auf dunklem Tuch"),
    img("team-gruppe.jpg", "Gruppe nach einem Team-Event im Kochstudio"),
    img("food-06.jpg", "Angerichtetes Gericht mit Saucenstreifen"),
    img("food-07.jpg", "Gemüse wird mit Sauce übergossen"),
    img("food-08.jpg", "Vegane Häppchen und Dips auf einer Platte"),
    img("food-09.jpg", "Randen-Ravioli auf grauem Teller"),
    img("kochkurs-zubereitung.jpg", "Zubereitung am Tisch mit vielen Schüsseln"),
    img("food-10.jpg", "Kleine Suppen in Tassen mit Kräutern"),
    img("food-11.jpg", "Avocado-Salat auf dunklem Teller"),
    img("food-12.jpg", "Blätterteig-Gebäck mit Aprikosen"),
    img("team-tafel-2.jpg", "Lachende Gruppe an einer reich gedeckten Tafel"),
    img("food-13.jpg", "Angerichtete Vorspeise auf weissem Teller"),
    img("food-14.jpg", "Tomatensalat mit Zucchiniröschen"),
    img("food-15.jpg", "Kleine Vorspeise im Glas auf Holz"),
    img("food-16.jpg", "Angerichteter Teller mit Blüten"),
    img("food-17.jpg", "Salatteller auf Holz"),
    img("food-18.jpg", "Grüner Salat mit Croûtons"),
    img("food-19.jpg", "Gemüse-Tarte mit Salat"),
    img("food-20.jpg", "Cashew-Cheesecake-Stücke"),
    img("food-21.jpg", "Hauptgang auf dunklen Tellern mit Menükarte"),
    img("wildkraeuter-pizza.jpg", "Wildkräuter-Pizza mit Gänseblümchen auf Holzbrett"),
  ],

  aboutTitle: "Bettina Pfiffner",
  aboutLead:
    "Passioniert, motiviert und optimistisch. Mein Herz schlägt für die Tiere und unsere Umwelt.",
  aboutText: `Ich setze mich für einen bewussten, nachhaltigen Lebensstil ein und möchte Menschen motivieren, denselben Weg zu gehen – mit dem Ziel, Leiden zu mindern und Leben zu retten.

Seit 2014 zeige ich mit Veganrocks in Kochkursen, Team-Events und Coachings, wie einfach, kreativ und genussvoll die pflanzliche Küche ist. Von Rohkost bis Gourmetküche, von Saucen-Basics bis Freestyle-Kochen: Jeder Kurs ist geprägt von Kreativität, Spass und Leidenschaft – mit einer ordentlichen Portion Rock ’n’ Roll.`,
  aboutImage: img("bettina-portrait.jpg", "Porträt von Bettina Pfiffner"),
  qualifications: [
    "Fachkompetenz für holistische Gesundheit, Gesundheits- und Ernährungsberaterin, Akademie der Naturheilkunde",
    "Fähigkeitsausweis zur Führung eines Gastwirtschaftsbetriebs",
    "Raw Vegan Chef by Matthew Kenney, California",
    "Educator in Raw Vegan Nutrition, Living Light Culinary Institute, California",
    "PR-Fachfrau mit eidgenössischem Fachausweis",
    "Inhaberin Kurkuma Communications",
  ],
  aboutImages: [
    img("bettina-chefkoch.jpg", "Bettina in Kochjacke in einer Profiküche"),
    img("bettina-kochen.jpg", "Bettina beim Kochen in einer hellen Küche"),
    img("bettina-tv.jpg", "Bettina bei einem Kochkurs mit Gästen"),
  ],

  shopIntro:
    "Verschenke ein Erlebnis oder buche deinen nächsten Kochkurs. Gutscheine kannst du für einen privaten Kochkurs oder Team-Anlass einlösen – bei dir daheim, in einer Wunschlocation oder im Kochstudio. Datum, Ort und Menü sind frei wählbar.",
  orderInfo: `## So funktioniert’s
- Wähle dein Angebot und lege es in den Warenkorb.
- Schicke die Bestellung ab – du bezahlst per Rechnung oder TWINT.
- Gutscheine erhältst du nach dem Zahlungseingang per E-Mail, auf Wunsch persönlich gestaltet.
- Für Kochkurse melde ich mich bei dir, um Datum, Gruppengrösse und Menü abzustimmen.

Eilt es? Ruf mich an oder schick mir ein WhatsApp.`,

  ownerName: "Bettina Pfiffner",
  address: "Veganrocks\nOthmarsingen AG",
  email: "kitchen@veganrocks.ch",
  phone: "+41 79 568 54 88",
  whatsapp: "41795685488",
  instagram: "https://www.instagram.com/veganrocks.ch/",
  facebook: "https://facebook.com/veganrocks.ch",
  newsletterUrl: "http://eepurl.com/csW2df",
};

export const placeholderPages: Page[] = [
  {
    _id: "page-kochkurse",
    title: "Private Kochkurse",
    slug: "kochkurse",
    menu: "angebot",
    menuTitle: "Private Kochkurse",
    eyebrow: "Für Freunde, Familie & besondere Anlässe",
    intro:
      "Entdecke die kreative und einfache vegane Küche. Egal, ob du Anfängerin bist oder als Hobbykoch schon Erfahrung hast – hier wird Kochen zum Erlebnis.",
    teaser: "Vegane Kochkurse bei dir daheim, in deiner Wunschlocation oder im Kochstudio Othmarsingen – für Anfänger und Fortgeschrittene.",
    heroImage: img("kochkurs-tisch.jpg", "Tisch voller frischer Zutaten während eines Kochkurses"),
    facts: items([
      { value: "ab 5", label: "Personen" },
      { value: "3–4 Std.", label: "Kochen & Geniessen" },
      { value: "frei", label: "Datum, Ort & Menü" },
    ]),
    body: `## Kochkurs bei dir daheim @home
Dein Wunschmenü mit deinen Lieblingsmenschen: Ab 5 Personen kochen wir bei dir zu Hause – ein geselliger Abend mit Freunden, ein Polterabend, ein Geburtstag oder eine Familienfeier. Du brauchst eine Küche, ganz egal, was vorhanden ist; wir passen das Menü den Möglichkeiten an. Du sorgst lediglich für Gäste und Getränke.

## Im Kochstudio in Othmarsingen
Im voll ausgestatteten Kochstudio kreieren wir eure Wunschgerichte – ob italienische Pasta, asiatische Wok-Kreationen, vegane Schweizer Klassiker oder exotische Spezialitäten. Platz hat es für 5 bis 13 Personen. Grössere Gruppen und andere Locations in der ganzen Schweiz sind nach Absprache möglich.

## Von Rohkost bis Gourmetküche
Gemeinsam gestalten wir Kurse, die euren Bedürfnissen und Vorstellungen entsprechen – von einfachen, gesunden Rezepten bis zu beeindruckenden Gourmetgerichten. Es wird improvisiert, gelacht und natürlich gekocht.

## Vegan Basics – für Einsteiger, Neugierige und Flexitarier
- Einfache vegane Rezepte: vegan geht ganz einfach!
- Wie gesund ist eine vegane Ernährung?
- Rohkost oder gekocht – finde deinen Stil
- Milch, Eier, Käse, Fleisch und Fisch ersetzen
- Einkaufstipps, Bio oder konventionell?
- Messertechniken, Kochtricks und Anrichten

## Für Fortgeschrittene
- Intuitives Kochen: ohne Rezept einfach drauflos
- Ernährungsthemen der veganen Küche vertiefen
- Rohkostküche für Wagemutige
- Ersatzprodukte selbst herstellen, ohne Fertigprodukte
- Vegane Käseherstellung & Fermentieren
- Zero Waste und Root to Leaf: Wurzeln und Blätter verwerten statt wegwerfen
- Profi-Tipps zum Anrichten und Dekorieren`,
    cardsTitle: "Das erwartet dich",
    cards: items([
      { title: "Gemeinsam kochen", text: "Zusammen zubereiten, kreativ anrichten und in geselliger Runde geniessen." },
      { title: "Ernährungswissen", text: "Wertvolle Fakten, Mythen und Vorurteile ausradiert – und Antworten auf all deine Fragen." },
      { title: "Alltagstauglich", text: "Rezepte für zuhause sowie Tipps & Tricks, die du gleich am nächsten Tag anwendest." },
    ]),
    images: [
      img("kochkurs-studio.jpg", "Kochkurs im Kochstudio am Herd"),
      img("kochkurs-zuhause.jpg", "Salat und Rösti, angerichtet auf einem Teller"),
      img("kochkurs-camera.jpg", "Gäste fotografieren den gedeckten Tisch"),
    ],
    videos: [],
    showTestimonials: true,
    cta: { title: "Dein Wunsch-Kochkurs", text: "Erzähl mir, was ihr feiern oder lernen möchtet – ich mache dir einen Vorschlag.", link: "/kontakt", buttonLabel: "Kochkurs anfragen" },
  },
  {
    _id: "page-team-events",
    title: "Team-Events & Firmenanlässe",
    slug: "team-events",
    menu: "angebot",
    menuTitle: "Team-Events",
    eyebrow: "Für Teams & Firmen",
    intro:
      "Gemeinsam kochen ist ein verbindendes Erlebnis: Es fordert Teamgeist, Kommunikation und exaktes Timing – ähnlich wie in der Berufswelt. Und am Schluss sitzen alle zusammen am Tisch.",
    teaser: "Vegane Team-Events, Polterabende und Firmenanlässe mit Teambuilding, Spass und Genuss – im Kochstudio oder an eurer Wunschlocation.",
    heroImage: img("team-tafel.jpg", "Team an einer langen, gedeckten Tafel nach dem Kochen"),
    facts: items([
      { value: "5–25", label: "Teilnehmende" },
      { value: "3–4 Std.", label: "Know-how, Spass & Genuss" },
      { value: "CHF 150", label: "pro Person" },
    ]),
    body: `## Nachhaltigkeit mit einer Prise Rock ’n’ Roll
Bei uns dreht sich alles um die Verbindung von nachhaltiger Ernährung und Spass in der Küche. Gutes Essen ist nicht nur gut für dich, sondern auch für den Planeten. Richtig inszeniert wirkt Kochen meditativ, erfüllend und baut Stress ab.

Einen Nachmittag in der Küche, ein gemeinsam zubereitetes Dinner zum Jahresende oder ein Mittagessen zum Thema Gesundheitsförderung: Die Möglichkeiten für Ihre Gruppe sind vielseitig. Gekocht wird in Ihren Räumlichkeiten oder auswärts – eine Küche ist nicht zwingend nötig.

## Das erwartet euch
- Wissenswertes rund um die nachhaltige Küche
- Gemeinsames Kochen und Zubereiten
- Anrichten & Dekorieren
- Teambuilding, Spass & Rock ’n’ Roll
- Essen & Trinken kommen nicht zu kurz
- Coaching & Rezepte zum Mitnehmen

## Optionen
- Kochstudio in Othmarsingen bis 13 Personen
- Eure Wunschlocation oder eure Küche
- Erweiterung mit Weindegustation, Backkurs oder Gin-Degustation mit Profis
- Speed-Kitchen: die wohl schnellste Kochart
- Kitchen-Battle: das lustige Wettkochen`,
    cardsTitle: "Warum Veganrocks?",
    cards: items([
      { title: "Kochkurs nach Wunsch", text: "Wir kochen eure Lieblingsgerichte oder Spezialitäten aus einem Land eurer Wahl." },
      { title: "Ernährungswissen", text: "Wir klären alle Fragen rund um eine gesunde, pflanzliche Ernährung." },
      { title: "Teambuilding", text: "Kochen verbindet und schafft ein gemeinsames Erlebnis, von dem man noch lange spricht." },
    ]),
    images: [
      img("team-gruppe.jpg", "Gruppe nach einem Team-Event"),
      img("team-kueche.jpg", "Team beim Kochen in der Küche"),
      img("team-tafel-2.jpg", "Lachende Gruppe an einer reich gedeckten Tafel"),
    ],
    videos: [],
    showTestimonials: true,
    cta: { title: "Euer Team-Event planen", text: "Datum, Gruppengrösse und Ort – den Rest stimmen wir gemeinsam ab.", link: "/kontakt", buttonLabel: "Team-Event anfragen" },
  },
  {
    _id: "page-social-cooking",
    title: "Social Cooking",
    slug: "social-cooking",
    menu: "angebot",
    eyebrow: "Gemeinsam kochen & essen",
    intro:
      "Gemeinsam kochen fördert den Teamgeist und die Kommunikation. Gemeinsame Erlebnisse stärken und festigen zwischenmenschliche Beziehungen – und selber gekocht schmeckt alles noch viel besser.",
    teaser: "Kochen als verbindendes Erlebnis – für Alters- und Pflegeheime, Kliniken, Schulen und Gruppen mit besonderen Bedürfnissen.",
    heroImage: img("social-cooking.jpg", "Zwei Frauen kochen lachend gemeinsam"),
    facts: [],
    body: `## Sensorik, Kreativität & Motorik
Gemeinsam kochen wir, fördern dabei die Motorik und lernen neue Aromen und Gemüse kennen. Alle werden integriert – vom Tischdecken bis zum Rüsten und Gemüsewaschen. Alle sind Teil des Teams.

Ein themenspezifischer Koch-Event zu einer Feier oder regelmässige Mittagstische: Die Möglichkeiten sind vielseitig. Den Teilnehmenden angepasst kreiere ich für euch den perfekten Koch-Event.

## Kochen ist Therapie!
Kochen mit Handicap, im Alters- oder Pflegeheim, für Kinder mit Lernschwierigkeiten oder in Kliniken – ich freue mich auf deine Kontaktaufnahme.`,
    cards: [],
    images: [img("social-cooking-2.jpg", "Fröhliche Gruppe nach einem gemeinsamen Kochnachmittag")],
    videos: [],
    showTestimonials: false,
    cta: null,
  },
  {
    _id: "page-gastro-coaching",
    title: "Gastro-Coaching",
    slug: "gastro-coaching",
    menu: "angebot",
    eyebrow: "Für Profis: Küchenchefs, Wirte, Köche, Lernende",
    intro:
      "Vegan ist kein Trend mehr, sondern ein Lifestyle – die Nachfrage steigt. Gastronomen, die ihr Angebot ausbauen und gut vermarkten, profitieren.",
    teaser: "Veganes Coaching für Gastronomiebetriebe: Rezepturen, Produktkunde und Schulung für Küche und Service – bei Ihnen vor Ort.",
    heroImage: img("gastro-kueche.jpg", "Bettina in Kochjacke in einer Profiküche"),
    facts: items([
      { value: "vor Ort", label: "in Ihrer Küche" },
      { value: "individuell", label: "nach Ihren Bedürfnissen" },
      { value: "Küche & Service", label: "das ganze Team" },
    ]),
    body: `Die pflanzliche Kochart eignet sich für Veganer, Vegetarier, gesundheitsbewusste und nachhaltig interessierte Gäste. Sind Ihre Gerichte zudem kreativ und delikat, finden sie auch bei Allesessern Anklang.

Veganrocks unterstützt Sie bei der Produktbeschaffung, der Rezeptkreation und der Zubereitung der neuen Gerichte. Gemeinsam erarbeiten wir die veganen Rezepturen zu Ihren Standardgerichten. Auch Rezepte aus der Rohkost- oder Vital-Küche sind einfach umsetzbar.

## Vegan lohnt sich
In Zeiten schwieriger Marktbedingungen ist die Gastronomie gefordert, neue Wege zu gehen. Der Trend zu Nachhaltigkeit und reduziertem Fleischkonsum steigt – die Gäste stellen neue Ansprüche: vegan, gesund und nachhaltig. Darum ist es wichtig, das ganze Personal von der Küche bis zum Service umfassend zu informieren.

## Themen des Coachings
- Begriffserklärung, Abgrenzungen, pragmatische Anwendung im Alltag
- Vegane Produktkunde und Neuheiten
- Rezepte, Zubereitungstipps, Handhabung und optimaler Einsatz
- Bezugsquellen von veganen Produkten
- Fragen, Alltagsthemen und Ernährungsfakten
- Deklaration & Kommunikation
- Vermarktung & Community-Aufbau auf Social Media
- Ihre individuellen Themen

Die Coachings finden bei Ihnen vor Ort statt. In gewohnter Umgebung, zu echten Bedingungen wird Ihr Team für den Alltag gewappnet.

## Vegan oder vegetarisch?
Vegan bedeutet: Die Speisen enthalten keine tierischen Bestandteile wie Fisch, Fleisch, Milchprodukte, Eier, Butter oder Honig. Vegetarisch bedeutet: keine Tiere verarbeiten (Fisch, Fleisch, Gelatine usw.).`,
    cards: [],
    images: [img("gastro-team.jpg", "Team in einer Gastroküche")],
    videos: [],
    showTestimonials: false,
    cta: { title: "Unverbindliche Offerte", text: "Fordern Sie die Dokumentation oder eine unverbindliche Offerte an.", link: "/kontakt", buttonLabel: "Offerte anfragen" },
  },
  {
    _id: "page-rezepte",
    title: "Rezepte & Videos",
    slug: "rezepte",
    menu: "tipps",
    eyebrow: "Vegan grillieren & geniessen",
    intro: "Ein paar Lieblingsrezepte zum Nachkochen – vom Grill, aus dem Mixer und für den nächsten Apéro. Weitere Ideen gibt’s auf Instagram und Facebook.",
    teaser: "Vegane Grillrezepte auf dem Ofyr, veganer Mozzarella und BBQ-Marinade – mit Videos von Veganrocks.",
    heroImage: img("ofyr-grill.jpg", "Veganer Burger-Patty auf dem Ofyr-Grill"),
    facts: [],
    body: `## Cauliflower Steak mit Chimichurri
- 1 Blumenkohl
- 1 EL Senf
- 1 EL Tomatenpüree
- BBQ-Gewürz oder Aroma-Meister (Würzmeister)
- Smoked Paprika (Würzmeister)
- Salz und schwarzer Pfeffer

Blumenkohl in Scheiben schneiden, mit der Marinade bestreichen und mit viel Öl anbraten. Am besten lässt ihr die Marinade vorher etwas einziehen. Auf beiden Seiten goldig braten. Erdnuss-, Raps- oder Kokosöl zum Erhitzen verwenden – keine kaltgepressten Öle.

## Chimichurri
- 1 Bund glatte Petersilie
- 2 Knoblauchzehen
- 1 kleine rote Zwiebel
- Saft von 1 Limette
- Olivenöl
- ½ TL getrocknete Chiliflocken
- ½ TL schwarzer Pfeffer
- 1 TL grobes Meersalz
- ½ Bund Oregano, 1 Zweig Thymian, 1 Lorbeerblatt

Petersilie, Knoblauch und Zwiebel fein hacken. Alle Zutaten gut mischen, mit einem Löffel oder Mörser bearbeiten und mit Limettensaft und Olivenöl zu einer dickflüssigen Emulsion vermischen – die Konsistenz sollte ähnlich wie bei einem Pesto sein.

## Grillierte Auberginen mit Tahini-Dip
Für den Dip Tahini, Kokosjoghurt, Pfiffikus-Streuwürze und schwarzen Pfeffer verrühren. Die Auberginen halbieren und rautenförmig einschneiden, ohne die Haut zu verletzen. Mit Salz oder Sojasauce und Knoblauch bestreichen und ca. eine Stunde auf dem Feuer rösten.

## Veganer Mozzarella
- 400 ml Wasser
- 2 EL gemahlene Flohsamenschalen
- Saft von ½ Zitrone
- 1 Becher Cashewkerne, 2 Stunden eingeweicht
- Salz und Gewürze nach Belieben

Die Flohsamenschalen ins Wasser einrühren und ca. 2 Stunden stehen lassen, bis eine geleeartige Masse entsteht. Alle Zutaten im Blender mixen – quält sich der Mixer, einfach etwas Wasser dazugeben. Abschmecken, in eine Schüssel giessen und ca. 2 Stunden kühl stellen.

## Mozzarella-Zucchini-Türmli
Zucchini und Tomaten in Scheiben schneiden, mit italienischen Kräutern (Oregano, Rosmarin, Basilikum, Thymian) bestreuen und in Öl anbraten oder grillieren. Den Mozzarella auf den gewendeten Zucchinischeiben mitgrillieren und abwechselnd Käse, Zucchini und Tomate aufschichten.

## BBQ-Marinade für Jackfruit
- 4 TL Tomatenpüree
- 2 EL Senf
- 4–6 Tropfen Liquid Smoke
- 7 Umdrehungen Pfeffer
- 1,5 TL Sambal Oelek
- 1 TL Cajun Salt, 1 TL Smoked Paprika, ½ TL Aroma-Meister (Würzmeister)
- 2 TL Agavendicksaft

Alles gut verrühren. Passt zu jeglichem Grillgut für Grill oder Tischgrill. Am besten einige Stunden oder über Nacht marinieren lassen. En Guete!`,
    cards: [],
    images: [],
    videos: items([
      { title: "Vegane Grill-Rezepte auf dem Ofyr: Auberginen und Blumenkohlsteak", url: "https://youtu.be/TVBD1RgnXEs" },
      { title: "Vegan grilling für Outdoor-Fans", url: "https://youtu.be/AOAsuqhk4PI" },
    ]),
    showTestimonials: false,
    cta: null,
  },
  {
    _id: "page-einkaufstipps",
    title: "Einkaufstipps",
    slug: "einkaufstipps",
    menu: "tipps",
    eyebrow: "Vegan einkaufen",
    intro: "Meine Lieblingsadressen für Gewürze, Geräte und Alternativen – zum Teil mit Rabattcode für dich.",
    teaser: "Vegane Einkaufstipps: Onlineshops, Gewürze, Küchengeräte, Weine und Rabattcodes von Veganrocks.",
    heroImage: img("partner-gemuese.jpg", "Kiste mit frischem Gemüse, Pilzen und Kartoffeln"),
    facts: [],
    body: `## Onlineshops
Fleisch-, Fisch-, Rahm- und Käsealternativen findet ihr in den Onlineshops von Mr. Vegan, Eva’s Apples, Hellovegan und Fabulous.

## Gewürze
Pfiffikus – die besten Streuwürzen mit Steinsalz ohne Natriumglutamat, geniales Kartoffelgewürz, Pestos, verschiedene Salze, Dips und Saucen: vitanaturalis.ch

Aroma-Meister, Rauchpaprika und BBQ-Gewürz sind elementar für ein geniales veganes BBQ. Würzmeister.ch hat zahlreiche leckere Gewürze, die in keiner Küche fehlen dürfen. Mit dem Code VEGANROCKS15 erhältst du 15 % auf deine Erstbestellung.

Sprossen sind Weltmeister, was Geschmack, Vitamine, Enzyme, Proteine und sekundäre Pflanzenstoffe angeht. Bei Sprossensamen gibt’s mit dem Gutscheincode «veganrocks» 5 % Rabatt.

## Die richtigen Geräte
Der «Börner» unter den Raffeln hält ewig, ist super scharf und einfach effizient – Vermerk «veganrock» bei der Bestellung bei bkhandel.

Mixer und Profigeräte von Keimling: Mit 10VEGANROCKS erhältst du 10 % Rabatt.

Wired Cooker: Mit dem Code KBBPFIFF10PT erhältst du 10 % Rabatt auf den einmaligen Kauf eines Wired Cookers auf wiredcooking.com.

## Auswärts vegan essen
Mit diesen Apps findest du veganes Essen auf der ganzen Welt: HappyCow oder Vanilla Bean.

## Weine
Ab Jahrgang 2017 sind alle Weine bei Delinat vegan: delinat.ch

## Ferien
Vegan-Chalet an der Lenk: geniales Airbnb mit perfekt ausgestatteter Küche – ihr müsst gar nichts mitbringen, die veganen Besitzer haben den gesamten Foodstock im Chalet für euch bereit.

## Desserts & Torten
Veganlicious: Torten, Cake-Pops und Desserts auf Wunsch zum Bestellen.

## Nachhaltig waschen
10 % auf die Waschstreifen von bluu: kein Plastik, zero waste, vegan und einfach zu dosieren.`,
    cards: [],
    images: [],
    videos: [],
    showTestimonials: false,
    cta: null,
  },
  {
    _id: "page-wildkraeuter",
    title: "Wildkräuter",
    slug: "wildkraeuter",
    menu: "tipps",
    eyebrow: "verkräutert",
    intro:
      "Wir lieben die Natur und was sie uns schenkt. Aus Leidenschaft für (Wild-)Kräuter entstand verkräutert – gerne teilen wir unser Wissen und die Freude an der grünen Welt mit dir.",
    teaser: "Wildkräuterkurse und Wildkräuterprodukte von verkräutert – von Bettina und Jenny.",
    heroImage: img("wildkraeuter.jpg", "Wildkräuter in der Natur"),
    facts: [],
    body: `## Wildkräuterkurse
Entdecke, welche leckeren Pflanzen direkt vor deiner Haustür spriessen. In unseren Kursen lernst du, wie du Wildkräuter erkennst, bestimmst und sammelst, ohne dabei die Natur oder dich zu schädigen.

## Wildkräuterprodukte
Von Kräutersalzen über Kombucha und Sirupe bis zu Wellnessprodukten – alles ist mit Liebe hergestellt. Lagere die Produkte kühl und trocken und schütze sie vor Feuchtigkeit. Obwohl sie voller Naturkraft stecken, sind sie kein Ersatz für Medikamente oder Therapien, sondern sollen deine Küche und dein Leben bereichern und verkräutern.

Tauche ein in ein Leben, das ein bisschen verkräutert ist. Alle Infos und aktuellen Kurse findest du unter [verkräutert.ch](https://xn--verkrutert-q5a.ch).

Bettina & Jenny`,
    cards: [],
    images: [img("wildkraeuter-pizza.jpg", "Wildkräuter-Pizza mit Gänseblümchen")],
    videos: [],
    showTestimonials: false,
    cta: null,
  },
  {
    _id: "page-partner-werden",
    title: "Partner werden",
    slug: "partner-werden",
    menu: "footer",
    eyebrow: "Ihr neuer Absatzkanal",
    intro:
      "Sie haben ein veganes, nachhaltiges Produkt und möchten es bei der passenden Zielgruppe lancieren, bekannt machen und den Absatz steigern?",
    teaser: "Promotion für vegane, nachhaltige Produkte: Integration in Kochkurse, Coachings, Degustationen und Events von Veganrocks.",
    heroImage: img("partner-produkte.jpg", "Vegane Produkte in Gläsern auf einem Tisch"),
    facts: [],
    body: `Ich integriere Ihre Produkte in meine Kochkurse und Coachings. Ich behalte mir vor, die Produkte zuerst zu testen und allenfalls nur eine Auswahl zu integrieren – denn ich empfehle nur Produkte weiter, hinter denen ich persönlich stehen kann.

## Promotion Ihrer Produkte
- Integration bei Degustationen, Demos, Kochkursen und Coachings
- Präsenz auf meiner Website
- Abgabe von Infomaterial
- Integration und Anwendung
- Nach Absprache Rezepte, Videos und gemeinsame Events
- Kochshows & Kurse an Messen

Kontaktieren Sie mich – ich freue mich auf die Zusammenarbeit.`,
    cards: [],
    images: [],
    videos: [],
    showTestimonials: false,
    cta: { title: "Zusammenarbeit anfragen", text: null, link: "/kontakt", buttonLabel: "Kontakt aufnehmen" },
  },
] as Page[];

export const placeholderProducts: Product[] = [
  {
    _id: "product-yoga",
    name: "Yoga & Kochkurs in der Sennhütte",
    slug: "yoga-kochkurs-sennhuette",
    kind: "event",
    price: 190,
    priceNote: "pro Person",
    description:
      "Day Retreat: 75 Minuten Yoga mit Flavia Schmid, danach ein mehrgängiges Menü mit Veganrocks – inklusive Coaching, Rezepten, Zutaten, Essen und alkoholfreien Getränken.",
    details: `Gönn dir eine bewusste Auszeit vom Alltag. Dieses Tageserlebnis verbindet Bewegung, Entspannung und kreative Küche – für neue Energie, Inspiration und Genuss.

## Ablauf
Wir beginnen in ruhiger Atmosphäre mit einem sanften Ankommen. Anschliessend erwartet dich eine 75-minütige Yogaeinheit mit Flavia Schmid, die Elemente aus Vinyasa und Hatha Yoga verbindet. Egal ob Anfängerin oder schon geübt: Alle sind willkommen.

Danach wird es kreativ und genussvoll: Gemeinsam kreieren wir ein mehrgängiges Menü und erarbeiten die wichtigsten Grundlagen, die du direkt in deinen Alltag mitnehmen kannst.
- Gemeinsames Kochen und Zubereiten
- Kreatives Anrichten
- Rezepte für zuhause
- Gemeinsames Essen in entspannter Runde
- Ernährungskunde & wertvolle Facts
- Tipps & Tricks für den Alltag

## Inbegriffen
Yoga, Kochkurs, Coaching, Rezepte, Zutaten, Essen und alkoholfreie Getränke.

## Mitbringen
Tupperware und bequeme Kleidung.`,
    images: [
      img("sennhuette.jpg", "Sennhütte Effingen mit blühender Fassade"),
      img("sennhuette-luftbild.jpg", "Luftbild der Sennhütte Effingen im Grünen"),
      img("wildkraeuter-pizza.jpg", "Wildkräuter-Pizza mit Gänseblümchen"),
    ],
    date: "2026-11-08",
    time: "11 bis ca. 16 Uhr",
    location: "Sennhütte Effingen, Sennhütten 97, 5078 Effingen",
    seats: 0,
    giftFields: false,
    soldOut: true,
    available: true,
  },
  {
    _id: "product-gutschein-privatevent",
    name: "Gutschein für einen Privatevent",
    slug: "gutschein-privatevent",
    kind: "voucher",
    price: 750,
    priceNote: "für bis zu 5 Personen",
    description:
      "Das perfekte Geschenk: ein privater Kochkurs mit Wunschmenü – bei euch daheim oder in einer Küche eurer Wahl. Jede weitere Person CHF 150.",
    details: `Mach jemanden glücklich mit einem Gutschein für einen Veganrocks-Kochkurs! Ob als Geburtstagsüberraschung, zum Valentinstag, zum Jubiläum oder einfach so – dieses Geschenk vereint Genuss, Kreativität und neue kulinarische Erlebnisse.

## Das Besondere an diesem Gutschein
- Flexibel: gültig für euer Wunschmenü in eurer Küche oder in einer Küche eurer Wahl
- Privat: eure Wünsche, euer Zeitrahmen, mit euren Lieblingsmenschen
- Vielfältig: von veganen Saucen-Basics über Freestyle-Kochen bis zu internationalen Gerichten

Der Gutschein gilt für bis zu 5 Personen. Jede weitere Person kostet CHF 150 – dafür gibt es den Gutschein pro Person.

Verschenke mehr als nur einen Kochkurs – verschenke Inspiration und Genuss!`,
    images: [img("gutschein.jpg", "Gutschein mit Veganrocks-Logo"), img("kochkurs-gruppe-tisch.jpg", "Gruppe an einer Tafel nach dem Kochkurs")],
    date: null,
    time: null,
    location: null,
    seats: null,
    giftFields: true,
    soldOut: false,
    available: true,
  },
  {
    _id: "product-gutschein-person",
    name: "Gutschein pro Person",
    slug: "gutschein-pro-person",
    kind: "voucher",
    price: 150,
    priceNote: "pro Person",
    description:
      "Ein Platz an einem privaten Kochkurs oder Team-Anlass – auch als Ergänzung zum Gutschein für einen Privatevent ab der 6. Person.",
    details: `Schenke ein unvergessliches Erlebnis: einen Kochkurs mit der Familie, Freunden oder Arbeitskollegen. Datum, Ort und Menü sind frei wählbar.

Aufregend, spannend, inspirierend, nachhaltig, gesund und genussvoll – gemeinsam kochen, lachen, zubereiten und geniessen.

Der Gutschein kann für einen Veganrocks-@home-Privatkochkurs bei dir daheim, bei der beschenkten Person oder in einem professionellen Kochstudio angerechnet werden.`,
    images: [img("kochkurs-gruppe-tisch.jpg", "Gruppe an einer Tafel nach dem Kochkurs"), img("gutschein.jpg", "Gutschein mit Veganrocks-Logo")],
    date: null,
    time: null,
    location: null,
    seats: null,
    giftFields: true,
    soldOut: false,
    available: true,
  },
  {
    _id: "product-kochkurs-home",
    name: "Kochkurs @Home",
    slug: "kochkurs-home",
    kind: "course",
    price: 750,
    priceNote: "für 5 Personen",
    description:
      "Dein Wunschmenü mit deinen Wunschgästen: Ab 5 Personen kochen wir bei dir zu Hause. Kleinere Gruppen gegen Aufpreis und nach Absprache.",
    details: `Buche einen Kochkurs bei dir daheim – dein Wunschmenü mit deinen Lieblingsmenschen.

- Kreative, delikate Gerichte nach deinen Wünschen
- Ein geselliger Abend mit Freunden
- Für Anfänger oder Fortgeschrittene
- Ernährungswissen: Mythen und Vorurteile ausradieren
- Messertechniken, Kochtricks und Anrichten

Du brauchst eine Küche, ganz egal, was vorhanden ist – wir passen das Menü den Möglichkeiten an. Du sorgst lediglich für Gäste und Getränke. Jede weitere Person CHF 150. Spezialwünsche und grössere Events sind realisierbar!

Nach der Buchung melde ich mich bei dir, um Datum und Menü abzustimmen.`,
    images: [img("kochkurs-zuhause.jpg", "Salat und Rösti, angerichtet auf einem Teller"), img("kochkurs-camera.jpg", "Gäste fotografieren den gedeckten Tisch")],
    date: null,
    time: null,
    location: null,
    seats: null,
    giftFields: false,
    soldOut: false,
    available: true,
  },
  {
    _id: "product-kochevent",
    name: "Kochevent im Kochstudio",
    slug: "kochevent-kochstudio",
    kind: "course",
    price: 750,
    priceNote: "für 5 Personen",
    description:
      "Im voll ausgestatteten Kochstudio in Othmarsingen kreieren wir eure Wunschgerichte – für 5 bis 13 Personen. Jede weitere Person CHF 150.",
    details: `Du suchst ein besonderes Geschenk oder einen Anlass, der in Erinnerung bleibt? Ob Geburtstag, Polterabend, Firmenevent oder einfach gemeinsame Zeit – ein Veganrocks-Kochkurs ist ein Erlebnis voller Genuss, Spass und Inspiration.

## Was erwartet euch?
Ob italienische Pasta, asiatische Wok-Kreationen, vegane Schweizer Klassiker oder exotische Spezialitäten – das Thema wählt ihr selbst. Der Kochkurs wird individuell auf eure Wünsche abgestimmt.

- Gültig für 5 bis 13 Personen in Othmarsingen
- Grössere Gruppen und andere Locations in der ganzen Schweiz nach Absprache
- Themen und Gerichte frei wählbar

## So funktioniert’s
- Buchen oder als Gutschein verschenken
- Termin, Gruppengrösse und Themen gemeinsam abstimmen
- Gemeinsam ein mehrgängiges Menü kochen – genau nach euren Wünschen`,
    images: [img("team-tafel-2.jpg", "Lachende Gruppe an einer reich gedeckten Tafel"), img("team-jubel.jpg", "Jubelnde Gruppe im Kochstudio"), img("kochkurs-zubereitung.jpg", "Zubereitung am Tisch")],
    date: null,
    time: null,
    location: null,
    seats: null,
    giftFields: false,
    soldOut: false,
    available: true,
  },
];
