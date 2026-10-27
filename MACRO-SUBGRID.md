# Makrolayout med CSS Subgrid

Makrogridet oprettes **én gang** i `src/styles/global.css` på `.site-grid`.
Det har 12 indholdskolonner mellem `content-start` og `content-end` samt
to ydre spor til full-bleed baggrunde.

`src/layouts/Layout.astro` giver alle routes samme gridsystem.
`.page-grid` arver forælderens kolonner med `grid-template-columns: subgrid`.
Sektionsniveauet arver igen de samme kolonner; eksisterende indre grids til
kort, statistik m.m. er bevidst bevaret som **mikrolayout**.

For en ny sektion gælder dette mønster:

```html
<section class="section">
  <div class="section-inner">...</div>
</section>
```

```css
.section {
  grid-column: full-start / full-end;
  display: grid;
  grid-template-columns: subgrid;
}
.section-inner {
  grid-column: content-start / content-end;
}
```

Subgrid kræver, at elementet er et direkte grid-item hos sin grid-parent.
Man kan ikke arve tracks fra en vilkårlig forfader gennem et almindeligt
`display:block`-element.

Det eksisterende responsive komponentlayout, container queries og
FAQ-animation er ikke ændret. Efter ændringen bør alle routes kontrolleres
visuelt ved mobil, tablet og desktop, især sektionernes indrykning.
