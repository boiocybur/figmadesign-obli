# Refleksion – Figma til kode

**Gruppemedlemmer: Jesper Deetho Jessen, Lezam Idrizi.**

## Eksempel 1: Genbrugelig komponent med variant og subgrid

### Hvor og hvorfor?

I `src/components/CoreValues.astro` bruger vi en variant-prop til at vise den samme komponent i to forskellige visuelle udgaver: `default` og `alt`.

Vi ville undgå at lave to næsten identiske komponenter med samme HTML og data. Derfor bruger vi den samme komponent og ændrer stylingen ud fra den valgte variant.

Vi bruger også `subgrid` i kortene. Hvert kort består af ikon, titel, tekst og link. Ved at lade kortene bruge rækkerne fra det overordnede grid kan indholdet flugte på tværs af kortene, selv når teksterne har forskellig længde.

### Relevant kode

```astro
interface Props {
  variant?: "default" | "alt";
}

const { variant = "default" } = Astro.props;
```

```astro
<section class:list={["values", `values--${variant}`]}>
```

```css
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows:
    auto
    auto
    1fr
    auto;
}

.value-card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
}
```

### Afprøvning og ændringer

- **Vi testede:** Komponenten med både standardvarianten og `variant="alt"`.
- **Vi observerede:** Indholdet og strukturen var den samme, mens baggrund, tekst, knap og kort ændrede udseende. `subgrid` gjorde samtidig, at indholdet i kortene flugtede bedre.
- **Vi ændrede:** Vi samlede variationerne i én komponent i stedet for at kopiere komponenten. Vi tilføjede også `subgrid`, så kortene kunne dele de samme rækker.

## Eksempel 2: FAQ med progressive enhancement

### Hvor og hvorfor?

I `src/components/FAQ.astro` bruger vi HTML-elementerne `<details>` og `<summary>` til FAQ-sektionen.

De har åbne/lukke-funktionalitet indbygget i HTML og kræver derfor ikke JavaScript for at fungere. Spørgsmålene hentes samtidig fra API'et med `getFAQ()`, så indholdet ikke er hardkodet direkte i komponenten.

Vi bruger `@supports` og `interpolate-size` til at tilføje animation som progressive enhancement. Hvis browseren ikke understøtter funktionen, virker FAQ'en stadig, men uden animation.

### Relevant kode

```js
const faq = await getFAQ();
```

```astro
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

Animationen bliver kun aktiveret, hvis browseren understøtter `interpolate-size`:

```css
@supports (interpolate-size: allow-keywords) {
  :global(html) {
    interpolate-size: allow-keywords;
  }

  details::details-content {
    block-size: 0;
    overflow: hidden;
    opacity: 0;

    transition:
      block-size 250ms ease,
      opacity 200ms ease,
      content-visibility 250ms allow-discrete;
  }

  details[open]::details-content {
    block-size: auto;
    opacity: 1;
  }
}
```

### Afprøvning og ændringer

- **Vi testede:** At FAQ'en kunne åbnes og lukkes, og at animationen fungerede i en browser med understøttelse.
- **Vi observerede:** `<details>` og `<summary>` fungerer stadig uden animations-CSS, fordi åbne/lukke-funktionen er indbygget i HTML.
- **Vi ændrede:** Den tidligere løsning forsøgte at animere `.answer` fra `height: 0` til `height: auto`, men animationen fungerede ikke korrekt. Derfor ændrede vi løsningen til `details::details-content` og bruger `interpolate-size`.

## Eksempel 3: Size container queries

### Hvor og hvorfor?

I `src/components/Services.astro` bruger vi en size container query.

I stedet for kun at reagere på hele browserens viewport reagerer komponenten nu på bredden af sin egen container. Det gør komponenten mere selvstændig og gør det muligt at genbruge den i områder med forskellige bredder.

### Relevant kode

```css
.services-section {
  container-type: inline-size;
}

.services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

