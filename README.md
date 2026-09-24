# Opgaveskabelon til "Figma til kode"

Se opgavebeskrivelsen på Fronter.

## Medfølgende Data

Der medfølger indholdsdata i form af lokale JSON-filer, som du kan bruge til din opgave. Det er ikke et krav til opgaven, men det kan gøre det nemmere og hurtigere at få tekst og billeder ind i dit projekt.

> [!NOTE]
> Bemærk, at CaseStudy-siden allerede inkluderer data fra en lokal JSON-fil.
> Bemærk også, at ikke alle billeder fra Figma-filen er i det lokale indholdsdata.

Dokumentationen til anvendelsen af dataene finder du på: [https://frontend-design-theme.netlify.app/](https://frontend-design-theme.netlify.app/).

Her er et eksempel på, hvordan du kan bruge dataene i dine Astro-komponenter:

```astro
import employees from "@data/employees.json";

console.log(employees);
```

## Brug af hjælpekomponenter

### DynamicImage.astro (`@helpers/DynamicImage.astro`)

Brug denne komponent til at vise billeder dynamisk fra lokale datafiler. Du skal blot sende stien fra datasættet direkte til komponenten.

Eksempel med data:

```astro
{employees.map((employee) => (
  <DynamicImage
    imagePath={employee.img}
    altText={employee.name}
    width={200}
    height={200}
  />
))}
```

### DynamicIcon.astro (`@helpers/DynamicIcon.astro`)

`DynamicIcon` bruges til at vise SVG-ikoner dynamisk baseret på et navn fra dine data.

Eksempel med data:

```astro
{employee.social_links.map((link) => (
  <DynamicIcon name={link.icon} />
))}
```

Her vises et ikon for hvert socialt medie, hvor `icon`-feltet matcher filnavnet på SVG-ikonet i `src/icons/`.

---

## Import af SVG-ikoner direkte

Du kan importere SVG-ikoner direkte i dine komponenter ved at importere dem:

```astro
import Checkmark from "@icons/checkmark.svg";

<Checkmark width={32} height={32} class="my-icon" />
```

Se evt. `src/pages/svgs.astro` for flere eksempler på direkte import og brug af SVG-ikoner.
