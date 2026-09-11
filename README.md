# quarto-themes

Installable looks for Quarto books, websites, and documents. Each theme is a
format extension, so a project changes its look by changing one line.

**Gallery:** <https://brenobeirigo.github.io/quarto-themes/>

| Theme | Format | Character |
|---|---|---|
| [Lucid](https://brenobeirigo.github.io/quarto-themes/lucid/) | `lucid-html` | Clear, accessible, and restrained. Viridis accents on charcoal and paper, for material that people study rather than skim. |

## Install

```bash
quarto add brenobeirigo/quarto-themes
```

This copies every theme into `_extensions/brenobeirigo/`. Update later with
`quarto update brenobeirigo/quarto-themes`. Then choose a theme in `_quarto.yml`:

```yaml
format:
  lucid-html: default
```

## Lucid

Lucid is built on five principles.

- **Clarity first.** Prose keeps a 76-character measure, headings use Jost, body text uses Libre Franklin, and table figures share one width.
- **Colour that works for every reader.** Accents come from the viridis scale, which stays distinguishable under common colour-vision deficiencies.
- **Restrained geometry.** Nearly square corners, hairline frames, and one coloured edge per component.
- **Accessible by default.** Header scope on tables, focusable scroll regions, keyboard-operable callouts, and titled diagrams.
- **Faithful on paper.** Print switches to black on white and keeps tables, pseudocode, and diagrams legible.

For a book, also set `reader-mode: true` under `book:` to enable the wide reading layout.

### Options

Switch any enhancement off under `lucid:` in document or project metadata.

| Option | Default | Effect |
|---|---|---|
| `accessible-tables` | `true` | Header `scope`, and row headers for `.row-headers` tables |
| `pseudocode` | `true` | `.pseudocode` code blocks render as a numbered terminal |
| `flowcharts` | `true` | Readable Mermaid sizing with an SVG title and description |
| `callouts` | `true` | Keyboard-operable collapsible callouts and solution titles |
| `copy-refs` | `true` | Copy-reference buttons on numbered labels in headings |
| `table-scroll` | `true` | Wide tables become focusable scroll regions |
| `page-references` | `false` | Page-local bibliography stays visible on every citing page |

### Customise colours and fonts

Every token in `scss/lucid-light.scss` and `scss/lucid-dark.scss` is a `!default`
Sass variable. Put your values in a brand file with a `/*-- scss:defaults --*/`
section, then list it after the palette. A `theme:` entry replaces the one the
format supplies, so list the Lucid layers as well.

```yaml
format:
  lucid-html:
    theme:
      light:
        - cosmo
        - _extensions/brenobeirigo/lucid/scss/lucid.scss
        - _extensions/brenobeirigo/lucid/scss/lucid-light.scss
        - brand.scss
      dark:
        - darkly
        - _extensions/brenobeirigo/lucid/scss/lucid.scss
        - _extensions/brenobeirigo/lucid/scss/lucid-dark.scss
        - brand.scss
```

Components read CSS custom properties such as `--lucid-accent`, so a plain
stylesheet can adjust a single component without recompiling the theme.

### Components

The [component gallery](https://brenobeirigo.github.io/quarto-themes/lucid/components.html)
shows each one with its markup.

| Component | Classes |
|---|---|
| Data and trace tables | `.data-table`, `.trace-table`, `.row-headers` |
| Great Tables | automatic for `table.gt_table` |
| Pseudocode terminal | `.pseudocode` code block |
| Exercises | `.exercise-label`, `.question-label`, `.question-group-label`, `.exercise-heading`, `data-copy-ref` |
| Scope notes | `details.scope-note.preview`, `details.scope-note.optional` |
| Worksheets | `.excel-table`, `.alpha-list`, `.questions`, `.form-table`, `.handwritten-table`, `.warningbox` |
| Landing page | `body-classes: landing-page`, `.landing-hero`, `.landing-facts`, `.landing-cards`, `.landing-modules`, `.landing-steps`, `.landing-links`, `.landing-cta` |
| Course outline | `.syllabus-hero`, `.course-meta`, `.calendar-grid`, `.module-card`, `.success-grid`, `.support-grid`, `.rhythm-grid`, `.timeline` |

### Moving from dact-html 1.0

Lucid replaces the earlier `dact-html` format from this repository.

| dact-html 1.0 | lucid-html |
|---|---|
| `format: dact-html` | `format: lucid-html` |
| `dact:` options `flowchart-layout`, `solution-callouts`, `exercise-numbering`, `table-layout` | `lucid:` options `flowcharts`, `callouts`, `copy-refs`, `table-scroll` |
| `.dact-table` | `.data-table` |
| `body-classes: dact-home` and `.dact-*` home classes | `body-classes: landing-page` and `.landing-*` classes |
| `.dact-card-grid`, `.dact-increments`, `.dact-link-grid`, `.dact-resource`, `.dact-footer-cta`, `.dact-module-list`, `.dact-display-title` | `.landing-cards`, `.landing-steps`, `.landing-links`, `.landing-link`, `.landing-cta`, `.landing-modules`, `.landing-title` |
| `details.dact-scope.dact-preview`, `.dact-optional` | `details.scope-note.preview`, `.optional` |
| `.dact-page-number`, `.dact-section-number` | any element with `data-page-id`, `data-section-id`, or `data-copy-ref` |
| `.dact-copy-reference` | `.copy-ref-button` |
| Great Tables with an id starting `dact-decision-` | all Great Tables output |
| `.studio-timeline` | `.timeline` |
| `--dact-*` custom properties | `--lucid-*` custom properties |
| page bibliography always visible | `lucid: page-references: true` |

## Repository layout

```
_extensions/brenobeirigo/<theme>/   one folder per theme; the only part quarto add installs
  _extension.yml                    format definition
  <theme>.lua                       build-time filter and optional scripts
  scss/                             shared layer and light and dark palettes
  css/                              component stylesheets that read CSS tokens
  js/                               browser enhancements
<theme>/*.qmd                       gallery pages for that theme
index.qmd, _quarto.yml              gallery site, rendered to docs/
```

## Add a theme

1. Create `_extensions/brenobeirigo/<name>/_extension.yml` with a `contributes: formats: html:` entry.
2. Add gallery pages in `<name>/`, list them under `project: render:`, and add a navbar menu in `_quarto.yml`.
3. Run `quarto render` and commit `docs/`.
