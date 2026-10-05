# Refleksion – Figma til kode

**Gruppemedlemmer: Jesper Deetho Jessen, Lezam Idrizi.

## Sådan bruger I filen

Skriv jeres fælles refleksion direkte i denne fil. Erstat hjælpeteksterne med jeres egne erfaringer, og slet Markdown-guiden og demoen inden aflevering. Skriv kort og konkret, og brug eksempler fra jeres egen kode.

Åbn forhåndsvisningen i VS Code med **Cmd + Shift + V** (Mac) eller **Ctrl + Shift + V** (Windows). Så ser I, hvordan Markdown bliver vist. På GitHub vises formateringen automatisk, når I åbner filen.

### Mini-guide til Markdown

- `# Titel` er dokumentets hovedoverskrift. Brug kun én.
- `## Afsnit` og `### Underafsnit` giver overskrifter i flere niveauer.
- `**vigtig tekst**` bliver til **vigtig tekst**.
- En bindestreg efterfulgt af et mellemrum laver en punktopstilling som denne.
- Skriv kode inde i en sætning mellem enkelte backticks, fx `getTeamMembers()`.
- Links skrives sådan: `[Astros dokumentation](https://docs.astro.build/)`.
- Lav et nyt afsnit med en tom linje. Brug også en tom linje før og efter lister og kodeblokke.

En kodeblok starter og slutter med tre backticks. Skriv sproget efter de første, fx `js`, `css`, `html` eller `astro`. Se et eksempel i filens kildekode nedenfor.

### Kort demo – sådan kan tekst, kode og link kombineres

> Dette er et opdigtet eksempel på formen, ikke en færdig refleksion eller et ekstra krav.

Vi flyttede datahentningen til en fælles funktion, så endpointet kun skal vedligeholdes ét sted.

```js
export function getServices() {
  return apiFetch("https://ftk-api.pages.dev/services");
}
```

I komponenten kalder vi `getServices()`. Vi kontrollerede, at de samme servicetitler blev vist før og efter ændringen. Næste skridt er at undersøge, hvad der sker, hvis API'et returnerer en fejl.

