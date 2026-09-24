# Opgaveskabelon til "Figma til kode"

Se opgavebeskrivelsen på ItsLearning.

## Refleksion

Skriv jeres fælles refleksion i [REFLEKSION.md](./REFLEKSION.md). Filen indeholder en kort Markdown-guide, en demo og en skabelon, I kan udfylde. Refleksionen skal ikke skrives i README.

## Data i opgaven

I opgaven skal du som udgangspunkt hente data fra API'et:

[https://ftk-api.pages.dev](https://ftk-api.pages.dev)

API'et simulerer et eksternt data-endpoint, så du kan øve `fetch()`.

Eksempel:

```js
const response = await fetch("https://ftk-api.pages.dev/team");
const team = await response.json();
```

Du kan se de tilgængelige endpoints og eksempler her:

[https://ftk-api.pages.dev/endpoints](https://ftk-api.pages.dev/endpoints)

## Sider i skabelonen

- `src/pages/index.astro` → `/`: Forsiden med en påbegyndt Hero-komponent.
- `src/pages/about.astro` → `/about`: Fælles Layout og en overskrift.
- `src/pages/team/index.astro` → `/team`: Fælles Layout og en overskrift.
- `src/pages/team/[slug].astro` → `/team/[slug]`: Data og grundindhold for den enkelte medarbejder.
- `src/pages/case-studies/[slug].astro` → `/case-studies/[slug]`: Data og markup til caseartiklen.

Siderne bruger `src/layouts/Layout.astro`. I skal selv bygge den fælles navigation og færdiggøre sidernes indhold, komponenter og styling.

## Et enkelt eksempel: API-data i en komponent

Start med `src/components/Services.astro`, som allerede vises gennem `Hero.astro` på forsiden:

1. I komponentens frontmatter hentes listen fra `/services` med `fetch()`, og svaret læses med `.json()`.
2. `serviceData.map(...)` opretter en `ServiceCard` for hver service og sender data som en prop: `<ServiceCard service={service} />`.
3. I `ServiceCard.astro` læses den med `const { service } = Astro.props`. Felterne bruges derefter i HTML, fx `<h2>{service.title}</h2>`.

I dette statiske Astro-projekt hentes data ved build (og under udvikling på dev-serveren), ikke med JavaScript i brugerens browser. Brug mønstret som reference, når I bygger flere komponenter. Caseartiklen viser desuden, hvordan data bruges til at oprette sider med `getStaticPaths()`.

## Billeder fra API'et

Billeder fra API'et returneres som billeddata:

```json
{
  "image": {
    "src": "https://ftk-api.pages.dev/images/sarah.webp",
    "alt": "Sarah Jasmine",
    "width": 732,
    "height": 784
  }
}
```

Skabelonen er sat op til at kunne bruge billeder fra `ftk-api.pages.dev` med Astros `Image`-komponent.

```astro
---
import { Image } from "astro:assets";
---

<Image
  src={employee.image.src}
  alt={employee.image.alt}
  width={employee.image.width}
  height={employee.image.height}
/>
```

> [!NOTE]
> Bemærk, at CaseStudy-siden allerede er sat op.
> Bemærk også, at ikke alle billeder fra Figma-filen findes i API'et.

## Brug af hjælpekomponenter

### DynamicIcon.astro (`@helpers/DynamicIcon.astro`)

`DynamicIcon` bruges til at vise SVG-ikoner ud fra et ikonnavn fra data.

API'et returnerer fx:

```json
{
  "platform": "instagram",
  "icon": "instagram"
}
```

Det matcher en lokal SVG-fil i `src/icons/`:

```txt
src/icons/instagram.svg
src/icons/facebook.svg
src/icons/layers.svg
```

Eksempel:

```astro
---
import DynamicIcon from "@helpers/DynamicIcon.astro";
---

{employee.social_links.map((link) => (
  <a href={link.url} aria-label={link.platform}>
    <DynamicIcon name={link.icon} width={24} height={24} class="social-icon" />
  </a>
))}
```

Foruden `name`-prop'en, som er obligatorisk, forwarder komponenten øvrige props direkte til SVG-komponenten. Du kan derfor fx sende `class`, `width`, `height` og lignende med.

Hvis ikonet ikke findes, vises der ikke noget output, og komponenten logger en advarsel i konsollen.

## Links fra data

Nogle datafelter indeholder linkdata, fx:

```json
{
  "link": {
    "text": "Read More",
    "url": "#"
  }
}
```

Du kan bruge dem sådan:

```astro
<a href={item.link.url}>{item.link.text}</a>
```

Hvis et link kun indeholder et ikon og ingen synlig tekst, skal du give linket et tilgængeligt navn, fx med `aria-label`.

```astro
<a href={link.url} aria-label={link.platform}>
  <DynamicIcon name={link.icon} />
</a>
```

## Import af SVG-ikoner direkte

Du kan også importere SVG-ikoner direkte i dine komponenter:

```astro
---
import Checkmark from "@icons/checkmark.svg";
---

<Checkmark width={32} height={32} class="my-icon" />
```

Se evt. `src/pages/svgs.astro` for flere eksempler på direkte import og brug af SVG-ikoner.

---

---

---

## Lokal backup-data

Der ligger også lokale JSON-filer i `src/data/`. De kan bruges som backup, hvis API'et ikke virker, eller hvis du vil teste uden netværkskald.

Dokumentation til lokal data findes her:

[https://ftk-api.pages.dev/local.html](https://ftk-api.pages.dev/local.html)

Bemærk, at lokal data ikke nødvendigvis har præcis samme struktur som API-svarene. API'et kan fx normalisere data, gøre billedstier absolutte eller returnere lister direkte.

Eksempel med lokal data:

```astro
---
import employees from "@data/employees.json";
---

{employees.map((employee) => (
  <article>
    <h2>{employee.name}</h2>
    <p>{employee.title}</p>
  </article>
))}
```

### DynamicImage.astro (`@helpers/DynamicImage.astro`)

`DynamicImage` er kun relevant, hvis du arbejder med lokale billeder fra `src/data/images/`.

Du skal som udgangspunkt ikke bruge `DynamicImage` til billeder fra API'et, fordi API'et allerede returnerer offentlige billed-URL'er og dimensioner. Brug i stedet Astros `Image`-komponent som vist ovenfor.

`DynamicImage` kan stadig bruges, hvis du vælger at arbejde med lokal backup-data, hvor billedstierne peger på lokale filer i projektet.

Eksempel med lokal data, hvis billedstien ligger i et lokalt `img`-felt:

```astro
---
import DynamicImage from "@helpers/DynamicImage.astro";
import employees from "@data/employees.json";
---

{employees.map((employee) => (
  <DynamicImage
    src={employee.img}
    alt={employee.name}
    width={300}
    height={320}
    class="employee-image"
  />
))}
```