@container (max-width: 800px) {
  .services {
    grid-template-columns: 1fr;
    margin-top: calc(var(--space-7) * -1);
  }
}
```

Vi bruger også size container queries i `CoreValues.astro`:

```css
.values {
  container-type: inline-size;
}

@container (max-width: 900px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (max-width: 600px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
}
```

### Afprøvning og ændringer

- **Vi testede:** FAQ'en i Chrome og Edge.
- **Vi observerede:** FAQ'en kunne åbnes og lukkes korrekt, og animationen fungerede i begge browsere.
- **Vi ændrede:** Den tidligere løsning forsøgte at animere `.answer` fra `height: 0` til `height: auto`, men animationen fungerede ikke korrekt. Derfor ændrede vi løsningen til `details::details-content` og bruger `interpolate-size`.

## Fallback og robusthed

### Fallback og progressive enhancement

I `FAQ.astro` bruger vi `<details>` og `<summary>`, så FAQ'en virker uden JavaScript og uden animationsfunktionen.

Hvis browseren ikke understøtter `interpolate-size`, bliver indholdet i `@supports`-blokken ikke anvendt. Brugeren kan stadig åbne og lukke spørgsmålene, men uden den glidende animation.

På den måde mister brugeren kun den visuelle forbedring og ikke selve funktionaliteten.

### Defensiv kode og CSS

I `Projection.astro` bruger vi defensiv JavaScript:

```js
if (!grid || cards.length === 0) return;
```

Det betyder, at scriptet stopper, hvis de nødvendige elementer ikke findes, i stedet for at forsøge at fortsætte og give en fejl.

Vi bruger også defensiv CSS flere steder. I `CoreValues.astro` har `.value-card` blandt andet:

```css
.value-card {
  min-width: 0;
}
```

Det hjælper grid-elementet med at kunne blive mindre uden at indholdet tvinger layoutet ud over den tilgængelige bredde.

Container queries sørger samtidig for, at kortene går fra fire kolonner til to og derefter én, når der bliver mindre plads.

### Global CSS og komponent-CSS

I den globale CSS har vi placeret fælles designværdier som farver, spacing, typografi, border radius og maksimal indholdsbredde.

Eksempel:

```css
:root {
  --color-text: var(--color-neutrals-900);
  --space-4: 1rem;
  --font-body: "Lato", sans-serif;
  --radius-md: 1rem;
  --content-width: 70.75rem;
}
```

I komponenternes CSS bruger vi derefter de globale variabler:

```css
.value-card {
  padding: var(--space-7) var(--space-6);
  border-radius: var(--radius-md);
  color: var(--color-text);
}
```

Det gør designet mere ens på tværs af løsningen og betyder, at fælles designværdier kan ændres ét sted i stedet for i hver enkelt komponent.

## Brug af AI

- **Hvad brugte I den til?**  
  Vi brugte AI til at få hjælp til at finde fejl i vores kode og til at forstå, hvordan forskellige dele af vores CSS og Astro-kode fungerede. Vi brugte det blandt andet til vores Hero-sektion, hvor vi skulle placere et billede bag teksten. Vi brugte også AI til at undersøge vores implementering af blandt andet `subgrid`, container queries og FAQ-animationen.

- **Hvad ændrede eller fravalgte I i svaret?**  
  Vi brugte ikke altid løsningen direkte, som AI foreslog den. Nogle gange passede CSS'en ikke helt til vores design fra Figma, så vi ændrede blandt andet størrelser, placeringer og spacing. Vi fravalgte også kode, som ikke var nødvendig for vores løsning.

- **Hvad lærte I, og hvordan kontrollerede I løsningen?**  
  Vi lærte, at AI kan være en hjælp til at finde fejl og forklare kode, men at man stadig selv skal forstå og kontrollere løsningen. Vi testede derfor komponenterne i browseren, kontrollerede konsollen og vurderede selv, om forslagene passede til vores design og kode.