Reference: [Datahentning i Astro](https://docs.astro.build/en/guides/data-fetching/).

---

## Eksempel 1: Genbrugelig komponent med variant

### Hvor og hvorfor?
I components mappen, i filen CoreValues.astro bruger vi en variant-prop til at vise den samme komponent i to forskellige visuelle udgaver: default og alt.

Hvor i løsningen bruger I teknikken, og hvilket konkret problem løser den? Henvis gerne til en fil, fx `src/components/MinKomponent.astro`.
Benspændet var, at vi ville undgå at lave to næsten identiske komponenter med samme HTML og data. I stedet bruger vi den samme komponent og skifter styling derinde.

### Relevant kode

Indsæt en kort kodeblok fra jeres løsning. Vælg det passende sprog, og forklar den del, der er vigtig for jeres valg.
```js
interface Props { 
  variant?: "default" | "alt";
  }

  const { variant = "default" } = Astro.props;
```
```html
  <section class:list={["values", 'values--${variant}']}>
```

### Afprøvning og ændringer

- **Vi testede: Komponenten både med standardvarianten og variant="alt".
- **Vi observerede: Indholdet og strukturen var den samme, mens baggrund, tekst, knap og kort ændrede udseende.
- **Vi ændrede eller mangler: Vi samlede variationerne i én komponent i stedet for at kopiere komponenten. Næste skridt kunne være at reducere noget af den gentagne CSS mellem standard- og alt-varianten.

## Eksempel 2: FAQ med progressive enhancement

Brug samme struktur som i eksempel 1: Hvor og hvorfor? Relevant kode. Afprøvning og ændringer.
I FAQ astro side bruger vi HTML-elementerne details og summary til FAQ-sektionen. De virker allerede uden JavaScript, så brugeren kan åbne og lukke spørgsmålene direkte i browseren.
Vi henter samtidig spørgsmålene fra API'et med getFAQ(), så indholdet ikke er skrevet direkte i komponenten.

Kode eksempel: const faq : await getFAQ ();

Koden til vi bruger til at bruge data fra API'en:
```js
{
  faq.map((item) => (
    <details>
      <summary>
        <span>{item.question}</span>
        <span class="icon" aria-hidden="true"></span>
      </summary>

      <div class="answer">
        <p>{item.answer}</p>
      </div>
    </details>
  ))
}
```
Vi bruger også @supports til kun at tilføje animation, hvis browseren understøtter interpolate-size:

```css
@supports (interpolate-size: allow-keywords) {
  :global(html) {
    interpolate-size: allow-keywords;
  }

  .answer {
    height: 0;
    overflow: hidden;
    opacity: 0;

    transition:
      height 250ms ease,
      opacity 200ms ease;
  }

  details[open] .answer {
    height: auto;
    opacity: 1;
  }
}
```
Afprøvning og ændringer
- Vi testede: FAQ'en både med og uden understøttelse af interpolate-size.
- Vi observerede: details og summary fungerede stadig uden animation, fordi åbne/lukke-funktionen er indbygget i HTML.
- Vi ændrede eller mangler: Vi tilføjede animation som en forbedring i browsere, der understøtter funktionen. Hvis funktionen ikke understøttes, virker FAQ'en stadig normalt.

## Eksempel 3: Responsiv carousel med defensiv kode

I Projection.astro har vi lavet en carousel, hvor antallet af synlige kort ændrer sig efter skærmstørrelsen.
CSS bestemmer, hvor mange kort der skal vises, og JavaScript læser den samme værdi. På den måde undgår vi at skrive de samme breakpoint-regler flere steder.
```css
.financial-grid {
  --cards-visible: 4;

  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

@media (max-width: 900px) {
  .financial-grid {
    --cards-visible: 2;
  }
}

@media (max-width: 600px) {
  .financial-grid {
    --cards-visible: 1;
  }
}

function getVisibleCards() {
  const value = getComputedStyle(grid)
    .getPropertyValue("--cards-visible")
    .trim();

  return Number(value) || 4;
}
```
defensiv kode:
```js
if (!grid || cards.length === 0) return;
```

Det betyder at scriptet stopper hvis elementet ikke findes istedet for at give en fejl.

## Fallback og robusthed

Dette må gerne indgå i de tre eksempler ovenfor. Hvis det allerede er dækket dér, kan I slette dette afsnit.

- **Fallback/progressive enhancement: I FAQ.astro bruger vi <details> og <summary>, så FAQ'en virker uden JavaScript og uden animation. Brugeren kan derfor stadig åbne og lukke spørgsmål, selv hvis browseren ikke understøtter interpolate-size.

Animationen bliver kun aktiveret i browsere, der understøtter funktionen:

```css
@supports (interpolate-size: allow-keywords) {
  :global(html) {
    interpolate-size: allow-keywords;
  }

  .answer {
    height: 0;
    overflow: hidden;
    opacity: 0;

    transition:
      height 250ms ease,
      opacity 200ms ease;
  }

  details[open] .answer {
    height: auto;
    opacity: 1;
  }
}
```
Med understøttelse får brugeren en glidende animation. Uden understøttelse virker FAQ'en stadig, men åbner og lukker uden animation.
Dokumentation: MDN – interpolate-size

- **Defensive CSS: Vi bruger flere steder CSS, der sikrer, at layoutet stadig fungerer ved mindre skærme og begrænset plads.
I CoreValues.astro går kortene fra fire kolonner til to og derefter én:

```css
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-7);
}

@media (max-width: 900px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
}
```
Det gør, at kortene ikke bliver presset for meget sammen på mindre skærme.
Vi bruger også fx max-width på tekstområder og flex-shrink: 0 på elementer, der ikke skal klemmes sammen.

- **Global CSS og komponent-CSS: I den globale CSS har vi placeret fælles designværdier som farver, spacing, typografi, border radius og maksimal indholdsbredde.
```css
:root {
  --color-text: var(--color-neutrals-900);
  --space-4: 1rem;
  --font-body: "Lato", sans-serif;
  --radius-md: 1rem;
  --content-width: 70.75rem;
}
```
I komponenternes CSS bruger vi derefter variabler som disse:
```css
.value-card {
  padding: var(--space-7);
  border-radius: var(--radius-md);
  color: var(--color-text);
}
```
Det gør, at designet er mere ens på tværs af siden, og at vi kan ændre fælles værdier ét sted i stedet for i hver komponent.

## Brug af AI

Hvis I har brugt AI til en væsentlig del af løsningen, så beskriv kort:

- Hvad brugte I den til?
  Vi brugte AI til at få hjælp til at finde fejl i vores kode og til at forstå, hvordan forskellige dele af vores CSS og Astro-kode fungerede. Vi brugte det blandt andet til vores Hero-sektion, hvor vi skulle placere et billede bag teksten.
  
- Hvad ændrede eller fravalgte I i svaret?
  Vi brugte ikke altid løsningen direkte, som AI foreslog den. Nogle gange passede CSS'en ikke helt til vores design fra Figma, så vi ændrede blandt andet størrelser, placeringer og spacing. Vi fravalgte også kode, som ikke var nødvendig for vores løsning.
  
- Hvad lærte I, og hvordan kontrollerede I løsningen?
  Vi lærte, at AI kan være en god hjælp til at finde fejl og forklare kode, men at man stadig selv skal forstå, hvad koden gør. AI har ikke altid den fulde forståelse af, hvordan vores kode og design hænger sammen, og derfor skal man selv vurdere og tilpasse de forslag, man får.
